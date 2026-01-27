# Guía de Arquitectura, Optimización y Buenas Prácticas

Este documento unifica los estándares de arquitectura, principios de diseño y estrategias de optimización para el desarrollo en CELAEST.

---

## 1. Arquitectura Clean en el Frontend Moderno

En lugar de capas tradicionales (Controller -> Service -> Repo), usamos la **Separación por Entornos**:

### A. Capa de Datos (Server Boundary)

- **Equivalente a:** Repository + Use Cases
- **Dónde:** `src/actions/*` y en Componentes `page.tsx` (Server Components).
- **Responsabilidad:** Interactuar con la DB (Supabase), validar permisos, ejecutar lógica de negocio pura.
- **Regla de Oro:** Aquí vive la "Verdad". **Nunca** confiamos en lo que envía el cliente sin re-validar.

### B. Capa de Presentación (Client Boundary)

- **Equivalente a:** UI / View
- **Dónde:** `components/*` (con `"use client"`).
- **Responsabilidad:** Mostrar datos, capturar eventos del usuario, gestionar estado visual (Zustand).
- **Regla:** Componentes "tontos" (Dumb Components). Reciben datos y emiten eventos (o llaman Server Actions).

### C. Screaming Architecture (Estructura de Carpetas)

La estructura del proyecto debe "gritar" el negocio, no la tecnología.

- `src/features/billing`
- `src/features/licenses`
- `src/features/users`

Dentro de cada feature:

- `/components`: UI (Client/Server)
- `/services`: Lógica de negocio y acceso a datos (Agnóstico de UI)
- `/hooks`: Lógica de estado (Zustand/React)
- `/actions`: Server Actions (Entry points)

---

## 2. Arquitectura de Componentes & UI

### A. Componentes "Headless" y Accesibles

- **No reinventamos la rueda.** Usamos primitivas de `radix-ui` (vía `shadcn/ui`) para garantizar accesibilidad (ARIA, foco, teclado) desde el día 1.
- **Teclado:** Todo componente interactivo debe ser operable con `Tab`, `Enter` y `Esc`.

### B. Skeleton UI & Suspense

- Evita el "Layout Shift" (saltos de contenido visual).
- Usa `loading.tsx` o `<Suspense fallback={<Skeleton />}>` para envolver secciones asíncronas.
- **Importante:** La estructura del Skeleton debe coincidir visualmente con el contenido final para reducir la carga cognitiva.

### C. Optimistic UI (La Regla de los 100ms)

- Usa `useOptimistic` para mutaciones.
- La UI debe reaccionar al click **inmediatamente**, asumiendo éxito. Si la operación falla, se revierte el estado automáticamente.

---

## 3. Manejo de Formularios (React Hook Form + Zod)

El estándar para formularios complejos, seguros y performantes.

1.  **Validación Dual:** Definimos el schema con **Zod** una vez (`createUserSchema`) y lo usamos:
    - En el **Cliente**: Para feedback visual inmediato.
    - En el **Servidor**: Para seguridad real antes de procesar datos.
2.  **Componentes:** Usamos `shadcn/ui` (`Form`, `FormControl`) que integran React Hook Form.
3.  **Flujo:**
    - Hook: `useForm<z.infer<typeof schema>>`
    - Submit: Llama a una **Server Action**.

---

## 4. Principios SOLID en React

### S - Single Responsibility Principle (SRP)

- **Mal:** Un componente `UserDashboard.tsx` que hace fetch, valida formularios y gestiona modales.
- **Bien:**
  - `DashboardPage.tsx` (Server): Obtiene datos.
  - `UserTable.tsx` (Client): Muestra la lista.
  - `CreateUserForm.tsx` (Client): Gestiona el formulario.
  - `createUserAction.ts` (Server): Guarda en la BD.

### O - Open/Closed Principle

- **Aplicación:** Usa composición (`children` prop) en lugar de booleanos excesivos ("Prop Drilling" de configuración).
- **Ejemplo:** En lugar de `<Card isUserCard />`, usa `<Card><UserContent /></Card>`.

### L - Liskov Substitution Principle

- **Aplicación:** Si un componente acepta `className` o `style`, debe comportarse como un elemento HTML estándar. No rompas las expectativas de las props nativas.

### I - Interface Segregation

- **Aplicación:** No pases el objeto `user` entero (con password, logs, etc.) a un componente que solo necesita `user.avatarUrl`. Mapea los datos antes de bajarlos al cliente.

### D - Dependency Inversion

- **Aplicación:** Los componentes de UI (ej. "Detalle de Licencia") no deben saber _cómo_ se borra una licencia. Deben recibir una función `onDelete` (o una Server Action) como prop.

---

## 5. Clean Code, DRY & Seguridad

### El "Falso" DRY

- **Cuidado:** No abstraigas código solo porque "se parece". Si dos Server Actions hacen cosas similares pero _cambian por razones diferentes_ (ej: `createAdmin` vs `createClient`), **MANTENLAS SEPARADAS**.

### Prácticas de Seguridad

1.  **Validación en Servidor:** NUNCA confíes en las validaciones del cliente. Zod en Server Actions es obligatorio.
2.  **Autenticación Explicita:** Verifica `getUser()` o `checkSession()` al inicio de **CADA** Server Action.
3.  **Priorización:** Ante la duda, prioriza **SEO, Performance y Seguridad** sobre DRY.

---

## 6. Estrategias de Optimización (Archivos Grandes & Rendering)

Para archivos que superan las 1000 líneas o vistas complejas (ej. Dashboards, Marketplaces):

### Descomposición "Container/Presenter"

Divide y vencerás.

- **Container:** Hooks personalizados (`useProducts`, `useSearch`) que manejan la lógica y el estado.
- **Presenters:** Componentes visuales puros (`MarketplaceHero`, `VideoDemoSection`) que solo reciben props.

### Optimización de Renderizado

1.  **React.memo:** Úsalo en componentes hijos puramente visuales (Header, Footer estático) para evitar re-renders cuando el padre cambia de estado.
2.  **Virtualización:** Si renderizas listas de >50 elementos, usa librerías como `react-window` o paginación eficiente.
3.  **useMemo / useCallback:**
    - `useMemo`: Para cálculos pesados (filtrado de arrays grandes).
    - `useCallback`: Para funciones que se pasan como props a componentes memorizados.

### SEO & Metadata

- **Server Components:** Mantén las páginas (`page.tsx`) como Server Components para generar el HTML inicial crítico para SEO.
- **Metadata API:** Usa `export const metadata` para definir títulos y descripciones dinámicas.
- **Semántica HTML:** Usa `<main>`, `<article>`, `<section>`, `<h1>` correctamente. Evita el "div soup".

### Imágenes

- Usa siempre `<Image />` de Next.js.
- Define `width` y `height` o usa `fill` para evitar Layout Shift (CLS).
- Usa formatos modernos (`webp`) automáticamente vía Next.js.

---

## 7. Escalabilidad de Sistema y Abstracción Global

Para escalar de un MVP a un producto empresarial, debemos pensar como "Optimizadores de Tareas Responsivas" y "Arquitectos de Sistemas".

### A. Abstracción de Componentes Globales (Global Component Abstraction)

- **Problema:** Repetir la misma estructura HTML/CSS para Tablas, Cards o Modales en 10 features diferentes hace imposible mantener un diseño consistente. Si cambias el borde de una tabla, tienes que editar 50 archivos.
- **Solución:** Promover patrones repetitivos a la carpeta `src/components/ui` o `src/features/shared/components`.
- **Ejemplo:** En lugar de `<table>...</table>` con 20 clases en cada archivo, usa un componente `<DataTable />` o primitivas globales (`<Table>`, `<TableHeader>`, etc.) que encapsulen el estilo base.
- **Beneficio:**
  1.  **Mantenibilidad:** Un cambio en el componente global se replica en todo el sistema.
  2.  **Velocidad:** El desarrollador no piensa en CSS, solo "ensambla" bloques pre-diseñados.
  3.  **Consistencia:** Todas las tablas se comportan igual (márgenes, fuentes, hovers).

### B. Tokens de Diseño y Atomic Design

- No hardcodees colores (`bg-blue-500`). Usa variables semánticas (`bg-primary`) o componentes que ya las traigan integradas.
- Esto permite cambiar el "Theme" (Dark/Light o Rebranding) sin tocar el código.
