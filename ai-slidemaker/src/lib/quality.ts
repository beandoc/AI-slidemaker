import { SceneAST } from '@/store/editor-types';

export interface QualityReport {
    score: number;
    issues: { severity: 'critical' | 'warning', message: string }[];
}

export function validateScene(ast: SceneAST): QualityReport {
    const report: QualityReport = { score: 100, issues: [] };

    // 1. Check for empty sections
    if (ast.sections.length === 0) {
        report.issues.push({ severity: 'critical', message: 'Document has no sections.' });
        report.score -= 50;
    }

    // 2. Check for missing headings
    ast.sections.forEach((section, i) => {
        const hasHeading = section.blocks.some(b => b.type === 'text' && b.data.tag === 'h1');
        if (!hasHeading && section.layoutId === 'hero') {
            report.issues.push({ severity: 'warning', message: `Section ${i + 1} (Hero) missing high-level heading.` });
            report.score -= 5;
        }
    });

    // 3. Accessibility: Contrast (Simple check for light foreground on dark background)
    // In a real app, we'd use color-contrast library
    if (ast.config.theme.foreground === ast.config.theme.background) {
        report.issues.push({ severity: 'critical', message: 'Foreground and Background colors are the same (Zero contrast).' });
        report.score -= 40;
    }

    // 4. Mobile Layout
    ast.sections.forEach((section, i) => {
        if (section.blocks.length > 8) {
            report.issues.push({ severity: 'warning', message: `Section ${i + 1} has too many blocks (>8). May cause mobile overflow.` });
            report.score -= 10;
        }
    });

    return report;
}
