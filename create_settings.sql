CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permitir lectura y escritura libre (para el MVP)
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;

-- Insertar configuración por defecto
INSERT INTO public.site_settings (key, value) VALUES 
('profile_image_url', ''),
('hero_title', 'Dra. Rosita Ysela Maza Suxe'),
('hero_bio', 'Soy abogada titulada por la Universidad..., con especialización en Derecho Civil y Penal. Mi compromiso es brindarte una defensa transparente, honesta y eficaz.'),
('contact_phone', '+51 999 999 999'),
('contact_email', 'contacto@rosius.pe'),
('contact_address', 'Av. Principal 123, Lima, Perú');
