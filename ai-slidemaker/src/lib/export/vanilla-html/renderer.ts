import { SceneAST, Section, Block } from '@/store/editor-types';

/**
 * Cinematic Rendering Pipeline v2.0
 * SceneAST -> Single-File Zero-Dependency HTML with GSAP ScrollTrigger
 */
export function generateProductionHTML(ast: SceneAST) {
    const sectionsHTML = ast.sections.map((s, i) => buildSectionHTML(s, i)).join('\n');

    const coreCSS = getCoreCSS();
    const themeHTML = getThemeHTML(ast);
    const coreJS = getCoreJavascript();

    const fontHeadline = ast.config.theme.fonts.headline.replace(/ /g, '+');
    const fontBody = ast.config.theme.fonts.body.replace(/ /g, '+');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(ast.title || 'Antigravity Scene')}</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=${fontHeadline}:wght@200;900&family=${fontBody}:wght@300;400;700&display=swap" rel="stylesheet">
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    
    <style>
        ${themeHTML.css}
        ${coreCSS}
    </style>
</head>
<body class="archetype-${ast.config.archetype}">
    <div class="document-container">
        ${sectionsHTML}
    </div>

    <script>
        ${coreJS}
    </script>
</body>
</html>`;
}

function buildSectionHTML(section: Section, index: number) {
    let contentHTML = '';
    const blocksHTML = section.blocks.map(b => buildBlockHTML(b));

    if (section.layoutId === 'hero') {
        contentHTML = `<div class="layout-hero">${blocksHTML.join('')}</div>`;
    } else if (section.layoutId === 'split') {
        const left = blocksHTML.filter((_, i) => i % 2 === 0).join('');
        const right = blocksHTML.filter((_, i) => i % 2 !== 0).join('');
        contentHTML = `<div class="layout-split"><div class="col">${left}</div><div class="col">${right}</div></div>`;
    } else if (section.layoutId === 'bento') {
        contentHTML = `<div class="layout-bento">${blocksHTML.map((html, i) => `<div class="bento-cell ${i === 0 ? 'bento-main' : ''}">${html}</div>`).join('')}</div>`;
    } else {
        contentHTML = `<div class="layout-default">${blocksHTML.join('')}</div>`;
    }

    const bgStyle = section.background.type === 'color'
        ? `background-color: ${section.background.value}`
        : `background-image: url('${section.background.value}')`;

    return `
    <section class="section section-${section.layoutId}" id="${section.id}" style="${bgStyle}; opacity: ${section.background.opacity}">
        <div class="section-overlay" style="background: ${section.background.overlay || 'transparent'}"></div>
        <div class="section-content">
            ${contentHTML}
        </div>
    </section>`;
}

function buildBlockHTML(block: Block) {
    let content = '';
    const styleAttr = Object.entries(block.style || {})
        .map(([k, v]) => `${k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}: ${v}`)
        .join('; ');

    const animationAttr = block.animation ? `data-anim="${block.animation.type}" data-delay="${block.animation.delay}"` : '';

    switch (block.type) {
        case 'text':
            const Tag = block.data.tag || 'p';
            content = `<${Tag} class="block block-text" style="${styleAttr}" ${animationAttr}>${escapeHTML(block.data.content)}</${Tag}>`;
            break;
        case 'image':
            content = `
            <div class="block block-image" style="${styleAttr}" ${animationAttr}>
                <img src="${block.data.url}" alt="${block.data.alt || ''}" style="object-position: ${block.data.focalPoint?.x ?? 50}% ${block.data.focalPoint?.y ?? 50}%" />
            </div>`;
            break;
        case 'chart':
            content = `<div class="block block-chart" id="chart-${block.id}" ${animationAttr} style="height: 300px; ${styleAttr}"></div>`;
            break;
    }

    return content;
}

function getThemeHTML(ast: SceneAST) {
    const { primary, accent, background, foreground, fonts } = ast.config.theme;
    return {
        css: `
            :root {
                --primary: ${primary};
                --accent: ${accent};
                --bg: ${background};
                --fg: ${foreground};
                --font-head: '${fonts.headline}', sans-serif;
                --font-body: '${fonts.body}', sans-serif;
            }
        `
    };
}

function getCoreCSS() {
    return `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            background: var(--bg); color: var(--fg); 
            font-family: var(--font-body); 
            line-height: 1.5; overflow-x: hidden;
        }

        .section {
            min-height: 100vh;
            width: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10vh 5vw;
            background-size: cover;
            background-position: center;
        }

        .section-overlay {
            position: absolute; inset: 0; z-index: 1;
        }

        .layout-hero { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 2rem; }
        .layout-split { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .layout-bento { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 1fr); gap: 1.5rem; }
        .bento-main { grid-column: span 2; grid-row: span 2; }

        /* ARCHETYPE SPECIFIC OVERRIDES */
        .archetype-editorial-ledger { --bg: #ffffff; --fg: #000000; }
        .archetype-editorial-ledger .section { border-bottom: 2px solid #000; }
        .archetype-editorial-ledger .section-content { max-width: 900px; padding: 4rem; position: relative; }
        .archetype-editorial-ledger .section-content::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 1px; background: #000; opacity: 0.1; }
        .archetype-editorial-ledger h1 { font-family: 'serif'; font-size: clamp(4rem, 12vw, 10rem); line-height: 0.9; text-transform: uppercase; letter-spacing: -0.05em; margin-bottom: 2rem; }
        .archetype-editorial-ledger .block-text p { font-size: 1.5rem; max-width: 40ch; line-height: 1.4; color: #333; }

        .archetype-split-rail .layout-split { gap: 0; }
        .archetype-split-rail .col { padding: 5vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; }
        .archetype-split-rail .col:first-child { border-right: 1px solid rgba(var(--primary-rgb), 0.2); }
        .archetype-split-rail .block-image img { border-radius: 0; height: 80vh; }

        .archetype-card-mosaic { background: #050505; }
        .archetype-card-mosaic .bento-cell { 
            background: rgba(255,255,255,0.03); 
            padding: 3rem; 
            border-radius: 2.5rem; 
            backdrop-filter: blur(20px); 
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
            transition: transform 0.4s ease;
        }
        .archetype-card-mosaic .bento-cell:hover { transform: translateY(-10px); background: rgba(255,255,255,0.05); }

        .archetype-minimal-columns .section-content { max-width: 1400px; }
        .archetype-minimal-columns .layout-default { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 6rem;
        }
        .archetype-minimal-columns .block-text { border-top: 1px solid var(--fg); padding-top: 1.5rem; }

        /* NEON CYBER HUD EFFECTS */
        .archetype-neon-cyber { --primary-rgb: 56, 189, 248; }
        .archetype-neon-cyber .section::after { 
            content: ""; position: absolute; inset: 0; 
            background-image: radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb), 0.05) 0%, transparent 70%); 
            pointer-events: none; 
        }
        .archetype-neon-cyber .block-text h1 { 
            text-shadow: 0 0 20px rgba(var(--primary-rgb), 0.4); 
            letter-spacing: 0.2em; font-weight: 200; 
        }

        /* MOBILE SAFE RULES */
        @media (max-width: 768px) {
            .section { padding: 4rem 1.5rem; height: auto; min-height: 100vh; }
            .section-content { gap: 2rem; }
            
            /* Typography Scaling */
            .block-text h1 { font-size: 3rem !important; word-break: break-word; }
            .block-text h2 { font-size: 2rem !important; }
            
            /* Layout Stacking */
            .layout-split { grid-template-columns: 1fr; gap: 2rem; }
            .layout-bento { grid-template-columns: 1fr; grid-template-rows: auto; gap: 1rem; }
            .bento-main { grid-column: span 1; grid-row: span 1; }
            
            /* Archetype Tweaks */
            .archetype-editorial-ledger h1 { font-size: 3.5rem !important; }
            .archetype-editorial-ledger .section-content { padding: 2rem 1rem; border-left: none; border-top: 1px solid #000; }
            
            .archetype-split-rail .col { height: auto; padding: 2rem 0; border-right: none; border-bottom: 1px solid rgba(var(--primary-rgb), 0.1); }
            .archetype-split-rail .block-image img { height: 40vh; }
            
            .archetype-card-mosaic .bento-cell { padding: 1.5rem; border-radius: 1.5rem; }
            
            .archetype-minimal-columns .layout-default { grid-template-columns: 1fr; gap: 3rem; }
            
            .archetype-neon-cyber .block-text h1 { letter-spacing: 0.1em; }
        }

        .block-text h1 { font-family: var(--font-head); font-size: clamp(3rem, 8vw, 6rem); line-height: 1; font-weight: 900; }
        .block-text h2 { font-family: var(--font-head); font-size: clamp(2rem, 5vw, 4rem); font-weight: 800; }
        
        .block-image img { width: 100%; height: auto; border-radius: 1rem; object-fit: cover; }
        
        /* SCROLL ANIMATION STATES */
        [data-anim] { opacity: 0; }
    `;
}

function getCoreJavascript() {
    return `
        gsap.registerPlugin(ScrollTrigger);

        document.addEventListener('DOMContentLoaded', () => {
            // GSAP Entrance Animations
            document.querySelectorAll('[data-anim]').forEach(el => {
                const anim = el.dataset.anim;
                const delay = parseFloat(el.dataset.delay || 0);
                
                let fromProps = { opacity: 0, y: 30 };
                if (anim === 'slide-up') fromProps = { opacity: 0, y: 50 };
                if (anim === 'zoom') fromProps = { opacity: 0, scale: 0.8 };
                if (anim === 'fade') fromProps = { opacity: 0 };

                gsap.from(el, {
                    ...fromProps,
                    duration: 1.2,
                    delay: delay,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                });
            });

            // Smooth Scroll for sections
            gsap.utils.toArray('.section').forEach(section => {
                gsap.from(section, {
                    scale: 0.95,
                    opacity: 0.8,
                    duration: 1,
                    scrollTrigger: {
                        trigger: section,
                        start: "top 100%",
                        end: "top 0%",
                        scrub: true
                    }
                });
            });
        });
    `;
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
