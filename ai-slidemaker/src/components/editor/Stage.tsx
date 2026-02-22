'use client';

import React from 'react';
import { useAst, useEditorStore } from '@/store/editor';
import { Section } from '@/store/editor-types';
import BlockRenderer from './BlockRenderer';
import { useSceneMotion } from '@/lib/motion';

export default function Stage() {
    const ast = useAst();
    const activeSectionId = useEditorStore(state => state.activeSectionId);

    if (!ast) return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="text-4xl font-black text-white/10 animate-pulse uppercase tracking-tighter">No Scene Loaded</div>
                <button
                    onClick={() => {
                        // Initialize with a default scene if empty
                        useEditorStore.getState().setAst({
                            id: 'default',
                            version: '2.0',
                            title: 'New Presentation',
                            config: {
                                archetype: 'neon-cyber',
                                theme: {
                                    primary: '#38bdf8',
                                    secondary: '#0f172a',
                                    accent: '#38bdf8',
                                    background: '#0a0c10',
                                    foreground: '#ffffff',
                                    fonts: { headline: 'Outfit', body: 'Inter' }
                                },
                                typography: { baseSize: 16, scaleRatio: 1.25 },
                                motion: { enabled: true, reducedMotion: false }
                            },
                            sections: [
                                {
                                    id: 's1',
                                    layoutId: 'hero',
                                    blocks: [
                                        {
                                            id: 'b1',
                                            type: 'text',
                                            data: { content: 'DESIGNING THE FUTURE', tag: 'h1' },
                                            style: { textAlign: 'center', fontWeight: 900 }
                                        }
                                    ],
                                    background: { type: 'color', value: '#0a0c10', opacity: 1 }
                                }
                            ],
                            assets: {}
                        });
                    }}
                    className="px-6 py-2 bg-sky-500 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-sky-400 transition-all"
                >
                    Create New Scene
                </button>
            </div>
        </div>
    );

    const containerRef = React.useRef<HTMLDivElement>(null);
    useSceneMotion(containerRef);

    return (
        <div ref={containerRef} className={`space-y-20 pb-40 archetype-${ast.config.archetype}`}>
            {ast.sections.map((section, idx) => (
                <div
                    key={section.id}
                    id={section.id}
                    className={`scene-section relative mx-auto w-full max-w-[1200px] aspect-video shadow-2xl overflow-hidden transition-all duration-700 
                        ${ast.config.archetype === 'glass-aero' ? 'rounded-[2rem]' : 'rounded-xl'}
                        ${ast.config.archetype === 'brutalist-signal' ? 'border-4 border-black' : 'ring-1 ring-white/10'}
                        ${activeSectionId === section.id ? 'ring-sky-500/50 scale-[1.02]' : 'opacity-60 scale-[0.98]'}`}
                    onMouseEnter={() => useEditorStore.getState().setActiveSection(section.id)}
                >
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundColor: section.background.type === 'color' ? section.background.value : undefined,
                            backgroundImage: section.background.type === 'image' ? `url(${section.background.value})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: section.background.opacity
                        }}
                    />

                    <div className="relative z-10 h-full w-full p-20 overflow-hidden">
                        {section.layoutId === 'hero' && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                                {section.blocks.map((block) => (
                                    <BlockRenderer key={block.id} block={block} sectionId={section.id} />
                                ))}
                            </div>
                        )}

                        {section.layoutId === 'split' && (
                            <div className="h-full grid grid-cols-2 gap-20 items-center">
                                <div className="space-y-6">
                                    {section.blocks.filter((_, i) => i % 2 === 0).map((block) => (
                                        <BlockRenderer key={block.id} block={block} sectionId={section.id} />
                                    ))}
                                </div>
                                <div className="space-y-6">
                                    {section.blocks.filter((_, i) => i % 2 !== 0).map((block) => (
                                        <BlockRenderer key={block.id} block={block} sectionId={section.id} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {section.layoutId === 'bento' && (
                            <div className="h-full grid grid-cols-3 grid-rows-2 gap-4">
                                {section.blocks.map((block, i) => (
                                    <div key={block.id} className={`${i === 0 ? 'col-span-2 row-span-2' : 'col-span-1'}`}>
                                        <BlockRenderer block={block} sectionId={section.id} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {!['hero', 'split', 'bento'].includes(section.layoutId) && (
                            <div className="h-full flex flex-col justify-center space-y-6">
                                {section.blocks.map((block) => (
                                    <BlockRenderer key={block.id} block={block} sectionId={section.id} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
