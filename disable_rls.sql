-- Desactivar temporalmente RLS (Seguridad a Nivel de Fila) 
-- para permitir que el MVP funcione sin autenticación estricta configurada
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_updates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents DISABLE ROW LEVEL SECURITY;
