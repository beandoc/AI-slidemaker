'use client';

import React from 'react';
import { Slide } from '@/store/editor-types';
import TitleSlide from '../slides/TitleSlide';

// Engine Portfolio
import BentoSlide from '../slides/engine/BentoSlide';
import KineticSlide from '../slides/engine/KineticSlide';
import EditorialSlide from '../slides/engine/EditorialSlide';
import SplitSlide from '../slides/engine/SplitSlide';
import SimulationSlide from '../slides/engine/SimulationSlide';
import CalculatorSlide from '../slides/engine/CalculatorSlide';
import MetricSlide from '../slides/engine/MetricSlide';
import BookingSlide from '../slides/engine/BookingSlide';
import ThreeDSlide from '../slides/engine/ThreeDSlide';

interface SlideRendererProps {
    slide: Slide;
    index: number;
}

export default function SlideRenderer({ slide, index }: SlideRendererProps) {
    switch (slide.type) {
        case 'title':
            return <TitleSlide slide={slide} />;
        case 'bento':
            return <BentoSlide slide={slide} index={index} />;
        case 'kinetic':
            return <KineticSlide slide={slide} index={index} />;
        case 'editorial':
            return <EditorialSlide slide={slide} index={index} />;
        case 'split':
            return <SplitSlide slide={slide} index={index} />;
        case 'simulation':
            return <SimulationSlide slide={slide} />;
        case 'calculator':
            return <CalculatorSlide slide={slide} />;
        case 'metric-list':
            return <MetricSlide slide={slide} />;
        case 'booking':
            return <BookingSlide slide={slide} />;
        case '3d-sim':
            return <ThreeDSlide slide={slide} />;
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
