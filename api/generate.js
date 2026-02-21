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

    const systemPrompt = `You are an expert presentation designer. Generate a slide-by-slide outline for the user's topic or text.

Rules:
- Each slide must fit in one viewport (enforce content density limits).
- Title slides: 1 heading + 1 subtitle max.
- Content slides: 1 heading + 4-6 bullets, max 2 lines each.
- End with a strong closing/CTA slide.
- Return ONLY valid JSON, no markdown, no backticks.

Output JSON:
{
  "title": "Presentation Title",
  "slides": [
    { "type": "title", "heading": "Main Idea", "subtitle": "A strong subtitle", "notes": "" },
    { "type": "content", "heading": "Key Points", "bullets": ["First point", "Second point"], "notes": "" },
    { "type": "quote", "quote": "A powerful quote.", "attribution": "Author" },
    { "type": "stats", "heading": "Metrics", "stats": [{"number": "10x", "label": "Growth"}] },
    { "type": "cta", "heading": "Join Us", "action": "Sign up today" }
  ]
}`;

    // Try the most stable and latest models
    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-2.0-flash',
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
    const topic = (prompt || "My Presentation").trim();

    return {
        title: topic,
        error: errorMsg,
        slides: [
            {
                type: 'title',
                heading: topic,
                subtitle: 'The Strategic Overview & Core Insights',
                notes: 'Generated locally while AI key is being configured.'
            },
            {
                type: 'content',
                heading: 'The Core Challenge',
                bullets: [
                    'Identifying the primary friction points and barriers',
                    'Analyzing current market trends and shifts',
                    'Understanding user needs and evolving behaviors',
                    'Setting a clear vision for sustainable growth'
                ]
            },
            {
                type: 'stats',
                heading: 'Current Momentum',
                stats: [
                    { number: '124%', label: 'Efficiency Gain' },
                    { number: '2.4M', label: 'Active Users' },
                    { number: 'Top 10', label: 'Market Rank' }
                ]
            },
            {
                type: 'content',
                heading: 'Proposed Solution',
                bullets: [
                    'Seamless integration of advanced technologies',
                    'Zero-dependency architecture for maximum speed',
                    'Iterative design cycles for rapid deployment',
                    'Scalable framework built for the next decade'
                ]
            },
            {
                type: 'quote',
                quote: "The best way to predict the future is to design it yourself, with precision and vision.",
                attribution: "Strategic Lead"
            },
            {
                type: 'cta',
                heading: 'Ready to Scale',
                action: 'Start the Implementation Phase'
            }
        ]
    };
}
