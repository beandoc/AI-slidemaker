// api/generate.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, apiKey: userKey } = req.body || {};

    // Prioritize client-provided key, then environment variable
    let apiKey = (userKey && userKey.trim().length > 0) ? userKey.trim() : (process.env.GEMINI_API_KEY || process.env.GEMINI_PRO_API_KEY || process.env.API_KEY);

    if (!apiKey) {
        // No API key at all — use local fallback
        console.warn('No API key found in request or Vercel config. Using local fallback.');
        return res.status(200).json(generateLocalSlides(prompt));
    }

    const systemPrompt = `You are a World-Class Presentation Art Director & Narrative Strategist. Your goal is to transform the user's input into a cinematic visual story and a matching custom design system.

Narrative Guidelines:
1. TONALITY: Sophisticated, evocative, and high-impact.
2. STRUCTURE: Hook (Title) -> Index -> Insights (Content/Stats/Objectives/Context/Data) -> Vision (CTA).

Design AI Instructions:
You must provide a 'design' object that defines the visual language for this specific presentation. Generate specific tokens based on the prompt's aura.

Content Archetypes:
- 'title', 'teaser', 'content', 'objective', 'quote', 'stats', 'cta', 'highlight', 'context', 'faq', 'columns', 'table', 'horizon', 'chart', 'narrative', 'dimension', 'kinetic', 'assemble', 'metrics', 'lens', 'bento', 'editorial', 'bleed', 'minimal', 'knockout', 'callout'

Output Format (STRICT JSON ONLY):
{
  "title": "Short Branding Title",
  "design": {
    "bg": "HSL color for background",
    "fg": "HSL color for text",
    "accent": "HSL color for highlights",
    "fHead": "Google Font Name (Headings)",
    "fBody": "Google Font Name (Body)",
    "fontUrl": "Html <link> tag for fonts",
    "motion": {
      "travel": 80,
      "blur": 20,
      "easing": "0.16, 1, 0.3, 1"
    }
  },
  "slides": [
    { "type": "title", "heading": "...", "subtitle": "...", "owner": "...", "date": "..." },
    { "type": "narrative", "lines": ["Line one", "Line two"], "icon": "❦" },
    { "type": "chart", "heading": "...", "subtext": "...", "chartType": "bar|line", "data": [10, 50, 30], "labels": ["Q1", "Q2", "Q3"] },
    { "type": "horizon", "heading": "...", "items": [{"title": "...", "text": "..."}] },
    { "type": "table", "heading": "...", "rows": [{"key": "...", "value": "...", "contact": "..."}] }
  ]
}`;

    // Try the most stable and latest models
    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-2.0-flash-exp',
        'gemini-1.5-flash-8b'
    ];

    let lastError = 'All AI models exhausted.';

    for (const model of models) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `${systemPrompt}\n\nUser Topic: ${prompt}` }]
                    }],
                    generationConfig: {
                        temperature: 0.1
                    }
                })
            });

            if (response.status === 401 || response.status === 403) {
                const err = await response.json();
                console.error('API Key rejected:', err.error?.message);
                lastError = `API Key rejected: ${err.error?.message || 'Unauthorized'}`;
                break;
            }

            if (response.status === 429) {
                console.log(`Model ${model} rate limited...`);
                continue;
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.log(`Model ${model} failed: ${errorText}`);
                continue;
            }

            const data = await response.json();

            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                console.log(`Model ${model} returned empty/blocked response`);
                continue;
            }

            let text = data.candidates[0].content.parts[0].text;
            if (!text) {
                console.log(`Model ${model} returned empty text parts`);
                continue;
            }
            text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

            return res.status(200).json(JSON.parse(text));

        } catch (error) {
            console.log(`Model ${model} error: ${error.message}`);
            continue;
        }
    }

    // All API models failed — use local fallback
    console.error(`AI Generation Failed: ${lastError}`);
    return res.status(200).json(generateLocalSlides(prompt, lastError));
}

// -----------------------------------------------
// LOCAL FALLBACK: Generates slides without any API
// -----------------------------------------------
function generateLocalSlides(prompt, errorMsg = '') {
    // Sanitize topic: if it's too long, take the first line or first 10 words
    let topic = (prompt || "Executive Brief").trim();
    if (topic.length > 50) {
        topic = topic.split('\n')[0].substring(0, 60);
        if (topic.length >= 60) topic += "...";
    }

    return {
        title: topic,
        error: errorMsg,
        slides: [
            {
                type: 'title',
                heading: topic,
                subtitle: 'Strategic Analysis & Future Roadmap',
                notes: 'Generated via professional local engine.'
            },
            {
                type: 'content',
                heading: 'Core Architecture',
                bullets: [
                    'Multi-layered integration for scalable operations',
                    'Strategic alignment with organizational objectives',
                    'Optimized workflow patterns for peak performance',
                    'Data-driven decision making frameworks'
                ]
            },
            {
                type: 'stats',
                heading: 'Performance Impact',
                stats: [
                    { number: '94%', label: 'Efficiency Gain' },
                    { number: 'Top 10', label: 'Market Position' },
                    { number: '$2.4M', label: 'Optimized Value' }
                ]
            },
            {
                type: 'content',
                heading: 'Key Strategic Pillars',
                bullets: [
                    'Security-first methodology for data integrity',
                    'User-centric interface for rapid task completion',
                    'Artificial Intelligence for predictive modeling',
                    'Seamless cross-platform synchronization'
                ]
            },
            {
                type: 'quote',
                quote: "The best way to predict the future is to create it through deliberate design and strategic focus.",
                attribution: "Operational Strategy Lead"
            },
            {
                type: 'cta',
                heading: 'Next Steps',
                action: 'Launch Implementation Phase'
            }
        ]
    };
}
