-- Ejecuta este script en el SQL Editor de Supabase para tener datos de prueba y validar el funcionamiento del buscador

-- 1. Insertar un Cliente de prueba
INSERT INTO public.clients (id, dni, full_name, email, phone)
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    '12345678', 
    'Juan Pérez de Prueba', 
    'juan@ejemplo.com', 
    '999888777'
) ON CONFLICT (dni) DO NOTHING;

-- 2. Insertar un Caso de prueba asignado al cliente
INSERT INTO public.cases (id, client_id, code, subject_type, status)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'EXP-2026-001',
    'Demanda por Alimentos',
    'En Proceso'
) ON CONFLICT (code) DO NOTHING;

-- 3. Insertar algunas actualizaciones del caso
INSERT INTO public.case_updates (case_id, description, is_internal_note)
VALUES 
    ('22222222-2222-2222-2222-222222222222', 'Demanda ingresada en mesa de partes', false),
    ('22222222-2222-2222-2222-222222222222', 'Auto admisorio emitido por el juez', false),
    ('22222222-2222-2222-2222-222222222222', 'Falta pagar el arancel (NOTA INTERNA, CLIENTE NO LO VE)', true);
