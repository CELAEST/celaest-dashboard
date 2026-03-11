---
applyTo: "**/features/**/components/modals/**"
---

# Modal Design System — Celaest Dashboard

## Regla fundamental
Cada feature tiene **UN único color de acento**. Ese color se aplica de forma consistente en todo el modal: header, footer, botones, badges, bordes. **Nunca mezclar dos colores de acento en el mismo modal**.

---

## Mapa global de colores por feature

| Feature | Color Tailwind | RGB para inline styles |
|---|---|---|
| `marketplace` | `emerald` (verde) | `rgba(16,185,129,…)` |
| `assets` | `blue` (azul) | `rgba(59,130,246,…)` |
| `releases` | `violet` (violeta) | `rgba(139,92,246,…)` |
| `licensing` | `amber` (dorado) | `rgba(245,158,11,…)` |
| `billing` | `purple` (morado) | `rgba(168,85,247,…)` |

Al crear un modal en una feature nueva, asignarle un color que **no esté en esta tabla** y añadirlo aquí.

---

## Estructura del modal (patrón Release-style)

El wrapper ya está implementado en `BillingModal` (`src/features/billing/components/modals/shared/BillingModal.tsx`). **Siempre usar `<BillingModal>` como wrapper externo**; nunca reimplementar portales ni AnimatePresence.

```tsx
<BillingModal isOpen={isOpen} onClose={onClose} className="max-w-{N}" showCloseButton={false}>
  {/* 1. Línea de acento superior */}
  {/* 2. Corner glow */}
  {/* 3. Header */}
  {/* 4. Contenido */}
  {/* 5. Footer */}
</BillingModal>
```

---

## 1 — Línea de acento superior (top accent)

```tsx
<div className="absolute inset-x-0 top-0 h-px z-20 bg-linear-to-r from-transparent via-{color}-500/70 to-transparent" />
```

---

## 2 — Corner glow (top-right)

```tsx
<div
  style={{
    position: "absolute",
    top: 0,
    right: 0,
    width: "22rem",
    height: "22rem",
    background: "radial-gradient(circle at top right, rgba({RGB},0.06), transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  }}
/>
```

---

## 3 — Header

```tsx
<div className="relative px-8 py-6 border-b border-white/8 flex items-center justify-between overflow-hidden shrink-0">
  {/* Gradient wash */}
  <div className="absolute inset-0 bg-linear-to-r from-{color}-500/10 via-{color}-600/8 to-transparent" />
  {/* Grid dots */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
      backgroundSize: "20px 20px",
      pointerEvents: "none",
    }}
  />
  {/* Bottom accent line */}
  <div className="absolute bottom-0 left-0 h-px w-2/5 bg-linear-to-r from-{color}-500/50 to-transparent" />

  <div className="relative z-10 flex items-center gap-4">
    {/* Icon badge */}
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#111] text-{color}-400 border border-white/10 shadow-lg shadow-{color}-500/10">
      <PhosphorIcon size={22} />
    </div>
    <div>
      <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">Título</h2>
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Subtítulo</p>
    </div>
  </div>

  {/* Close button */}
  <div className="relative z-10">
    <button onClick={onClose} className="p-2 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/10">
      <X size={22} />
    </button>
  </div>
</div>
```

---

## 4 — Contenido (área scrollable)

```tsx
<div className="px-8 py-6 flex-1 min-h-0 overflow-y-auto">
  {/* campos, stats, secciones */}
</div>
```

### Inputs / campos
```tsx
<input className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm focus:outline-none focus:border-{color}-500/50 focus:ring-1 focus:ring-{color}-500/20 transition-colors placeholder:text-white/20" />
```

### Labels sobre campos
```tsx
<label className="text-[10px] uppercase font-black tracking-widest text-white/40">Label</label>
```

### Secciones internas
```tsx
<div className="space-y-3">
  <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">Sección</h3>
  {/* contenido */}
</div>
```

---

## 5 — Footer

El footer tiene su propio mini acento superior y glow inferior. **Mismo color que el resto del modal**.

```tsx
<div className="relative shrink-0 overflow-hidden">
  {/* Top accent */}
  <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-{color}-500/50 to-transparent" />
  {/* Bottom glow */}
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "18rem",
      height: "8rem",
      background: "radial-gradient(circle at bottom left, rgba({RGB},0.07), transparent 70%)",
      pointerEvents: "none",
    }}
  />
  <div className="relative px-8 py-5 flex gap-3">
    {/* Botón fantasma (cancelar) */}
    <button className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/10 transition-colors">
      Cancel
    </button>
    {/* Botón primario */}
    <button className="flex-1 py-3 rounded-2xl bg-linear-to-r from-{color}-500 to-{color}-600 text-black text-sm font-black uppercase tracking-wide shadow-[0_0_20px_rgba({RGB},0.3)] hover:shadow-[0_0_30px_rgba({RGB},0.5)] transition-all flex items-center justify-center gap-2">
      <PhosphorIcon size={16} />
      Acción
    </button>
  </div>
</div>
```

> **Nota**: Si el botón primario es de color oscuro (cyan, emerald, blue, violet) y el texto no es legible en negro, usar `text-white` en su lugar. Cyan usa `text-black`; violet y purple usan `text-white`.

---

## Footer informativo (sin acciones)

Para modales de detalle que muestran metadata en el footer:

```tsx
<div className="relative shrink-0 overflow-hidden">
  <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-{color}-500/50 to-transparent" />
  <div
    style={{
      position: "absolute", bottom: 0, left: 0, width: "16rem", height: "7rem",
      background: "radial-gradient(circle at bottom left, rgba({RGB},0.07), transparent 70%)",
      pointerEvents: "none",
    }}
  />
  <div className="relative px-6 py-4 flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-{color}-500/10 text-{color}-400 border border-{color}-500/20">
        <PhosphorIcon size={14} />
      </div>
      <div>
        <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30 mb-0.5">Label</p>
        <p className="text-sm font-mono text-white/60 tracking-wider">valor</p>
      </div>
    </div>
    <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-{color}-400/70 bg-{color}-500/10 border border-{color}-500/20 px-2.5 py-1 rounded-lg">
      badge
    </div>
  </div>
</div>
```

---

## Checklist al crear o modificar un modal

- [ ] Usar `<BillingModal>` como wrapper
- [ ] Identificar el color correcto de la feature en el mapa global
- [ ] Aplicar ese color de forma consistente: top accent, corner glow, header gradient, icon badge, inputs focus, footer accent, botón primario
- [ ] **No mezclar colores de acento** de distintas features en el mismo modal
- [ ] Iconos siempre de `@phosphor-icons/react` (nunca lucide-react, heroicons u otros)
- [ ] Clases Tailwind v4: `border-white/8`, `max-w-128`, `bg-linear-to-r`, sin `[]` para valores estándar
