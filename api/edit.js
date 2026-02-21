// api/edit.js — AI-powered slide editing via natural language
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { currentHtml, instruction, apiKey: userKey } = req.body;
    const apiKey = userKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(400).json({ error: 'No API key configured. Please set GEMINI_API_KEY or provide one in Settings.' });
    }

    if (!instruction || !currentHtml) {
        return res.status(400).json({ error: 'Missing instruction or currentHtml in request body.' });
    }

    const systemPrompt = `You are an expert HTML/CSS presentation designer and editor.

You will receive the CURRENT HTML of a presentation and an EDIT INSTRUCTION from the user.

Your job is to modify the HTML according to the instruction and return ONLY the complete, modified HTML.

Guidelines:
- You can change any CSS (fonts, colors, backgrounds, spacing, etc.)
- You can change any text/content in the slides
- You can add images using high-quality Unsplash URLs like: https://images.unsplash.com/photo-{id}?w=1200&q=80
- You can add/remove slides
- You can change layouts, add gradients, shadows, animations
- You can add Google Fonts by adding new <link> tags in the <head>
- Keep the slideshow JavaScript functionality intact (the Slideshow class)
- Keep the scroll-snap, nav-dots, and progress-bar working
- Maintain viewport-fitting (100vw × 100vh slides)
- Return ONLY the complete HTML document, no explanations, no markdown backticks

Common edit types you should handle:
1. "Change font to X" → Update Google Fonts link + CSS font-family
2. "Make it dark/light" → Change background/text colors
3. "Add image of X" → Insert <img> or background-image with Unsplash photo
4. "Change colors to X" → Update CSS custom properties
5. "Make text bigger/smaller" → Adjust font-size values
6. "Add a slide about X" → Insert a new <section class="slide"> 
7. "Change heading to X" → Update the heading text
8. "Add animation" → Add CSS animations/transitions
9. "Make it more professional/playful/minimal" → Restyle holistically`;

    // Try models in order
    const models = [
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-1.5-flash',
        'gemini-pro'
    ];

    for (const model of models) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${systemPrompt}\n\n--- CURRENT HTML ---\n${currentHtml}\n\n--- USER INSTRUCTION ---\n${instruction}\n\n--- Return the COMPLETE modified HTML below ---`
                        }]
                    }],
                    generationConfig: {
                        maxOutputTokens: 16384,
                        temperature: 0.3
                    }
                })
            });

            if (response.status === 429 || response.status === 404) {
                console.log(`Model ${model} unavailable (${response.status}), trying next...`);
                continue;
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.log(`Model ${model} failed: ${errorText}`);
                continue;
            }

            const data = await response.json();
            let text = data.candidates[0].content.parts[0].text;

            // Strip markdown wrappers if Gemini adds them
            text = text.replace(/```html\s*/gi, '').replace(/```\s*/g, '').trim();

            // Validate it looks like HTML
            if (!text.includes('<!DOCTYPE') && !text.includes('<html') && !text.includes('<head')) {
                console.log(`Model ${model} returned non-HTML, trying next...`);
                continue;
            }

            return res.status(200).json({ html: text });

        } catch (error) {
            console.log(`Model ${model} error: ${error.message}`);
            continue;
        }
    }

    return res.status(500).json({ error: 'All AI models failed. Please try again.' });
}
