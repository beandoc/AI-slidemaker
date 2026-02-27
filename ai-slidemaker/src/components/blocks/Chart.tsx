'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useEditorStore } from '@/store/editor';

interface ChartProps {
    type: 'bar' | 'line' | 'pie' | 'area';
    data: {
        labels: string[];
        values?: number[];
        datasets?: Array<{ label: string, data: number[], color?: string }>;
    };
    height?: string;
}

export default function Chart({ type, data, height = '100%' }: ChartProps) {
    const deck = useEditorStore(state => state.deck);
    const primaryColor = deck?.theme.primary || '#f97316';

    const getOption = () => {
        const baseOption = {
            backgroundColor: 'transparent',
            textStyle: { color: '#64748b', fontFamily: 'Satoshi' },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: '#e2e8f0',
                textStyle: { color: '#0f172a' }
            },
            grid: { top: 40, bottom: 40, left: 60, right: 20, containLabel: true },
        };

        const series = data.datasets
            ? data.datasets.map(ds => ({
                name: ds.label,
                data: ds.data,
                type: type === 'area' ? 'line' : type,
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: { width: 4, color: ds.color || primaryColor },
                itemStyle: { color: ds.color || primaryColor },
                areaStyle: type === 'area' ? { opacity: 0.1 } : undefined
            }))
            : [{
                data: data.values,
                type: type === 'area' ? 'line' : type,
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: { width: 4, color: primaryColor },
                itemStyle: { color: primaryColor },
                areaStyle: type === 'area' ? { opacity: 0.1 } : undefined
            }];

        switch (type) {
            case 'bar':
            case 'line':
            case 'area':
                return {
                    ...baseOption,
                    xAxis: {
                        type: 'category',
                        data: data.labels,
                        boundaryGap: type === 'bar',
                        axisLine: { lineStyle: { color: '#e2e8f0' } }
                    },
                    yAxis: {
                        type: 'value',
                        splitLine: { lineStyle: { color: '#f1f5f9' } },
                        axisLine: { show: false }
                    },
                    series
                };
            case 'pie':
                return {
                    ...baseOption,
                    series: [{
                        type: 'pie',
                        radius: ['45%', '75%'],
                        avoidLabelOverlap: true,
                        itemStyle: { borderRadius: 12, borderColor: '#fff', borderWidth: 4 },
                        label: { show: true, position: 'outside', color: '#64748b' },
                        data: data.labels.map((l: string, i: number) => ({ value: data.values ? data.values[i] : 0, name: l })),
                        color: [primaryColor, '#3b82f6', '#10b981', '#f59e0b', '#6366f1']
                    }]
                };
            default:
                return baseOption;
        }
    };

    return (
        <ReactECharts
            option={getOption()}
            style={{ height, width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
        />
    );
}
