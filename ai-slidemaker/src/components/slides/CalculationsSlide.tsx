'use client';

import React, { useState } from 'react';
import { Slide } from '@/store/editor-types';
import { motion, AnimatePresence } from 'framer-motion';

interface CalculationsSlideProps {
    slide: Slide;
}

export default function CalculationsSlide({ slide }: CalculationsSlideProps) {
    const { title, items } = slide.content;
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const toggleItem = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const totalAdoption = (items || [])
        .filter((item: any) => selectedIds.has(item.id))
        .reduce((acc: number, item: any) => acc + (item.value || 0), 0);

    const activeItems = (items || []).filter((item: any) => selectedIds.has(item.id));

    return (
        <div className="w-full h-full bg-slate-50 flex flex-col p-20 font-sans">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                <h2 className="text-5xl font-black font-display tracking-tight text-slate-900">{title}</h2>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-16 overflow-hidden">
                {/* Cards Grid */}
                <div className="col-span-8 grid grid-cols-2 gap-6 h-fit">
                    {(items || []).map((item: any) => {
                        const isSelected = selectedIds.has(item.id);
                        return (
                            <motion.button
                                key={item.id}
                                onClick={() => toggleItem(item.id)}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`text-left p-8 rounded-[2rem] border-2 transition-all h-48 flex flex-col justify-between
                                    ${isSelected
                                        ? 'bg-blue-50 border-blue-500 ring-4 ring-blue-500/10'
                                        : 'bg-white border-slate-100 hover:border-slate-300 slide-shadow'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-xl ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-200'}`}>
                                        {isSelected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                                    </div>
                                </div>
                                <div>
                                    <h4 className={`text-xl font-black mb-1 ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>{item.label}</h4>
                                    <p className={`text-sm font-medium ${isSelected ? 'text-blue-600/60' : 'text-slate-400'}`}>{item.description || 'Global Adoption Rate'}</p>
                                    <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.value}%` }}
                                            className={`h-full ${isSelected ? 'bg-blue-500' : 'bg-slate-300'}`}
                                        />
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Summary Panel */}
                <div className="col-span-4 flex flex-col gap-8">
                    <div className="bg-blue-600 rounded-[2rem] p-8 text-white slide-shadow flex flex-col justify-between h-56">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Selected Features</p>
                        <div>
                            <p className="text-7xl font-black mb-1">{selectedIds.size}</p>
                            <p className="text-sm font-bold opacity-60">of {items?.length || 0} available</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 border border-slate-200 slide-shadow flex-1 flex flex-col">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Calculated Metrics</h3>

                        <div className="mb-12">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Combined Adoption Rate</p>
                            <div className="flex items-end gap-3 mb-4">
                                <span className="text-6xl font-black text-slate-900">{selectedIds.size > 0 ? (totalAdoption / selectedIds.size).toFixed(0) : 0}</span>
                                <span className="text-2xl font-black text-slate-300 mb-2">%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    animate={{ width: `${selectedIds.size > 0 ? (totalAdoption / selectedIds.size) : 0}%` }}
                                    className="h-full bg-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Active Selection</p>
                            <div className="flex flex-wrap gap-2">
                                <AnimatePresence>
                                    {activeItems.map((item: any) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-[10px] font-black text-blue-600 uppercase tracking-tighter"
                                        >
                                            {item.label}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {activeItems.length === 0 && (
                                    <p className="text-xs font-medium text-slate-300 italic">No features selected</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Impact</p>
                                <p className="text-2xl font-black text-slate-900">{totalAdoption}k</p>
                            </div>
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
