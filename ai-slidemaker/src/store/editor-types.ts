import { z } from 'zod';

// --- SLIDE THEMES & BACKGROUNDS ---

export const SlideBackgroundSchema = z.object({
    type: z.enum(['color', 'gradient', 'image', 'video']).default('gradient'),
    value: z.string().default('linear-gradient(135deg, #fce7f3 0%, #e0e7ff 100%)'),
    opacity: z.number().default(1),
});

export const DeckThemeSchema = z.object({
    primary: z.string().default('#f97316'), // Orange accent
    accent: z.string().default('#3b82f6'),  // Blue accent
    background: z.string().default('#ffffff'),
    foreground: z.string().default('#0f172a'),
    fonts: z.object({
        display: z.string().default('Clash Display'),
        body: z.string().default('Satoshi'),
    }),
});

// --- SLIDE CONTENT DESCRIPTIONS ---

export const SlideTypeSchema = z.enum([
    'title',
    'interactive-chart',
    'calculations',
    'comparison',
    'cta',
    'booking',
    'custom'
]);

export const ChartDataSchema = z.object({
    labels: z.array(z.string()),
    datasets: z.array(z.object({
        label: z.string(),
        data: z.array(z.number()),
    })),
    controls: z.array(z.object({
        id: z.string(),
        label: z.string(),
        min: z.number(),
        max: z.number(),
        value: z.number(),
    })).optional(),
});

export const CalculationItemSchema = z.object({
    id: z.string(),
    label: z.string(),
    value: z.number(),
    unit: z.string().optional(),
    description: z.string().optional(),
    selected: z.boolean().default(false),
});

// --- SLIDE SCHEMA ---

export const SlideSchema = z.object({
    id: z.string(),
    title: z.string(),
    type: SlideTypeSchema,
    content: z.record(z.string(), z.any()),
    background: SlideBackgroundSchema,
    notes: z.string().optional(),
    thumbnail: z.string().optional(),
});

// --- DECK SCHEMA ---

export const DeckSchema = z.object({
    id: z.string(),
    title: z.string(),
    slides: z.array(SlideSchema),
    theme: DeckThemeSchema,
    createdAt: z.string(),
});

// --- TYPES ---

export type Slide = z.infer<typeof SlideSchema>;
export type Deck = z.infer<typeof DeckSchema>;
export type SlideType = z.infer<typeof SlideTypeSchema>;
export type DeckTheme = z.infer<typeof DeckThemeSchema>;
export type SlideBackground = z.infer<typeof SlideBackgroundSchema>;
export type ChartData = z.infer<typeof ChartDataSchema>;
export type CalculationItem = z.infer<typeof CalculationItemSchema>;

