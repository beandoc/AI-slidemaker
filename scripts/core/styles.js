// scripts/core/styles.js - The "Chromium Style Engine"
export function getGlobalCSS() {
    return `
/* CORE SYSTEM */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; outline: none; }
body { 
    background: #0a0a0f; color: var(--fg); /* Cinematic Black over Pure Black */
    font-family: var(--f-body), 'Inter', sans-serif; 
    -webkit-font-smoothing: antialiased;
    letter-spacing: -0.01em; 
    line-height: 1.6;        
    overflow-x: hidden; scroll-behavior: smooth;
}

/* 0. GLOBAL FORCE OVERRIDES */
a { color: var(--accent); text-decoration: none; transition: opacity 0.3s; }
a:hover { opacity: 0.7; }
ul { list-style: none; padding: 0; }
li { position: relative; padding-left: 2rem; margin-bottom: 1rem; }
li::before { 
    content: "—"; position: absolute; left: 0; 
    color: var(--accent); font-weight: 900; opacity: 0.5;
}

/* 1. TYPOGRAPHIC SAFETY NETS (Senior Directives) */
h1, h2, .h-hero { 
    letter-spacing: -0.05em !important; 
    line-height: 1.05 !important; 
    text-rendering: optimizeLegibility;
}

/* 2. MIXED WEIGHT TENSION */
.mixed-weight { font-weight: 200; }
.mixed-weight strong { font-weight: 900; }

/* 3. SENIOR BORDERS (Whisper Thin) */
.glass-panel, .card, .bento-card {
    border: 1px solid rgba(255,255,255,0.08) !important;
    backdrop-filter: blur(20px);
    background: rgba(255,255,255,0.03);
}

/* 4. MESH GRADIENT CORE (V15 Refined) */
.mesh-bg {
    position: fixed; inset: 0; z-index: -1;
    background: 
        radial-gradient(at 0% 0%, rgba(34, 211, 238, 0.08) 0%, transparent 50%),
        radial-gradient(at 100% 0%, rgba(129, 140, 248, 0.05) 0%, transparent 50%),
        radial-gradient(at 50% 100%, rgba(192, 132, 252, 0.05) 0%, transparent 50%),
        #0a0a0f;
}

/* THE STORYTELLING GRID */
#presentation { 
    height: 100vh; overflow-y: scroll; scroll-snap-type: y mandatory; 
    scroll-behavior: smooth;
    scrollbar-width: none; -ms-overflow-style: none;
}
#presentation::-webkit-scrollbar { display: none; }

.slide { 
    height: 100vh; width: 100vw; scroll-snap-align: start; 
    display: flex; align-items: center; position: relative;
    overflow: hidden; padding: 10vh 0;
}

/* PROGRESS & NAVIGATION */
#p-bar { position: fixed; top: 0; left: 0; width: 100%; height: 3px; background: rgba(255,255,255,0.05); z-index: 2000; }
#p-inner { height: 100%; background: var(--accent); width: 0; transition: width 0.1s linear; box-shadow: 0 0 10px var(--accent); }

/* FLOATING NAV */
#floating-nav { position: fixed; right: 2rem; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 1rem; }
.nav-dot { width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.2); background: transparent; cursor: pointer; transition: 0.3s; }
.nav-dot.active { border-color: var(--accent); background: var(--accent); box-shadow: 0 0 15px var(--accent); width: 14px; height: 14px; }
.nav-dot:hover { border-color: #fff; }

/* DESIGN SYSTEM COMPONENTS */
.label { font-family: var(--f-head); font-size: 0.8rem; letter-spacing: 0.4em; color: var(--accent); text-transform: uppercase; margin-bottom: 2rem; display: block; }
h1 { font-family: var(--f-head); font-size: clamp(3.5rem, 10vw, 8rem); line-height: 0.95; font-weight: 900; letter-spacing: -0.04em; }
h2 { font-family: var(--f-head); font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1.1; margin-bottom: 2rem; font-weight: 800; }
.wide-wrap { 
    width: 100%; 
    max-width: 1400px; 
    padding: 0 15vw; /* Forced breathing room */
    position: relative; 
    z-index: 10; 
}

/* GLASSMORPHISM DNA */
.glass-panel {
    background: rgba(255,255,255,0.02);
    backdrop-filter: blur(var(--motion-blur));
    border: 1px solid rgba(255,255,255,0.08);
    padding: 4.5rem;
    border-radius: 3rem;
    box-shadow: 0 50px 100px rgba(0,0,0,0.2);
}

/* BACKGROUNDS */
.bg-wrap { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; }
.ken-burns { animation: kenburns 40s linear infinite alternate; }
@keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.1); } }
.overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%); }

/* ANIMATION REVEALS */
.reveal { opacity: 0; transform: translateY(var(--motion-travel)); transition: all 1.2s var(--motion-easing); }
.reveal.active { opacity: 1; transform: translateY(0); }

/* MESH BACKGROUND */
.mesh-bg {
    position: fixed; inset: 0; z-index: -1;
    background: 
        radial-gradient(circle at 10% 10%, var(--accent-soft) 0%, transparent 40%),
        radial-gradient(circle at 90% 90%, var(--accent-soft) 0%, transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, var(--bg) 100%);
}

/* DIMENSION 3D ENGINE */
.slide--dimension { padding: 0; background: #000; }
.dimension-container { position: absolute; inset: 0; z-index: 1; }
.dimension-overlay { position: relative; z-index: 10; pointer-events: none; width: 100%; height: 100%; display: flex; align-items: center; }
spline-viewer { width: 100%; height: 100%; }

/* KINETIC PLAYGROUND */
.slide--kinetic { background: var(--bg); overflow: hidden; }
.kinetic-playground { position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.4; }
.k-blob { 
    position: absolute; width: 400px; height: 400px; 
    background: radial-gradient(circle, var(--accent) 0%, transparent 70%); 
    filter: blur(80px); border-radius: 50%; opacity: 0.3;
}
.k-blob-0 { top: 10%; left: 10%; }
.k-blob-1 { top: 60%; left: 70%; }
.k-blob-2 { top: 30%; left: 50%; }

/* STUNTS V13: BLEEDING EDGE DNA */

/* 1. NOISE & TEXTURE OVERLAY */
body::after {
    content: ""; position: fixed; inset: 0; z-index: 9999; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.04; mix-blend-mode: overlay;
}

/* 2. BENTO GRID (Apple Keynote Style) */
.bento-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 300px);
    gap: 1.5rem;
    max-width: 1200px;
}
.bento-card {
    background: var(--surface);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(10px);
    border-radius: 2rem;
    padding: 2.5rem;
    display: flex; flex-direction: column; justify-content: space-between;
    transition: transform 0.4s var(--motion-easing);
}
.bento-card:hover { transform: scale(1.02); border-color: var(--accent); }
.bento-wide { grid-column: span 2; }
.bento-tall { grid-row: span 2; }

/* 3. KINETIC TYPOGRAPHY (Apple Stagger) */
.kinetic-text { display: flex; flex-wrap: wrap; gap: 0.4em; }
.kinetic-word { 
    display: inline-block; 
    transform: translateY(1em); opacity: 0;
    transition: all 0.8s var(--motion-easing);
}
.reveal.active .kinetic-word { transform: translateY(0); opacity: 1; }

/* 4. SCROLL-DRIVEN CLIP PATHS (Native CSS 2025) */
@supports (animation-timeline: scroll()) {
    .scroll-reveal-img {
        animation: reveal-clip linear both;
        animation-timeline: view();
        animation-range: entry 20% cover 50%;
    }
    @keyframes reveal-clip {
        from { clip-path: inset(100% 0 0 0); }
        to { clip-path: inset(0 0 0 0); }
    }
}

/* 5. THE EDITORIAL DIVIDER */
.editorial-header { border-top: 1px solid var(--fg); padding-top: 1rem; margin-bottom: 4rem; display: flex; justify-content: space-between; align-items: baseline; }
.editorial-label { font-family: var(--f-head); text-transform: uppercase; letter-spacing: 0.3em; font-size: 0.7rem; }

/* 5.1 THE EDITORIAL INDEX */
.index-layout { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 8rem; align-items: start; padding-top: 4rem; }
.index-list { list-style: none; padding: 0; }
.index-link { 
    display: flex; align-items: center; gap: 2rem; 
    padding: 1.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.1);
    text-decoration: none; color: var(--fg); /* Killing browser blue */
    transition: all 0.4s var(--motion-easing);
}
.index-link:hover { padding-left: 2rem; border-color: var(--accent); color: var(--accent); }
.index-num { font-family: var(--f-head); font-size: 0.8rem; opacity: 0.4; letter-spacing: 0.2em; }
.index-text { font-family: var(--f-head); font-size: 2.5rem; font-weight: 200; letter-spacing: -0.05em; }
.index-link:hover .index-text { font-weight: 900; }

/* 6. DECK OF CARDS (Pinned Layering) */
.slide--pinned { position: sticky; top: 0; height: 100vh; z-index: 10; }

/* 7. BLEED-OUT ELEMENTS */
.bleed-element {
    position: absolute; right: -10vw; top: 20%;
    font-size: 30vw; font-weight: 900; opacity: 0.03;
    user-select: none; pointer-events: none;
    line-height: 0.8; transform: rotate(-5deg);
}

/* 8. DATA CALLOUT BOX (Deliberate Tension) */
.data-callout {
    background: var(--accent); color: #000;
    padding: 2rem; border-radius: 12px;
    transform: rotate(-1.5deg) translate(20px, -20px);
    box-shadow: 20px 20px 0px rgba(0,0,0,0.3);
    font-family: var(--f-head); font-weight: 800;
}

/* 9. TEXT KNOCKOUT (Magazine Spread) */
.knockout-text {
    mix-blend-mode: exclusion;
    color: #fff; filter: invert(1);
}

/* 10. SECTION COUNTER SYSTEM */
.sect-counter {
    position: absolute; top: 4rem; right: 4rem;
    font-family: var(--f-head); font-size: 0.7rem;
    letter-spacing: 0.4em; opacity: 0.3;
    z-index: 100; pointer-events: none;
}

/* LIST SYSTEMS & BREATHING */
.editorial-list { 
    display: grid; gap: 4rem; 
    margin-top: 5rem;
}
.columns-2 { grid-template-columns: 1fr 1fr; gap: 8rem; }
.editorial-list li { 
    font-size: 1.4rem; opacity: 0.9; 
    line-height: 1.4;
    max-width: 40ch; /* Line length control */
}
.editorial-list li span { display: block; }

/* CUSTOM CURSOR & MAGNETIC HUD */
.custom-cursor {
    width: 20px; height: 20px; border: 2px solid var(--accent);
    border-radius: 50%; position: fixed; pointer-events: none;
    z-index: 10000; transition: transform 0.1s ease, width 0.3s, height 0.3s;
    mix-blend-mode: difference;
}
.magnetic-target { transition: transform 0.3s var(--motion-easing); }

/* KINETIC LENS REVEAL DNA (V12) */
.slide--lens { background: #000; perspective: 1000px; }
.lens-track { width: 100%; height: 200vh; position: relative; } /* Multi-scroll depth */
.lens-sticky { position: sticky; top: 0; height: 100vh; width: 100vw; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.lens-mask {
    width: 100%; height: 100%;
    background-size: cover; background-position: center;
    clip-path: circle(calc(var(--sect-p, 0) * 150%) at 50% 50%);
    transform: scale(calc(2 - var(--sect-p, 0)));
    transition: clip-path 0.1s linear, transform 0.1s linear;
}
.lens-content { 
    position: absolute; z-index: 5; text-align: center; color: #fff;
    opacity: calc((var(--sect-p, 0) - 0.5) * 2); 
    transform: translateY(calc(50px * (1 - var(--sect-p, 0))));
}

/* PAN-UP NARRATIVE DNA */
.narrative-line { overflow: hidden; display: block; line-height: 1.2; margin-bottom: 0.2em; }
.pan-up { 
    display: inline-block; transform: translateY(110%); 
    transition: transform 1.5s var(--motion-easing); 
}
.reveal.active .pan-up { transform: translateY(0); }

/* NARRATIVE SLIDE LAYOUT */
.slide--narrative { text-align: left; }
.narrative-wrap { max-width: 1100px; margin: 0 auto; }
.narrative-text { font-family: var(--f-head); font-size: clamp(3rem, 7vw, 6rem); font-weight: 800; }
.narrative-icon { font-size: 5rem; margin-top: 3rem; transform: translateY(50px); opacity: 0; transition: all 1.2s var(--motion-easing); transition-delay: 0.6s; }
.reveal.active .narrative-icon { transform: translateY(0); opacity: 1; }

/* SPECIFIC COMPONENT CSS */
/* (Individual slide CSS follows) */

/* TEASER GRID */
.teaser-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 4rem; }
.teaser-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 3rem; border-radius: 2rem; text-align: left; position: relative; transition: all 0.4s; }
.teaser-card:hover { transform: translateY(-15px); background: rgba(255,255,255,0.05); border-color: var(--accent); }
.teaser-card h4 { font-family: var(--f-head); font-size: 1.5rem; margin-bottom: 1rem; color: var(--accent); }

/* CHART COMPONENT */
.chart-layout { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 5rem; align-items: center; text-align: left; }
.chart-box { padding: 4rem; background: rgba(255,255,255,0.01); border-radius: 3rem; border: 1px solid rgba(255,255,255,0.05); }
.svg-chart-engine { width: 100%; height: auto; overflow: visible; }
.chart-bar-grow { transform-origin: bottom; animation: barGrow 1.5s var(--motion-easing) forwards; opacity: 0; }
@keyframes barGrow { from { transform: scaleY(0); opacity: 0; } to { transform: scaleY(1); opacity: 1; } }
.chart-line-draw { stroke-dasharray: 2000; stroke-dashoffset: 2000; animation: lineDraw 2.5s var(--motion-easing) forwards; }
@keyframes lineDraw { to { stroke-dashoffset: 0; } }
.chart-area-reveal { animation: areaFill 2s var(--motion-easing) forwards; opacity: 0; }
@keyframes areaFill { from { opacity: 0; } to { opacity: 0.3; } }

/* HORIZONTAL SCROLL TRACK */
.slide--horizon { padding: 0; min-height: 400vh; align-items: flex-start; }
.horizon-sticky { position: sticky; top: 0; height: 100vh; width: 100vw; overflow: hidden; display: flex; align-items: center; }
.horizon-content { display: flex; align-items: center; padding-left: 10vw; transition: transform 0.1s linear; transform: translateX(calc(var(--horizon-p) * -75vw)); }
.horizon-card { min-width: 450px; height: 550px; background: rgba(255,255,255,0.03); border-radius: 2.5rem; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); margin-right: 4rem; }
.horizon-img { height: 60%; background-size: cover; background-position: center; }

/* MOSAIC GALLERY */
.mosaic-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 320px; gap: 2rem; max-width: 1200px; margin: 0 auto; }
.mosaic-item:nth-child(2) { grid-row: span 2; }
.mosaic-img { width: 100%; height: 100%; background-size: cover; background-position: center; border-radius: 2rem; transition: all 0.5s; filter: grayscale(0.5); }
.mosaic-item:hover .mosaic-img { filter: grayscale(0); transform: scale(1.03); }

/* OBJECTIVE LAYOUT */
.obj-grid { display: grid; grid-template-columns: 1fr; gap: 2.5rem; margin-top: 4rem; text-align: left; }
.obj-card { display: flex; align-items: center; gap: 3rem; background: rgba(255,255,255,0.03); padding: 3rem; border-radius: 2rem; border-left: 8px solid var(--accent); }
.obj-id { font-family: var(--f-head); font-size: 3.5rem; font-weight: 900; color: var(--accent); opacity: 0.6; min-width: 100px; }
.obj-body h4 { font-family: var(--f-head); font-size: 1.8rem; margin-bottom: 0.5rem; }

/* KPI STATS */
.stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 5rem; margin-top: 5rem; }
.stat-card { border-left: 3px solid var(--accent); padding-left: 3.5rem; text-align: left; }
.stat-val { font-size: clamp(4rem, 8vw, 7rem); color: var(--accent); line-height: 1; font-weight: 900; margin-bottom: 1.5rem; font-family: var(--f-head); }
.stat-lbl { font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.3em; opacity: 0.5; font-weight: 700; }

/* DATA TABLES */
.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table th { font-family: var(--f-head); padding: 1.5rem; border-bottom: 2px solid var(--accent); color: var(--accent); font-size: 0.85rem; letter-spacing: 0.2em; }
.data-table td { padding: 1.8rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 1.1rem; }

/* QUOTES & CTA */
blockquote { font-family: var(--f-head); font-size: clamp(2rem, 5vw, 4rem); line-height: 1.2; font-style: italic; margin-bottom: 3rem; font-weight: 600; }
cite { font-size: 1.4rem; letter-spacing: 0.2em; opacity: 0.5; text-transform: uppercase; font-style: normal; font-weight: 800; display: block; border-left: 4px solid var(--accent); padding-left: 2rem; margin-left: auto; margin-right: auto; width: fit-content; }

.btn-diamond {
    display: inline-block; padding: 2rem 6rem; background: #fff; color: #000;
    font-size: 1.8rem; font-weight: 900; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.15em;
    box-shadow: 0 40px 100px rgba(0,0,0,0.4); transition: all 0.5s; cursor: pointer;
}
.btn-diamond:hover { transform: translateY(-15px) scale(1.05); box-shadow: 0 60px 120px rgba(0,0,0,0.6); }

/* STRATEGIC COLUMNS */
.col-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4rem; margin-top: 4rem; text-align: left; }
.col-item { border-top: 1px solid var(--accent); padding-top: 2rem; }
.col-label { font-size: 0.75rem; font-weight: 800; color: var(--accent); margin-bottom: 1rem; letter-spacing: 0.2em; }
.col-item h3 { font-family: var(--f-head); font-size: 2rem; margin-bottom: 1rem; }

/* CANVA PREMIUM ASSEMBLY DNA */
.slide--assemble { overflow: hidden; }
.assembly-stage { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }

.assembly-layer { 
    position: absolute; 
    transition: transform 0.8s var(--motion-easing), opacity 0.8s;
    opacity: 0;
}

/* Flying patterns */
.from-left { transform: translateX(-150px); }
.from-right { transform: translateX(150px); }
.from-top { transform: translateY(-150px); }
.from-bottom { transform: translateY(150px); }
.scale-up { transform: scale(0.5); }

.reveal.active .assembly-layer { opacity: 1; transform: translate(0,0) scale(1); }

/* SCROLL-LINKED GROWTH */
.scroll-growth-track { width: 100%; height: 20px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; margin: 1rem 0; }
.scroll-growth-fill { 
    height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); 
    width: calc(var(--sect-p, 0) * 100%); transition: width 0.1s linear;
}

/* FAQ SYSTEM */
.faq-list { max-width: 900px; margin: 4rem auto 0; text-align: left; }
.faq-item { margin-bottom: 3.5rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
.faq-q { font-family: var(--f-head); font-size: 1.6rem; font-weight: 800; margin-bottom: 1.2rem; color: var(--accent); }
.faq-a { opacity: 0.7; font-size: 1.2rem; line-height: 1.8; padding-left: 2.5rem; border-left: 2px solid rgba(255,255,255,0.1); }

/* FOOTER BRANDING */
.slide--footer { background: var(--bg); border-top: 1px solid rgba(255,255,255,0.05); }
.footer-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 6rem; text-align: left; }
.footer-brand h3 { font-family: var(--f-head); font-size: 3rem; margin-bottom: 1rem; }
.footer-contact p { font-size: 1.2rem; margin-bottom: 0.5rem; opacity: 0.6; }
`;
}
