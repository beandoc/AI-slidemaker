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
        <div
            className="w-full h-full flex flex-col items-center justify-center p-24 text-white relative overflow-hidden"
            style={{
                background: slide.background.value || 'linear-gradient(135deg, #FF0080 0%, #7928CA 100%)',
            }}
        >
            {/* Animated background Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [0, -90, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-3xl"
            />

            <div className="relative z-10 flex flex-col items-center text-center max-w-5xl">
                {tagline && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-lg font-bold tracking-[0.3em] uppercase mb-8 opacity-80"
                    >
                        {tagline}
                    </motion.p>
                )}

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-[120px] font-black leading-[0.9] tracking-tighter mb-12 font-display uppercase"
                >
                    {title}
                </motion.h1>

                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-3xl font-medium opacity-70 max-w-3xl leading-relaxed"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>

            {/* Bottom branding */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 opacity-40">
                <div className="flex items-center gap-2 font-display font-bold text-sm tracking-widest uppercase">
                    <span className="w-2 h-2 bg-white rounded-full" />
                    Lovable Slides
                </div>
            </div>
        </div>
    );
}
