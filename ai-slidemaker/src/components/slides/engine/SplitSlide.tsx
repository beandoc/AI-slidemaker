'use client';

import React from 'react';
import { Slide } from '@/store/editor-types';
import { motion } from 'framer-motion';

interface SplitSlideProps {
    slide: Slide;
    index: number;
}

export default function SplitSlide({ slide, index }: SplitSlideProps) {
    const {
        heading = "",
        subtitle = "",
        bullets = [],
        image = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
        label = "ANALYSIS"
    } = slide.content;

    return (
        <div className="engine-container">
            <div className="mesh-bg opacity-10" />
            <div className="engine-slide slide--split h-full flex">
                {/* Left Side: Visual */}
                <div className="w-1/2 relative overflow-hidden bg-black">
                    <motion.div
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="bg-img"
                        style={{ backgroundImage: `url('${image}')` }}
                    />
                    <div className="photo-overlay" />
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="vertical-tag"
                    >
                        {label} // V.27
                    </motion.div>
                </div>

                {/* Right Side: Content */}
                <div className="w-1/2 flex items-center p-24 bg-white text-black">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <span className="label text-[0.7rem] text-accent font-black tracking-[0.4em] mb-4 block">
                                SUMMARY
                            </span>
                            <h2 className="text-6xl font-black mb-6 tracking-tighter leading-[1.1]">
                                {heading}
                            </h2>
                            <p className="text-2xl font-light opacity-60 mb-10 leading-relaxed">
                                {subtitle}
                            </p>

                            <ul className="space-y-6">
                                {bullets.map((bullet: string, i: number) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + (i * 0.1) }}
                                        className="flex items-start gap-4"
                                    >
                                        <span className="w-2 h-2 bg-accent rounded-full mt-3 shrink-0" />
                                        <span className="text-xl font-medium opacity-80">{bullet}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
