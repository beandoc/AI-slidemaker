import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are a World-Class Presentation Architect specializing in "Lovable Slides" — high-fidelity, interactive, and cinematically designed slide decks.
Your goal is to transform user content into a stunning React-powered presentation using our Studio Archetype Engine.

Available Slide Archetypes:
1. "title": High-impact hero slide. 
2. "bento": Modern grid for features or structured data Modules.
3. "kinetic": High-energy atmospheric slide for vision/concepts (large text).
4. "editorial": Magazine-style divider or deep-focus slide.
5. "split": 50/50 image and text spread. Perfect for concise single-slide content.
6. "simulation": INTERACTIVE supply/demand curve simulation. Use when user mentions costs, market, or shifts.
7. "calculator": INTERACTIVE feature selection panel. Use for ROI, Adoption, or feature lists.
8. "metric-list": Large professional growth chart with detail cards. Use for statistics and trends.
9. "3d-sim": INTERACTIVE 3D mesh object view. Use for structural or product concepts.
10. "booking": INTERACTIVE calendar and time-slot booking flow.

CRITICAL CONSTRAINTS:
- **Conciseness**: Only generate 3-5 slides max unless explicitly asked for more.
- **Single Block Content**: If the user provides a single short paragraph, generate EXACTLY 1 OR 2 slides, using 'split' or 'editorial' for the text, or an interactive archetype if they mention numbers.
- **Interactivity**: If the user provides data that can be "played" with (costs, ROI, growth), ALWAYS use 'simulation', 'calculator', or 'metric-list'.
- **Structure**: Every slide MUST have a 'title' and 'subtitle'.
- **Studio Aesthetic**: Use vibrant gradients and #0a0a0f cinematic backgrounds.

JSON OUTPUT FORMAT:
You MUST return valid JSON exactly matching this structure:
{
  "title": "Deck Title",
  "theme": { "primary": "#3b82f6", "accent": "#00c6ff", "background": "#0a0a0f", "foreground": "#e0e0e0" },
  "slides": [
    {
      "id": "s1",
      "type": "split",
      "title": "Slide Title",
      "subtitle": "Optional Subtitle",
      "content": { "heading": "Content Heading", "text": "Content Text" },
      "background": { "type": "color", "value": "#ffffff" }
    }
  ]
}
`;

function createFallbackDeck() {
    return {
        id: `deck_${Date.now()}`,
        title: 'Studio Edition: Interactive Vision 2026',
        slides: [
            {
                id: 's1',
                title: 'Studio Edition 2026',
                subtitle: 'Building presentations as powerful as modern web applications.',
                type: 'title',
                content: {
                    tagline: 'INTERACTIVE VISION // V.2'
                },
                background: { type: 'gradient', value: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' },
                notes: 'Welcome the audience.'
            },
            {
                id: 's2',
                title: 'Interactive Simulations',
                subtitle: 'Adjust the curves to see real-time market equilibrium',
                type: 'simulation',
                content: {},
                background: { type: 'color', value: '#ffffff' },
            },
            {
                id: 's3',
                title: 'Selectable Feature Logic',
                subtitle: 'Dynamic weighted averaging for complex feature sets',
                type: 'calculator',
                content: {},
                background: { type: 'color', value: '#ffffff' },
            },
            {
                id: 's4',
                title: 'Data-Driven Growth',
                subtitle: 'Professional trend analysis with drill-down cards',
                type: 'metric-list',
                content: {},
                background: { type: 'color', value: '#ffffff' },
            }
        ],
        theme: { primary: '#3b82f6', accent: '#60a5fa', background: '#0a0a0f', foreground: '#e0e0e0' },
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
        const apiKey = ((body.apiKey as string | undefined) || process.env.GEMINI_API_KEY)?.trim();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
        }

        if (!apiKey) {
            console.log("⚠️ WARNING: GEMINI_API_KEY is not defined in environment variables. Returning fallback deck.");
            return NextResponse.json({
                data: createFallbackDeck(),
                warning: 'No Gemini API key found. Returned a fallback demo deck.',
            });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `CONTEXT & RULES:\n${SYSTEM_PROMPT}\n\nUSER REQUEST:\n${prompt}\n\nRESPONSE (VALID JSON ONLY):`
                        }]
                    }]
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("GEMINI API ERROR:", response.status, errorText);
            return NextResponse.json({ error: 'Gemini API rejected request: ' + response.statusText }, { status: 502 });
        }

        const payload = await response.json();
        const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) return NextResponse.json({ error: 'LLM returned empty text' }, { status: 500 });

        let parsed;
        try {
            parsed = JSON.parse(extractJsonPayload(rawText));
        } catch (e) {
            console.error("JSON PARSE ERROR. Raw text was:", rawText);
            return NextResponse.json({ error: 'Failed to parse AI output. Try a simpler prompt.' }, { status: 500 });
        }

        // Ensure theme exists
        if (!parsed.theme) {
            parsed.theme = { primary: '#f97316', accent: '#3b82f6', background: '#0a0a0f', foreground: '#e0e0e0' };
        }
        if (!parsed.createdAt) parsed.createdAt = new Date().toISOString();
        if (!parsed.id) parsed.id = `deck_${Date.now()}`;

        return NextResponse.json({ data: parsed });
    } catch (e) {
        console.error("GENERATION CATCH ERROR:", e);
        return NextResponse.json({
            error: 'Generation failed entirely.',
        }, { status: 500 });
    }
}
