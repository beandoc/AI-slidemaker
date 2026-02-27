'use client';

import React, { useRef } from 'react';
import { useDeck, useEditorStore, useActiveSlide } from '@/store/editor';
import ThumbnailSidebar from './ThumbnailSidebar';
import SlideRenderer from './SlideRenderer';
import { useSlideScaling } from '@/hooks/useSlideScaling';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import SlideOverviewGrid from './SlideOverviewGrid';
import { motion, AnimatePresence } from 'framer-motion';

import { Slide } from '@/store/editor-types';

import ChatPanel from './ChatPanel';

export default function PresentationViewer({
    onRefine,
    isGenerating = false
}: {
    onRefine?: (prompt: string, currentSlide?: Slide) => void;
    isGenerating?: boolean;
}) {
    const deck = useDeck();
    const activeSlide = useActiveSlide();
    const { isFullscreen, isSidebarOpen, showGrid, showNotes, activeSlideIndex, zoom, toggleSidebar, toggleGrid, toggleNotes, nextSlide, prevSlide } = useEditorStore();

    const viewportRef = useRef<HTMLDivElement>(null);
    const scale = useSlideScaling(viewportRef);

    useKeyboardNavigation();

    if (!deck || !activeSlide) return null;

    return (
        <div className={`flex flex-1 overflow-hidden transition-all duration-500 pb-20 ${isFullscreen ? 'fixed inset-0 z-[100] bg-black' : 'bg-white'}`}>
            {/* 1. CHAT PANEL (Far Left) */}
            {!isFullscreen && (
                <ChatPanel
                    onSendMessage={(text) => onRefine?.(text, activeSlide)}
                    isGenerating={isGenerating}
                />
            )}

            {/* 2. THUMBNAIL STRIP (Middle) */}
            {!isFullscreen && isSidebarOpen && (
                <motion.aside
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    className="shrink-0 border-r border-slate-100 bg-slate-50/50 overflow-hidden"
                >
                    <ThumbnailSidebar />
                </motion.aside>
            )}

            {/* 3. MAIN STAGE (Right) */}
            <main className="flex-1 relative flex flex-col overflow-hidden bg-white">
                {/* TOOLBAR */}
                {!isFullscreen && (
                    <div className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-40">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => useEditorStore.getState().setDeck(null)}
                                className="p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-400 hover:text-red-500"
                                title="Exit to Chat"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
                            </button>
                            <div className="w-px h-6 bg-slate-100 mx-1" />
                            <button
                                onClick={toggleSidebar}
                                className={`p-2 rounded-lg hover:bg-slate-50 transition-colors ${isSidebarOpen ? 'text-blue-500' : 'text-slate-400'}`}
                                title="Toggle Sidebar"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="9" x2="9" y1="3" y2="21" /></svg>
                            </button>
                            <h1 className="text-sm font-bold text-slate-800 tracking-tight ml-2 truncate max-w-[200px]">{deck.title}</h1>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Preview Controls */}
                            <div className="flex items-center bg-slate-100 p-1 rounded-xl mr-4 scale-90">
                                <button className="px-4 py-1.5 bg-white text-blue-500 rounded-lg shadow-sm text-xs font-bold flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                    Preview
                                </button>
                                <button className="px-4 py-1.5 text-slate-500 hover:text-slate-900 rounded-lg text-xs font-bold flex items-center gap-2 transition-all">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                                    Code
                                </button>
                            </div>

                            {/* Premium Actions */}
                            <div className="flex items-center gap-2 mr-4 scale-90 origin-right">
                                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80" alt="Profile" />
                                </div>
                                <button className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-all flex items-center gap-2 border border-slate-200">
                                    Share
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg transition-all">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                                </button>
                                <button className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-2 transition-all">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m13 2-2 10h9L7 22l2-10H3L13 2z" /></svg>
                                    Upgrade
                                </button>
                                <button className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all">
                                    Publish
                                </button>
                            </div>

                            <button
                                onClick={() => useEditorStore.getState().setFullscreen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" x2="14" y1="3" y2="10" /><line x1="3" x2="10" y1="21" y2="14" /></svg>
                                Present
                            </button>
                        </div>
                    </div>
                )}

                {/* VIEWPORT CONTROLLER */}
                <div
                    ref={viewportRef}
                    className="flex-1 relative flex flex-col items-center justify-center bg-slate-50/30 overflow-hidden p-12"
                    style={isFullscreen ? { backgroundColor: '#000', padding: 0 } : {}}
                >
                    <AnimatePresence>
                        {showGrid && <SlideOverviewGrid onClose={toggleGrid} />}
                    </AnimatePresence>

                    <div className="flex-1 w-full relative flex items-center justify-center">
                        <div
                            className="slide-container slide-shadow origin-center transition-transform duration-300 ease-out"
                            style={{ transform: `scale(${scale * zoom})` }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSlide.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                    className="w-full h-full"
                                >
                                    <SlideRenderer slide={activeSlide} index={activeSlideIndex} />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Exit Fullscreen Button (Floating) */}
                    {isFullscreen && (
                        <button
                            onClick={() => useEditorStore.getState().setFullscreen(false)}
                            className="fixed top-6 right-6 z-[110] p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/20 group"
                            title="Exit Fullscreen (Esc)"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    )}

                    {/* Navigation Bar (Lovable Style) */}
                    <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center bg-white/70 backdrop-blur-xl border border-slate-200 rounded-full px-4 py-2 shadow-2xl gap-4 z-50 transition-all ${isFullscreen ? 'opacity-0 hover:opacity-100 scale-90' : 'opacity-100'}`}>
                        <button onClick={prevSlide} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500 border border-slate-100">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <div className="h-4 w-px bg-slate-200 mx-1" />
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[60px] text-center">
                            {activeSlideIndex + 1} of {deck.slides.length}
                        </div>
                        <div className="h-4 w-px bg-slate-200 mx-1" />
                        <button onClick={nextSlide} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500 border border-slate-100">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>
                </div>
            </main>

            {/* Global Presenter Notes (Optional) */}
            <AnimatePresence>
                {showNotes && (
                    <div /> // Hidden for now to match Lovable UI
                )}
            </AnimatePresence>
        </div>
    );
}
