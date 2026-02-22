import { z } from 'zod';

// --- ATOMIC STYLE SCHEMAS ---

export const AnimationSchema = z.object({
    type: z.enum(['fade', 'slide-up', 'zoom', 'parallax', 'stagger-reveal', 'none']),
    duration: z.number().default(0.8),
    delay: z.number().default(0),
    easing: z.string().default('power4.out'),
    trigger: z.enum(['on-scroll', 'on-load', 'on-click']).default('on-scroll'),
});

export const InteractionSchema = z.object({
    type: z.enum(['link', 'scroll-to', 'zoom-image', 'none']),
    target: z.string().optional(),
});

export const StyleSchema = z.object({
    padding: z.string().optional(),
    margin: z.string().optional(),
    color: z.string().optional(),
    backgroundColor: z.string().optional(),
    borderRadius: z.string().optional(),
    border: z.string().optional(),
    boxShadow: z.string().optional(),
    opacity: z.number().optional(),
    fontFamily: z.string().optional(),
    fontSize: z.string().optional(),
    fontWeight: z.union([z.string(), z.number()]).optional(),
    lineHeight: z.number().optional(),
    letterSpacing: z.string().optional(),
    textAlign: z.enum(['left', 'center', 'right', 'justify']).default('left'),
    zIndex: z.number().optional(),
    transform: z.string().optional(),
});

// --- BLOCK SCHEMAS ---

export const TextBlockSchema = z.object({
    content: z.string(),
    tag: z.enum(['h1', 'h2', 'h3', 'p', 'span']).default('p'),
});

export const ImageBlockSchema = z.object({
    url: z.string(),
    alt: z.string().optional(),
    focalPoint: z.object({ x: z.number(), y: z.number() }).default({ x: 50, y: 50 }),
    caption: z.string().optional(),
    fit: z.enum(['cover', 'contain', 'fill']).default('cover'),
});

export const ChartBlockSchema = z.object({
    chartType: z.enum(['bar', 'line', 'pie', 'area', 'timeline']),
    data: z.any(),
    options: z.record(z.string(), z.any()).optional(),
});

export const BlockSchema = z.object({
    id: z.string(),
    type: z.enum(['text', 'image', 'chart', 'kpi', 'bento', 'spacer']),
    data: z.any(), // discriminated in implementation
    style: StyleSchema,
    animation: AnimationSchema.optional(),
    interaction: InteractionSchema.optional(),
});

// --- SECTION SCHEMAS ---

export const SectionSchema = z.object({
    id: z.string(),
    layoutId: z.string(), // hero, split, bento, narrative, metrics, etc.
    title: z.string().optional(),
    blocks: z.array(BlockSchema),
    background: z.object({
        type: z.enum(['color', 'gradient', 'image', 'video']),
        value: z.string(),
        opacity: z.number().default(1),
        overlay: z.string().optional(),
    }),
    animation: z.object({
        scrollTrigger: z.boolean().default(true),
        transition: z.enum(['slide', 'fade', 'stack', 'parallax', 'none']).default('slide'),
    }).optional(),
    style: z.object({
        minHeight: z.string().default('100vh'),
        padding: z.string().optional(),
    }).optional(),
});

// --- DOCUMENT SCHEMA ---

export const ThemeSchema = z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    foreground: z.string(),
    fonts: z.object({
        headline: z.string().default('Outfit'),
        body: z.string().default('Inter'),
        mono: z.string().optional(),
    }),
});

export const DocumentConfigSchema = z.object({
    archetype: z.enum(['neon-cyber', 'editorial-ledger', 'split-rail', 'card-mosaic', 'minimal-columns', 'glass-aero', 'brutalist-signal']).default('neon-cyber'),
    theme: ThemeSchema,
    typography: z.object({
        baseSize: z.number().default(16),
        scaleRatio: z.number().default(1.25),
    }),
    motion: z.object({
        enabled: z.boolean().default(true),
        reducedMotion: z.boolean().default(false),
    }),
});

export const AssetSchema = z.object({
    id: z.string(),
    url: z.string(),
    type: z.enum(['image', 'svg', 'audio', 'video']),
    metadata: z.record(z.string(), z.any()).optional(),
});

export const SceneASTSchema = z.object({
    id: z.string(),
    version: z.string().default('2.0'),
    title: z.string(),
    config: DocumentConfigSchema,
    sections: z.array(SectionSchema),
    assets: z.record(z.string(), AssetSchema).default({}),
});

export type Block = z.infer<typeof BlockSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type SceneAST = z.infer<typeof SceneASTSchema>;
export type DocumentConfig = z.infer<typeof DocumentConfigSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type Asset = z.infer<typeof AssetSchema>;
export type BlockType = Block['type'];
