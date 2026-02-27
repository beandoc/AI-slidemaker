import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are a World-Class Presentation Architect specializing in "Lovable Slides".
Your goal is to transform user content into a high-fidelity, interactive React-powered slide deck.

Available Slide Types:
1. "title": Hero slide for high impact.
   - Props: { title, subtitle, tagline }
2. "interactive-chart": Dynamic data visualization.
   - Props: { title, description, baseData: { labels, datasets: [{ label, data, color }] }, controls: [{ id, label, min, max, value }] }
   - Use this for any quantitative trends or balance-based content.
3. "calculations": Interactive metric cards for ROI or performance.
   - Props: { title, items: [{ id, label, value, unit, description }] }
   - Use this for multi-component data like adoption rates or costs.
4. "comparison": Side-by-side framework comparison. Props: { title, left: { title, points }, right: { title, points } }
5. "cta": High-conversion closing slide. Props: { title, text, buttonText }
6. "booking": Interactive calendar/booking flow. Props: { title, subtitle, buttonText }
7. "custom": Used ONLY when a layout is highly specific (e.g., 3-column stats, image grids) and doesn't fit the above. Props: { html }
   - The 'html' string MUST contain raw HTML using standard Tailwind CSS classes. No React components, pure HTML. For icons, use standard svg string data. For interactive elements use purely visual hover effects. Scale everything to a 1920x1080 container. Use flex/grid for complex layouts.

Design Rules:
- Generate 6-8 slides.
- Use variety. Never repeat a slide type 3 times in a row.
- Backgrounds: Use vibrant, modern CSS linear-gradients (e.g. 135deg, #f97316 0%, #facc15 100%) for impact slides, and clean #ffffff for content-heavy slides.
- Notes: Include brief "presenter notes" for each slide to guide the speaker.
- Interactivity: Ensure "interactive-chart" has meaningful controls (e.g. "Interest Rate", "Adoption Speed").

Return ONLY valid JSON matching the Deck schema.
`;

function createFallbackDeck() {
    return {
        id: `deck_${Date.now()}`,
        title: 'Project Lovable: Interactive Vision 2026',
        slides: [
            {
                id: 's1',
                title: 'The Future of Presentations',
                type: 'title',
                content: {
                    title: 'Interactive Intelligence',
                    subtitle: 'Building presentations as powerful as modern web applications.',
                    tagline: 'STRATEGY 2026'
                },
                background: { type: 'gradient', value: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)' },
                notes: 'Welcome the audience. Emphasize that these aren\'t just static slides—they are interactive experiences.'
            },
            {
                id: 's2',
                title: 'Comparison of Methods',
                type: 'comparison',
                content: {
                    title: 'Legacy vs. Modern',
                    left: {
                        title: 'Traditional PowerPoint',
                        points: ['Static images and text', 'Limited interactivity', 'Locked resolution', 'Complex editing workflows']
                    },
                    right: {
                        title: 'Lovable Slides',
                        points: ['Code-powered components', 'Real-time data interaction', 'Perfect scaling (1920x1080)', 'AI-assisted generation']
                    }
                },
                background: { type: 'color', value: '#ffffff' },
                notes: 'Explain why the transition to interactive slides is inevitable for teams that care about engagement.'
            },
            {
                id: 's3',
                title: 'Growth Projections',
                type: 'calculations',
                content: {
                    title: 'Engagement Metrics',
                    items: [
                        { id: 'm1', label: 'Retention', value: 89, unit: '%', description: 'Audience focus duration' },
                        { id: 'm2', label: 'CTR', value: 45, unit: '%', description: 'Post-presentation clicks' },
                        { id: 'm3', label: 'Conversion', value: 12, unit: '%', description: 'Goal achievement rate' }
                    ]
                },
                background: { type: 'color', value: '#ffffff' },
                notes: 'Highlight how interactivity directly leads to better retention and conversion.'
            },
            {
                id: 's4',
                title: 'Market Dynamics',
                type: 'interactive-chart',
                content: {
                    title: 'Adoption Curve',
                    description: 'Adjust market forces to see how adoption accelerates with interactive content.',
                    controls: [
                        { id: 'demand', label: 'Market Demand', min: -50, max: 50, value: 0 },
                        { id: 'supply', label: 'Feature Supply', min: -50, max: 50, value: 0 }
                    ]
                },
                background: { type: 'color', value: '#ffffff' },
                notes: 'Demonstrate the interactive chart. Pull the sliders to show how the curves shift.'
            },
            {
                id: 's5',
                title: 'Closing',
                type: 'cta',
                content: {
                    title: 'Ready to Transform?',
                    text: 'Join the next generation of presenters using code-powered interactive stories.',
                    buttonText: 'Get Started Now'
                },
                background: { type: 'color', value: '#0f172a' },
                notes: 'Final call to action. Summarize the key benefits and end on a high note.'
            }
        ],
        theme: { primary: '#f97316', accent: '#3b82f6', background: '#ffffff', foreground: '#0f172a' },
        createdAt: new Date().toISOString()
    };
}

function extractJsonPayload(raw: string) {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    return fenced ? fenced[1].trim() : raw.trim();
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
        const apiKey = (body.apiKey as string | undefined) || process.env.GEMINI_API_KEY;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
        }

        if (!apiKey) {
            return NextResponse.json({
                data: createFallbackDeck(),
                warning: 'No Gemini API key found. Returned a fallback demo deck.',
            });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                    generationConfig: { responseMimeType: 'application/json' },
                }),
            }
        );

        if (!response.ok) {
            return NextResponse.json({
                data: createFallbackDeck(),
                warning: 'API error. Returned demo deck.',
            });
        }

        const payload = await response.json();
        const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) return NextResponse.json({ data: createFallbackDeck() });

        const parsed = JSON.parse(extractJsonPayload(rawText));

        // Ensure theme exists
        if (!parsed.theme) {
            parsed.theme = { primary: '#f97316', accent: '#3b82f6', background: '#ffffff', foreground: '#0f172a' };
        }
        if (!parsed.createdAt) parsed.createdAt = new Date().toISOString();
        if (!parsed.id) parsed.id = `deck_${Date.now()}`;

        return NextResponse.json({ data: parsed });
    } catch {
        return NextResponse.json({
            data: createFallbackDeck(),
            warning: 'Generation failed. Returned demo deck.',
        });
    }
}

