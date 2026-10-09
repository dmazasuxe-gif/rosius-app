-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Clientes
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Opcional: si en el futuro tienen cuenta completa
    dni VARCHAR(8) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Casos
CREATE TABLE public.cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL, -- Ej: EXP-2023-001
    subject_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Caso recibido',
    latest_update TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Actuaciones / Historial de Casos
CREATE TABLE public.case_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    is_internal_note BOOLEAN DEFAULT false, -- Si es true, el cliente NUNCA la verá
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Documentos
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    is_public_to_client BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de Artículos y Actualidad Jurídica
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100),
    summary TEXT,
    content TEXT NOT NULL,
    author VARCHAR(100) DEFAULT 'ROSIUS',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla de Leyes y Normas
CREATE TABLE public.laws (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    norm_number VARCHAR(100),
    summary TEXT,
    content TEXT,
    valid_status VARCHAR(50), -- Vigente, Derogada, Modificada
    official_source_url TEXT,
    published_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) para proteger los datos
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laws ENABLE ROW LEVEL SECURITY;

-- Políticas iniciales (El administrador tiene acceso total)
-- Las políticas para clientes se ajustarán cuando implementemos el acceso por DNI + OTP.
CREATE POLICY "Public read access for published posts" ON public.posts
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public read access for laws" ON public.laws
    FOR SELECT USING (true);
