'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slide } from '@/store/editor-types';

const INITIAL_FEATURES = [
    { id: 'analytics', title: 'Advanced Analytics', desc: 'Real-time dashboards and custom reports', adoption: 87, users: 2400, icon: 'analytics' },
    { id: 'automation', title: 'Workflow Automation', desc: 'Automate repetitive tasks and approvals', adoption: 72, users: 1800, icon: 'zap' },
    { id: 'security', title: 'Enterprise Security', desc: 'SSO, audit logs, and compliance tools', adoption: 94, users: 3100, icon: 'shield' },
    { id: 'collab', title: 'Team Collaboration', desc: 'Shared workspaces and real-time editing', adoption: 68, users: 1500, icon: 'users' },
    { id: 'notifs', title: 'Smart Notifications', desc: 'AI-powered alerts and digest emails', adoption: 45, users: 890, icon: 'bell' },
];

export default function CalculatorSlide({ slide }: { slide: Slide }) {
    const [selectedIds, setSelectedIds] = useState<string[]>(['analytics', 'security']);

    const toggleFeature = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const stats = useMemo(() => {
        const selected = INITIAL_FEATURES.filter(f => selectedIds.includes(f.id));
        if (selected.length === 0) return { avgAdoption: 0, totalUsers: '0', count: 0 };

        const avgAdoption = Math.round(selected.reduce((acc, f) => acc + f.adoption, 0) / selected.length);
        const totalUsers = selected.reduce((acc, f) => acc + f.users, 0);

        return {
            avgAdoption,
            totalUsers: (totalUsers / 1000).toFixed(1) + 'k',
            count: selected.length
        };
    }, [selectedIds]);

    return (
        <div className="w-full h-full bg-white p-12 flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <div className="mb-10 pl-4 border-l-4 border-blue-500">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{slide.title}</h1>
                <p className="text-slate-500 font-medium">{slide.subtitle || 'Select features to see combined adoption metrics and user engagement'}</p>
            </div>

            <div className="flex-1 flex gap-12 min-h-0">
                {/* Left: Component Grid */}
                <div className="flex-[2] grid grid-cols-2 gap-4 auto-rows-max overflow-y-auto pr-2 custom-scrollbar">
                    {INITIAL_FEATURES.map((feature) => {
                        const isSelected = selectedIds.includes(feature.id);
                        return (
                            <motion.div
                                key={feature.id}
                                onClick={() => toggleFeature(feature.id)}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col gap-4
                                    ${isSelected ? 'border-blue-500 bg-blue-50/10 shadow-lg shadow-blue-500/5' : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-slate-900 transition-colors'}`}>
                                        <Icon name={feature.icon as any} size={18} />
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center
                                        ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-200'}`}>
                                        {isSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                                    </div>
                                </div>

                                <div>
                                    <h3 className={`text-sm font-black mb-1 ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>{feature.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed truncate">{feature.desc}</p>
                                </div>

                                <div className="space-y-2 mt-2">
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-slate-400 uppercase tracking-tight">Adoption</span>
                                        <span className={isSelected ? 'text-blue-600' : 'text-slate-900'}>{feature.adoption}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${feature.adoption}%` }}
                                            className={`h-full ${isSelected ? 'bg-blue-500' : 'bg-slate-300 transition-colors group-hover:bg-slate-400'}`}
                                        />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-300 uppercase block">≈ {feature.users} active users</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Right: Summary Panel */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Selected Count */}
                    <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2 block">Selected Features</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black">{stats.count}</span>
                            <span className="text-blue-200 font-bold">of {INITIAL_FEATURES.length} available</span>
                        </div>
                    </div>

                    {/* Combined Adoption */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col gap-6 flex-1">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Combined Adoption Rate</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black text-slate-900">{stats.avgAdoption}</span>
                                <span className="text-2xl font-black text-slate-300">%</span>
                            </div>
                        </div>

                        <div className="relative h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${stats.avgAdoption}%` }}
                                className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                transition={{ type: "spring", stiffness: 50 }}
                            />
                        </div>

                        {/* Selection Chips */}
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Active Selection</span>
                            <div className="flex flex-wrap gap-2">
                                <AnimatePresence>
                                    {selectedIds.map(id => {
                                        const f = INITIAL_FEATURES.find(x => x.id === id);
                                        return (
                                            <motion.div
                                                key={id}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-100 flex items-center gap-2"
                                            >
                                                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                                                {f?.title}
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                                {selectedIds.length === 0 && (
                                    <span className="text-[10px] font-bold text-slate-300 italic">No features selected</span>
                                )}
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-2">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                    Total Active Users
                                </span>
                                <span className="text-2xl font-black text-slate-900">{stats.totalUsers}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Icon({ name, size = 24 }: { name: 'analytics' | 'zap' | 'shield' | 'users' | 'bell', size?: number }) {
    switch (name) {
        case 'analytics': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
        case 'zap': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
        case 'shield': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
        case 'users': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
        case 'bell': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
    }
}
