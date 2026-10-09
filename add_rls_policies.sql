-- 1. Habilitar lectura pública para Clientes (Necesario para que el panel admin y la búsqueda de DNI funcionen con la anon key)
CREATE POLICY "Allow public read access for clients" ON public.clients
    FOR SELECT USING (true);

-- 2. Habilitar lectura pública para Casos
CREATE POLICY "Allow public read access for cases" ON public.cases
    FOR SELECT USING (true);

-- 3. Habilitar lectura pública para Actualizaciones de Casos
CREATE POLICY "Allow public read access for case_updates" ON public.case_updates
    FOR SELECT USING (true);

-- Nota: Estas políticas permiten que cualquier persona con la anon_key lea los datos. 
-- En un entorno de producción real, el panel de administrador debería usar un usuario autenticado (auth.uid()) 
-- o usar la llave SERVICE_ROLE para saltarse el RLS, y la búsqueda pública solo debería permitir ver el caso 
-- si se conoce el DNI y el código OTP correcto.
