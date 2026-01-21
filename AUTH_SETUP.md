# CELAEST Dashboard - Configuración de Autenticación

## Configuración de Supabase

### 1. Crear un proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que el proyecto se inicialice (toma unos 2 minutos)

### 2. Obtener las credenciales

1. Ve a **Settings** → **API** en tu proyecto de Supabase
2. Copia los siguientes valores:
   - **Project URL**: `https://tu-proyecto.supabase.co`
   - **anon/public key**: La clave pública que empieza con `eyJ...`

### 3. Configurar variables de entorno

1. Crea un archivo `.env.local` en la raíz del proyecto:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` con tus credenciales:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

### 4. Configurar la autenticación en Supabase

1. Ve a **Authentication** → **Providers** en Supabase
2. Habilita **Email** como proveedor de autenticación
3. (Opcional) Configura la URL de confirmación:
   - Ve a **Authentication** → **URL Configuration**
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**`

### 5. Crear la tabla de usuarios (opcional)

Si quieres almacenar información adicional de usuarios:

```sql
-- Ejecuta esto en el SQL Editor de Supabase
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  role TEXT DEFAULT 'client',
  scopes JSONB DEFAULT '{"marketplace:purchase": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, scopes)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(
      (NEW.raw_user_meta_data->>'scopes')::jsonb,
      '{"marketplace:purchase": true}'::jsonb
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 6. Iniciar el proyecto

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Características de Autenticación

- ✅ **Login/Register con Split Screen**: Diseño moderno con transición animada
- ✅ **Autenticación con Supabase**: Segura y escalable
- ✅ **Gestión de sesiones**: Persistencia automática
- ✅ **Roles y permisos**: Super Admin, Admin, Client
- ✅ **Scopes granulares**: Control de acceso por funcionalidad
- ✅ **Theme-aware**: Adapta al modo oscuro/claro

## Roles y Permisos

### Super Admin
- Acceso total al sistema
- Gestión de usuarios
- Todas las funcionalidades

### Admin
- Lectura de datos
- Compras en marketplace
- Sin gestión de usuarios

### Client
- Acceso básico
- Compras en marketplace

## Solución de Problemas

### Error: "Invalid API key"
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de reiniciar el servidor después de cambiar `.env.local`

### Error: "User already registered"
- El email ya está en uso
- Usa la opción de "Sign in" en lugar de "Sign up"

### No recibo el email de confirmación
- Verifica en spam/correo no deseado
- Para desarrollo, desactiva la confirmación de email en Supabase:
  - **Authentication** → **Providers** → **Email** → Desactiva "Confirm email"

## Próximos Pasos

1. Personaliza los scopes según tus necesidades
2. Configura OAuth providers (Google, GitHub) si lo necesitas
3. Implementa la tabla de perfiles para datos adicionales
4. Agrega recuperación de contraseña
