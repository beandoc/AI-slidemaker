'use client';

import React from 'react';
import { Slide } from '@/store/editor-types';
import TitleSlide from '../slides/TitleSlide';
import InteractiveChartSlide from '../slides/InteractiveChartSlide';
import CalculationsSlide from '../slides/CalculationsSlide';
import ComparisonSlide from '../slides/ComparisonSlide';
import CTASlide from '../slides/CTASlide';
import BookingSlide from '../slides/BookingSlide';

interface SlideRendererProps {
    slide: Slide;
}

export default function SlideRenderer({ slide }: SlideRendererProps) {
    switch (slide.type) {
        case 'title':
            return <TitleSlide slide={slide} />;
        case 'interactive-chart':
            return <InteractiveChartSlide slide={slide} />;
        case 'calculations':
            return <CalculationsSlide slide={slide} />;
        case 'comparison':
            return <ComparisonSlide slide={slide} />;
        case 'cta':
            return <CTASlide slide={slide} />;
        case 'booking':
            return <BookingSlide slide={slide} />;
        case 'custom':
            return (
                <div
                    className="w-full h-full bg-white text-slate-900 flex flex-col items-center justify-center p-20"
                    dangerouslySetInnerHTML={{ __html: slide.content.html || '<div>No HTML provided</div>' }}
                />
            );
        default:
            return (
                <div className="w-full h-full flex flex-col items-center justify-center bg-white p-20">
                    <h1 className="text-4xl font-bold mb-4">{slide.title}</h1>
                    <pre className="text-xs bg-slate-50 p-4 rounded-lg overflow-auto max-w-full">
                        {JSON.stringify(slide.content, null, 2)}
                    </pre>
                </div>
            );
    }
}
