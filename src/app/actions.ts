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

export async function createCase({ dni, phone, full_name, email, code, subject_type, fileName, storagePath }: any) {
  // 1. Buscar o crear cliente
  let { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id")
    .eq("dni", dni)
    .single()

  if (clientError || !client) {
    const { data: newClient, error: createError } = await supabase
      .from("clients")
      .insert([{ dni, phone, full_name, email }])
      .select("id")
      .single()
    
    if (createError || !newClient) {
      return { error: "Error al crear el cliente: " + (createError?.message || '') }
    }
    client = newClient
  }

  // 2. Crear el caso
  const { data: newCase, error: caseError } = await supabase
    .from("cases")
    .insert([{ 
      client_id: client.id, 
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

  // 5. Guardar en tabla documents si se subió
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

export async function updateCaseStatus({ caseId, status, updateText, isInternal, isPublicDoc, fileName, storagePath }: any) {
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

  // 4. Guardar en tabla documents si se subió
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

export async function saveSettings(settings: any) {
  const updates = Object.keys(settings).map((key) => ({
    key,
    value: settings[key],
    updated_at: new Date().toISOString()
  }))
  
  const { error } = await supabase.from("site_settings").upsert(updates, { onConflict: 'key' })
  
  if (error) {
    return { error: "Error al guardar ajustes." }
  }
  
  revalidatePath("/")
  return { success: true }
}
