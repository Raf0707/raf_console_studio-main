const clamp = (value, min, max) => (
    Math.min(max, Math.max(min, value))
);

function roundedRectSdf(x, y, width, height, radius) {
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const safeRadius = Math.min(radius, halfWidth, halfHeight);

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

function smoothstep(edge0, edge1, value) {
    const range = Math.max(
        edge1 - edge0,
        0.0001,
    );

    const t = clamp(
        (value - edge0) / range,
        0,
        1,
    );

    return t * t * (3 - 2 * t);
}

function encodeChannel(value) {
    return Math.round(
        clamp(
            128 + value * 127,
            0,
            255,
        ),
    );
}

/**
 * Горизонтальная выпуклая карта преломления.
 *
 * Профиль:
 *
 *   меньше -> больше -> максимум -> больше -> меньше
 *
 * То есть визуально:
 *
 *   < >
 *
 * В красном канале хранится только горизонтальное смещение.
 * Зелёный канал всегда нейтральный, поэтому текст не должен
 * троиться или разделяться по вертикали.
 */
export function createRefractionMap({
                                        width,
                                        height,
                                        radius,

                                        margin = 24,

                                        edgeBand = 20,
                                        edgeStrength = 0.14,

                                        centerStrength = 0.46,
                                        centerPower = 1.3,

                                        verticalStrength = 0,
                                    }) {
    const safeWidth = Math.max(
        1,
        Math.round(width),
    );

    const safeHeight = Math.max(
        1,
        Math.round(height),
    );

    const safeMargin = Math.max(
        0,
        Math.round(margin),
    );

    const safeRadius = Math.max(
        0,
        Math.min(
            radius,
            safeHeight * 0.5,
        ),
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

    const halfWidth = Math.max(
        safeWidth * 0.5,
        1,
    );

    const halfHeight = Math.max(
        safeHeight * 0.5,
        1,
    );

    const safeEdgeBand = Math.max(
        2,
        edgeBand,
    );

    for (let y = 0; y < mapHeight; y += 1) {
        for (let x = 0; x < mapWidth; x += 1) {
            const offset = (
                y * mapWidth + x
            ) * 4;

            const localX = x - safeMargin;
            const localY = y - safeMargin;

            const distance = roundedRectSdf(
                localX,
                localY,
                safeWidth,
                safeHeight,
                safeRadius,
            );

            pixels[offset + 3] = 255;

            /*
             * За пределами линзы карта нейтральная.
             * Значение 128 означает отсутствие displacement.
             */
            if (distance >= 0) {
                pixels[offset] = 128;
                pixels[offset + 1] = 128;
                pixels[offset + 2] = 128;
                continue;
            }

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

            /*
             * Вертикальная огибающая.
             *
             * Эффект сильнее по центру строки и плавно затухает
             * возле верхней и нижней границы капли.
             *
             * При этом вертикального displacement нет.
             */
            const verticalGate = Math.pow(
                Math.max(
                    1 - normalizedY * normalizedY,
                    0,
                ),
                0.72,
            );

            /*
             * Центральная выпуклая зона.
             *
             * Смещение направлено к центру карты:
             * левая половина сдвигается вправо,
             * правая половина сдвигается влево.
             *
             * Для feDisplacementMap это создаёт эффект увеличения
             * центральных букв.
             */
            const centerEnvelope = Math.pow(
                Math.max(
                    1 - Math.abs(normalizedX),
                    0,
                ),
                centerPower,
            );

            const inwardPull = (
                -normalizedX
                * centerEnvelope
                * centerStrength
                * verticalGate
            );

            /*
             * Узкая краевая зона.
             *
             * Нужна, чтобы крайние буквы не обрывались резко
             * и плавно переходили от меньшего размера к центру.
             */
            const insideDepth = -distance;

            const edgeFade = smoothstep(
                0,
                safeEdgeBand,
                insideDepth,
            );

            const edgeTaper = (
                -normalizedX
                * (1 - edgeFade)
                * edgeStrength
                * verticalGate
            );

            const displacementX = clamp(
                inwardPull + edgeTaper,
                -1,
                1,
            );

            /*
             * По умолчанию verticalStrength = 0.
             *
             * Поэтому зелёный канал остаётся нейтральным
             * и вертикального троения текста быть не должно.
             */
            const displacementY = clamp(
                normalizedY * verticalStrength,
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

    context.putImageData(
        image,
        0,
        0,
    );

    return {
        dataUrl: canvas.toDataURL('image/png'),
        width: mapWidth,
        height: mapHeight,
        margin: safeMargin,
    };
}