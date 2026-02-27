'use client';

import { useEffect } from 'react';
import { useEditorStore } from '@/store/editor';

export function useKeyboardNavigation() {
    const {
        nextSlide,
        prevSlide,
        setFullscreen,
        isFullscreen,
        toggleSidebar,
        toggleGrid,
        toggleNotes
    } = useEditorStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't navigate if typing in an input/textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            // Shift Shortcuts
            if (e.shiftKey) {
                switch (e.key.toUpperCase()) {
                    case 'G':
                        e.preventDefault();
                        toggleGrid();
                        break;
                    case 'N':
                        e.preventDefault();
                        toggleNotes();
                        break;
                    case 'S':
                        e.preventDefault();
                        toggleSidebar();
                        break;
                }
                return;
            }

            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ': // Space
                    e.preventDefault();
                    nextSlide();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'f':
                case 'F':
                    setFullscreen(!isFullscreen);
                    break;
                case 'Escape':
                    if (isFullscreen) {
                        setFullscreen(false);
                    }
                    if (useEditorStore.getState().showGrid) {
                        toggleGrid();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide, setFullscreen, isFullscreen]);
}
