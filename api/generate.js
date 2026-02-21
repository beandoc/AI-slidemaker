// api/generate.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, apiKey: userKey } = req.body;
    const apiKey = userKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        // No API key at all — use local fallback
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

    // Try multiple models in order of preference
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
                        parts: [{ text: `${systemPrompt}\n\nUser Topic: ${prompt}` }]
                    }]
                })
            });

            // If rate limited (429), try next model
            if (response.status === 429) {
                console.log(`Model ${model} rate limited, trying next...`);
                continue;
            }

            // If model not found (404), try next model
            if (response.status === 404) {
                console.log(`Model ${model} not found, trying next...`);
                continue;
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.log(`Model ${model} failed: ${errorText}`);
                continue;
            }

            const data = await response.json();
            let text = data.candidates[0].content.parts[0].text;

            // Strip markdown wrappers if AI adds them
            text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

            return res.status(200).json(JSON.parse(text));

        } catch (error) {
            console.log(`Model ${model} error: ${error.message}`);
            continue;
        }
    }

    // All API models failed — use local fallback
    console.log('All API models exhausted, using local fallback');
    return res.status(200).json(generateLocalSlides(prompt));
}

// -----------------------------------------------
// LOCAL FALLBACK: Generates slides without any API
// -----------------------------------------------
function generateLocalSlides(prompt) {
    const topic = prompt.trim();

    // Try to extract bullet points from pasted text
    const lines = topic.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // If user pasted multiple lines, treat them as content
    if (lines.length > 3) {
        return generateFromLines(lines);
    }

    // Otherwise, generate a template from the topic
    return generateFromTopic(topic);
}

function generateFromLines(lines) {
    const title = lines[0].replace(/^[#\-*•]\s*/, '');
    const slides = [
        {
            type: 'title',
            heading: title,
            subtitle: lines[1] ? lines[1].replace(/^[#\-*•]\s*/, '') : 'A presentation',
            notes: ''
        }
    ];

    // Group remaining lines into slides of 4-5 bullets each
    const contentLines = lines.slice(2).map(l => l.replace(/^[\-*•\d.]\s*/, ''));

    for (let i = 0; i < contentLines.length; i += 4) {
        const chunk = contentLines.slice(i, i + 4);
        const slideNum = Math.floor(i / 4) + 1;

        slides.push({
            type: 'content',
            heading: `Key Points — Part ${slideNum}`,
            bullets: chunk,
            notes: ''
        });
    }

    // Add closing slide
    slides.push({
        type: 'cta',
        heading: 'Thank You',
        action: 'Questions & Discussion',
        notes: ''
    });

    return {
        title: title,
        slides: slides
    };
}

function generateFromTopic(topic) {
    return {
        title: topic || 'My Presentation',
        slides: [
            {
                type: 'title',
                heading: topic || 'My Presentation',
                subtitle: 'An overview of the key concepts',
                notes: ''
            },
            {
                type: 'content',
                heading: 'Introduction',
                bullets: [
                    `What is ${topic}?`,
                    'Why it matters today',
                    'Key challenges and opportunities',
                    'What we will cover'
                ],
                notes: ''
            },
            {
                type: 'content',
                heading: 'Core Concepts',
                bullets: [
                    'Foundational principles',
                    'How it works in practice',
                    'Real-world applications',
                    'Common misconceptions'
                ],
                notes: ''
            },
            {
                type: 'stats',
                heading: 'Impact & Metrics',
                stats: [
                    { number: '3x', label: 'Efficiency Gain' },
                    { number: '85%', label: 'Adoption Rate' },
                    { number: '10M+', label: 'Users Worldwide' }
                ],
                notes: ''
            },
            {
                type: 'cta',
                heading: 'Next Steps',
                action: 'Get started today — explore, learn, and build.',
                notes: ''
            }
        ]
    };
}
