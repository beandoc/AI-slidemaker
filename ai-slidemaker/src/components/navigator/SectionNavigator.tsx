'use client';

import React from 'react';
import { useAst, useEditorStore } from '@/store/editor';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableSection({ id, index, title, isActive }: { id: string, index: number, title: string, isActive: boolean }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    const setActiveSection = useEditorStore(state => state.setActiveSection);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => setActiveSection(id)}
            className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${isActive ? 'bg-sky-500/10 border-sky-500/30' : 'bg-transparent border-transparent hover:bg-white/5'}`}
        >
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-white/20">{index + 1}</span>
                <span className={`text-xs font-medium truncate ${isActive ? 'text-sky-400' : 'text-slate-400'}`}>
                    {title || "Untitled Section"}
                </span>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity">
                <div className="w-1.5 h-4 flex flex-col justify-between">
                    <div className="h-0.5 w-full bg-white rounded-full"></div>
                    <div className="h-0.5 w-full bg-white rounded-full"></div>
                    <div className="h-0.5 w-full bg-white rounded-full"></div>
                </div>
            </div>
        </div>
    );
}

const BLUEPRINTS: { id: string, name: string, layout: string, blocks: any[] }[] = [
    {
        id: 'hero',
        name: 'Hero Impact',
        layout: 'hero',
        blocks: [
            { id: 'b1', type: 'text', data: { content: 'PRIMAL VISION', tag: 'h1' }, style: { textAlign: 'center', fontWeight: 900 } }
        ]
    },
    {
        id: 'split',
        name: 'Narrative Split',
        layout: 'split',
        blocks: [
            { id: 'b1', type: 'image', data: { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80' }, style: { textAlign: 'left' } },
            { id: 'b2', type: 'text', data: { content: 'Dualistic Reality', tag: 'h2' }, style: { textAlign: 'left' } }
        ]
    },
    {
        id: 'bento',
        name: 'Bento Grid',
        layout: 'bento',
        blocks: [
            { id: 'b1', type: 'text', data: { content: 'THE ECOSYSTEM', tag: 'h2' }, style: { textAlign: 'left' } },
            { id: 'b2', type: 'chart', data: { chartType: 'bar', data: { labels: ['A', 'B', 'C'], values: [10, 20, 30] } }, style: { textAlign: 'center' } }
        ]
    }
];

export default function SectionNavigator() {
    const ast = useAst();
    const activeSectionId = useEditorStore(state => state.activeSectionId);
    const reorderSections = useEditorStore(state => state.reorderSections);
    const [showBlueprints, setShowBlueprints] = React.useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    if (!ast) return null;

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = ast.sections.findIndex(s => s.id === active.id);
            const newIndex = ast.sections.findIndex(s => s.id === over.id);
            const newSections = arrayMove(ast.sections, oldIndex, newIndex);
            reorderSections(newSections.map(s => s.id));
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0d0f14]">
            <div className="p-6 relative border-b border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Sections</h2>
                    <button
                        onClick={() => setShowBlueprints(!showBlueprints)}
                        className={`p-2 rounded-full transition-all ${showBlueprints ? 'bg-sky-500 text-white' : 'hover:bg-white/5 text-sky-400'}`}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                </div>

                {showBlueprints && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-[#161920] border-b border-white/10 p-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
                        <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Choose Blueprint</label>
                        <div className="grid grid-cols-1 gap-2">
                            {BLUEPRINTS.map(bp => (
                                <button
                                    key={bp.id}
                                    onClick={() => {
                                        const newId = `s_${Date.now()}`;
                                        useEditorStore.getState().addSection({
                                            id: newId,
                                            layoutId: bp.layout,
                                            blocks: bp.blocks.map(b => ({ ...b, id: `${b.id}_${Date.now()}` })),
                                            background: { type: 'color', value: ast.config.theme.background, opacity: 1 }
                                        });
                                        useEditorStore.getState().setActiveSection(newId);
                                        setShowBlueprints(false);
                                    }}
                                    className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-left transition-all"
                                >
                                    <span className="text-[10px] font-bold text-slate-300">{bp.name}</span>
                                    <span className="text-[8px] px-2 py-0.5 bg-white/5 rounded text-white/30 uppercase">{bp.layout}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={ast.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                        {ast.sections.map((section, i) => (
                            <SortableSection
                                key={section.id}
                                id={section.id}
                                index={i}
                                title={section.title || `Section ${i + 1}`}
                                isActive={activeSectionId === section.id}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            <div className="p-6 border-t border-white/5 bg-[#0d0f14]">
                <button
                    onClick={() => useEditorStore.getState().setAst({ ...ast! })}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-all"
                >
                    Save Draft
                </button>
            </div>
        </div>
    );
}
