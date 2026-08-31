# PROJECT AGENT RULES: CELAEST Dashboard

> **Mandate**: This document defines the permanent, non-negotiable engineering and architectural rules for all AI agents working on this codebase.

---

## 1. Non-Negotiable Aesthetics & Component Decomposition
1. **Hyper-Premium Enterprise UI**: Strictly follow bespoke SVGs, glassmorphism, and Apple SF Symbols standards.
2. **Zero Monoliths**: Every panel/card decomposed into atomic sub-components.
3. **i18n & Clean State**: No hardcoded UI strings; all data fetched through TanStack Query with user-isolated cache keys.

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
