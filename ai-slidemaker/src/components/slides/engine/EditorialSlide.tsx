'use client';

import React from 'react';
import { Slide } from '@/store/editor-types';
import { motion } from 'framer-motion';

interface EditorialSlideProps {
    slide: Slide;
    index: number;
}

export default function EditorialSlide({ slide, index }: EditorialSlideProps) {
    const {
        heading = "",
        subtitle = "",
        leftLabel = "TAC-OPS",
        rightLabel = "01"
    } = slide.content;

    const headWords = heading.split(' ');
    const displayHeadBold = headWords[0];
    const displayHeadRest = headWords.slice(1, 4).join(' ');
    const subText = headWords.length > 4 ? headWords.slice(4).join(' ') + ' — ' + (subtitle || '') : (subtitle || '');

    const bigNum = rightLabel.padStart(2, '0');

    return (
        <div className="engine-container">
            <div className="mesh-bg" />
            <div className="engine-slide slide--editorial">
                <div className="bleed-element text-[#fff] opacity-[0.03] select-none pointer-events-none" style={{ right: '5vw', top: '10%' }}>
                    {bigNum}
                </div>

                <div className="wide-wrap">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="editorial-header"
                    >
                        <span className="editorial-label">{leftLabel}</span>
                        <span className="editorial-label">// MODULE {bigNum}</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                        className="editorial-body border-l-4 border-accent pl-16 mt-16"
                    >
                        <h1 className="mixed-weight text-[8rem] leading-[0.9] tracking-tighter">
                            <strong>{displayHeadBold}</strong> {displayHeadRest}
                        </h1>
                        {subText && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="subtitle mt-6"
                            >
                                {subText}
                            </motion.p>
                        )}
                    </motion.div>
                </div>
            </div>

            <div className="vertical-tag">STUDIO EDITION // V.27</div>
            <div className="vertical-tag right">PROTOTYPE ARCHIVE // 2026</div>
        </div>
    );
}
