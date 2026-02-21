import { create } from 'zustand';

// Types defining the JSON Abstract Syntax Tree (AST)

export type SlideLayout =
    | 'title'
    | 'content'
    | 'quote'
    | 'stats'
    | 'cta'
    | 'split'
    | 'feature-grid'
    | 'image';

export interface StatItem {
    number: string;
    label: string;
}

export interface BrandAsset {
    id: string;
    name: string;
    type: 'logo' | 'icon' | 'image';
    url: string;
}

export interface SlideContent {
    heading?: string;
    subtitle?: string;
    bullets?: string[];
    quote?: string;
    attribution?: string;
    stats?: StatItem[];
    action?: string;
    imagePath?: string;
    imagePrompt?: string;
    icon?: string;
    customIconUrl?: string; // For uploaded brand icons/logos
    notes?: string;
}

export interface SlideAST {
    id: string;
    type: SlideLayout;
    content: SlideContent;
}

export interface PresentationAST {
    title: string;
    theme: string;
    slides: SlideAST[];
    assets: BrandAsset[];
}

// ------------------------------------
// Global State Store
// ------------------------------------

interface EditorState {
    presentation: PresentationAST | null;
    activeSlideId: string | null;

    // Actions
    setPresentation: (data: PresentationAST) => void;
    setActiveSlide: (id: string) => void;
    updateSlideContent: (slideId: string, partialContent: Partial<SlideContent>) => void;
    addAsset: (asset: BrandAsset) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    presentation: null,
    activeSlideId: null,

    setPresentation: (data) => set({
        presentation: data,
        activeSlideId: data.slides.length > 0 ? data.slides[0].id : null
    }),

    setActiveSlide: (id) => set({ activeSlideId: id }),

    addAsset: (asset) => set((state) => {
        if (!state.presentation) return state;
        return {
            presentation: {
                ...state.presentation,
                assets: [...(state.presentation.assets || []), asset]
            }
        };
    }),

    updateSlideContent: (slideId, partialContent) => set((state) => {
        if (!state.presentation) return state;

        return {
            presentation: {
                ...state.presentation,
                slides: state.presentation.slides.map(slide => {
                    if (slide.id === slideId) {
                        return {
                            ...slide,
                            content: { ...slide.content, ...partialContent }
                        }
                    }
                    return slide;
                })
            }
        };
    })
}));
