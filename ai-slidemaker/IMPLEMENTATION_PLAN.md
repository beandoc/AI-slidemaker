# Professional AI Slidemaker: Architectural Overhaul & Feature Expansion

This plan outlines the re-architecture of the AI Slidemaker into a Canva-grade cinematic document engine.

## Phase 1: Core Foundation & Scene AST
The engine will move from a flat "slide" model to a hierarchical, validated Scene AST.

- **Storage**: `zustand` + `zundo` (for undo/redo).
- **Validation**: `Zod` schema for the AST to ensure data integrity.
- **AST Hierarchy**:
    - `Document`: Global config, title, metadata, shared assets.
    - `Section`: A full-screen viewport unit. Contains blocks, layout rules, and section-level animations.
    - `Block`: Atomic units (Text, Image, Chart, Video, KPI). Each has its own content, style, and animation properties.
    - `Assets`: A registry of used media with optimization metadata.
    - `Animations`: Declarative GSAP/Framer Motion configs.

## Phase 2: The "Canva-Style" Editor Shell
A triple-pane workspace designed for high productivity.

- **Left Pane (Navigator)**: Drag-and-drop section reordering using `@dnd-kit`. Section previews.
- **Center Stage**: The live renderer. Uses the AST to render React components. Supports focal-point selection and real-time content updates.
- **Right Pane (Inspector)**: Context-aware properties.
    - Typography (Pairing, Optical Scale).
    - Colors (Accent generator, Contrast checker).
    - Motion (Easing presets, Timeline triggers).
    - Media (Uploads, focal point, crops).

## Phase 3: Specialized Engine Implementations
1. **Typography Engine**:
    - Variable font support.
    - Pairing presets (e.g., "Luxury Agency", "High-Tech", "Classic Editorial").
    - Auto-flow: Responsive line-length constraints.
2. **Chart Engine**:
    - `ECharts` integration for responsive, interactive visualizations.
    - Native support for Bars, Lines, Areas, and Timelines.
    - Linked to Document Accent Color.
3. **Motion Engine**:
    - GSAP `ScrollTrigger` for section-to-section transitions.
    - `Framer Motion` for per-block entrance and intra-section interactions.
4. **Media Pipeline**:
    - Dominant color extraction for auto-theming background elements.
    - SVGO for inline vector optimization.

## Phase 4: Smart AI Orchestration
A tiered AI generation pipeline:
- **Tier 1 (Architect)**: Defines the narrative structure and section sequence.
- **Tier 2 (Visual Director)**: Generates styling tokens (fonts, colors, motion presets).
- **Tier 3 (QA Fixer)**: Post-processing to fix contrast, overflow, and timing issues.

## Phase 5: Production & Export
- **Export Modes**:
    - Portable: Single-file HTML with base64 assets.
    - Production: Optimized Next.js bundle / static export.
- **Quality Gates**: Automated checks for A11y (WCAG), performance (LCP/CLS), and visual jank before export.

## Phase 6: Collaboration & Polish
- Keyboard shortcuts (⌘K for command palette).
- Version history snapshots.
- Performance: Code splitting and intersection-lazy-loading for all blocks.
