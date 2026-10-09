# PROJECT AGENT RULES: CELAEST Dashboard

> **Mandate**: This document defines the permanent, non-negotiable engineering and architectural rules for all AI agents working on this codebase.

---

## 1. Non-Negotiable Aesthetics & Enterprise Luxury UI (Lingua Standard)
1. **Zero-AI-Slop Manifesto**: Strictly avoid generic AI aesthetics.
   - **No vibrant/neon colors**: No saturated cyans or generic crypto gradients. Deep obsidian palette (`#040811`, `#080c14`, `#0b101b`) with pure luminance contrast (`text-white`, `text-white/80`, `text-white/50`, `text-white/20`).
   - **No AI status dots ("bolitas")**: Never use colored radio circles or dot indicators for selection. Use clean typographic hierarchy and subtle background luminance (`bg-white/[0.05]`).
   - **No border clutter**: Eradicate `border border-white/10` or colored borders around every element. Achieve elevation with deep glassmorphism (`backdrop-blur-2xl`) and diffused ambient shadows.
   - **Floating micro-typography**: Metadata, tags, and categories must be floating clean typography (`text-[10px] font-mono tracking-[0.18em] uppercase text-white/40`), never colored pill boxes.
   - **No aggressive hover jumps**: Avoid `hover:-translate-y-1 hover:scale-[1.02]`. Use smooth luminance shifts (`transition-colors duration-200`).
2. **Zero Feature Modification**: Never add or remove business logic or features when refactoring UI. All filters, search debounce, pagination, purchase flow, and modal states must remain 100% functionally identical.
3. **UI / Styling Fast-Track**: When working on visual design, CSS, Tailwind, spacing, or UI components, **NEVER** run heavy builds (`npm run build`) or unit test suites (`vitest`). Iterate in hot-reload mode via Next.js HMR.
4. **Zero Monoliths**: Every panel/card decomposed into atomic sub-components.
5. **i18n & Clean State**: No hardcoded UI strings; all data fetched through TanStack Query with user-isolated cache keys.

---

## 2. Dynamic On-Demand MCP Orchestration & Refined 5-Stage Pipeline

```mermaid
graph TD
    A[Requerimiento / Tarea] --> B[Análisis Inicial & AST]
    B -->|Serena / gopls| C[Lectura Quirúrgica por Rangos (StartLine/EndLine)]
    C --> D[Memoria de Contexto & Arquitectura]
    D --> E[Implementación Modular & Desacoplada]
    E --> F[Quality Gate Automatizado]
    F -->|tsc / vitest / Semgrep| G{¿Pasa 100%?}
    G -->|Fallo Detectado (Loop Auto-Reparación)| E
    G -->|100% Aprobado| H[Registro en Memoria Serena & Entrega]
```

### Directives:
1. **Targeted Reading**: Always inspect functions via targeted slices rather than reading entire 500+ line files.
2. **Surgical Diffs**: Modify with precise diffs (`replace_file_content`).
3. **Semgrep in Quality Gate**: Run static security scans during the post-implementation Quality Gate stage ($F$).
4. **Self-Healing Quality Gate ($F \xrightarrow{\text{Fallo}} E$)**:
   - Run `npx tsc --noEmit` + `npm test`.
   - If any test/build error occurs, auto-repair immediately before concluding the turn.
5. **Persistent Memory Gate**: Update Serena project memories and knowledge items to retain architectural continuity.
