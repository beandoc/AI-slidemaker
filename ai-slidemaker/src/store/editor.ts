import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import { SceneAST, Section, Block, DocumentConfig, Asset } from './editor-types';

interface EditorState {
    ast: SceneAST | null;
    activeSectionId: string | null;
    activeBlockId: string | null;
    isEditMode: boolean;

    // --- Actions ---
    setAst: (ast: SceneAST) => void;
    setActiveSection: (id: string | null) => void;
    setActiveBlock: (id: string | null) => void;
    toggleEditMode: () => void;

    // --- Scene Operations ---
    updateConfig: (config: Partial<DocumentConfig>) => void;

    // --- Section Operations ---
    addSection: (section: Section, index?: number) => void;
    removeSection: (id: string) => void;
    updateSection: (id: string, updates: Partial<Section>) => void;
    reorderSections: (newOrder: string[]) => void;

    // --- Block Operations ---
    addBlock: (sectionId: string, block: Block, index?: number) => void;
    removeBlock: (sectionId: string, blockId: string) => void;
    updateBlock: (sectionId: string, blockId: string, updates: Partial<Block>) => void;
    reorderBlocks: (sectionId: string, newOrder: string[]) => void;

    // --- Asset Operations ---
    addAsset: (asset: Asset) => void;
    removeAsset: (id: string) => void;
}

export const useEditorStore = create<EditorState>()(
    temporal(
        persist(
            (set) => ({
                ast: null,
                activeSectionId: null,
                activeBlockId: null,
                isEditMode: true,

                setAst: (ast) => set({
                    ast,
                    activeSectionId: ast.sections.length > 0 ? ast.sections[0].id : null
                }),

                setActiveSection: (id) => set({ activeSectionId: id, activeBlockId: null }),
                setActiveBlock: (id) => set({ activeBlockId: id }),
                toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),

                updateConfig: (updates) => set((state) => {
                    if (!state.ast) return state;
                    return {
                        ast: {
                            ...state.ast,
                            config: { ...state.ast.config, ...updates }
                        }
                    };
                }),

                addSection: (section, index) => set((state) => {
                    if (!state.ast) return state;
                    const newSections = [...state.ast.sections];
                    if (index !== undefined) {
                        newSections.splice(index, 0, section);
                    } else {
                        newSections.push(section);
                    }
                    return { ast: { ...state.ast, sections: newSections } };
                }),

                removeSection: (id) => set((state) => {
                    if (!state.ast) return state;
                    return {
                        ast: {
                            ...state.ast,
                            sections: state.ast.sections.filter(s => s.id !== id)
                        }
                    };
                }),

                updateSection: (id, updates) => set((state) => {
                    if (!state.ast) return state;
                    return {
                        ast: {
                            ...state.ast,
                            sections: state.ast.sections.map(s => s.id === id ? { ...s, ...updates } : s)
                        }
                    };
                }),

                reorderSections: (newOrder) => set((state) => {
                    if (!state.ast) return state;
                    const sectionMap = new Map(state.ast.sections.map(s => [s.id, s]));
                    const newSections = newOrder.map(id => sectionMap.get(id)!).filter(Boolean);
                    return { ast: { ...state.ast, sections: newSections } };
                }),

                addBlock: (sectionId, block, index) => set((state) => {
                    if (!state.ast) return state;
                    return {
                        ast: {
                            ...state.ast,
                            sections: state.ast.sections.map(s => {
                                if (s.id !== sectionId) return s;
                                const newBlocks = [...s.blocks];
                                if (index !== undefined) {
                                    newBlocks.splice(index, 0, block);
                                } else {
                                    newBlocks.push(block);
                                }
                                return { ...s, blocks: newBlocks };
                            })
                        }
                    };
                }),

                removeBlock: (sectionId, blockId) => set((state) => {
                    if (!state.ast) return state;
                    return {
                        ast: {
                            ...state.ast,
                            sections: state.ast.sections.map(s => {
                                if (s.id !== sectionId) return s;
                                return { ...s, blocks: s.blocks.filter(b => b.id !== blockId) };
                            })
                        }
                    };
                }),

                updateBlock: (sectionId, blockId, updates) => set((state) => {
                    if (!state.ast) return state;
                    return {
                        ast: {
                            ...state.ast,
                            sections: state.ast.sections.map(s => {
                                if (s.id !== sectionId) return s;
                                return {
                                    ...s,
                                    blocks: s.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b)
                                };
                            })
                        }
                    };
                }),

                reorderBlocks: (sectionId, newOrder) => set((state) => {
                    if (!state.ast) return state;
                    return {
                        ast: {
                            ...state.ast,
                            sections: state.ast.sections.map(s => {
                                if (s.id !== sectionId) return s;
                                const blockMap = new Map(s.blocks.map(b => [b.id, b]));
                                const newBlocks = newOrder.map(id => blockMap.get(id)!).filter(Boolean);
                                return { ...s, blocks: newBlocks };
                            })
                        }
                    };
                }),

                addAsset: (asset) => set((state) => {
                    if (!state.ast) return state;
                    return {
                        ast: {
                            ...state.ast,
                            assets: { ...state.ast.assets, [asset.id]: asset }
                        }
                    };
                }),

                removeAsset: (id) => set((state) => {
                    if (!state.ast) return state;
                    const newAssets = { ...state.ast.assets };
                    delete newAssets[id];
                    return { ast: { ...state.ast, assets: newAssets } };
                }),
            }),
            {
                name: 'slidemaker-v2-storage',
            }
        ),
        {
            limit: 50, // Undo stack limit
        }
    )
);

// Helper selectors
export const useAst = () => useEditorStore((state) => state.ast);
export const useActiveSection = () => useEditorStore((state) =>
    state.ast?.sections.find(s => s.id === state.activeSectionId)
);
export const useUndoStore = () => useEditorStore.temporal;
