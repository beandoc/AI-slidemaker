'use client';

import React, { useState } from 'react';
import { useDeck, useEditorStore } from '@/store/editor';
import PresentationViewer from '@/components/presentation/PresentationViewer';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppHome() {
  const deck = useDeck();
  const setDeck = useEditorStore(state => state.setDeck);

  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [title, setTitle] = useState('');

  const handleGenerate = async () => {
    if (!content.trim()) return;

    setIsGenerating(true);
    try {
      // Reworked generation logic
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Create a professional interactive slide deck for: ${title || 'Presentation'}. Content: ${content}`
        }),
      });

      const payload = await response.json();
      if (response.ok && payload.data) {
        setDeck(payload.data);
      } else {
        alert(payload.error || 'Generation failed. Check the server console.');
      }
    } catch (error) {
      console.error(error);
      alert("Network error: Could not reach generation API.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (refinePrompt: string, currentSlide?: any) => {
    if (!deck || !refinePrompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `USER REQUEST: "${refinePrompt}"\n\nCONTEXT: We are currently on a slide of type "${currentSlide?.type || 'unknown'}".\nCURRENT SLIDE DATA: ${JSON.stringify(currentSlide?.content || {})}\n\nPlease update the slide or the deck as requested. If the user wants to ADD an element (like a chart to cards), use the 'custom' slide type and write HTML that combines them.`
        }),
      });

      const payload = await response.json();
      if (payload.data) {
        setDeck(payload.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <AnimatePresence mode="wait">
        {!deck ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50"
          >
            <div className="w-full max-w-2xl bg-white rounded-3xl p-10 slide-shadow border border-slate-200">
              <div className="mb-8">
                <h1 className="text-3xl font-black font-display tracking-tight text-slate-900 mb-2">Build a presentation</h1>
                <p className="text-slate-500 font-medium">Paste your content and we'll generate interactive slides, charts, and simulations.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Presentation Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Q3 Market Analysis"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paste your content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste paragraphs, data points, or a quick outline..."
                    className="w-full h-48 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium resize-none"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !content.trim()}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Analyzing Content...</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 22 14-8L5 6V22z" /><path d="m14 14 5 4-5 4" /><path d="m14 6 5-4-5-4" /></svg>
                      <span>Generate Interactive Deck</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            <PresentationViewer
              onRefine={handleRefine}
              isGenerating={isGenerating}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
