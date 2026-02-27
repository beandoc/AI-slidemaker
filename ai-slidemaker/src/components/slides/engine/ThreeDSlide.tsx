'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Slide } from '@/store/editor-types';

export default function ThreeDSlide({ slide }: { slide: Slide }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-500, 500], [30, -30]);
    const rotateY = useTransform(x, [-500, 500], [-30, 30]);

    function handleMouseMove(event: React.MouseEvent) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <div className="w-full h-full bg-[#f8faff] p-12 flex flex-col font-sans relative overflow-hidden">
            {/* Header */}
            <div className="mb-8 max-w-2xl">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 block mb-2">3D Interactive</span>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{slide.title}</h1>
                <p className="text-slate-500 font-medium">{slide.subtitle || 'Click and drag to orbit around the 3D object'}</p>
            </div>

            <div
                className="flex-1 flex items-center justify-center relative cursor-move"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ perspective: 1200 }}
            >
                {/* 3D Object (CSS Mesh Simulation) */}
                <motion.div
                    style={{ rotateX, rotateY }}
                    className="relative w-96 h-96 flex items-center justify-center"
                >
                    {/* Floating Orbs for depth */}
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />

                    {/* The "Mesh" */}
                    <div className="relative w-64 h-64 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-blob shadow-2xl flex items-center justify-center">
                        <div className="w-48 h-48 bg-white/10 rounded-full backdrop-blur-3xl border border-white/20 flex items-center justify-center">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin-slow">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 2a10 10 0 0 1 10 10" />
                            </svg>
                        </div>
                    </div>

                    {/* Surrounding Nodes */}
                    {[0, 90, 180, 270].map((deg, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-12 h-12 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center"
                            style={{
                                transform: `rotate(${deg}deg) translateX(180px) rotate(-${deg}deg)`
                            }}
                            animate={{
                                y: [0, -20, 0],
                                rotateZ: [0, 10, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: i * 0.5
                            }}
                        >
                            <div className="w-4 h-4 rounded-full bg-blue-500/20" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Badge Bottom */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full px-6 py-2.5 shadow-xl flex items-center gap-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="m15 18-6-6 6-6" /><path d="m9 18 6-6-6-6" /></svg>
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Move Mouse to rotate view</span>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
                    33% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
                    66% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
                    100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
                }
                .animate-blob { animation: blob 10s infinite alternate; }
                .animate-spin-slow { animation: spin 20s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
