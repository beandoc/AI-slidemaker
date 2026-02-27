'use client';

import React from 'react';
import { Slide } from '@/store/editor-types';
import { motion } from 'framer-motion';

interface ComparisonSlideProps {
    slide: Slide;
}

export default function ComparisonSlide({ slide }: ComparisonSlideProps) {
    const { title, left, right } = slide.content;

    return (
        <div className="w-full h-full bg-white flex flex-col p-20 font-sans">
            <div className="flex items-center gap-3 mb-16 px-10">
                <div className="w-1.5 h-8 bg-slate-900 rounded-full" />
                <h2 className="text-5xl font-black font-display tracking-tight text-slate-900">{title}</h2>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-2 overflow-hidden px-10">
                {/* Left Side */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-50 rounded-[3rem] p-16 flex flex-col"
                >
                    <h3 className="text-3xl font-black text-slate-900 mb-10 font-display">{left?.title || 'Traditional Approach'}</h3>
                    <ul className="space-y-8">
                        {(left?.points || []).map((point: string, i: number) => (
                            <motion.li
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                key={i}
                                className="flex items-start gap-5"
                            >
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-500"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </div>
                                <span className="text-xl text-slate-500 font-medium leading-relaxed">{point}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Right Side */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-blue-600 rounded-[3rem] p-16 flex flex-col text-white slide-shadow relative overflow-hidden"
                >
                    {/* Decorative Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />

                    <h3 className="text-3xl font-black mb-10 font-display relative z-10">{right?.title || 'Lovable Slides'}</h3>
                    <ul className="space-y-8 relative z-10">
                        {(right?.points || []).map((point: string, i: number) => (
                            <motion.li
                                initial={{ x: 10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                key={i}
                                className="flex items-start gap-5"
                            >
                                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 mt-1">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-blue-600"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <span className="text-xl font-medium leading-relaxed opacity-90">{point}</span>
                            </motion.li>
                        ))}
                    </ul>

                    <div className="mt-auto pt-10">
                        <div className="px-6 py-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                            <p className="text-sm font-bold opacity-70 mb-1">Performance Lift</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black">+45%</span>
                                <span className="text-xs font-bold opacity-60 uppercase tracking-widest">Efficiency</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom branding */}
            <div className="mt-12 text-center opacity-20">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Feature Comparison Framework 2026</p>
            </div>
        </div>
    );
}
