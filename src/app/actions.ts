"use server"

import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"

export async function submitContact(formData: FormData) {
  // En un entorno real, esto insertaría en una tabla de mensajes o enviaría un email
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

  // Buscar cliente por DNI
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id")
    .eq("dni", dni)
    .single()

  if (clientError || !client) {
    return { error: "No se encontró el DNI." }
  }

  // Validar si ese cliente tiene el expediente indicado
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

export async function getClientCases(clientId: string) {
  const { data: cases, error } = await supabase
    .from("cases")
    .select("*, case_updates(*)")
    .eq("client_id", clientId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return cases || []
}

export async function getAllCases() {
  const { data: cases, error } = await supabase
    .from("cases")
    .select("*, clients(*)")
    .order('created_at', { ascending: false })

  if (error) return []
  return cases
}
