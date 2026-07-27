'use client';

import {
    useCallback,
    useRef,
    useState,
} from 'react';

function waitForPaint() {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
        });
    });
}

export default function useSegmentLoading(
    initialValue,
) {
    /*
     * visualValue переключается немедленно.
     * Именно он управляет белым текстом и каплей.
     */
    const [
        visualValue,
        setVisualValue,
    ] = useState(initialValue);

    /*
     * contentValue определяет отображаемый контент.
     */
    const [
        contentValue,
        setContentValue,
    ] = useState(initialValue);

    const [
        isSegmentLoading,
        setIsSegmentLoading,
    ] = useState(false);

    const operationIdRef = useRef(0);

    const selectSegment = useCallback(
        async (
            nextValue,
            loadContent,
        ) => {
            if (
                nextValue === visualValue &&
                !isSegmentLoading
            ) {
                return;
            }

            operationIdRef.current += 1;

            const operationId =
                operationIdRef.current;

            /*
             * Капля и текст переключаются сразу.
             */
            setVisualValue(nextValue);

            /*
             * После этого закрываем только область контента.
             */
            setIsSegmentLoading(true);

            try {
                /*
                 * В loadContent можно выполнить:
                 * - фильтрацию;
                 * - запрос данных;
                 * - динамический import;
                 * - подготовку карточек.
                 */
                await loadContent?.(nextValue);

                if (
                    operationId !==
                    operationIdRef.current
                ) {
                    return;
                }

                setContentValue(nextValue);

                await waitForPaint();

                /*
                 * Небольшой запас для построения сетки
                 * и первого кадра стеклянных карточек.
                 */
                await new Promise((resolve) => {
                    window.setTimeout(resolve, 90);
                });
            } finally {
                if (
                    operationId ===
                    operationIdRef.current
                ) {
                    setIsSegmentLoading(false);
                }
            }
        },
        [
            visualValue,
            isSegmentLoading,
        ],
    );

    return {
        visualValue,
        contentValue,
        isSegmentLoading,
        selectSegment,
    };
}