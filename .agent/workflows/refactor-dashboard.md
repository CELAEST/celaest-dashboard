---
description: Refactor a Dashboard Component using Enterprise Bespoke SVGs (CELAEST Standard)
---

# Dashboard Refactoring Workflow (CELAEST Enterprise Standard)

This workflow outlines the precise, hyper-premium standards for refactoring or building new dashboard components. When invoked, the AI must abandon generic component libraries (like Recharts default shapes) and implement strictly bespoke, math-driven, glassmorphic interfaces.

## 1. Rule of Engagement: Image-Driven Scoping
*   **Strict Scope:** Only modify components, cards, or sections that the user explicitly provides an image reference (screenshot) for.
*   **Do Not Touch:** If a surrounding component or layout element is NOT explicitly highlighted or requested via an image, LEAVE IT AS IS. Protect the underlying dashboard architecture.
*   **Flex Architecture:** Always respect the parent container limits (typically `flex-1 min-h-0 relative`). Build visuals that flex and scale into the empty space without breaking the zero-scroll matrix layout.

## 2. The "Enterprise" Aesthetic Standard
*   **Iconography "Jewel Boxes":** Do not use plain Phosphor icons. Wrap top-level KPI icons in a 28x28px (`w-7 h-7`) `rounded-[8px]` dual-shadow glassmorphic box:
    *   *Dark Mode:* `bg-linear-to-b from-white/8 to-transparent border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)]`
    *   *Light Mode:* `bg-linear-to-b from-white to-gray-50 border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05)]`
*   **Drop Generic Libraries:** Remove generic Recharts (or similar) shapes (`<Pie>`, `<Bar>`, `<Line>`) unless specifically requesting purely functional raw data tooltips. For primary visual centerpieces like the "Asset Mix", discard Recharts completely.
*   **Holographic SVGs:** Write SVGs from scratch. Use `<defs>` for `feGaussianBlur` glows and `linearGradient` masks.
*   **Technical HUD Feel:** Introduce elements of a Heads-Up Display:
    *   Rotisseries: Layered `<circle strokeDasharray="..." />` elements rotating at different speeds (`360`, `-360`).
    *   Telemetry Markers: Include tiny `fontFamily="monospace"` coordinates, version numbers (`[v2.4]`), or status labels (`SYS.OP.01`) in the corners.
    *   Crosshairs & Nodes: Use `line` and `circle` primitives to draw technical targeting grids behind the core data.

## 3. Mathematical Interactivity
*   **Parametric Geometry:** Drive SVG shapes using actual data (e.g., mapping a dataset into a 360-degree `strokeDasharray` orbital ring using `2 * Math.PI * r`).
*   **Framer Motion:** Every custom SVG must breathe. Animate stroke paths (`strokeDashoffset`), rotation, opacity pulses, and positional translations (`y: [-2, 2, -2]`) via `motion/react`.

## 4. Execution Protocol
1.  **Analyze the User Image:** Identity the exact shape, color palette, and intention of the specific component to be upgraded.
2.  **Scaffold the Bespoke SVG:** Create a highly isolated React component (e.g., `<BespokeRadarVisual />`) that calculates its own paths, colors, and motion.
3.  **Inject and Verify:** Drop the `<BespokeRadarVisual />` into the specific container, set the wrapper to `w-full h-full absolute/relative flex items-center`, and take a screenshot to verify with the user.
