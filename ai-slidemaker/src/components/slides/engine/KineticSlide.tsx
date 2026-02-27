'use client';

import React from 'react';
import { Slide } from '@/store/editor-types';
import { motion } from 'framer-motion';

interface KineticSlideProps {
    slide: Slide;
    index: number;
}

export default function KineticSlide({ slide, index }: KineticSlideProps) {
    const { heading = "Energy", text = "" } = slide.content;

    const blobs = [
        { top: '10%', left: '10%', duration: 15 },
        { top: '60%', left: '70%', duration: 18 },
        { top: '30%', left: '50%', duration: 20 },
        { top: '80%', left: '20%', duration: 22 },
        { top: '20%', left: '80%', duration: 19 },
    ];

    return (
        <div className="engine-container overflow-hidden">
            <div className="kinetic-playground">
                {blobs.map((b, i) => (
                    <motion.div
                        key={i}
                        className="k-blob"
                        style={{ top: b.top, left: b.left }}
                        animate={{
                            x: [0, 100, -100, 0],
                            y: [0, -100, 100, 0],
                            scale: [1, 1.2, 0.8, 1],
                        }}
                        transition={{
                            duration: b.duration,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <div className="engine-slide slide--kinetic">
                <div className="wide-wrap flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                        className="glass-panel text-center p-20 rounded-[3rem] w-full max-w-4xl"
                    >
                        <h2 className="pan-up text-6xl tracking-tight mb-8">
                            {heading}
                        </h2>
                        {text && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-2xl font-light opacity-70 leading-relaxed"
                            >
                                {text}
                            </motion.p>
                        )}
                    </motion.div>
                </div>
            </div>

            <div className="vertical-tag">STUDIO EDITION // V.27</div>
        </div>
    );
}
