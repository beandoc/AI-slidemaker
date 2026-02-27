'use client';

import React, { useState, useMemo } from 'react';
import { Slide } from '@/store/editor-types';
import Chart from '../blocks/Chart';
import { motion } from 'framer-motion';

interface InteractiveChartSlideProps {
    slide: Slide;
}

export default function InteractiveChartSlide({ slide }: InteractiveChartSlideProps) {
    const { title, description, baseData, controls } = slide.content;

    // State for sliders
    const [sliderValues, setSliderValues] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};
        controls?.forEach((c: any) => initial[c.id] = c.value);
        return initial;
    });

    // Calculate derived data based on sliders
    const chartData = useMemo(() => {
        // Simple linear model for the demonstration supply/demand
        const demandShift = sliderValues['demand'] || 0;
        const supplyShift = sliderValues['supply'] || 0;

        const labels = Array.from({ length: 11 }, (_, i) => i * 10);

        // Demand: P = 100 - Q + shift
        const demand = labels.map(q => Math.max(0, 100 - q + demandShift));

        // Supply: P = 20 + Q - shift
        const supply = labels.map(q => Math.max(0, 20 + q - supplyShift));

        return {
            labels: labels.map(String),
            datasets: [
                { label: 'Demand', data: demand, color: '#3b82f6' },
                { label: 'Supply', data: supply, color: '#10b981' }
            ]
        };
    }, [sliderValues]);

    // Calculate metrics
    const equilibrium = useMemo(() => {
        const dShift = sliderValues['demand'] || 0;
        const sShift = sliderValues['supply'] || 0;
        // 100 - Q + dShift = 20 + Q - sShift
        // 80 + dShift + sShift = 2QH
        const qe = (80 + dShift + sShift) / 2;
        const pe = 100 - qe + dShift;
        return { quantity: qe.toFixed(1), price: pe.toFixed(2) };
    }, [sliderValues]);

    return (
        <div className="w-full h-full bg-slate-50 flex flex-col p-20 font-sans">
            <div className="flex justify-between items-start mb-12">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                        <h2 className="text-5xl font-black font-display tracking-tight text-slate-900">{title}</h2>
                    </div>
                    <p className="text-xl text-slate-500 font-medium">{description}</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-16 overflow-hidden">
                {/* Main Chart Area */}
                <div className="col-span-8 bg-white rounded-[2rem] p-12 slide-shadow relative border border-slate-200">
                    <div className="h-full w-full">
                        <Chart
                            type="line"
                            data={chartData}
                        />
                    </div>
                </div>

                {/* Controls Area */}
                <div className="col-span-4 flex flex-col gap-8">
                    <div className="bg-white rounded-[2rem] p-8 slide-shadow border border-slate-200">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Curve Controls</h3>
                        <div className="space-y-10">
                            {controls?.map((ctrl: any) => (
                                <div key={ctrl.id} className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${ctrl.id === 'demand' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-600">{ctrl.label}</span>
                                        </div>
                                        <span className="text-xs font-black font-mono text-slate-400">{sliderValues[ctrl.id]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={ctrl.min}
                                        max={ctrl.max}
                                        value={sliderValues[ctrl.id]}
                                        onChange={(e) => setSliderValues(prev => ({ ...prev, [ctrl.id]: parseInt(e.target.value) }))}
                                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase">
                                        <span>Lower</span>
                                        <span>Higher</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-orange-50/50 rounded-[2rem] p-8 border border-orange-100 flex-1">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 mb-8">Market Equilibrium</h3>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-bold text-orange-600/60 uppercase mb-2">Price ($)</p>
                                <p className="text-4xl font-black text-slate-900">${equilibrium.price}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-orange-600/60 uppercase mb-2">Quantity</p>
                                <p className="text-4xl font-black text-slate-900">{equilibrium.quantity}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
