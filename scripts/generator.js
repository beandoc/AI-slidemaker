// scripts/generator.js

// 12 Styles Data Map
export const PRESETS = [
    { id: 'bold-signal', name: 'Bold Signal', vibe: 'High-impact, editorial (Dark)', type: 'dark' },
    { id: 'electric-studio', name: 'Electric Studio', vibe: 'Architecture, split-panel (Dark)', type: 'dark' },
    { id: 'creative-voltage', name: 'Creative Voltage', vibe: 'Retro-modern, energetic (Dark)', type: 'dark' },
    { id: 'dark-botanical', name: 'Dark Botanical', vibe: 'Sophisticated, premium (Dark)', type: 'dark' },
    { id: 'notebook-tabs', name: 'Notebook Tabs', vibe: 'Organized, tactile (Light)', type: 'light' },
    { id: 'pastel-geometry', name: 'Pastel Geometry', vibe: 'Friendly, modern (Light)', type: 'light' },
    { id: 'split-pastel', name: 'Split Pastel', vibe: 'Playful, colorful (Light)', type: 'light' },
    { id: 'vintage-editorial', name: 'Vintage Editorial', vibe: 'Witty, magazine-style (Light)', type: 'light' },
    { id: 'neon-cyber', name: 'Neon Cyber', vibe: 'Futuristic, techy (Dark)', type: 'dark' },
    { id: 'terminal-green', name: 'Terminal Green', vibe: 'Developer-focused (Dark)', type: 'dark' },
    { id: 'swiss-modern', name: 'Swiss Modern', vibe: 'Bauhaus, minimal (Light)', type: 'light' },
    { id: 'paper-ink', name: 'Paper & Ink', vibe: 'Literary, editorial (Light)', type: 'light' }
];

export function generateHTML(outline, presetId) {
    const styleData = getStyleCSS(presetId);

    const slidesHTML = outline.slides.map((s, i) => {
        return buildSlideHTML(s, i, presetId);
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${outline.title || 'Presentation'}</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    ${styleData.fontUrl}
    
    <style>
        ${styleData.css}
        ${getCoreCSS()}
    </style>
</head>
<body>
    <div class="progress-bar" id="progressBar"></div>
    <nav class="nav-dots" id="navDots"></nav>

    ${slidesHTML}

    <script>
        ${getCoreJavascript()}
    </script>
</body>
</html>`;
}

function buildSlideHTML(slide, index, preset) {
    let content = '';

    // Switch on type to render content
    switch (slide.type) {
        case 'title':
            content = `<h1 class="reveal">${escapeHTML(slide.heading || '')}</h1>
                       <p class="reveal delay-1">${escapeHTML(slide.subtitle || '')}</p>`;
            break;
        case 'content':
            const listItems = (slide.bullets || []).map((b, i) =>
                `<li class="reveal delay-${(i % 5) + 1}">${escapeHTML(b)}</li>`
            ).join('');
            content = `<h2 class="reveal">${escapeHTML(slide.heading || '')}</h2>
                       <ul class="content-list">${listItems}</ul>`;
            break;
        case 'quote':
            content = `<blockquote class="reveal">"${escapeHTML(slide.quote || '')}"</blockquote>
                       <cite class="reveal delay-1">— ${escapeHTML(slide.attribution || '')}</cite>`;
            break;
        case 'stats':
            const statHTML = (slide.stats || []).map((s, i) =>
                `<div class="stat-card reveal delay-${(i % 5) + 1}">
                  <div class="stat-num">${escapeHTML(s.number)}</div>
                  <div class="stat-lbl">${escapeHTML(s.label)}</div>
                </div>`
            ).join('');
            content = `<h2 class="reveal">${escapeHTML(slide.heading || '')}</h2>
                       <div class="grid">${statHTML}</div>`;
            break;
        case 'cta':
            content = `<h2 class="reveal">${escapeHTML(slide.heading || '')}</h2>
                       <div class="cta-box reveal delay-1">${escapeHTML(slide.action || '')}</div>`;
            break;
        default:
            content = `<h2>${escapeHTML(slide.heading || '')}</h2>`;
    }

    return `
    <section class="slide" id="slide-${index}">
        <div class="slide-content">
            <div class="container">
                <div class="slide-inner">
                    ${content}
                </div>
            </div>
        </div>
    </section>`;
}

function getStyleCSS(presetId) {
    if (presetId === 'bold-signal') {
        return {
            fontUrl: `<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500&display=swap" rel="stylesheet">`,
            css: `
                :root {
                    --bg-primary: #1a1a1a;
                    --text-primary: #ffffff;
                    --accent: #FF5722;
                    --font-display: 'Archivo Black', sans-serif;
                    --font-body: 'Space Grotesk', sans-serif;
                }
                .slide { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%); }
                h1, h2 { font-family: var(--font-display); text-transform: uppercase; letter-spacing: -0.02em; }
                h1 { color: var(--accent); }
            `
        };
    } else if (presetId === 'dark-botanical') {
        return {
            fontUrl: `<link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Sans:wght@300;400&display=swap" rel="stylesheet">`,
            css: `
                :root {
                    --bg-primary: #0f0f0f;
                    --text-primary: #e8e4df;
                    --accent: #d4a574;
                    --font-display: 'Cormorant', serif;
                    --font-body: 'IBM Plex Sans', sans-serif;
                }
                .slide { 
                    background-color: var(--bg-primary); 
                    position: relative;
                }
                .slide::before {
                    content: ''; position: absolute; top: -20vh; right: -20vw;
                    width: 60vw; height: 60vw; border-radius: 50%;
                    background: radial-gradient(circle, rgba(212, 165, 116, 0.1) 0%, transparent 70%);
                    filter: blur(80px);
                }
                h1, h2 { font-family: var(--font-display); font-weight: 400; font-style: italic; }
            `
        };
    } else if (presetId === 'neon-cyber') {
        return {
            fontUrl: `<link href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500&display=swap" rel="stylesheet">`,
            css: `
                 :root {
                    --bg-primary: #0a0f1c;
                    --text-primary: #ffffff;
                    --accent: #00ffcc;
                    --font-display: 'Clash Display', sans-serif;
                    --font-body: 'Satoshi', sans-serif;
                 }
                 .slide {
                    background-color: var(--bg-primary);
                    background-image: linear-gradient(rgba(0, 255, 204, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 204, 0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                 }
                 h1, h2 { font-family: var(--font-display); color: var(--accent); text-shadow: 0 0 10px rgba(0,255,204,0.3); }
             `
        }
    } else if (presetId === 'notebook-tabs') {
        return {
            fontUrl: `<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;1,6..96,400&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">`,
            css: `
                 :root {
                     --bg-primary: #f8f6f1;
                     --text-primary: #1a1a1a;
                     --accent: #f4b8c5;
                     --font-display: 'Bodoni Moda', serif;
                     --font-body: 'DM Sans', sans-serif;
                 }
                 html { background: #2d2d2d; }
                 .slide { background: var(--bg-primary); box-shadow: 0 0 20px rgba(0,0,0,0.1); margin: 2rem; height: calc(100vh - 4rem); width: calc(100vw - 4rem); border-radius: 8px;}
                 h1, h2 { font-family: var(--font-display); }
             `
        }
    }

    // Default fallback
    return {
        fontUrl: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">`,
        css: `
             :root { --bg-primary: #fafafa; --text-primary: #111; --accent: #000; --font-display: 'Inter', sans-serif; --font-body: 'Inter', sans-serif; }
         `
    };
}

function getCoreCSS() {
    return `
        /* CORE VIEWPORT */
        html, body {
            height: 100%;
            overflow-x: hidden;
            margin: 0; padding: 0;
        }
        html { scroll-snap-type: y mandatory; scroll-behavior: smooth; }
        body { font-family: var(--font-body); background: var(--bg-primary); color: var(--text-primary); }

        .slide {
            width: 100vw;
            height: 100vh;
            height: 100dvh;
            overflow: hidden;
            scroll-snap-align: start;
            display: flex;
            flex-direction: column;
            position: relative;
            box-sizing: border-box;
        }
        
        .slide-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: clamp(1.5rem, 5vw, 5rem);
        }

        .container {
            max-width: min(92vw, 1100px);
            max-height: min(82vh, 750px);
            margin: 0 auto;
            width: 100%;
        }

        /* TYPOGRAPHY RESPONSIVE */
        h1 { font-size: clamp(2.5rem, 6vw, 5rem); margin-bottom: 1rem; line-height: 1.1; }
        h2 { font-size: clamp(1.75rem, 4vw, 3rem); margin-bottom: 2rem; line-height: 1.2; }
        p, li { font-size: clamp(1rem, 1.5vw, 1.5rem); line-height: 1.5; margin-bottom: 0.5rem; }
        
        .content-list { padding-left: 2rem; }
        
        /* GRIDS & CARDS */
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
        }
        
        .stat-card {
            border: 1px solid rgba(128,128,128,0.2);
            padding: 2rem;
            text-align: center;
            border-radius: 8px;
        }
        .stat-num { font-size: 3rem; font-weight: bold; font-family: var(--font-display); color: var(--accent); }
        .stat-lbl { font-size: 1.1rem; opacity: 0.8; }
        
        blockquote { font-size: 2rem; font-family: var(--font-display); border-left: 4px solid var(--accent); padding-left: 2rem; margin-bottom: 1rem;}
        
        .cta-box {
            display: inline-block; padding: 1rem 2.5rem; background: var(--accent); color: var(--bg-primary); 
            font-weight: bold; font-size: 1.25rem; border-radius: 4px;
        }

        /* ANIMATIONS */
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .slide.visible .reveal { opacity: 1; transform: translateY(0); }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        .delay-4 { transition-delay: 0.4s; }
        .delay-5 { transition-delay: 0.5s; }

        /* UI */
        .progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: var(--accent); z-index: 1000; transition: width 0.3s ease; }
        .nav-dots {
            position: fixed; right: 20px; top: 50%; transform: translateY(-50%);
            display: flex; flex-direction: column; gap: 10px; z-index: 1000;
        }
        .nav-dot {
            width: 8px; height: 8px; border-radius: 50%; background: var(--text-primary); opacity: 0.3; cursor: pointer; transition: all 0.3s; border: none;
        }
        .nav-dot.active { opacity: 1; transform: scale(1.5); background: var(--accent); }
    `;
}

function getCoreJavascript() {
    return `
        class Slideshow {
            constructor() {
                this.slides = [...document.querySelectorAll('.slide')];
                this.navDots = document.getElementById('navDots');
                this.progressBar = document.getElementById('progressBar');
                this.current = 0;
                
                this.initNav();
                this.initObserver();
                this.initKeyboard();
                this.update(0);
            }
            
            initNav() {
                this.slides.forEach((s, i) => {
                    const d = document.createElement('button');
                    d.className = 'nav-dot';
                    d.onclick = () => this.goTo(i);
                    this.navDots.appendChild(d);
                });
            }
            
            initObserver() {
                const obs = new IntersectionObserver((entries) => {
                    entries.forEach(e => {
                        if (e.isIntersecting) {
                            e.target.classList.add('visible');
                            this.current = this.slides.indexOf(e.target);
                            this.update(this.current);
                        }
                    });
                }, { threshold: 0.5 });
                this.slides.forEach(s => obs.observe(s));
            }
            
            initKeyboard() {
                window.addEventListener('keydown', e => {
                    if (['ArrowDown', 'ArrowRight', ' '].includes(e.key)) this.goTo(this.current + 1);
                    if (['ArrowUp', 'ArrowLeft'].includes(e.key)) this.goTo(this.current - 1);
                });
            }
            
            goTo(i) {
                if (i >= 0 && i < this.slides.length) {
                    this.slides[i].scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            update(idx) {
                const pct = ((idx + 1) / this.slides.length) * 100;
                this.progressBar.style.width = \`\${pct}%\`;
                [...this.navDots.children].forEach((d, i) => {
                    d.classList.toggle('active', i === idx);
                });
            }
        }
        new Slideshow();
    `;
}

function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
