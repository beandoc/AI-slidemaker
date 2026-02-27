'use client';

import React from 'react';
import { useDeck, useEditorStore } from '@/store/editor';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableThumbnail({ slide, index, isActive }: { slide: any, index: number, isActive: boolean }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: slide.id });
    const setActiveSlideIndex = useEditorStore(state => state.setActiveSlideIndex);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => setActiveSlideIndex(index)}
            className="flex items-start gap-4 p-2 cursor-pointer group"
        >
            <span className={`text-[10px] font-black w-4 pt-4 text-center ${isActive ? 'text-blue-500' : 'text-slate-300'}`}>
                {index + 1}
            </span>
            <div
                className={`relative flex-1 aspect-video rounded-lg overflow-hidden border-2 transition-all 
                    ${isActive ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 group-hover:border-slate-300'}
                    bg-slate-50`}
            >
                {/* Miniature slide preview - could be an image or a very scaled down version */}
                <div
                    className="absolute inset-0 transition-opacity"
                    style={{
                        background: slide.background?.value,
                        backgroundSize: 'cover',
                        opacity: 0.8
                    }}
                />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                    <p className="text-[8px] font-bold text-white truncate uppercase tracking-tighter">{slide.title}</p>
                </div>
            </div>
        </div>
    );
}

export default function ThumbnailSidebar() {
    const deck = useDeck();
    const activeSlideIndex = useEditorStore(state => state.activeSlideIndex);
    const reorderSlides = useEditorStore(state => state.reorderSlides);

    const sensors = useSensors(useSensor(PointerSensor));

    if (!deck) return null;

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = deck.slides.findIndex(s => s.id === active.id);
        const newIndex = deck.slides.findIndex(s => s.id === over.id);

        const newOrder = arrayMove(deck.slides, oldIndex, newIndex).map(s => s.id);
        reorderSlides(newOrder);
    };

    return (
        <div className="w-full h-full flex flex-col bg-slate-50/50">
            {/* Top Bar for middle column */}
            <div className="p-4 flex items-center justify-between bg-white border-b border-slate-100">
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Outline</span>
                <div className="flex gap-1">
                    <button
                        onClick={() => useEditorStore.getState().setDeck(null)}
                        className="p-1.5 hover:bg-slate-50 hover:text-red-500 rounded-md text-slate-400 transition-colors"
                        title="New Presentation (Clear Content)"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={deck.slides.map(s => s.id)} strategy={verticalListSortingStrategy}>
                        {deck.slides.map((slide, i) => (
                            <div key={slide.id} className="flex gap-4 group">
                                <span className={`text-[11px] font-black mt-10 transition-colors ${activeSlideIndex === i ? 'text-blue-500' : 'text-slate-300'}`}>
                                    {i + 1}
                                </span>
                                <div className="flex-1">
                                    <div
                                        onClick={() => useEditorStore.getState().setActiveSlideIndex(i)}
                                        className={`relative aspect-video rounded-xl border-2 transition-all cursor-pointer overflow-hidden shadow-sm
                                            ${activeSlideIndex === i
                                                ? 'border-blue-500 ring-4 ring-blue-500/10 scale-102'
                                                : 'border-white hover:border-slate-200'}`}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-80"
                                            style={{ background: slide.background?.value }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center p-3">
                                            <p className={`text-[8px] font-black uppercase tracking-tight text-center line-clamp-2 ${slide.background?.value === '#ffffff' ? 'text-black' : 'text-white'}`}>
                                                {slide.title}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-2 block px-1 tracking-tighter truncate">
                                        {slide.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}
