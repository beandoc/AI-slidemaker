'use client';

import React from 'react';
import SectionNavigator from '../navigator/SectionNavigator';
import Stage from './Stage';
import InspectorPanel from '../inspector/InspectorPanel';

export default function EditorShell() {
    return (
        <div className="flex h-screen w-full bg-[#0a0c10] overflow-hidden text-slate-200">
            {/* LEFT: SECTION NAVIGATOR */}
            <aside className="w-64 border-r border-white/5 bg-[#0d0f14]/50 backdrop-blur-xl shrink-0 flex flex-col">
                <SectionNavigator />
            </aside>

            {/* CENTER: LIVE STAGE */}
            <main className="flex-1 relative flex flex-col overflow-hidden bg-[#08090d]">
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0c10]/80 backdrop-blur-md z-40">
                    <div className="text-xs font-bold tracking-widest text-slate-500 uppercase">Stage View</div>
                    <div className="flex gap-4">
                        <button className="text-[10px] font-bold text-sky-400 hover:text-sky-300 transition-colors">PREVIEW</button>
                        <button className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors">SHARE</button>
                        <button className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors">EXPORT</button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-12 custom-scrollbar">
                    <Stage />
                </div>
                <div className="h-10 border-t border-white/5 flex items-center justify-between px-6 bg-[#0a0c10] text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                    <span>Scene v2.0-Alpha</span>
                    <div className="flex gap-4">
                        <span>LCP: 0.8s</span>
                        <span>CLS: 0.01</span>
                    </div>
                </div>
            </main>

            {/* RIGHT: INSPECTOR PANEL */}
            <aside className="w-80 border-l border-white/5 bg-[#0d0f14]/50 backdrop-blur-xl shrink-0 flex flex-col">
                <InspectorPanel />
            </aside>
        </div>
    );
}
