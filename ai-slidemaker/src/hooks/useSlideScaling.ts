'use client';

import { useState, useEffect, RefObject } from 'react';

export function useSlideScaling(containerRef: RefObject<HTMLDivElement | null>) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;

                // Target resolution is 1920x1080
                const targetWidth = 1920;
                const targetHeight = 1080;

                // Calculate scale to fit while maintaining aspect ratio
                // We add some padding (e.g., 40px on each side)
                const padding = 80;
                const availableWidth = width - padding;
                const availableHeight = height - padding;

                const scaleW = availableWidth / targetWidth;
                const scaleH = availableHeight / targetHeight;

                setScale(Math.min(scaleW, scaleH));
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [containerRef]);

    return scale;
}
