// api/generate.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, apiKey: userKey } = req.body;
    const apiKey = userKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: GEMINI_API_KEY is missing.' });
    }

    const systemPrompt = `
You are an expert presentation designer. Generate a slide-by-slide outline for the user's topic or text.

Rules:
- Each slide must fit in one viewport (enforce content density limits).
- Title slides: 1 heading + 1 subtitle max.
- Content slides: 1 heading + 4-6 bullets, max 2 lines each.
- End with a strong closing/CTA slide.

Output format STRICTLY AS JSON:
{
  "title": "Presentation Title",
  "slides": [
    { "type": "title", "heading": "Main Idea", "subtitle": "A strong subtitle", "notes": "" },
    { "type": "content", "heading": "Key Points", "bullets": ["First point", "Second point"], "notes": "" },
    { "type": "quote", "quote": "A powerful quote.", "attribution": "Author" },
    { "type": "stats", "heading": "Metrics", "stats": [{"number": "10x", "label": "Growth"}] },
    { "type": "cta", "heading": "Join Us", "action": "Sign up today" }
  ]
}
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: { responseMimeType: 'application/json' }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: `Gemini API error: ${errorText}` });
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        res.status(200).json(JSON.parse(text));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
