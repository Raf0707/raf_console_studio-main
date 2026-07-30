const clamp = (value, min, max) => (
    Math.min(max, Math.max(min, value))
);

function roundedRectSdf(x, y, width, height, radius) {
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const safeRadius = Math.min(
        radius,
        halfWidth,
        halfHeight,
    );

    const qx = Math.abs(x - halfWidth)
        - (halfWidth - safeRadius);
    const qy = Math.abs(y - halfHeight)
        - (halfHeight - safeRadius);

    return (
        Math.hypot(
            Math.max(qx, 0),
            Math.max(qy, 0),
        )
        + Math.min(Math.max(qx, qy), 0)
        - safeRadius
    );
}

function superellipseHeight(depth01, profileShape) {
    const n = Math.max(profileShape, 1.01);
    const inverseDepth = clamp(1 - depth01, 0, 1);
    const inner = Math.max(
        1 - Math.pow(inverseDepth, n),
        0,
    );

    return Math.pow(inner, 1 / n);
}

function gaussian(value, center, width) {
    const safeWidth = Math.max(width, 0.001);
    const normalized = (value - center) / safeWidth;

    return Math.exp(-(normalized * normalized) * 0.5);
}

function encodeChannel(value) {
    return Math.round(
        clamp(128 + value * 127, 0, 255),
    );
}

/**
 * Creates an intentionally art-directed SDF displacement map.
 *
 * The map combines three optical zones:
 * 1. a strong outward edge bend;
 * 2. an opposite inner shoulder that compresses straight grid lines;
 * 3. a broad barrel-lens field that curves the backdrop through the body.
 *
 * This is deliberately more visible than a physically conservative lens,
 * because the RAF interface uses a dark monochrome grid with few large objects.
 */
export function createRefractionMap({
    width,
    height,
    radius,
    margin = 24,
    band = 20,
    profileShape = 3.6,
    edgePower = 1.42,
    bodyStrength = 0.16,
    normalStrength = 1,
    shoulderStrength = 0.34,
    shoulderPosition = 0.58,
    shoulderWidth = 0.17,
    bodyLensStrength = 0.24,
    bodyLensPower = 0.92,
    horizontalLensScale = 0.82,
    verticalLensScale = 1.14,
}) {
    const safeWidth = Math.max(1, Math.round(width));
    const safeHeight = Math.max(1, Math.round(height));
    const safeMargin = Math.max(0, Math.round(margin));
    const safeRadius = Math.max(
        0,
        Math.min(radius, safeHeight * 0.5),
    );
    const safeBand = Math.max(
        2,
        Math.min(band, safeHeight * 0.5),
    );

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', {
        alpha: false,
        willReadFrequently: false,
    });

    if (!context) {
        return null;
    }

    const mapWidth = safeWidth + safeMargin * 2;
    const mapHeight = safeHeight + safeMargin * 2;

    canvas.width = mapWidth;
    canvas.height = mapHeight;

    const image = context.createImageData(
        mapWidth,
        mapHeight,
    );
    const pixels = image.data;

    const halfWidth = Math.max(safeWidth * 0.5, 1);
    const halfHeight = Math.max(safeHeight * 0.5, 1);

    const centerDistance = Math.max(
        -roundedRectSdf(
            halfWidth,
            halfHeight,
            safeWidth,
            safeHeight,
            safeRadius,
        ),
        1,
    );

    const distanceAt = (localX, localY) => (
        roundedRectSdf(
            localX,
            localY,
            safeWidth,
            safeHeight,
            safeRadius,
        )
    );

    for (let y = 0; y < mapHeight; y += 1) {
        for (let x = 0; x < mapWidth; x += 1) {
            const offset = (y * mapWidth + x) * 4;
            const localX = x - safeMargin;
            const localY = y - safeMargin;
            const distance = distanceAt(localX, localY);

            pixels[offset + 3] = 255;

            if (distance >= 0) {
                pixels[offset] = 128;
                pixels[offset + 1] = 128;
                pixels[offset + 2] = 128;
                continue;
            }

            const depth = -distance;
            const depth01 = clamp(
                depth / centerDistance,
                0,
                1,
            );

            const gradientX = (
                distanceAt(localX + 1, localY)
                - distanceAt(localX - 1, localY)
            ) * 0.5;
            const gradientY = (
                distanceAt(localX, localY + 1)
                - distanceAt(localX, localY - 1)
            ) * 0.5;

            const gradientLength = Math.hypot(
                gradientX,
                gradientY,
            ) || 1;

            const normalX = gradientX / gradientLength;
            const normalY = gradientY / gradientLength;

            const edgeDepth = clamp(
                depth / safeBand,
                0,
                1,
            );
            const edgeWeight = Math.pow(
                1 - edgeDepth,
                edgePower,
            );
            const outerFeather = clamp(depth / 1.35, 0, 1);

            const profileHeight = superellipseHeight(
                depth01,
                profileShape,
            );
            const profileEdge = (
                1 - profileHeight
            ) * bodyStrength;

            /*
             * The opposite shoulder produces a readable S-curve in straight
             * grid lines: first they bend out at the rim, then compress back.
             */
            const shoulder = gaussian(
                edgeDepth,
                shoulderPosition,
                shoulderWidth,
            ) * shoulderStrength;

            const edgeAmplitude = (
                edgeWeight * outerFeather
                + profileEdge
                - shoulder
            ) * normalStrength;

            /*
             * A broad barrel field keeps refraction visible away from the rim.
             * The envelope is zero at both the boundary and the exact centre,
             * with maximum curvature through the middle of the glass body.
             */
            const bodyEnvelope = Math.pow(
                Math.max(
                    Math.sin(Math.PI * depth01),
                    0,
                ),
                bodyLensPower,
            );

            const normalizedX = clamp(
                (localX - halfWidth) / halfWidth,
                -1,
                1,
            );
            const normalizedY = clamp(
                (localY - halfHeight) / halfHeight,
                -1,
                1,
            );

            const bodyX = (
                -normalizedX
                * bodyEnvelope
                * bodyLensStrength
                * horizontalLensScale
            );
            const bodyY = (
                -normalizedY
                * bodyEnvelope
                * bodyLensStrength
                * verticalLensScale
            );

            const displacementX = clamp(
                normalX * edgeAmplitude + bodyX,
                -1,
                1,
            );
            const displacementY = clamp(
                normalY * edgeAmplitude + bodyY,
                -1,
                1,
            );

            pixels[offset] = encodeChannel(
                displacementX,
            );
            pixels[offset + 1] = encodeChannel(
                displacementY,
            );
            pixels[offset + 2] = 128;
        }
    }

    context.putImageData(image, 0, 0);

    return {
        dataUrl: canvas.toDataURL('image/png'),
        width: mapWidth,
        height: mapHeight,
        margin: safeMargin,
    };
}
