import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are the World-Class Lead Architect for "Antigravity OS".
Your goal: Transform user input into a validated, hierarchical JSON Scene AST.

// STRUCTURAL DNA (Mandatory Composition Rules):
1. 'hero': REQUIRES centered blocks (textAlign: center). Max 2 blocks. Large font weights.
2. 'split': REQUIRES exactly 2 columns. Block 0 (even) goes Left, Block 1 (odd) goes Right. Perfect for Image + Text pairs.
3. 'bento': REQUIRES a 3-column grid. The first block must be 'hero-sized' (mentally). Used for feature sets or metrics.
4. 'vision': Full bleed background with a single high-impact quote or KPI.

// DESIGN ARCHETYPES:
1. 'neon-cyber': Technical, glow, dark. Layouts should feel like a HUD.
2. 'editorial-ledger': Clean, white, massive typography. High-contrast.
3. 'split-rail': Focused on horizontal split layout divergence.
4. 'card-mosaic': Deep usage of bento grids and layered cards.
5. 'minimal-columns': Multi-column text focus, vertical breathing room.
6. 'glass-aero': Modern, soft, blurry.
7. 'brutalist-signal': Raw, heavy borders, loud.

// OUTPUT FORMAT (STRICT SCENE AST v2.0):
{
  "id": "scene_...",
  "version": "2.0",
  "title": "...",
  "config": {
    "archetype": "neon-cyber" | "editorial-ledger" | "split-rail" | "card-mosaic" | "minimal-columns" | "glass-aero" | "brutalist-signal",
    "theme": { ... },
    ...
  },
  "sections": [...]
}

MISSION: Never repeat the same layoutId twice in a row.
`;

const FALLBACK_SCENES: Record<string, any> = {
  'default': {
    title: "Deterministic Blueprint",
    config: {
      archetype: "editorial-ledger",
      theme: { primary: "#000000", secondary: "#f0f0f0", accent: "#000000", background: "#ffffff", foreground: "#000000", fonts: { headline: "Playfair Display", body: "Inter" } },
      typography: { baseSize: 16, scaleRatio: 1.25 },
      motion: { enabled: true, reducedMotion: false }
    },
    sections: [
      { id: "s1", layoutId: "hero", blocks: [{ id: "b1", type: "text", data: { content: "FALLBACK ENGINE", tag: "h1" }, style: { textAlign: "center", fontWeight: 900 } }], background: { type: "color", value: "#ffffff", opacity: 1 } }
    ]
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt || "";
    const apiKey = body.apiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        data: FALLBACK_SCENES.default,
        warning: "STRICT WARNING: No Gemini API Key found. Falling back to local deterministic blueprint. Your composition will be static."
      });
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
      return NextResponse.json({
        data: FALLBACK_SCENES.default,
        warning: `API Error: ${response.status}. Using fallback blueprint.`
      });
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const jsonAST = JSON.parse(text);

    // Archetype Normalization
    const validArchetypes = ['neon-cyber', 'editorial-ledger', 'split-rail', 'card-mosaic', 'minimal-columns', 'glass-aero', 'brutalist-signal'];
    if (!validArchetypes.includes(jsonAST.config?.archetype)) {
      jsonAST.config = { ...jsonAST.config, archetype: 'neon-cyber' };
    }

    return NextResponse.json({ data: jsonAST });
  } catch (error: unknown) {
    return NextResponse.json({
      data: FALLBACK_SCENES.default,
      warning: "Generation failed. Using local fallback."
    });
  }
}
