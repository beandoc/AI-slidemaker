'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export const useSceneMotion = (containerRef: React.RefObject<HTMLElement | null>) => {
    useEffect(() => {
        if (!containerRef.current) return;

        const sections = containerRef.current.querySelectorAll('.scene-section');

        sections.forEach((section: any, i) => {
            gsap.fromTo(section,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [containerRef]);
};

export const ENTRANCE_ANIMATIONS = {
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    'slide-up': { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
    zoom: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
};
