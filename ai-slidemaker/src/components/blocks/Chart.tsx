'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useEditorStore } from '@/store/editor';

interface ChartProps {
    type: 'bar' | 'line' | 'pie' | 'area' | 'timeline';
    data: any;
    theme?: any;
}

export default function Chart({ type, data, theme }: ChartProps) {
    const ast = useEditorStore(state => state.ast);
    const primaryColor = ast?.config.theme.primary || '#38bdf8';
    const foregroundColor = ast?.config.theme.foreground || '#ffffff';

    const getOption = () => {
        const baseOption = {
            backgroundColor: 'transparent',
            textStyle: { color: foregroundColor, fontFamily: 'Inter' },
            tooltip: { trigger: 'axis' },
            grid: { top: 20, bottom: 40, left: 40, right: 20, containLabel: true },
        };

        switch (type) {
            case 'bar':
                return {
                    ...baseOption,
                    xAxis: { type: 'category', data: data.labels },
                    yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } } },
                    series: [{
                        data: data.values,
                        type: 'bar',
                        itemStyle: { color: primaryColor, borderRadius: [4, 4, 0, 0] },
                        barWidth: '40%',
                    }]
                };
            case 'line':
            case 'area':
                return {
                    ...baseOption,
                    xAxis: { type: 'category', data: data.labels, boundaryGap: false },
                    yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } } },
                    series: [{
                        data: data.values,
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        lineStyle: { width: 4, color: primaryColor },
                        itemStyle: { color: primaryColor },
                        areaStyle: type === 'area' ? {
                            color: {
                                type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [
                                    { offset: 0, color: primaryColor + '44' }, // 44 is opacity hex
                                    { offset: 1, color: primaryColor + '00' }
                                ]
                            }
                        } : undefined
                    }]
                };
            case 'pie':
                return {
                    ...baseOption,
                    series: [{
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: { borderRadius: 10, borderColor: '#0d0f14', borderWidth: 2 },
                        label: { show: false },
                        data: data.labels.map((l: string, i: number) => ({ value: data.values[i], name: l })),
                        color: [primaryColor, '#fb7185', '#34d399', '#facc15', '#a78bfa']
                    }]
                };
            default:
                return baseOption;
        }
    };

    return (
        <ReactECharts
            option={getOption()}
            style={{ height: '300px', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
        />
    );
}
