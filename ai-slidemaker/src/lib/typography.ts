export interface FontPairing {
    name: string;
    headline: string;
    body: string;
}

export const FONT_PAIRINGS: FontPairing[] = [
    { name: 'Luxury Agency', headline: 'Outfit', body: 'Inter' },
    { name: 'High-Tech', headline: 'Space Grotesk', body: 'Manrope' },
    { name: 'Classic Editorial', headline: 'Playfair Display', body: 'Source Sans 3' },
    { name: 'Modern Minimal', headline: 'Plus Jakarta Sans', body: 'Inter' },
];

export const TYPOGRAPHY_SCALES = {
    'Major Second': 1.125,
    'Minor Third': 1.2,
    'Major Third': 1.25,
    'Perfect Fourth': 1.333,
    'Golden Ratio': 1.618,
};

export function calculateFontSize(level: number, baseSize: number, ratio: number): string {
    // level: 0 = body, 1 = h3, 2 = h2, 3 = h1
    const size = baseSize * Math.pow(ratio, level);
    return `${Math.round(size)}px`;
}

export function getFontStack(fontName: string): string {
    return `"${fontName}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
}
