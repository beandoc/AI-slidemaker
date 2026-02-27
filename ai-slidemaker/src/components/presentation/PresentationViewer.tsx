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

export default function PresentationViewer({ onRefine }: { onRefine?: (prompt: string, currentSlide?: Slide) => void }) {
    const deck = useDeck();
    const activeSlide = useActiveSlide();
    const { isFullscreen, isSidebarOpen, showGrid, showNotes, activeSlideIndex, zoom, toggleSidebar, toggleGrid, toggleNotes, nextSlide, prevSlide } = useEditorStore();

    const [refinePrompt, setRefinePrompt] = React.useState('');

    const viewportRef = useRef<HTMLDivElement>(null);
    const scale = useSlideScaling(viewportRef);

    useKeyboardNavigation();

    if (!deck || !activeSlide) return null;

    return (
        <div className={`flex flex-1 overflow-hidden transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[100] bg-black' : 'bg-slate-100'}`}>
            {/* THUMBNAIL SIDEBAR */}
            {!isFullscreen && (
                <motion.aside
                    initial={false}
                    animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                    className="shrink-0 overflow-hidden"
                >
                    <ThumbnailSidebar />
                </motion.aside>
            )}

            {/* MAIN STAGE */}
            <main className="flex-1 relative flex flex-col overflow-hidden">
                {/* TOOLBAR */}
                {!isFullscreen && (
                    <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-40">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className={`p-2 rounded-lg hover:bg-slate-50 transition-colors ${isSidebarOpen ? 'text-blue-500' : 'text-slate-400'}`}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="9" x2="9" y1="3" y2="21" /></svg>
                            </button>
                            <h1 className="text-sm font-bold text-slate-800 tracking-tight">{deck.title}</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                <button
                                    onClick={() => useEditorStore.getState().setZoom(Math.max(0.1, useEditorStore.getState().zoom - 0.1))}
                                    className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200"
                                    title="Zoom Out"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12" /></svg>
                                </button>
                                <button
                                    onClick={() => useEditorStore.getState().setZoom(1)}
                                    className="px-2 text-[10px] font-black text-slate-400 uppercase hover:text-slate-900 transition-colors"
                                    title="Reset Zoom"
                                >
                                    {Math.round(useEditorStore.getState().zoom * 100)}%
                                </button>
                                <button
                                    onClick={() => useEditorStore.getState().setZoom(Math.min(2, useEditorStore.getState().zoom + 0.1))}
                                    className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200"
                                    title="Zoom In"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
                                </button>
                            </div>

                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                <button
                                    onClick={toggleGrid}
                                    className={`p-1.5 rounded-lg transition-all border border-transparent ${showGrid ? 'bg-white text-blue-500 shadow-sm border-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
                                    title="Overview Grid (Shift+G)"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                                </button>
                                <button
                                    onClick={toggleNotes}
                                    className={`p-1.5 rounded-lg transition-all border border-transparent ${showNotes ? 'bg-white text-blue-500 shadow-sm border-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
                                    title="Presenter Notes (Shift+N)"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                </button>
                            </div>

                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                <button onClick={prevSlide} className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                </button>
                                <div className="px-3 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {activeSlideIndex + 1} / {deck.slides.length}
                                </div>
                                <button onClick={nextSlide} className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
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
                    className="flex-1 relative flex flex-col items-center justify-center bg-slate-100 overflow-hidden"
                    style={isFullscreen ? { backgroundColor: '#000', padding: 0 } : {}}
                >
                    <AnimatePresence>
                        {showGrid && <SlideOverviewGrid onClose={toggleGrid} />}
                    </AnimatePresence>

                    <div className="flex-1 w-full relative flex items-center justify-center p-8">
                        <div
                            className="slide-container slide-shadow origin-center transition-transform duration-300 ease-out"
                            style={{ transform: `scale(${scale * zoom})` }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSlide.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="w-full h-full"
                                >
                                    <SlideRenderer slide={activeSlide} />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Progress floating indicator */}
                    {!showNotes && (
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 z-10 w-full max-w-xl">
                            <div className="flex gap-2">
                                {deck.slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => useEditorStore.getState().setActiveSlideIndex(i)}
                                        className={`h-1 rounded-full transition-all ${activeSlideIndex === i ? 'w-8 bg-blue-500' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                                    />
                                ))}
                            </div>

                            {/* Floating AI Bar */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="w-full bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full h-14 pl-6 pr-2 py-2 flex items-center shadow-2xl slide-shadow"
                            >
                                <input
                                    type="text"
                                    value={refinePrompt}
                                    onChange={(e) => setRefinePrompt(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && onRefine && refinePrompt.trim()) {
                                            onRefine(refinePrompt, activeSlide);
                                            setRefinePrompt('');
                                        }
                                    }}
                                    placeholder="Ask AI to modify current slide..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-600 placeholder:text-slate-400"
                                />
                                <button
                                    onClick={() => {
                                        if (onRefine && refinePrompt.trim()) {
                                            onRefine(refinePrompt, activeSlide);
                                            setRefinePrompt('');
                                        }
                                    }}
                                    className="p-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </button>
                            </motion.div>
                        </div>
                    )}

                    {/* Presenter Notes Panel */}
                    <AnimatePresence>
                        {showNotes && (
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 240 }}
                                exit={{ height: 0 }}
                                className="w-full bg-white border-t border-slate-200 z-30 overflow-hidden shadow-2xl"
                            >
                                <div className="p-8 h-full flex flex-col max-w-5xl mx-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Presenter Notes — Slide {activeSlideIndex + 1}</h3>
                                        <button onClick={toggleNotes} className="text-slate-300 hover:text-slate-900">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                    <div className="flex-1 bg-slate-50 rounded-2xl p-6 text-slate-600 font-medium leading-relaxed overflow-y-auto custom-scrollbar">
                                        {activeSlide.notes || "No notes for this slide. Speak naturally!"}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
