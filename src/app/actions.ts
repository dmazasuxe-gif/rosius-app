"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function submitContact(formData: FormData) {
  console.log("Contacto recibido:", Object.fromEntries(formData))
  return { success: true }
}

export async function lookupCase(formData: FormData) {
  const dni = formData.get("dni") as string
  const code = formData.get("code") as string
  
  if (!dni || dni.length !== 8) {
    return { error: "El DNI debe tener 8 dígitos." }
  }
  
  if (!code) {
    return { error: "El número de expediente es requerido." }
  }

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id")
    .eq("dni", dni)
    .single()

  if (clientError || !client) {
    return { error: "No se encontró el DNI." }
  }

  const { data: caseData, error: caseError } = await supabase
    .from("cases")
    .select("id")
    .eq("client_id", client.id)
    .eq("code", code)
    .single()

  if (caseError || !caseData) {
    return { error: "El expediente no coincide con el DNI ingresado." }
  }

  return { success: true, clientId: client.id }
}

export async function clientLogin(formData: FormData) {
  const username = (formData.get("username") as string)?.trim()
  const password = (formData.get("password") as string)?.trim()

  if (!username) {
    return { error: "Por favor, ingresa tu usuario o DNI." }
  }
  if (!password) {
    return { error: "Por favor, ingresa tu contraseña." }
  }

  // 1. Buscar cliente por DNI o Correo
  const isDni = /^\d{8}$/.test(username)
  const clientQuery = isDni
    ? supabase.from("clients").select("id, dni, full_name, password_hash").eq("dni", username).single()
    : supabase.from("clients").select("id, dni, full_name, password_hash").eq("email", username).single()

  const { data: client, error: clientError } = await clientQuery

  if (clientError || !client) {
    return { error: "Credenciales incorrectas. No se encontró el usuario ingresado." }
  }

  // 2. Verificar contraseña:
  // a) Si el cliente tiene password_hash configurado
  if (client.password_hash) {
    if (client.password_hash !== password) {
      return { error: "Contraseña incorrecta." }
    }
    return { success: true, clientId: client.id, clientName: client.full_name }
  }

  // b) Si no tiene contraseña aún, admitir el código de cualquiera de sus expedientes (ej. EXP-2026-001) o su propio DNI
  const { data: matchingCase } = await supabase
    .from("cases")
    .select("id")
    .eq("client_id", client.id)
    .eq("code", password)
    .single()

  if (matchingCase || password === client.dni) {
    return { success: true, clientId: client.id, clientName: client.full_name }
  }

  return { 
    error: "Contraseña incorrecta. (Nota: Si es tu primer ingreso, usa el código de tu expediente o solicita tu clave a soporte)." 
  }
}

export async function getAllCases() {
  const { data: cases, error } = await supabase
    .from("cases")
    .select("*, clients(*)")
    .order('created_at', { ascending: false })

  if (error) return []
  return cases
}

export async function getCaseUpdates(caseId: string) {
  const { data: updates, error } = await supabase
    .from("case_updates")
    .select("*")
    .eq("case_id", caseId)
    .order('created_at', { ascending: false })

  if (error) return []
  return updates
}

export interface CreateCaseParams {
  dni: string;
  phone?: string;
  full_name: string;
  email?: string;
  code: string;
  subject_type: string;
  fileName?: string | null;
  storagePath?: string | null;
}

export async function createCase({ dni, phone, full_name, email, code, subject_type, fileName, storagePath }: CreateCaseParams) {
  // 1. Buscar o crear cliente
  let clientTargetId: string | null = null

  const { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .eq("dni", dni)
    .single()

  if (existingClient) {
    clientTargetId = existingClient.id
  } else {
    const { data: newClient, error: createError } = await supabase
      .from("clients")
      .insert([{ dni, phone, full_name, email }])
      .select("id")
      .single()
    
    if (createError || !newClient) {
      return { error: "Error al crear el cliente: " + (createError?.message || '') }
    }
    clientTargetId = newClient.id
  }

  // 2. Crear el caso
  const { data: newCase, error: caseError } = await supabase
    .from("cases")
    .insert([{ 
      client_id: clientTargetId, 
      code, 
      subject_type,
      status: 'Caso recibido'
    }])
    .select("id")
    .single()

  if (caseError || !newCase) {
    return { error: "Error al crear el caso (¿El código ya existe?)" }
  }

  // 3. Crear primera actualización
  const updateDesc = fileName 
    ? `Expediente inicial registrado. [Documento adjunto: ${fileName}]`
    : `Expediente inicial registrado.`

  await supabase.from("case_updates").insert([{
    case_id: newCase.id,
    description: updateDesc,
    is_internal_note: false
  }])

  // 4. Guardar en tabla documents si se subió
  if (storagePath) {
    await supabase.from("documents").insert([{
      case_id: newCase.id,
      title: fileName,
      storage_path: storagePath,
      is_public_to_client: true
    }])
  }

  revalidatePath("/admin/casos")
  return { success: true }
}

export interface UpdateCaseStatusParams {
  caseId: string;
  status: string;
  updateText: string;
  isInternal: boolean;
  isPublicDoc: boolean;
  fileName?: string | null;
  storagePath?: string | null;
}

export async function updateCaseStatus({ caseId, status, updateText, isInternal, isPublicDoc, fileName, storagePath }: UpdateCaseStatusParams) {
  // 1. Actualizar estado del caso
  const { error: updateError } = await supabase
    .from("cases")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", caseId)

  if (updateError) {
    return { error: "No se pudo actualizar el estado del caso." }
  }

  // 2. Crear actualización
  const desc = fileName 
    ? `${updateText} [Documento adjunto: ${fileName}]` 
    : updateText

  const { error: insertError } = await supabase
    .from("case_updates")
    .insert([{
      case_id: caseId,
      description: desc,
      is_internal_note: isInternal
    }])

  if (insertError) {
    return { error: "No se pudo registrar la actualización." }
  }

  // 3. Guardar en tabla documents si se subió
  if (storagePath) {
    await supabase.from("documents").insert([{
      case_id: caseId,
      title: fileName,
      storage_path: storagePath,
      is_public_to_client: isPublicDoc
    }])
  }

  revalidatePath("/admin/casos")
  revalidatePath(`/consulta/[id]`, 'layout')
  return { success: true }
}

export async function deleteCase(caseId: string) {
  const { error } = await supabase
    .from("cases")
    .delete()
    .eq("id", caseId)

  if (error) {
    return { error: "Error al eliminar el caso." }
  }

  revalidatePath("/admin/casos")
  return { success: true }
}

export async function saveSettings(settings: Record<string, string>) {
  const updates = Object.keys(settings).map((key) => ({
    key,
    value: settings[key],
    updated_at: new Date().toISOString()
  }))
  
  const { error } = await supabase.from("site_settings").upsert(updates, { onConflict: 'key' })
  
  if (error) {
    return { error: "Error al guardar ajustes: " + error.message }
  }
  
  revalidatePath("/")
  revalidatePath("/login")
  revalidatePath("/admin/ajustes")
  revalidatePath("/admin/login-settings")
  return { success: true }
}
