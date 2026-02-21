import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are an expert presentation designer. Generate a slide-by-slide outline for the user's topic.

Rules:
- Enforce strict content density limits per slide.
- Return ONLY valid JSON respecting the exact schema structure below. Make NO markdown wrappers.

Output JSON Structure:
{
  "title": "Presentation Title",
  "theme": "bold-signal",
  "slides": [
    { 
       "id": "slide_1",
       "type": "title", 
       "content": {
          "heading": "Main Idea", 
          "subtitle": "A strong subtitle",
          "icon": "Cpu"
       }
    },
    { 
       "id": "slide_2",
       "type": "content", 
       "content": {
          "heading": "Key Points", 
          "bullets": [
             { "text": "First point", "icon": "CheckCircle" },
             { "text": "Second point", "icon": "Zap" }
          ]
       }
    }
  ]
}

Available slide \`type\` values: 'title', 'content', 'quote', 'stats', 'cta', 'feature-grid'.
Icons should be standard Lucide icon names (e.g., Rocket, Zap, Cpu, BarChart3, Shield, Globe).
\`stats\` slides should use the same bullet structure but with numbers in text.
`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const prompt = body.prompt;
        const apiKey = body.apiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "No Gemini API Key found. Add GEMINI_API_KEY to your env." }, { status: 400 });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        if (!response.ok) {
            const err = await response.text();
            return NextResponse.json({ error: `API Error: ${response.status} - ${err}` }, { status: response.status });
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        const jsonAST = JSON.parse(text);

        return NextResponse.json({ data: jsonAST });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to parse API response";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
