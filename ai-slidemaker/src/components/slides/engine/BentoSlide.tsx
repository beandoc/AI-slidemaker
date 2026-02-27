'use client';

import React from 'react';
import { Slide } from '@/store/editor-types';
import { motion } from 'framer-motion';

interface BentoSlideProps {
    slide: Slide;
    index: number;
}

export default function BentoSlide({ slide, index }: BentoSlideProps) {
    const { cards = [], heading = "Architecture" } = slide.content;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as any } }
    };

    return (
        <div className="engine-container">
            <div className="mesh-bg" />
            <div className="engine-slide slide--bento">
                <div className="wide-wrap">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-12"
                    >
                        {heading}
                    </motion.h2>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="bento-grid"
                    >
                        {cards.map((card: any, i: number) => (
                            <motion.div
                                key={i}
                                variants={item}
                                className={`bento-card relative overflow-hidden ${card.size || ''}`}
                            >
                                <div className="relative z-10">
                                    <span className="label text-[0.65rem] opacity-80 border-b border-accent/20 pb-1 mb-4 inline-block">
                                        {card.label || 'FEATURE'}
                                    </span>
                                    <h3 className="text-[2.2rem] mb-4 font-display leading-tight">
                                        {card.title}
                                    </h3>
                                    <p className="font-light opacity-70 leading-relaxed text-[1.1rem]">
                                        {card.text}
                                    </p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent pointer-events-none" />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="vertical-tag">STUDIO EDITION // V.27</div>
            <div className="vertical-tag right">PROTOTYPE ARCHIVE // 2026</div>
        </div>
    );
}
