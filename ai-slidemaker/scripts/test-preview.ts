import { SceneAST } from './src/store/editor-types';
import { generateProductionHTML } from './src/lib/export/vanilla-html/renderer';
import * as fs from 'fs';
import { exec } from 'child_process';

const sampleAST: SceneAST = {
    id: 'preview-sample',
    version: '2.0',
    title: 'Cinematic Preview',
    config: {
        archetype: 'neon-cyber',
        theme: {
            primary: '#38bdf8',
            secondary: '#0f172a',
            accent: '#34d399',
            background: '#0a0c10',
            foreground: '#ffffff',
            fonts: { headline: 'Outfit', body: 'Inter' }
        },
        typography: { baseSize: 16, scaleRatio: 1.25 },
        motion: { enabled: true, reducedMotion: false }
    },
    sections: [
        {
            id: 's1',
            layoutId: 'hero',
            blocks: [
                {
                    id: 'b1',
                    type: 'text',
                    data: { content: 'ANTIGRAVITY OS', tag: 'h1' },
                    style: { textAlign: 'center', fontWeight: 900, fontSize: '6rem' }
                },
                {
                    id: 'b2',
                    type: 'text',
                    data: { content: 'The future of cinematic presentations is here.', tag: 'p' },
                    style: { textAlign: 'center', color: '#94a3b8' }
                }
            ],
            background: { type: 'color', value: '#0a0c10', opacity: 1 },
            animation: { scrollTrigger: true, transition: 'slide' }
        },
        {
            id: 's2',
            layoutId: 'split',
            blocks: [
                {
                    id: 'b3',
                    type: 'image',
                    data: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80', fit: 'cover' },
                    style: { borderRadius: '2rem' }
                },
                {
                    id: 'b4',
                    type: 'text',
                    data: { content: 'Neural Architecture', tag: 'h2' },
                    style: { textAlign: 'left', fontWeight: 800 }
                },
                {
                    id: 'b5',
                    type: 'text',
                    data: { content: 'Deep integration with generative models ensures your content is always fresh and structurally sound.', tag: 'p' },
                    style: { textAlign: 'left', color: '#64748b' }
                }
            ],
            background: { type: 'color', value: '#0d1117', opacity: 1 }
        }
    ],
    assets: {}
};

const html = generateProductionHTML(sampleAST);
fs.writeFileSync('preview_demo.html', html);
console.log('Preview generated: preview_demo.html');
exec('open preview_demo.html');
