'use client';

import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';
import { Slide } from '@/store/editor-types';

export default function SimulationSlide({ slide }: { slide: Slide }) {
    const [demandShift, setDemandShift] = useState(0);
    const [supplyShift, setSupplyShift] = useState(0);

    // Simulation Math
    const equilibrium = useMemo(() => {
        // Base Demand: Q = 100 - P  => P = 100 - Q
        // Base Supply: Q = P        => P = Q
        // Shifted Demand: P = (100 + demandShift) - Q
        // Shifted Supply: P = Q - supplyShift

        // Equilibrium (P_d = P_s):
        // (100 + demandShift) - Q = Q - supplyShift
        // 100 + demandShift + supplyShift = 2Q
        const q = (100 + demandShift + supplyShift) / 2;
        const p = q - supplyShift;

        const totalRevenue = p * q;
        const totalCost = (q * q) / 2; // Simple quadratic cost
        const profit = totalRevenue - totalCost;

        return {
            price: p.toFixed(2),
            quantity: q.toFixed(2),
            revenue: totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            cost: totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            profit: profit.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            margin: ((profit / totalRevenue) * 100).toFixed(1) + '%'
        };
    }, [demandShift, supplyShift]);

    const option = {
        animation: false,
        tooltip: { trigger: 'axis' },
        grid: { top: 40, right: 20, bottom: 40, left: 40 },
        xAxis: {
            name: 'Quantity',
            min: 0, max: 100,
            splitLine: { show: true, lineStyle: { type: 'dashed', opacity: 0.1 } }
        },
        yAxis: {
            name: 'Price ($)',
            min: 0, max: 140,
            splitLine: { show: true, lineStyle: { type: 'dashed', opacity: 0.1 } }
        },
        series: [
            {
                name: 'Demand',
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: { width: 3, color: '#3b82f6' },
                data: Array.from({ length: 11 }, (_, i) => {
                    const q = i * 10;
                    return [q, (100 + demandShift) - q];
                })
            },
            {
                name: 'Supply',
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: { width: 3, color: '#10b981' },
                data: Array.from({ length: 11 }, (_, i) => {
                    const q = i * 10;
                    return [q, q - supplyShift];
                })
            },
            {
                name: 'Equilibrium',
                type: 'scatter',
                symbolSize: 12,
                itemStyle: { color: '#f59e0b', borderWidth: 2, borderColor: '#fff' },
                data: [[parseFloat(equilibrium.quantity), parseFloat(equilibrium.price)]],
                markLine: {
                    symbol: 'none',
                    lineStyle: { type: 'dashed', color: '#f59e0b', opacity: 0.5 },
                    data: [
                        { type: 'average', xAxis: parseFloat(equilibrium.quantity) },
                        { type: 'average', yAxis: parseFloat(equilibrium.price) }
                    ]
                }
            }
        ],
        legend: { bottom: 0, itemGap: 20 }
    };

    return (
        <div className="w-full h-full bg-white p-12 flex flex-col font-sans">
            {/* Header */}
            <div className="mb-8 pl-4 border-l-4 border-blue-500">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{slide.title}</h1>
                <p className="text-slate-500 font-medium">{slide.subtitle || 'Adjust the curves to see real-time market equilibrium and economic outcomes'}</p>
            </div>

            <div className="flex-1 flex gap-12 min-h-0">
                {/* Left: Chart Area */}
                <div className="flex-[2] bg-slate-50/50 rounded-3xl border border-slate-100 p-8 flex flex-col relative overflow-hidden">
                    <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
                </div>

                {/* Right: Controls & Widgets */}
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Curve Controls */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Curve Controls</span>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        <span>Demand Shift</span>
                                    </div>
                                    <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{demandShift}</span>
                                </div>
                                <input
                                    type="range" min="-40" max="40" value={demandShift}
                                    onChange={(e) => setDemandShift(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
                                    <span>Less Demand</span>
                                    <span>More Demand</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span>Supply Shift</span>
                                    </div>
                                    <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{supplyShift}</span>
                                </div>
                                <input
                                    type="range" min="-40" max="40" value={supplyShift}
                                    onChange={(e) => setSupplyShift(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-green-500"
                                />
                                <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
                                    <span>Higher Costs</span>
                                    <span>Lower Costs</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Equilibrium Result */}
                    <div className="bg-orange-50/50 rounded-2xl border border-orange-100 p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <div className="w-24 h-24 bg-orange-500 rounded-full" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-4 block">Market Equilibrium</span>
                        <div className="flex gap-12">
                            <div>
                                <span className="text-[10px] font-bold text-orange-400/70 uppercase block mb-1">Price</span>
                                <span className="text-2xl font-black text-orange-900">${equilibrium.price}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-orange-400/70 uppercase block mb-1">Quantity</span>
                                <span className="text-2xl font-black text-orange-900">{equilibrium.quantity}</span>
                            </div>
                        </div>
                    </div>

                    {/* Financial Widget */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Financial Outcomes</span>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs font-medium">
                                <span className="text-slate-400">Total Revenue</span>
                                <span className="font-bold text-blue-600">{equilibrium.revenue}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-medium">
                                <span className="text-slate-400">Total Cost</span>
                                <span className="font-bold text-slate-700">{equilibrium.cost}</span>
                            </div>
                            <div className="h-px bg-slate-50 my-2" />
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-900">Profit</span>
                                <span className="text-sm font-black text-green-600">{equilibrium.profit}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400">Profit Margin</span>
                                <span className="text-sm font-black text-green-500">{equilibrium.margin}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
