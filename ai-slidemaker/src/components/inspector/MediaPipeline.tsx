'use client';

import React, { useState } from 'react';

interface MediaPipelineProps {
    imageUrl: string;
    onUpdate: (focalPoint: { x: number, y: number }) => void;
}

export default function MediaPipeline({ imageUrl, onUpdate }: MediaPipelineProps) {
    const [point, setPoint] = useState({ x: 50, y: 50 });

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        const newPoint = { x: Math.round(x), y: Math.round(y) };
        setPoint(newPoint);
        onUpdate(newPoint);
    };

    return (
        <div className="space-y-4">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Focal Point Selector</div>
            <div
                className="relative aspect-video rounded-xl overflow-hidden cursor-crosshair group"
                onClick={handleClick}
            >
                <img src={imageUrl} alt="Target" className="w-full h-full object-cover opacity-80" />
                <div
                    className="absolute w-6 h-6 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-2xl pointer-events-none"
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                >
                    <div className="absolute inset-0 bg-sky-500/30 animate-ping rounded-full" />
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Click to set focus</span>
                </div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono italic">
                <span>X: {point.x}%</span>
                <span>Y: {point.y}%</span>
            </div>
        </div>
    );
}
