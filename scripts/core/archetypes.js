// scripts/core/archetypes.js - THE ARCHETYPE ENGINE BANK
import { esc, pick } from './utils.js';

export function renderTitle(s, id, idx) {
    const img = pick('hero', idx);
    const dateStr = s.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
    const owner = s.owner ? `<div class="hero-meta reveal" data-d="400"><span>BY ${esc(s.owner).toUpperCase()}</span></div>` : '';
    return `<section class="slide slide--hero" id="${id}" data-label="Entry">
        <div class="bg-wrap"><div class="bg-img ken-burns" style="background-image:url('${img}')"></div></div>
        <div class="overlay"></div>
        <div class="vertical-title">${esc((s.heading || 'STUDIO').split(' ').slice(0, 2).join(' ').toUpperCase())}</div>
        <div class="vertical-tag">STUDIO EDITION V.24</div>
        <div class="content hero-content">
            <span class="badge reveal" data-d="0">EDITION I | ${dateStr}</span>
            <h1 class="reveal" data-d="150">${esc(s.heading)}</h1>
            <p class="subtitle reveal" data-d="300">${esc(s.subtitle || '')}</p>
            ${owner}
        </div>
    </section>`;
}

export function renderSplit(s, id, idx) {
    const img = s.image || pick('hero', idx);
    const bullets = (s.bullets || [s.text || '']).map((b, i) => `<li class="reveal" data-d="${200 + i * 100}"><span>${esc(b)}</span></li>`).join('');
    const sub = s.subtitle || s.subtext ? `<p class="subtitle reveal" data-d="150">${esc(s.subtitle || s.subtext)}</p>` : '';
    return `<section class="slide slide--split" id="${id}" data-label="Strategy">
        <div class="split-text">
            <div class="glass-panel" style="width: 100%;">
                <span class="label reveal" data-d="0">${esc(s.label || 'STRATEGY')}</span>
                <h2 class="reveal" data-d="100">${esc(s.heading)}</h2>
                ${sub}
                <ul class="editorial-list reveal" data-d="300" style="margin-top: 3rem;">${bullets}</ul>
            </div>
        </div>
        <div class="split-photo">
            <div class="bg-img drift-slow" style="background-image:url('${img}')"></div>
            <div class="photo-overlay"></div>
            <div class="vertical-tag">RESEARCH ARCHIVE</div>
        </div>
    </section>`;
}

export function renderContent(s, id) {
    const bullets = (s.bullets || [s.text || '']).map((b, i) => `<li class="reveal" data-d="${200 + i * 100}"><span>${esc(b)}</span></li>`).join('');
    const sub = s.subtitle || s.subtext ? `<p class="subtitle reveal" data-d="150">${esc(s.subtitle || s.subtext)}</p>` : '';
    return `<section class="slide slide--content" id="${id}" data-label="Focus">
        <div class="wide-wrap">
            <h2 class="mixed-weight reveal" data-d="0" style="font-size: 5rem;"><strong>${esc(s.heading.split(' ')[0])}</strong> ${esc(s.heading.split(' ').slice(1).join(' '))}</h2>
            ${sub}
            <ul class="editorial-list columns-2 reveal" data-d="300" style="margin-top: 2rem;">${bullets}</ul>
        </div>
    </section>`;
}

export function renderChart(s, id) {
    const data = s.data || [40, 70, 55, 90, 65];
    const labels = s.labels || ['Y1', 'Y2', 'Y3', 'Y4', 'Y5'];
    const type = s.chartType || 'bar';
    let body = '';
    if (type === 'area' || type === 'line') {
        const points = data.map((v, i) => `${(i * 200) + 50},${250 - (v * 2)}`).join(' ');
        const path = `50,250 ${points} ${(data.length - 1) * 200 + 50},250`;
        body = `<polygon points="${path}" fill="var(--accent-soft)" class="chart-area-reveal" />
                <polyline points="${points}" fill="none" stroke="var(--accent)" stroke-width="6" class="chart-line-draw" />`;
    } else {
        body = data.map((v, i) => `<rect x="${(i * 180) + 60}" y="${250 - (v * 2)}" width="70" height="${v * 2}" fill="var(--accent)" rx="10" class="chart-bar-grow" />`).join('');
    }
    return `<section class="slide slide--chart" id="${id}" data-label="Metrics">
        <div class="wide-wrap chart-layout">
            <div class="chart-text"><span class="label">DATA</span><h2>${esc(s.heading)}</h2><p>${esc(s.subtext || '')}</p></div>
            <div class="chart-box glass-panel reveal" data-d="200"><svg viewBox="0 0 1000 300" class="svg-chart-engine">${body}</svg></div>
        </div>
    </section>`;
}

export function renderHorizon(s, id) {
    const items = (s.items || []).map((item, i) => `<div class="horizon-card">
        <div class="horizon-img" style="background-image:url('${pick('hero', i)}')"></div>
        <div class="horizon-info"><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div>
    </div>`).join('');
    return `<section class="slide slide--horizon" id="${id}" data-label="Journey">
        <div class="horizon-sticky"><div class="horizon-content">
            <div class="horizon-intro"><span class="label">STORY</span><h2>${esc(s.heading)}</h2></div>
            <div class="horizon-items">${items}</div>
        </div></div>
    </section>`;
}

export function renderGallery(s, id) {
    const items = (s.images || [null, null, null]).map((img, i) => `<div class="mosaic-item reveal" data-d="${i * 100}"><div class="mosaic-img" style="background-image:url('${img || pick('hero', i)}')"></div></div>`).join('');
    return `<section class="slide slide--gallery" id="${id}" data-label="Gallery">
        <div class="wide-wrap"><h2 class="reveal">${esc(s.heading)}</h2><div class="mosaic-grid">${items}</div></div>
    </section>`;
}

export function renderDimension(s, id) {
    const scenes = {
        'abstract': 'https://prod.spline.design/6Wq1Q7YAncaZPOPs/scene.splinecode',
        'tech': 'https://prod.spline.design/6Wq1Q7YAncaZPOPs/scene.splinecode',
        'organic': 'https://prod.spline.design/6Wq1Q7YAncaZPOPs/scene.splinecode'
    };
    const sceneUrl = s.sceneUrl || scenes[s.theme || 'abstract'];
    return `<section class="slide slide--dimension" id="${id}" data-label="3D Space">
        <div class="dimension-container"><spline-viewer url="${sceneUrl}"></spline-viewer></div>
        <div class="dimension-overlay">
            <div class="wide-wrap">
                <span class="label reveal" data-d="0">${esc(s.label || 'DIMENSION')}</span>
                <h2 class="reveal" data-d="150">${esc(s.heading)}</h2>
                <p class="subtitle reveal" data-d="300">${esc(s.subtext || '')}</p>
            </div>
        </div>
    </section>`;
}

export function renderKinetic(s, id) {
    return `<section class="slide slide--kinetic" id="${id}" data-label="Energy">
        <div class="kinetic-playground">${Array(6).fill(0).map((_, i) => `<div class="k-blob k-blob-${i}"></div>`).join('')}</div>
        <div class="wide-wrap"><div class="glass-panel reveal"><h2 class="pan-up">${esc(s.heading)}</h2><p class="reveal" data-d="200">${esc(s.text || '')}</p></div></div>
    </section>`;
}

export function renderLens(s, id) {
    const img = s.image || pick('hero', 1);
    return `<section class="slide slide--lens" id="${id}" data-label="Reveal">
        <div class="lens-track"><div class="lens-sticky"><div class="lens-mask" style="background-image:url('${img}')"></div><div class="lens-content wide-wrap"><h1>${esc(s.heading)}</h1><p class="subtitle">${esc(s.subtext || '')}</p></div></div></div>
    </section>`;
}

export function renderBleed(s, id) {
    const bleedText = s.bleedText || '01';
    return `<section class="slide slide--bleed" id="${id}" data-label="Bleed">
        <div class="bleed-element knockout-text">${esc(bleedText)}</div>
        <div class="wide-wrap"><span class="label reveal" data-d="0">${esc(s.label || 'CHAPTER')}</span><h2 class="reveal" data-d="200" style="font-size: 5rem; margin-top: 2rem;">${esc(s.heading)}</h2><p class="reveal" data-d="400" style="max-width: 600px; opacity: 0.6;">${esc(s.subtext || '')}</p></div>
    </section>`;
}

export function renderMinimal(s, id) {
    return `<section class="slide slide--minimal" id="${id}" data-label="Minimal">
        <div class="wide-wrap" style="display: flex; flex-direction: column; justify-content: flex-end; height: 100vh; padding: 10vw;"><h2 class="reveal" style="font-size: 4rem; line-height: 1;">${esc(s.heading)}</h2><p class="reveal subtitle" data-d="200">${esc(s.subtext || '')}</p></div>
    </section>`;
}

export function renderKnockout(s, id) {
    const img = s.image || pick('hero', 2);
    return `<section class="slide slide--knockout" id="${id}" style="background-image:url('${img}'); background-size:cover;" data-label="Impact">
        <div class="wide-wrap" style="height: 100%; display: flex; align-items: center; justify-content: center;"><h2 class="knockout-text reveal" style="font-size: clamp(4rem, 15vw, 12rem); text-align: center;">${esc(s.heading)}</h2></div>
    </section>`;
}

export function renderCallout(s, id) {
    return `<section class="slide slide--callout" id="${id}" data-label="Insight">
        <div class="wide-wrap"><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center;"><div><span class="label">TRANSFORMATION</span><h2>${esc(s.heading)}</h2><p>${esc(s.text || '')}</p></div><div class="data-callout reveal" data-d="200"><div style="font-size: 1.2rem; opacity: 0.7;">${esc(s.statLabel || 'IMPACT')}</div><div style="font-size: 5rem; line-height: 1;">${esc(s.stat || '↑ 340%')}</div></div></div></div>
    </section>`;
}

export function renderAssemble(s, id) {
    const layers = (s.layers || [{ type: 'img', pos: 'from-left', delay: 0.2 }, { type: 'icon', pos: 'from-top', delay: 0.5 }, { type: 'title', pos: 'from-right', delay: 0.1 }]).map((l, i) => {
        let content = '';
        if (l.type === 'img') content = `<img src="${pick('hero', i)}" class="glass-panel" style="width:500px; padding:10px;">`;
        if (l.type === 'icon') content = `<div class="assembly-icon" style="font-size:10rem;">💎</div>`;
        if (l.type === 'title') content = `<h2>${esc(s.heading)}</h2>`;
        return `<div class="assembly-layer ${l.pos} reveal" data-d="${l.delay * 1000}">${content}</div>`;
    }).join('');
    return `<section class="slide slide--assemble" id="${id}" data-label="Assembly"><div class="assembly-stage">${layers}</div></section>`;
}

export function renderMetrics(s, id) {
    const bars = (s.data || [80, 45, 95, 60]).map((v, i) => `
        <div class="metric-item reveal" data-d="${i * 100}"><div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;"><span>${esc(s.labels[i] || 'Stat ' + i)}</span><strong>${v}%</strong></div><div class="scroll-growth-track"><div class="scroll-growth-fill" style="--sect-p: var(--sect-p)"></div></div></div>
    `).join('');
    return `<section class="slide slide--metrics" id="${id}" data-label="Metrics"><div class="wide-wrap"><span class="label">PERFORMANCE</span><h2>${esc(s.heading)}</h2><div class="metrics-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:4rem; margin-top:4rem;">${bars}</div></div></section>`;
}

export function renderNarrative(s, id) {
    const lines = (s.lines || [s.text || '']).map((line, i) => {
        const words = line.split(' ').map((word, wi) => `<span class="kinetic-word" style="transition-delay: ${(i * 200) + (wi * 50)}ms">${esc(word)}</span>`).join(' ');
        return `<span class="narrative-line kinetic-text">${words}</span>`;
    });
    return `<section class="slide slide--narrative" id="${id}" data-label="Story"><div class="wide-wrap"><div class="narrative-content reveal"><div class="narrative-icon reveal" data-d="0"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg></div><div class="narrative-lines">${lines.join('')}</div></div></div></section>`;
}

export function renderObjective(s, id) {
    const items = (s.items || []).map((obj, i) => `<div class="obj-card reveal" data-d="${i * 150}"><div class="obj-id">O${i + 1}</div><div class="obj-body"><h4>${esc(obj.title)}</h4><p>${esc(obj.desc)}</p></div></div>`).join('');
    return `<section class="slide slide--objectives" id="${id}" data-label="Goals"><div class="wide-wrap"><h2>${esc(s.heading)}</h2><div class="obj-grid">${items}</div></div></section>`;
}

export function renderTable(s, id) {
    const rows = (s.rows || []).map((r, i) => `<tr class="reveal" data-d="${i * 50}"><td><strong>${esc(r.key)}</strong></td><td>${esc(r.value)}</td><td>${esc(r.contact || '')}</td></tr>`).join('');
    return `<section class="slide slide--table" id="${id}" data-label="Data"><div class="wide-wrap"><div class="glass-panel"><table class="data-table"><thead><tr><th>KEY</th><th>DETAILS</th><th>CONTACT</th></tr></thead><tbody>${rows}</tbody></table></div></div></section>`;
}

export function renderStats(s, id) {
    const items = (s.stats || []).map((st, i) => `<div class="stat-card reveal" data-d="${i * 150}"><div class="stat-val">${st.number}</div><div class="stat-lbl">${esc(st.label)}</div></div>`).join('');
    return `<section class="slide slide--stats" id="${id}" data-label="KPIs"><div class="wide-wrap"><div class="stat-row">${items}</div></div></section>`;
}

export function renderQuote(s, id) {
    return `<section class="slide" id="${id}" data-label="Vision"><div class="wide-wrap reveal"><blockquote>${esc(s.quote)}</blockquote><cite>${esc(s.attribution)}</cite></div></section>`;
}

export function renderCTA(s, id) {
    return `<section class="slide slide--cta" id="${id}" data-label="Launch"><div class="wide-wrap reveal"><h2>${esc(s.heading)}</h2><div class="btn-diamond">${esc(s.action)}</div></div></section>`;
}

export function renderHighlight(s, id) {
    return `<section class="slide slide--highlight" id="${id}" data-label="Key"><div class="wide-wrap"><div class="highlight-block reveal"><h2>${esc(s.heading)}</h2><p>${esc(s.content)}</p></div></div></section>`;
}

export function renderContext(s, id) {
    return `<section class="slide slide--context" id="${id}" data-label="Context"><div class="context-grid"><div class="context-visual"><div class="bg-img" style="background-image:url('${pick('quote', 1)}')"></div></div><div class="context-text"><div class="glass-panel"><h2>${esc(s.heading)}</h2><p>${esc(s.text)}</p></div></div></div></section>`;
}

export function renderFAQ(s, id) {
    const items = (s.items || []).map((qa, i) => `<div class="faq-item reveal" data-d="${i * 100}"><div class="faq-q">Q: ${esc(qa.question)}</div><div class="faq-a">A: ${esc(qa.answer)}</div></div>`).join('');
    return `<section class="slide slide--faq" id="${id}" data-label="FAQs"><div class="wide-wrap"><div class="faq-list">${items}</div></div></section>`;
}

export function renderColumns(s, id) {
    const items = (s.items || []).map((col, i) => `<div class="col-item reveal" data-d="${i * 150}"><div class="col-label">${esc(col.label)}</div><h3>${esc(col.title)}</h3><p>${esc(col.text)}</p></div>`).join('');
    return `<section class="slide slide--columns" id="${id}" data-label="Strategy"><div class="wide-wrap"><div class="col-grid">${items}</div></div></section>`;
}

export function renderBento(s, id) {
    const cards = (s.cards || []).map((c, i) => `<div class="bento-card ${c.size || ''} reveal" data-d="${i * 100}"><div><span class="label">${esc(c.label || 'FEATURE')}</span><h3>${esc(c.title)}</h3></div><p>${esc(c.text)}</p></div>`).join('');
    return `<section class="slide slide--bento" id="${id}" data-label="Architecture"><div class="wide-wrap"><div class="bento-grid">${cards}</div></div></section>`;
}

export function renderEditorial(s, id) {
    const sub = s.subtitle || s.subtext ? `<p class="subtitle reveal" data-d="300">${esc(s.subtitle || s.subtext)}</p>` : '';
    return `<section class="slide slide--editorial" id="${id}" data-label="Divider"><div class="wide-wrap"><div class="editorial-header reveal"><span class="editorial-label">${esc(s.leftLabel || 'SECTION')}</span><span class="editorial-label">${esc(s.rightLabel || '01')}</span></div><div class="editorial-body reveal" data-d="200"><h1 class="mixed-weight"><strong>${esc(s.heading.split(' ')[0])}</strong> ${esc(s.heading.split(' ').slice(1).join(' '))}</h1>${sub}</div></div></section>`;
}
