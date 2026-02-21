import { PresentationAST, SlideAST } from '@/store/editor';

/**
 * World-class rendering pipeline: React JSON AST -> Zero-Dependency Vanilla HTML
 * Maintains the original promise of a single HTML file export that never breaks.
 */
export function generateProductionHTML(ast: PresentationAST) {
    const slidesHTML = ast.slides.map((s, i) => buildSlideHTML(s, i, ast.theme)).join('\n');

    const coreCSS = getCoreCSS();
    const themeData = getThemeData(ast);
    const coreJS = getCoreJavascript();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(ast.title || 'Presentation')}</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    ${themeData.fontUrl}
    
    <style>
        ${themeData.css}
        ${coreCSS}
    </style>
</head>
<body>
    <div class="progress-bar" id="progressBar"></div>
    <nav class="nav-dots" id="navDots"></nav>

    ${slidesHTML}

    <script>
        ${coreJS}
    </script>
</body>
</html>`;
}

function buildSlideHTML(slide: SlideAST, index: number, themePreset: string) {
    // themePreset is currently used for global CSS but we can add slide-level hooks here
    console.log(`Rendering slide ${index} with theme: ${themePreset}`);
    let content = '';

    // Icon Logic - Inject Raw SVG for zero-dependency portability
    const iconSVG = slide.content.icon ? getIconSVG(slide.content.icon) : '';
    const iconHTML = iconSVG
        ? `<div class="slide-icon reveal">${iconSVG}</div>`
        : '';

    // Image Logic
    const imageHTML = slide.content.imagePath
        ? `<div class="slide-image-container reveal delay-1">
             <img src="${slide.content.imagePath}" class="slide-image" alt="Visual" />
           </div>`
        : '';

    switch (slide.type) {
        case 'title':
            content = `<div class="title-layout">
                        ${iconHTML}
                        <h1 class="reveal">${escapeHTML(slide.content.heading)}</h1>
                        <p class="reveal delay-1">${escapeHTML(slide.content.subtitle)}</p>
                        ${imageHTML}
                       </div>`;
            break;
        case 'content':
            const listItems = (slide.content.bullets || []).map((b, i) => {
                const text = typeof b === 'string' ? b : b.text;
                const icon = typeof b === 'object' ? b.icon : null;
                const iconSVG = icon ? getIconSVG(icon) : '';
                return `<li class="reveal delay-${(i % 5) + 1} flex-item">
                            ${iconSVG ? `<span class="bullet-icon">${iconSVG}</span>` : '<span class="bullet-dot">•</span>'}
                            <span class="bullet-text">${escapeHTML(text)}</span>
                        </li>`;
            }).join('');
            content = `<div class="content-layout">
                        <div class="text-side">
                            ${iconHTML}
                            <h2 class="reveal">${escapeHTML(slide.content.heading)}</h2>
                            <ul class="content-list">${listItems}</ul>
                        </div>
                        ${imageHTML ? `<div class="image-side">${imageHTML}</div>` : ''}
                       </div>`;
            break;
        case 'quote':
            content = `<div class="quote-layout">
                        ${iconHTML}
                        <blockquote class="reveal">"${escapeHTML(slide.content.quote)}"</blockquote>
                        <cite class="reveal delay-1">— ${escapeHTML(slide.content.attribution)}</cite>
                       </div>`;
            break;
        case 'stats':
            const statHTML = (slide.content.stats || []).map((s, i) =>
                `<div class="stat-card reveal delay-${(i % 5) + 1}">
                  <div class="stat-num">${escapeHTML(s.number)}</div>
                  <div class="stat-lbl">${escapeHTML(s.label)}</div>
                </div>`
            ).join('');
            content = `<div class="stats-layout">
                        ${iconHTML}
                        <h2 class="reveal">${escapeHTML(slide.content.heading)}</h2>
                        <div class="grid">${statHTML}</div>
                       </div>`;
            break;
        case 'cta':
            content = `<div class="cta-layout">
                        ${iconHTML}
                        <h2 class="reveal">${escapeHTML(slide.content.heading)}</h2>
                        <div class="cta-box reveal delay-1">${escapeHTML(slide.content.action)}</div>
                       </div>`;
            break;
        case 'feature-grid':
        case 'split':
            const bentoItems = (slide.content.bullets || []).map((b, i) => {
                const text = typeof b === 'string' ? b : b.text;
                const icon = typeof b === 'object' ? b.icon : null;
                const iconSVG = icon ? getIconSVG(icon) : '';
                return `<div class="bento-item reveal delay-${(i % 5) + 1}">
                            <div class="bento-inner">
                                ${iconSVG ? `<div class="bento-icon">${iconSVG}</div>` : ''}
                                <div class="bento-content">${escapeHTML(text)}</div>
                            </div>
                        </div>`;
            }).join('');
            content = `<div class="bento-layout">
                        <h2 class="reveal">${escapeHTML(slide.content.heading)}</h2>
                        <div class="bento-grid">
                            ${bentoItems}
                        </div>
                       </div>`;
            break;
        default:
            content = `<h2>${escapeHTML(slide.content.heading)}</h2>`;
    }

    // Wrap the dynamic content in our structural slide shell
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

// Helper to provide raw SVG symbols for zero-dependency Lucide icons
function getIconSVG(name: string) {
    const icons: Record<string, string> = {
        'Cpu': `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
        'Zap': `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
        'BarChart3': `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
        'TrendingUp': `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
        'Rocket': `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"/><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"/></svg>`
    };
    return icons[name] || '';
}

function escapeHTML(str?: string) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getThemeData(ast: PresentationAST) {
    let themeData = {
        fontUrl: `<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800&f[]=satoshi@400,500&display=swap" rel="stylesheet">`,
        css: `
            :root {
                --bg-primary: #0f172a;
                --text-primary: #f8fafc;
                --accent: #f472b6;
                --accent-rgb: 244, 114, 182;
                --font-display: 'Cabinet Grotesk', sans-serif;
                --font-body: 'Satoshi', sans-serif;
            }
            h1, h2 { font-family: var(--font-display); color: var(--accent); }
        `
    };

    if (ast.theme === 'corporate-sharp') {
        themeData = {
            fontUrl: `<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet">`,
            css: `
                :root {
                    --bg-primary: #ffffff;
                    --text-primary: #1a1a1a;
                    --accent: #2563eb;
                    --accent-rgb: 37, 99, 235;
                    --font-display: 'Satoshi', sans-serif;
                    --font-body: 'Satoshi', sans-serif;
                }
                .slide { background: #ffffff; }
                h1, h2 { font-family: var(--font-display); font-weight: 700; color: #000; letter-spacing: -0.04em; }
            `
        };
    } else if (ast.theme === 'neon-cyber' || ast.theme === 'bold-signal') {
        themeData = {
            fontUrl: `<link href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500&display=swap" rel="stylesheet">`,
            css: `
                :root {
                    --bg-primary: #090b11;
                    --text-primary: #ffffff;
                    --accent: #22d3ee;
                    --accent-rgb: 34, 211, 238;
                    --font-display: 'Clash Display', sans-serif;
                    --font-body: 'Satoshi', sans-serif;
                }
                .slide {
                    background-color: var(--bg-primary);
                    background-image: radial-gradient(circle at 2px 2px, rgba(34, 211, 238, 0.05) 1px, transparent 0);
                    background-size: 32px 32px;
                }
                h1, h2 { font-family: var(--font-display); color: var(--accent); text-transform: uppercase; letter-spacing: 0.05em; }
            `
        };
    }

    // Inject Custom Accent if provided
    const customAccent = ast.accentColor ? `
        :root {
            --accent: ${ast.accentColor};
            --accent-rgb: ${hexToRgb(ast.accentColor)};
        }
    ` : '';

    return {
        fontUrl: themeData.fontUrl,
        css: themeData.css + customAccent
    };
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '34, 211, 238';
}

function getCoreCSS() {
    return `
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

        h1 { font-size: clamp(2.5rem, 6vw, 5rem); margin-bottom: 1rem; line-height: 1.1; }
        h2 { font-size: clamp(1.75rem, 4vw, 3rem); margin-bottom: 2rem; line-height: 1.2; }
        p, .bullet-text { font-size: clamp(1rem, 1.5vw, 1.5rem); line-height: 1.5; margin-bottom: 0.5rem; }
        .content-list { list-style: none; padding-left: 0; }
        .flex-item { display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.5rem; }
        .bullet-icon { color: var(--accent); width: 24px; flex-shrink: 0; }
        .bullet-dot { color: rgba(var(--accent-rgb), 0.4); flex-shrink: 0; }
        .bullet-icon svg { width: 100%; height: auto; }

        /* Bento Grid System */
        .bento-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            grid-auto-rows: 140px;
            gap: 1.5rem;
            width: 100%;
            margin-top: 2rem;
        }
        .bento-item {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            backdrop-filter: blur(10px);
            border-radius: 18px;
            padding: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;
            grid-column: span 4;
            transition: all 0.4s ease;
            text-align: center;
        }
        .bento-inner { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
        .bento-icon { color: var(--accent); width: 48px; }
        .bento-icon svg { width: 100%; height: auto; }
        .bento-item:hover { background: rgba(255,255,255,0.06); transform: translateY(-5px); border-color: var(--accent); }
        .bento-item:nth-child(1) { grid-column: span 8; grid-row: span 1; }
        .bento-item:nth-child(2) { grid-column: span 4; grid-row: span 2; }
        .bento-item:nth-child(3) { grid-column: span 4; grid-row: span 1; }
        .bento-item:nth-child(4) { grid-column: span 8; grid-row: span 1; }
        .bento-item:nth-child(even) { border-bottom: 2px solid var(--accent); }

        /* Side-by-side Layouts */
        .content-layout { display: flex; gap: 4rem; align-items: center; }
        .text-side { flex: 1.2; }
        .image-side { flex: 0.8; }

        /* Icon Styling */
        .slide-icon {
            color: var(--accent);
            margin-bottom: 2.5rem;
            filter: drop-shadow(0 0 15px rgba(var(--accent-rgb), 0.3));
        }

        /* Image Styling */
        .slide-image-container {
            width: 100%;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            margin-top: 2rem;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .slide-image { width: 100%; height: auto; object-fit: cover; display: block; }

        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; }
        .stat-card { border: 1px solid rgba(128,128,128,0.2); padding: 2rem; text-align: center; border-radius: 8px; }
        .stat-num { font-size: 3rem; font-weight: bold; font-family: var(--font-display); color: var(--accent); }
        .stat-lbl { font-size: 1.1rem; opacity: 0.8; }
        
        blockquote { font-size: 2rem; font-family: var(--font-display); border-left: 4px solid var(--accent); padding-left: 2rem; margin-bottom: 1rem;}
        
        .cta-box { display: inline-block; padding: 1rem 2.5rem; background: var(--accent); color: var(--bg-primary); font-weight: bold; font-size: 1.25rem; border-radius: 4px; }

        .reveal { 
            opacity: 0; 
            transform: translateY(40px) scale(0.95); 
            filter: blur(10px);
            transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        .slide.visible .reveal { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
            filter: blur(0);
        }
        
        /* Modern Slide Transitions */
        .slide {
            transition: transform 1s cubic-bezier(0.8, 0, 0.2, 1), opacity 1s ease;
        }

        .delay-1 { transition-delay: 0.1s; } 
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        .delay-4 { transition-delay: 0.4s; }
        .delay-5 { transition-delay: 0.5s; }

        .progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: var(--accent); z-index: 1000; transition: width 0.3s ease; }
        .nav-dots { position: fixed; right: 20px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 10px; z-index: 1000; }
        .nav-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-primary); opacity: 0.3; cursor: pointer; transition: all 0.3s; border: none; }
        .nav-dot.active { opacity: 1; transform: scale(1.5); background: var(--accent); }

        /* Liquid Background Accent */
        .slide::before {
            content: '';
            position: absolute;
            top: -20%; left: -20%;
            width: 140%; height: 140%;
            background: radial-gradient(circle at center, rgba(var(--accent-rgb), 0.03) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
            transition: transform 2s ease-out;
        }
        .slide.visible::before { transform: translate(5%, 5%); }
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
                
                this.initNav(); this.initObserver(); this.initKeyboard(); this.update(0);
            }
            initNav() {
                this.slides.forEach((s, i) => {
                    const d = document.createElement('button'); d.className = 'nav-dot'; d.onclick = () => this.goTo(i);
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
                if (i >= 0 && i < this.slides.length) this.slides[i].scrollIntoView({ behavior: 'smooth' });
            }
            update(idx) {
                const pct = ((idx + 1) / this.slides.length) * 100;
                this.progressBar.style.width = \`\${pct}%\`;
                [...this.navDots.children].forEach((d, i) => d.classList.toggle('active', i === idx));
            }
        }
        new Slideshow();
    `;
}
