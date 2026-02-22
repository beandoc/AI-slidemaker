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
        .archetype-editorial-ledger .section-content { max-width: 1000px; padding: 0 2rem; border-left: 1px solid #000; }
        .archetype-editorial-ledger h1 { font-family: 'serif'; font-size: 8rem; text-transform: uppercase; }

        .archetype-split-rail .layout-split { border-top: 1px solid var(--primary); padding-top: 2rem; }
        .archetype-split-rail .col:first-child { border-right: 1px solid var(--primary); padding-right: 2rem; }

        .archetype-card-mosaic .bento-cell { background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 2rem; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }

        .archetype-minimal-columns .section-content { max-width: 800px; }
        .archetype-minimal-columns .layout-default { text-align: justify; columns: 2; column-gap: 4rem; }

        /* MOBILE SAFE RULES */
        @media (max-width: 768px) {
            .layout-split { grid-template-columns: 1fr; }
            .layout-bento { grid-template-columns: 1fr; grid-template-rows: auto; }
            .bento-main { grid-column: span 1; grid-row: span 1; }
            .archetype-editorial-ledger h1 { font-size: 4rem; }
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
