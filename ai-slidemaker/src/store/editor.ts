import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import { Deck, Slide, DeckTheme } from './editor-types';

interface EditorState {
    deck: Deck | null;
    activeSlideIndex: number;
    isSidebarOpen: boolean;
    isFullscreen: boolean;
    showGrid: boolean;
    showNotes: boolean;
    zoom: number;

    // --- Actions ---
    setDeck: (deck: Deck | null) => void;
    setActiveSlideIndex: (index: number) => void;
    nextSlide: () => void;
    prevSlide: () => void;
    toggleSidebar: () => void;
    toggleGrid: () => void;
    toggleNotes: () => void;
    setFullscreen: (val: boolean) => void;
    setZoom: (val: number) => void;

    // --- Deck Operations ---
    updateTheme: (theme: Partial<DeckTheme>) => void;
    addSlide: (slide: Slide, index?: number) => void;
    removeSlide: (id: string) => void;
    updateSlide: (id: string, updates: Partial<Slide>) => void;
    reorderSlides: (newOrder: string[]) => void;
}

export const useEditorStore = create<EditorState>()(
    temporal(
        persist(
            (set) => ({
                deck: null,
                activeSlideIndex: 0,
                isSidebarOpen: true,
                isFullscreen: false,
                showGrid: false,
                showNotes: false,
                zoom: 1,

                setDeck: (deck) => set({ deck, activeSlideIndex: 0 }),
                setActiveSlideIndex: (index) => set({ activeSlideIndex: index }),

                nextSlide: () => set((state) => {
                    if (!state.deck) return state;
                    const nextIndex = Math.min(state.activeSlideIndex + 1, state.deck.slides.length - 1);
                    return { activeSlideIndex: nextIndex };
                }),

                prevSlide: () => set((state) => {
                    const prevIndex = Math.max(state.activeSlideIndex - 1, 0);
                    return { activeSlideIndex: prevIndex };
                }),

                toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
                toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
                toggleNotes: () => set((state) => ({ showNotes: !state.showNotes })),
                setFullscreen: (val) => set({ isFullscreen: val }),
                setZoom: (val) => set({ zoom: val }),

                updateTheme: (updates) => set((state) => {
                    if (!state.deck) return state;
                    return {
                        deck: {
                            ...state.deck,
                            theme: { ...state.deck.theme, ...updates }
                        }
                    };
                }),

                addSlide: (slide, index) => set((state) => {
                    if (!state.deck) return state;
                    const newSlides = [...state.deck.slides];
                    if (index !== undefined) {
                        newSlides.splice(index, 0, slide);
                    } else {
                        newSlides.push(slide);
                    }
                    return { deck: { ...state.deck, slides: newSlides } };
                }),

                removeSlide: (id) => set((state) => {
                    if (!state.deck) return state;
                    const newSlides = state.deck.slides.filter(s => s.id !== id);
                    const newIndex = Math.min(state.activeSlideIndex, newSlides.length - 1);
                    return {
                        deck: { ...state.deck, slides: newSlides },
                        activeSlideIndex: Math.max(0, newIndex)
                    };
                }),

                updateSlide: (id, updates) => set((state) => {
                    if (!state.deck) return state;
                    return {
                        deck: {
                            ...state.deck,
                            slides: state.deck.slides.map(s => s.id === id ? { ...s, ...updates } : s)
                        }
                    };
                }),

                reorderSlides: (newOrder) => set((state) => {
                    if (!state.deck) return state;
                    const slideMap = new Map(state.deck.slides.map(s => [s.id, s]));
                    const newSlides = newOrder.map(id => slideMap.get(id)!).filter(Boolean);
                    return { deck: { ...state.deck, slides: newSlides } };
                }),
            }),
            {
                name: 'lovable-slides-storage',
            }
        ),
        {
            limit: 50,
        }
    )
);

// Helper selectors
export const useDeck = () => useEditorStore((state) => state.deck);
export const useActiveSlide = () => useEditorStore((state) =>
    state.deck?.slides[state.activeSlideIndex]
);
export const useUndoStore = () => useEditorStore.temporal;

