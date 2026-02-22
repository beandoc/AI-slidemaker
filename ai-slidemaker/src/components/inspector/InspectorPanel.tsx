'use client';

import React from 'react';
import { useEditorStore, useAst, useUndoStore } from '@/store/editor';
import MediaPipeline from './MediaPipeline';
import { generateProductionHTML } from '@/lib/export/vanilla-html/renderer';

export default function InspectorPanel() {
    const ast = useAst();
    const activeSectionId = useEditorStore(state => state.activeSectionId);
    const activeBlockId = useEditorStore(state => state.activeBlockId);
    const updateBlock = useEditorStore(state => state.updateBlock);
    const updateSection = useEditorStore(state => state.updateSection);
    const updateConfig = useEditorStore(state => state.updateConfig);

    const { undo, redo } = useUndoStore().getState(); // New line for undo/redo

    const activeSection = ast?.sections.find(s => s.id === activeSectionId);
    const activeBlock = activeSection?.blocks.find(b => b.id === activeBlockId);

    if (!ast) return null;

    return (
        <div className="flex flex-col h-full h-screen">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Properties</h2>
                <div className="flex gap-2">
                    <button onClick={() => undo()} className="p-1 hover:text-white transition-colors" title="Undo">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></svg>
                    </button>
                    <button onClick={() => redo()} className="p-1 hover:text-white transition-colors" title="Redo">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 14 5-5-5-5" /><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" /></svg>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {activeBlock ? (
                    <div className="space-y-6">
                        <header>
                            <h3 className="text-xs font-bold text-sky-400 capitalize">{activeBlock.type} Block</h3>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{activeBlock.id}</p>
                        </header>

                        {/* CONTENT SECTION */}
                        <div className="space-y-4">
                            <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Content</label>
                            {activeBlock.type === 'text' && (
                                <textarea
                                    value={activeBlock.data.content}
                                    onChange={(e) => updateBlock(activeSectionId!, activeBlock.id, { data: { ...activeBlock.data, content: e.target.value } })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-sky-500/50 min-h-[100px]"
                                />
                            )}
                            {activeBlock.type === 'image' && (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={activeBlock.data.url}
                                        onChange={(e) => updateBlock(activeSectionId!, activeBlock.id, { data: { ...activeBlock.data, url: e.target.value } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-sky-500/50"
                                        placeholder="Image URL"
                                    />
                                    <MediaPipeline
                                        imageUrl={activeBlock.data.url}
                                        onUpdate={(focalPoint) => updateBlock(activeSectionId!, activeBlock.id, { data: { ...activeBlock.data, focalPoint } })}
                                    />
                                </div>
                            )}
                        </div>

                        {/* TYPOGRAPHY / STYLE SECTION */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Style</label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <span className="text-[8px] text-slate-500 uppercase">Text Align</span>
                                    <select
                                        value={activeBlock.style.textAlign}
                                        onChange={(e) => updateBlock(activeSectionId!, activeBlock.id, { style: { ...activeBlock.style, textAlign: e.target.value as any } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-[10px]"
                                    >
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[8px] text-slate-500 uppercase">Weight</span>
                                    <input
                                        type="number"
                                        step="100"
                                        min="100"
                                        max="900"
                                        value={activeBlock.style.fontWeight || 400}
                                        onChange={(e) => updateBlock(activeSectionId!, activeBlock.id, { style: { ...activeBlock.style, fontWeight: parseInt(e.target.value) } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-[10px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ADDING ANIMATION PLACEHOLDER */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Motion</label>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-all">
                                Add Entrance Animation
                            </button>
                        </div>
                    </div>
                ) : activeSection ? (
                    <div className="space-y-6">
                        <header>
                            <h3 className="text-xs font-bold text-emerald-400">Section Settings</h3>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{activeSection.id}</p>
                        </header>

                        <div className="space-y-4">
                            <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Background</label>
                            <div className="flex gap-2">
                                {['#0a0c10', '#1e293b', '#450a0a', '#064e3b'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => updateSection(activeSection.id, { background: { ...activeSection.background, value: c, type: 'color' } })}
                                        className={`w-8 h-8 rounded-full border-2 ${activeSection.background.value === c ? 'border-white' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Add Block</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => useEditorStore.getState().addBlock(activeSection.id, { id: `b_${Date.now()}`, type: 'text', data: { content: 'New Paragraph', tag: 'p' }, style: { textAlign: 'left' } })}
                                    className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-sky-500/40 text-[9px] font-bold text-slate-300"
                                >
                                    TEXT
                                </button>
                                <button
                                    onClick={() => useEditorStore.getState().addBlock(activeSection.id, { id: `b_${Date.now()}`, type: 'image', data: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80', fit: 'cover' }, style: { textAlign: 'left' } })}
                                    className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-sky-500/40 text-[9px] font-bold text-slate-300"
                                >
                                    IMAGE
                                </button>
                                <button
                                    onClick={() => useEditorStore.getState().addBlock(activeSection.id, {
                                        id: `b_${Date.now()}`,
                                        type: 'chart',
                                        data: {
                                            chartType: 'bar',
                                            data: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [120, 190, 80, 150] }
                                        },
                                        style: { textAlign: 'center' }
                                    })}
                                    className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-sky-500/40 text-[9px] font-bold text-slate-300"
                                >
                                    CHART
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">Select a section or block<br />to edit properties</p>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-white/5 bg-[#0d0f14] mt-auto">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global Theme</span>
                    <span className="text-[10px] text-sky-400 font-mono">v2.0</span>
                </div>
                <div className="flex gap-2 mb-6">
                    {['#38bdf8', '#fb7185', '#34d399', '#facc15'].map(c => (
                        <button
                            key={c}
                            onClick={() => updateConfig({ theme: { ...ast.config.theme, primary: c, accent: c } })}
                            className={`w-5 h-5 rounded-md ${ast.config.theme.primary === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0d0f14]' : ''}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => {
                            const html = generateProductionHTML(ast);
                            const blob = new Blob([html], { type: 'text/html' });
                            const url = URL.createObjectURL(blob);
                            window.open(url, '_blank');
                        }}
                        className="py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-sky-500/20"
                    >
                        Live Preview
                    </button>
                    <button
                        onClick={() => {
                            const html = generateProductionHTML(ast);
                            const blob = new Blob([html], { type: 'text/html' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `presentation-${Date.now()}.html`;
                            a.click();
                        }}
                        className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                        Export HTML
                    </button>
                </div>
            </div>
        </div>
    );
}
