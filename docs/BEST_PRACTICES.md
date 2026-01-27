# Secretos para la Excelencia ("Como una Uva")

Esta lista cubre esos detalles finos que separan un proyecto "bueno" de uno **de clase mundial**.

## 1. UX Invisible (Lo que se siente pero no se ve)

### A. La Regla de los 100ms (Optimistic UI)

- **Problema:** El usuario hace click en "Guardar" y espera 1 segundo a que la DB responda. Se siente "lento".
- **Solución:** Usa `useOptimistic`.
  - Al hacer click, la UI cambia INMEDIATAMENTE al estado de éxito.
  - Si el servidor falla 2 segundos después, la UI se revierte automáticamente y muestra un toast de error.
  - _El usuario percibe latencia cero._

### B. Skeleton Screens Inteligentes

- **No:** Un spinner gigante en medio de la pantalla.
- **Sí:** `loading.tsx` que replica exactamente la estructura del layout (Header, Sidebar, Grid de Cards) en gris pulsante. Evita el "Cumulative Layout Shift" (CLS).

### C. Teclado como Ciudadano de Primera

- Todo modal debe cerrar con `Esc`.
- Todo formulario debe enviar con `Enter` (sin tener que hacer click en "Guardar").
- El foco (`tab`) debe ser lógico. Usa `autoFocus` en el input más importante al abrir un modal.

---

## 2. Rendimiento Extremo

### A. Fuentes (Fonts)

- **Olvidados:** Cargar fuentes de Google Fonts vía CSS externo bloquea el renderizado.
- **Pro Tip:** Usa `next/font`. Next.js descarga la fuente en el build, la hostea localmente y elimina el "Flash of Unstyled Text" (FOUT) automáticamente.

### B. Imágenes y "LCP" (Largest Contentful Paint)

- **Error Común:** Usar `<img />` o `background-image` para la imagen principal (Hero).
- **Pro Tip:** Usa `<Image priority />` de Next.js para la imagen más grande visible al inicio. Esto le dice al navegador: "Deja todo y carga esto primero".

### C. Barrel Files (Archivos Barril)

- **Cuidado:** Evita `export * from './components'` en un `index.ts` gigante.
- **Por qué:** En entornos serverless, puede hacer que importar _un botón_ cargue en memoria _toda la librería de componentes_, ralentizando el arranque en frío (Cold Boot) de la Server Action.

---

## 3. Seguridad Paranoica

### A. "Safe-Guard" en Server Actions

- Nunca asumas que el usuario es quien dice ser solo porque está logueado.
- **Patrón:**
  ```typescript
  const user = await getUser();
  // ¿El usuario logueado es el DUEÑO del recurso que intenta borrar?
  if (resource.ownerId !== user.id) throw new Error("Unauthorized");
  ```
  (A veces protegemos la ruta `/admin`, pero olvidamos proteger la acción `deleteUser`).

### B. Zod no es solo para el Formulario

- Usa `.parse()` de Zod también para la respuesta de tus APIs externas o DB.
- Si tu DB devuelve datos corruptos, es mejor que la App falle controladamente (Error Boundary) a que muestre datos "undefined" por toda la UI.

---

## 4. DX (Developer Experience) y Calidad de Código

### A. Strict Null Checks "Real"

- No uses `user?.name` por pereza si sabes que el usuario _debe_ existir ahí.
- Si el usuario es `null` en un lugar imposible, lanza un error (`invariant`). Eso te ayuda a encontrar bugs lógicos rápido en lugar de esconderlos bajo alfombras de `undefined`.

### B. Comentarios: "Por qué", no "Qué"

- **Mal:** `// Suma a y b` (Obvio).
- **Bien:** `// Usamos Set aquí en lugar de Array porque la duplicidad de IDs causaba bugs en el reporte de Junio`.

### C. Feature Flags

- Pon un `if (FLAGS.USE_NEW_BILLING)` y vieja/nueva lógica conviviendo. Si la nueva falla en producción, apagas el flag en 1 segundo sin revertir código.

---

## 5. Refactoring Guidelines

### A. Preserve Design

- **Rule:** When refactoring logic or file structure, **DO NOT** alter the visual design (CSS, layout, or DOM structure) unless explicitly requested.
- **Context:** "Refactoring" means changing the _structure_ of the code, not its _behavior_ or _appearance_.

### B. Avoid Over-engineering

- **Rule:** Avoid adding unnecessary abstractions or complex patterns where simple ones suffice. Stick to the known requirements.

### C. Design Stability

- **Rule:** If a design is working and polished, treat it as a constraint. Do not "optimize" it visually without user consent.

MUYYY IMPORTANTE, NO HAGAS SOBREINGENIERIA, RESALTA ESTO, NECESITO TODO MUY LIMPIO CON MUY BUENAS PRACTICAS 
