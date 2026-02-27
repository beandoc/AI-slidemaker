'use client';

import React from 'react';
import { Slide } from '@/store/editor-types';
import { motion } from 'framer-motion';

interface TitleSlideProps {
    slide: Slide;
}

export default function TitleSlide({ slide }: TitleSlideProps) {
    const { title, subtitle, tagline } = slide.content;

    return (
        <div className="engine-container">
            <div className="bg-wrap">
                <div
                    className="bg-img ken-burns"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')` }}
                />
            </div>
            <div className="overlay" />
            <div className="mesh-bg opacity-30" />

            <div className="engine-slide slide--hero">
                <div className="vertical-title">{title?.split(' ')[0]?.toUpperCase()}</div>
                <div className="vertical-tag">STUDIO EDITION // V.27</div>
                <div className="vertical-tag right">PROTOTYPE ARCHIVE // 2026</div>

                <div className="wide-wrap flex flex-col items-center text-center relative z-10">
                    {tagline && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8"
                        >
                            <span className="text-[0.7rem] letter-spacing-[0.5em] opacity-50 border border-white/20 px-6 py-2 rounded-full uppercase">
                                {tagline}
                            </span>
                        </motion.div>
                    )}

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                        className="text-[8rem] font-black leading-[0.9] tracking-tighter mb-12 uppercase drop-shadow-2xl"
                    >
                        {title}
                    </motion.h1>

                    <div className="w-20 h-[3px] bg-accent mx-auto mb-12 rounded-full" />

                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-2xl font-light opacity-70 max-w-3xl leading-relaxed"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>
            </div>

            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 opacity-30">
                <div className="flex items-center gap-3 font-display font-bold text-xs tracking-[0.3em] uppercase">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                    Lovable Slides
                </div>
            </div>
        </div>
    );
}
