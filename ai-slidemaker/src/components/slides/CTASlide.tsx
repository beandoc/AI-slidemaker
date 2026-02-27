'use client';

import React from 'react';
import { Slide } from '@/store/editor-types';
import { motion } from 'framer-motion';

interface CTASlideProps {
    slide: Slide;
}

export default function CTASlide({ slide }: CTASlideProps) {
    const { title, text, buttonText } = slide.content;

    return (
        <div className="w-full h-full bg-slate-900 border-[1.5rem] border-white flex flex-col items-center justify-center p-24 text-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-12"
                >
                    <div className="w-24 h-24 bg-blue-500 rounded-3xl flex items-center justify-center text-white mb-8 mx-auto shadow-2xl shadow-blue-500/20">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-7xl font-black font-display tracking-tight mb-8"
                >
                    {title || 'Ready to shift?'}
                </motion.h2>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed mb-16"
                >
                    {text || 'Join over 5,000 teams building interactive presentations that engage and convert like never before.'}
                </motion.p>

                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-white text-slate-900 rounded-2xl text-xl font-black hover:bg-slate-50 transition-all shadow-2xl"
                >
                    {buttonText || 'Schedule a Demo'}
                </motion.button>
            </div>

            <div className="absolute bottom-16 w-full px-24 flex justify-between items-center opacity-40">
                <div className="flex items-center gap-2 font-display font-bold text-xs tracking-[0.2em] uppercase">
                    Lovable Slides
                </div>
                <div className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                </div>
            </div>
        </div>
    );
}
