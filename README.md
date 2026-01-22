# CELAEST Dashboard

Dashboard administrativo profesional construido con Next.js 16, React 19, y Supabase.

## Tecnologías

- **Framework:** Next.js 16.1.4 (App Router + Turbopack)
- **React:** 19.2.3
- **Estilos:** Tailwind CSS 4
- **UI Components:** Radix UI + Shadcn/ui
- **Base de datos:** Supabase
- **Animaciones:** Motion (Framer Motion)
- **Gráficos:** Recharts

##  Instalación Local

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd celaest-dashboard-next

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev
```

## 🌐 Despliegue en Vercel

### Opción 1: Deploy automático (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/celaest-dashboard-next)

### Opción 2: Deploy manual

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Iniciar sesión en Vercel:**
   ```bash
   vercel login
   ```

3. **Desplegar:**
   ```bash
   vercel
   ```

4. **Para producción:**
   ```bash
   vercel --prod
   ```

### Opción 3: Conectar repositorio en Vercel Dashboard

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio de GitHub/GitLab/Bitbucket
3. Vercel detectará automáticamente que es un proyecto Next.js
4. Configura las variables de entorno (ver sección siguiente)
5. Click en "Deploy"

##  Variables de Entorno en Vercel

Configura estas variables en **Vercel Dashboard > Tu Proyecto > Settings > Environment Variables**:

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase | ✅ |

>  **Importante:** Las variables con prefijo `NEXT_PUBLIC_` son expuestas al navegador.

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes reutilizables
│   ├── figma/            # Componentes de Figma
│   ├── icons/            # Iconos
│   └── ui/               # Componentes UI (Shadcn)
├── features/             # Módulos por funcionalidad
│   ├── analytics/        # Análisis y métricas
│   ├── assets/           # Gestión de activos
│   ├── auth/             # Autenticación
│   ├── billing/          # Facturación
│   ├── licensing/        # Licencias
│   ├── marketplace/      # Marketplace
│   ├── releases/         # Releases
│   ├── shared/           # Componentes compartidos
│   └── users/            # Gestión de usuarios
├── lib/                  # Utilidades y configuraciones
└── providers/            # Providers de React
```

##  Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar ESLint
```

##  Checklist Pre-Deploy

- [ ] Variables de entorno configuradas en Vercel
- [ ] Supabase configurado con las tablas necesarias
- [ ] URL de dominio agregada en Supabase (Authentication > URL Configuration)
- [ ] Build local exitoso (`npm run build`)

##  Solución de Problemas

### Error de variables de entorno
Si ves advertencias sobre variables de Supabase faltantes:
1. Verifica que las variables estén configuradas en Vercel
2. Re-despliega el proyecto después de agregar variables

### Error de imágenes externas
Las imágenes de Unsplash y Supabase están configuradas en `next.config.ts`. Si necesitas agregar más dominios:

```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'tu-dominio.com' },
  ],
}
```

## 📄 Licencia

Proyecto privado - Todos los derechos reservados.

