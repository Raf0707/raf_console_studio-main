/**
 * Raf</>Console Studio — Liquid Glass optical shader library.
 *
 * The runtime uses the composite shader directly, while the remaining
 * programs are intentionally exported as a reusable optics kit for future
 * cards, drawers, toolbars, buttons and native ports.
 */

export const RAF_AGENCY_SHADER_VERSION = '1.0.0';

export const FULLSCREEN_VERTEX_SHADER = `#version 300 es
precision highp float;

in vec2 a_position;
out vec2 v_uv;

void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;

export const GLSL_OPTICS_CORE = `
#define RAF_PI 3.1415926535897932384626433832795
#define RAF_TAU 6.283185307179586476925286766559

float rafSaturate(float value) {
    return clamp(value, 0.0, 1.0);
}

vec2 rafSafeNormalize(vec2 value) {
    return value / max(length(value), 0.00001);
}

float rafHash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float rafValueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = rafHash21(i);
    float b = rafHash21(i + vec2(1.0, 0.0));
    float c = rafHash21(i + vec2(0.0, 1.0));
    float d = rafHash21(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float rafFbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotation = mat2(0.80, 0.60, -0.60, 0.80);

    for (int i = 0; i < 5; i++) {
        value += amplitude * rafValueNoise(p);
        p = rotation * p * 2.03 + 11.7;
        amplitude *= 0.5;
    }

    return value;
}

float rafSdRoundRect(vec2 p, vec2 halfSize, float radius) {
    vec2 q = abs(p) - halfSize + radius;
    return min(max(q.x, q.y), 0.0)
        + length(max(q, 0.0))
        - radius;
}

float rafRoundedMask(
    vec2 p,
    vec2 halfSize,
    float radius,
    float feather
) {
    return 1.0 - smoothstep(
        -feather,
        feather,
        rafSdRoundRect(p, halfSize, radius)
    );
}

vec2 rafRoundedNormal(vec2 p, vec2 halfSize, float radius) {
    float epsilon = 0.75;
    float dx = rafSdRoundRect(p + vec2(epsilon, 0.0), halfSize, radius)
        - rafSdRoundRect(p - vec2(epsilon, 0.0), halfSize, radius);
    float dy = rafSdRoundRect(p + vec2(0.0, epsilon), halfSize, radius)
        - rafSdRoundRect(p - vec2(0.0, epsilon), halfSize, radius);
    return rafSafeNormalize(vec2(dx, dy));
}

float rafFresnel(float normalDotView, float power) {
    return pow(1.0 - rafSaturate(normalDotView), power);
}

float rafGaussian(float x, float sigma) {
    return exp(-(x * x) / max(2.0 * sigma * sigma, 0.00001));
}

float rafRing(float distanceValue, float center, float width) {
    return rafGaussian(distanceValue - center, width);
}

vec3 rafSpectralRim(float amount, float direction) {
    float phase = direction * 0.5 + 0.5;
    vec3 spectral = vec3(
        0.58 + 0.42 * phase,
        0.72,
        1.0 - 0.35 * phase
    );
    return spectral * amount;
}

float rafCausticField(vec2 p, float timeValue, float velocity) {
    vec2 q = p;
    q.x += sin(q.y * 5.8 + timeValue * 0.52) * 0.11;
    q.y += cos(q.x * 4.7 - timeValue * 0.41) * 0.09;

    float waves = sin((q.x + q.y) * 8.2 + timeValue * 0.74);
    waves += sin((q.x * 1.7 - q.y * 0.8) * 7.4 - timeValue * 0.58);
    waves += sin(length(q) * 15.0 - timeValue * 0.82 + velocity * 0.02);
    waves /= 3.0;

    return pow(rafSaturate(waves * 0.5 + 0.5), 7.0);
}

vec2 rafVerticalLensVector(vec2 normalized, float strength) {
    float verticalProfile = pow(rafSaturate(1.0 - abs(normalized.y)), 0.78);
    float edgeProfile = pow(rafSaturate(abs(normalized.y)), 2.2);
    float barrel = (1.0 - dot(normalized, normalized) * 0.36);

    vec2 vectorField = vec2(
        normalized.x * 0.30 * verticalProfile,
        normalized.y * (0.86 * verticalProfile + 0.44 * edgeProfile)
    );

    return vectorField * barrel * strength;
}

vec2 rafHorizontalLensVector(
    vec2 normalized,
    float velocity,
    float strength
) {
    float core = pow(rafSaturate(1.0 - length(normalized)), 0.72);
    float directional = tanh(velocity * 0.035);
    float squeeze = 1.0 + min(abs(velocity) * 0.0025, 0.55);

    vec2 vectorField = vec2(
        normalized.x * (0.92 + 0.34 * core) + directional * core * 0.42,
        normalized.y / squeeze * (0.72 + 0.46 * core)
    );

    return vectorField * core * strength;
}
`;

export const OPTICAL_COMPOSITE_FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_scroll;
uniform float u_scrollVelocity;
uniform float u_motionVelocity;
uniform float u_impact;
uniform float u_strength;
uniform float u_mode;
uniform float u_radius;
uniform float u_opacity;
uniform float u_quality;

in vec2 v_uv;
out vec4 outColor;

${GLSL_OPTICS_CORE}

void main() {
    vec2 resolution = max(u_resolution, vec2(1.0));
    vec2 pixel = v_uv * resolution;
    vec2 center = resolution * 0.5;
    vec2 halfSize = max(center - vec2(1.5), vec2(1.0));
    vec2 local = pixel - center;
    vec2 normalized = local / halfSize;

    float radius = min(u_radius, min(halfSize.x, halfSize.y));
    float sdf = rafSdRoundRect(local, halfSize, radius);
    float mask = 1.0 - smoothstep(-1.25, 1.75, sdf);

    if (mask <= 0.001) {
        discard;
    }

    vec2 normal2 = rafRoundedNormal(local, halfSize, radius);
    vec3 normal3 = normalize(vec3(normal2 * 0.82, 0.72));
    vec3 viewDirection = vec3(0.0, 0.0, 1.0);

    float fresnel = rafFresnel(dot(normal3, viewDirection), 3.8);
    float edgeDistance = rafSaturate(abs(sdf) / max(min(halfSize.x, halfSize.y), 1.0));
    float edgeBand = 1.0 - smoothstep(0.0, 0.065, edgeDistance);

    vec2 pointerUv = u_pointer / resolution;
    vec2 pointerDelta = v_uv - pointerUv;
    float pointerGlow = exp(-dot(pointerDelta, pointerDelta) * 15.0);

    float verticalMode = 1.0 - step(0.5, u_mode);
    float navMode = step(0.5, u_mode) * (1.0 - step(1.5, u_mode));
    float pillMode = step(1.5, u_mode);

    vec2 verticalVector = rafVerticalLensVector(normalized, u_strength);
    vec2 horizontalVector = rafHorizontalLensVector(
        normalized,
        u_motionVelocity,
        u_strength
    );

    vec2 opticalVector = mix(verticalVector, horizontalVector, navMode + pillMode);
    float opticalMagnitude = length(opticalVector);

    float microNoise = rafFbm(
        normalized * vec2(4.0, 3.2)
        + vec2(u_time * 0.055, -u_time * 0.041)
    ) - 0.5;

    float caustic = rafCausticField(
        normalized * vec2(1.25, 0.82),
        u_time + u_scroll * 0.0007,
        u_scrollVelocity + u_motionVelocity
    );

    float topHighlight = pow(
        rafSaturate(1.0 - (normalized.y + 1.0) * 0.5),
        5.5
    );

    float movingHighlight = rafGaussian(
        normalized.x
            - tanh(u_motionVelocity * 0.025) * 0.36
            - sin(u_time * 0.42) * 0.11,
        0.22 + 0.08 * pillMode
    );

    float impactProgress = rafSaturate(u_impact);
    float impactRing = rafRing(
        length(normalized - (pointerUv - 0.5) * 1.5),
        impactProgress * 1.35,
        mix(0.052, 0.018, impactProgress)
    ) * (1.0 - impactProgress);

    float directionalEdge = normal2.x * tanh(u_motionVelocity * 0.028);
    vec3 spectral = rafSpectralRim(
        edgeBand * (0.08 + pillMode * 0.16) * (1.0 + abs(u_motionVelocity) * 0.003),
        directionalEdge
    );

    float reflection = fresnel * (0.15 + pillMode * 0.14);
    reflection += topHighlight * (0.055 + verticalMode * 0.035);
    reflection += movingHighlight * (0.035 + pillMode * 0.095);
    reflection += pointerGlow * (0.025 + navMode * 0.025);

    float causticAmount = caustic
        * (0.018 + 0.026 * u_quality)
        * (0.72 + pillMode * 1.15)
        * (0.7 + opticalMagnitude * 2.0);

    float whiteBody = 0.006 + microNoise * 0.008;
    whiteBody += causticAmount;
    whiteBody += impactRing * 0.04 * pillMode;
    whiteBody += reflection;

    vec3 color = vec3(max(whiteBody, 0.0));
    color += spectral;

    float alpha = mask * u_opacity;
    alpha *= 0.72 + fresnel * 0.28;

    outColor = vec4(color * alpha, alpha);
}`;

export const VERTICAL_REFRACTION_FIELD_FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform float u_strength;
uniform float u_scrollVelocity;
in vec2 v_uv;
out vec4 outColor;
${GLSL_OPTICS_CORE}
void main() {
    vec2 normalized = v_uv * 2.0 - 1.0;
    vec2 vectorField = rafVerticalLensVector(
        normalized,
        u_strength * (1.0 + min(abs(u_scrollVelocity) * 0.002, 0.5))
    );
    outColor = vec4(vectorField * 0.5 + 0.5, 0.5, 1.0);
}`;

export const HORIZONTAL_NAVIGATION_FIELD_FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform float u_velocity;
uniform float u_strength;
in vec2 v_uv;
out vec4 outColor;
${GLSL_OPTICS_CORE}
void main() {
    vec2 normalized = v_uv * 2.0 - 1.0;
    vec2 vectorField = rafHorizontalLensVector(
        normalized,
        u_velocity,
        u_strength
    );
    outColor = vec4(vectorField * 0.5 + 0.5, 0.5, 1.0);
}`;

export const CHROMATIC_DISPERSION_FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform sampler2D u_scene;
uniform vec2 u_resolution;
uniform float u_strength;
in vec2 v_uv;
out vec4 outColor;
${GLSL_OPTICS_CORE}
void main() {
    vec2 p = v_uv * 2.0 - 1.0;
    vec2 direction = rafSafeNormalize(p + vec2(0.0001));
    float edge = pow(rafSaturate(length(p)), 2.4);
    vec2 shift = direction * edge * u_strength / max(u_resolution, vec2(1.0));
    float r = texture(u_scene, v_uv + shift).r;
    float g = texture(u_scene, v_uv).g;
    float b = texture(u_scene, v_uv - shift).b;
    outColor = vec4(r, g, b, 1.0);
}`;

export const CAUSTIC_LIGHT_FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform float u_time;
uniform float u_velocity;
in vec2 v_uv;
out vec4 outColor;
${GLSL_OPTICS_CORE}
void main() {
    vec2 p = v_uv * 2.0 - 1.0;
    float field = rafCausticField(p, u_time, u_velocity);
    float vignette = pow(rafSaturate(1.0 - length(p) * 0.72), 1.7);
    float amount = field * vignette;
    outColor = vec4(vec3(amount), amount);
}`;

export const MICRO_FROST_FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform float u_time;
uniform float u_density;
in vec2 v_uv;
out vec4 outColor;
${GLSL_OPTICS_CORE}
void main() {
    float grain = rafFbm(v_uv * (96.0 + u_density * 128.0) + u_time * 0.01);
    float pores = smoothstep(0.52, 0.78, grain);
    float alpha = pores * (0.025 + u_density * 0.07);
    outColor = vec4(vec3(0.85 + grain * 0.15) * alpha, alpha);
}`;

export const SPECULAR_RIM_FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_light;
uniform float u_radius;
in vec2 v_uv;
out vec4 outColor;
${GLSL_OPTICS_CORE}
void main() {
    vec2 center = u_resolution * 0.5;
    vec2 halfSize = center - vec2(1.0);
    vec2 local = v_uv * u_resolution - center;
    vec2 normal2 = rafRoundedNormal(local, halfSize, u_radius);
    vec2 lightDirection = rafSafeNormalize(u_light - v_uv * u_resolution);
    float specular = pow(rafSaturate(dot(normal2, lightDirection)), 24.0);
    float edge = 1.0 - smoothstep(0.0, 2.2, abs(rafSdRoundRect(local, halfSize, u_radius)));
    float alpha = specular * edge;
    outColor = vec4(vec3(alpha), alpha);
}`;

export const IMPACT_RIPPLE_FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform vec2 u_center;
uniform float u_progress;
uniform float u_strength;
in vec2 v_uv;
out vec4 outColor;
${GLSL_OPTICS_CORE}
void main() {
    float distanceValue = length(v_uv - u_center);
    float radius = u_progress * 1.1;
    float ring = rafRing(distanceValue, radius, mix(0.045, 0.012, u_progress));
    float fade = 1.0 - smoothstep(0.58, 1.0, u_progress);
    float alpha = ring * fade * u_strength;
    outColor = vec4(vec3(alpha), alpha);
}`;

export const SHADER_CATALOG = Object.freeze({
    opticalComposite: {
        vertex: FULLSCREEN_VERTEX_SHADER,
        fragment: OPTICAL_COMPOSITE_FRAGMENT_SHADER,
        purpose: 'Runtime reflection, caustics, Fresnel rim and motion response',
    },
    verticalRefractionField: {
        vertex: FULLSCREEN_VERTEX_SHADER,
        fragment: VERTICAL_REFRACTION_FIELD_FRAGMENT_SHADER,
        purpose: 'Vertical scroll lens vector field',
    },
    horizontalNavigationField: {
        vertex: FULLSCREEN_VERTEX_SHADER,
        fragment: HORIZONTAL_NAVIGATION_FIELD_FRAGMENT_SHADER,
        purpose: 'Telegram-like moving navigation bubble vector field',
    },
    chromaticDispersion: {
        vertex: FULLSCREEN_VERTEX_SHADER,
        fragment: CHROMATIC_DISPERSION_FRAGMENT_SHADER,
        purpose: 'RGB wavelength separation around curved edges',
    },
    caustics: {
        vertex: FULLSCREEN_VERTEX_SHADER,
        fragment: CAUSTIC_LIGHT_FRAGMENT_SHADER,
        purpose: 'Animated focused-light caustics',
    },
    microFrost: {
        vertex: FULLSCREEN_VERTEX_SHADER,
        fragment: MICRO_FROST_FRAGMENT_SHADER,
        purpose: 'Fine procedural frost/noise layer',
    },
    specularRim: {
        vertex: FULLSCREEN_VERTEX_SHADER,
        fragment: SPECULAR_RIM_FRAGMENT_SHADER,
        purpose: 'Pointer-aware edge highlight',
    },
    impactRipple: {
        vertex: FULLSCREEN_VERTEX_SHADER,
        fragment: IMPACT_RIPPLE_FRAGMENT_SHADER,
        purpose: 'Independent click/tap pressure ripple',
    },
});
