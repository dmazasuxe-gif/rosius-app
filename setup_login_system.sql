-- ====================================================================
-- SISTEMA DE INICIO DE SESIÓN PERSONALIZABLE (ESTILO TRILCE UCV)
-- ====================================================================

-- 1. Asegurar tabla site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permitir lectura y modificación (desactivar RLS para site_settings en este MVP)
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;

-- 2. Asegurar columna de contraseña para clientes (opcional)
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 3. Insertar configuraciones iniciales del Login estilo UCV
INSERT INTO public.site_settings (key, value) VALUES
('login_badge_text', 'Trilce UCV'),
('login_badge_logo_url', '/ucv-logo.png'),
('login_welcome_label', 'BIENVENIDO A'),
('login_welcome_title', 'TRILCE UCV'),
('login_title', 'Iniciar sesión'),
('login_subtitle', 'Bienvenido de nuevo. Ingrese sus credenciales para continuar.'),
('login_username_placeholder', 'Usuario o DNI*'),
('login_password_placeholder', 'Contraseña*'),
('login_forgot_password_text', '¿Olvidaste tu contraseña o nombre de usuario?'),
('login_forgot_password_url', 'https://wa.me/51999999999?text=Hola,%20olvide%20mis%20credenciales'),
('login_google_btn_text', 'Acceder con Google'),
('login_google_enabled', 'true'),
('login_manual_text', 'Manual del usuario'),
('login_manual_link_text', 'Descargar tutorial'),
('login_manual_url', '#'),
('login_help_text', '¿Necesitas ayuda?'),
('login_help_url', 'https://wa.me/51999999999?text=Hola,%20necesito%20ayuda%20para%20iniciar%20sesion'),
('login_primary_color', '#d31027'),
('login_secondary_color', '#0c2340'),
('login_slides', '[{"id":"1","imageUrl":"/slides/slide-1.jpg","tag":"Campus","title":"Ate"},{"id":"2","imageUrl":"/slides/slide-2.jpg","tag":"Facultad","title":"Derecho y Biblioteca"}]')
ON CONFLICT (key) DO NOTHING;
