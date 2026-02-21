// scripts/gemini.js

const SYSTEM_PROMPT = `
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

export async function generateOutline(prompt, apiKey) {
    if (!apiKey) throw new Error("Missing Gemini API Key. Please set it in Settings.");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
        },
        generationConfig: {
            responseMimeType: "application/json"
        }
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        let errorData = await response.text();
        try {
            const parsed = JSON.parse(errorData);
            errorData = parsed.error.message;
        } catch (e) { }
        throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    try {
        const text = data.candidates[0].content.parts[0].text;
        return JSON.parse(text);
    } catch (err) {
        throw new Error("Failed to parse AI response as JSON.");
    }
}
