'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';
import { Slide } from '@/store/editor-types';

export default function MetricSlide({ slide }: { slide: Slide }) {
    const option = {
        grid: { top: 40, right: 40, bottom: 40, left: 60 },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025E'],
            axisLine: { lineStyle: { color: '#e2e8f0' } },
            axisLabel: { color: '#94a3b8', fontWeight: 'bold' }
        },
        yAxis: {
            type: 'value',
            min: 0, max: 100,
            axisLabel: { formatter: '{value}%', color: '#94a3b8', fontWeight: 'bold' },
            splitLine: { lineStyle: { type: 'dashed', opacity: 0.1 } }
        },
        series: [{
            data: [15, 22, 35, 48, 62, 75, 88, 95],
            type: 'line',
            smooth: true,
            symbolSize: 8,
            lineStyle: { width: 4, color: '#3b82f6' },
            itemStyle: { color: '#3b82f6', borderWidth: 2, borderColor: '#fff' },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
                        { offset: 1, color: 'rgba(59, 130, 246, 0)' }
                    ]
                }
            }
        }]
    };

    const CARDS = [
        { id: 1, title: 'Virtual Patient Simulations', text: 'AI-driven clinical scenarios that adapt to student decisions in real time.', icon: 'monitor' },
        { id: 2, title: 'Adaptive Learning Paths', text: 'Personalized curricula that identify knowledge gaps and adjust difficulty.', icon: 'shield' },
        { id: 3, title: 'Diagnostic Training', text: 'Pattern recognition for radiology, pathology, and differential diagnosis.', icon: 'activity' },
    ];

    return (
        <div className="w-full h-full bg-white p-12 flex flex-col font-sans relative">
            {/* Slideforge Badge */}
            <div className="absolute top-6 right-12">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Metric View</span>
            </div>

            {/* Header */}
            <div className="mb-12 flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                </div>
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 block mb-1">Emerging Trend</span>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{slide.title}</h1>
                </div>
            </div>

            <div className="flex-1 flex gap-12 min-h-0">
                {/* Left: Chart Area */}
                <div className="flex-[2] flex flex-col gap-6">
                    <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">{slide.subtitle || 'Artificial intelligence is transforming how future clinicians learn — from adaptive curricula to AI-powered patient simulations.'}</p>
                    <div className="flex-1 bg-slate-50/30 rounded-3xl p-8 border border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">AI Adoption in Med Schools (%)</span>
                        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
                    </div>
                </div>

                {/* Right: Key Focus Cards */}
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {CARDS.map((card, i) => (
                        <motion.div
                            key={card.id}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col gap-4 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <Icon name={card.icon as any} size={16} />
                                </div>
                                <h3 className="text-[13px] font-black text-slate-800 tracking-tight">{card.title}</h3>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{card.text}</p>
                        </motion.div>
                    ))}

                    <div className="mt-auto pt-4 flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Source: AAMC Survey Data, 2024. E = Estimate.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Icon({ name, size = 16 }: { name: 'monitor' | 'shield' | 'activity', size?: number }) {
    switch (name) {
        case 'monitor': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
        case 'shield': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
        case 'activity': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
    }
}
