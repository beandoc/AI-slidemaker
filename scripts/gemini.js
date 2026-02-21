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
    const response = await fetch('/api/generate', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt, apiKey })
    });

    if (!response.ok) {
        let errorData = await response.text();
        try {
            const parsed = JSON.parse(errorData);
            errorData = parsed.error;
        } catch (e) { }
        throw new Error(errorData || `API Error: ${response.status}`);
    }

    return await response.json();
}
