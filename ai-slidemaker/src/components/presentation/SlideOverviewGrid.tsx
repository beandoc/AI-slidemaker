'use client';

import React from 'react';
import { useDeck, useEditorStore } from '@/store/editor';
import { motion } from 'framer-motion';

interface SlideOverviewGridProps {
    onClose: () => void;
}

export default function SlideOverviewGrid({ onClose }: SlideOverviewGridProps) {
    const deck = useDeck();
    const activeSlideIndex = useEditorStore(state => state.activeSlideIndex);
    const setActiveSlideIndex = useEditorStore(state => state.setActiveSlideIndex);

    if (!deck) return null;

    return (
        <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="absolute inset-0 z-50 bg-white/80 overflow-y-auto p-12 custom-scrollbar"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-4xl font-black font-display tracking-tight text-slate-900">Presentation Overview</h2>
                        <p className="text-slate-500 font-medium">{deck.slides.length} Slides total</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-900"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {deck.slides.map((slide, i) => (
                        <div key={slide.id} className="group flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    setActiveSlideIndex(i);
                                    onClose();
                                }}
                                className={`relative aspect-video rounded-2xl overflow-hidden border-4 transition-all duration-300
                                    ${activeSlideIndex === i
                                        ? 'border-blue-500 ring-8 ring-blue-500/10 scale-105 shadow-2xl'
                                        : 'border-white slide-shadow hover:scale-102 hover:border-slate-200'}`}
                            >
                                <div
                                    className="absolute inset-0 bg-slate-50"
                                    style={{ background: slide.background.value, opacity: 0.1 }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 line-clamp-2">{slide.title}</h3>
                                </div>
                                <div className="absolute top-4 left-4 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">
                                    {i + 1}
                                </div>
                            </button>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">{slide.type}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
