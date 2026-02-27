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
        <div className="w-full h-full flex flex-col bg-slate-50 border-r border-slate-200">
            <div className="p-4 flex items-center justify-between border-b border-slate-200 bg-white">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Slides</h2>
                <button className="text-slate-400 hover:text-slate-900 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={deck.slides.map(s => s.id)} strategy={verticalListSortingStrategy}>
                        {deck.slides.map((slide, i) => (
                            <SortableThumbnail
                                key={slide.id}
                                slide={slide}
                                index={i}
                                isActive={activeSlideIndex === i}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}
