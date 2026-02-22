'use client';

import React from 'react';
import { Block } from '@/store/editor-types';
import { useEditorStore } from '@/store/editor';
import { motion } from 'framer-motion';
import Chart from '../blocks/Chart';

interface BlockRendererProps {
    block: Block;
    sectionId: string;
}

export default function BlockRenderer({ block, sectionId }: BlockRendererProps) {
    const setActiveBlock = useEditorStore(state => state.setActiveBlock);
    const activeBlockId = useEditorStore(state => state.activeBlockId);
    const isSelected = activeBlockId === block.id;

    const renderBlockContent = () => {
        switch (block.type) {
            case 'text':
                const Tag = block.data.tag as any;
                const ast = useEditorStore.getState().ast;
                const archetype = ast?.config.archetype;

                return (
                    <Tag
                        className={`w-full focus:outline-none placeholder-white/10 transition-all duration-700
                            ${archetype === 'editorial-ledger' && Tag === 'h1' ? 'text-9xl font-black uppercase tracking-tighter' : ''}
                            ${archetype === 'neon-cyber' && Tag === 'h1' ? 'text-7xl font-light tracking-widest italic' : ''}
                            ${archetype === 'brutalist-signal' ? 'font-mono uppercase' : ''}`}
                        style={{
                            color: block.style.color,
                            fontSize: block.style.fontSize,
                            fontWeight: block.style.fontWeight,
                            lineHeight: block.style.lineHeight,
                            textAlign: block.style.textAlign,
                            fontFamily: block.style.fontFamily,
                        }}
                    >
                        {block.data.content}
                    </Tag>
                );
            case 'image':
                return (
                    <img
                        src={block.data.url}
                        alt={block.data.alt || ''}
                        className="w-full h-auto rounded-lg"
                        style={{
                            objectFit: block.data.fit,
                            borderRadius: block.style.borderRadius,
                        }}
                    />
                );
            case 'chart':
                return (
                    <div className="w-full">
                        <Chart
                            type={block.data.chartType}
                            data={block.data.data}
                        />
                    </div>
                );
            default:
                return <div>Unsupported Block Type</div>;
        }
    };

    return (
        <motion.div
            onClick={(e) => {
                e.stopPropagation();
                setActiveBlock(block.id);
            }}
            className={`relative group cursor-pointer transition-all ${isSelected ? 'ring-2 ring-sky-500 ring-offset-4 ring-offset-[#0d0f14] z-50' : 'hover:ring-1 hover:ring-white/20'}`}
            layoutId={block.id}
        >
            {renderBlockContent()}

            {isSelected && (
                <div className="absolute -top-10 left-0 flex gap-1 bg-sky-500 rounded-lg p-1 shadow-lg">
                    <button className="p-1.5 hover:bg-white/10 rounded-md"><span className="text-[8px] font-bold uppercase">Edit</span></button>
                    <button className="p-1.5 hover:bg-white/10 rounded-md"><span className="text-[8px] font-bold uppercase">Style</span></button>
                    <button className="p-1.5 hover:bg-white/10 rounded-md"><span className="text-[8px] font-bold uppercase">Anim</span></button>
                    <button
                        onClick={() => useEditorStore.getState().removeBlock(sectionId, block.id)}
                        className="p-1.5 hover:bg-white/10 rounded-md text-red-200"
                    >
                        <span className="text-[8px] font-bold uppercase">Del</span>
                    </button>
                </div>
            )}
        </motion.div>
    );
}
