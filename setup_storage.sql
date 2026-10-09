-- 1. Crear el bucket 'documents' para almacenar los expedientes PDF
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true);

-- 2. Permitir que cualquier persona (público) pueda ver/descargar los documentos
create policy "Public Access to Documents"
  on storage.objects for select
  using ( bucket_id = 'documents' );

-- 3. Permitir que se puedan subir documentos libremente (para el MVP/Panel)
create policy "Allow Uploads to Documents"
  on storage.objects for insert
  with check ( bucket_id = 'documents' );

-- 4. Permitir eliminar/modificar documentos si es necesario
create policy "Allow Update/Delete to Documents"
  on storage.objects for update
  using ( bucket_id = 'documents' );

create policy "Allow Delete to Documents"
  on storage.objects for delete
  using ( bucket_id = 'documents' );
