export const MAX_SURFACES = 24;
export const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;

export const FRAGMENT_SHADER = `#version 300 es
precision highp float;

#define MAX_SURFACES 24

uniform vec2 u_resolution;
uniform vec2 u_viewport;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_scroll;
uniform float u_strength;
uniform int u_surfaceCount;
uniform vec4 u_surfaces[MAX_SURFACES];
uniform vec4 u_surfaceMeta[MAX_SURFACES];

in vec2 v_uv;
out vec4 outColor;

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float sdRoundRect(vec2 p, vec2 halfSize, float radius) {
    vec2 q = abs(p) - halfSize + radius;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
}

float softBlob(vec2 uv, vec2 center, vec2 scale) {
    vec2 p = (uv - center) / scale;
    return exp(-dot(p, p) * 2.35);
}

vec3 backgroundAt(vec2 pixel, float timeValue) {
    vec2 uv = pixel / max(u_viewport, vec2(1.0));
    float aspect = u_viewport.x / max(u_viewport.y, 1.0);
    vec2 centered = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    float drift = timeValue * 0.028;
    float b1 = softBlob(
        vec2(centered.x / aspect + 0.5, centered.y + 0.5),
        vec2(0.15 + sin(drift) * 0.035, 0.18 + cos(drift * 0.8) * 0.025),
        vec2(0.34, 0.29)
    );
    float b2 = softBlob(
        vec2(centered.x / aspect + 0.5, centered.y + 0.5),
        vec2(0.86 + cos(drift * 0.7) * 0.04, 0.72 + sin(drift * 0.9) * 0.035),
        vec2(0.39, 0.34)
    );
    float b3 = softBlob(
        vec2(centered.x / aspect + 0.5, centered.y + 0.5),
        vec2(0.54 + sin(drift * 0.55) * 0.07, 1.02),
        vec2(0.48, 0.24)
    );

    vec2 grid = abs(fract((pixel + vec2(0.0, u_scroll * 0.035)) / 92.0) - 0.5);
    float gridLine = 1.0 - smoothstep(0.474, 0.5, max(grid.x, grid.y));
    float diagonal = 0.5 + 0.5 * sin((uv.x * 1.15 + uv.y * 0.74) * 9.0 - timeValue * 0.11);
    float grain = hash21(floor(pixel * 0.72) + floor(timeValue * 2.0)) - 0.5;
    float vignette = 1.0 - smoothstep(0.18, 0.95, length(centered));

    float luminance = 0.018;
    luminance += b1 * 0.105;
    luminance += b2 * 0.075;
    luminance += b3 * 0.052;
    luminance += gridLine * 0.017;
    luminance += diagonal * 0.009;
    luminance += grain * 0.006;
    luminance *= 0.72 + vignette * 0.34;

    return vec3(clamp(luminance, 0.006, 0.19));
}

void main() {
    vec2 pixel = vec2(
        gl_FragCoord.x / max(u_resolution.x, 1.0) * u_viewport.x,
        (1.0 - gl_FragCoord.y / max(u_resolution.y, 1.0)) * u_viewport.y
    );

    vec3 color = backgroundAt(pixel, u_time);

    for (int i = 0; i < MAX_SURFACES; i++) {
        if (i >= u_surfaceCount) {
            break;
        }

        vec4 rect = u_surfaces[i];
        vec4 meta = u_surfaceMeta[i];
        vec2 halfSize = rect.zw * 0.5;
        vec2 center = rect.xy + halfSize;
        vec2 localPixel = pixel - center;
        float radius = min(meta.x, min(halfSize.x, halfSize.y));
        float distanceToShape = sdRoundRect(localPixel, halfSize, radius);

        if (distanceToShape <= 1.5) {
            vec2 normalized = localPixel / max(halfSize, vec2(1.0));
            float radial = clamp(length(normalized), 0.0, 1.5);
            vec2 normal = normalize(normalized + vec2(0.0001));
            float lensCore = pow(clamp(1.0 - radial, 0.0, 1.0), 1.45);
            float innerBand = smoothstep(-28.0, -2.0, distanceToShape);
            float hover = meta.w;
            float kind = meta.z;
            float localStrength = u_strength * meta.y * (1.0 + hover * 0.23);

            vec2 tangent = vec2(-normal.y, normal.x);
            float wave = sin(dot(pixel, tangent) * 0.045 + u_time * (0.72 + kind * 0.18));
            vec2 refraction = normal * (4.0 + kind * 3.2) * lensCore * localStrength;
            refraction += tangent * wave * 1.25 * lensCore * localStrength;
            refraction += (u_pointer - center) / max(u_viewport, vec2(1.0)) * 2.6 * hover;

            vec3 refracted = backgroundAt(pixel + refraction, u_time + kind * 0.17);
            float pointerDistance = length((pixel - u_pointer) / max(u_viewport, vec2(1.0)));
            float pointerGlow = exp(-pointerDistance * 13.0) * hover;
            float topReflection = pow(clamp(1.0 - (normalized.y + 1.0) * 0.5, 0.0, 1.0), 4.0);
            float sideReflection = pow(clamp(1.0 - abs(normalized.x), 0.0, 1.0), 7.0) * 0.35;
            float innerShadow = innerBand * (0.018 + kind * 0.008);
            float rim = (1.0 - smoothstep(0.0, 1.8, abs(distanceToShape)))
                * (0.08 + localStrength * 0.11);
            float caustic = pow(max(0.0, sin((normalized.x - normalized.y) * 7.0 + u_time * 0.45)), 5.0);
            caustic *= lensCore * (0.018 + kind * 0.014) * localStrength;

            vec3 glass = refracted * (1.08 + lensCore * 0.16);
            glass += vec3(topReflection * 0.045 + sideReflection * 0.018);
            glass += vec3(pointerGlow * 0.035 + caustic + rim);
            glass -= vec3(innerShadow);
            glass = mix(glass, vec3(dot(glass, vec3(0.333))), 0.84);

            float mask = 1.0 - smoothstep(-0.5, 1.5, distanceToShape);
            color = mix(color, glass, mask);
        }
    }

    outColor = vec4(color, 1.0);
}`;
