"use server"

import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"

export async function submitContact(formData: FormData) {
  // En un entorno real, esto insertaría en una tabla de mensajes o enviaría un email
  console.log("Contacto recibido:", Object.fromEntries(formData))
  return { success: true }
}

export async function lookupDni(formData: FormData) {
  const dni = formData.get("dni") as string
  
  if (!dni || dni.length !== 8) {
    return { error: "El DNI debe tener 8 dígitos." }
  }

  const { data: client, error } = await supabase
    .from("clients")
    .select("id")
    .eq("dni", dni)
    .single()

  if (error || !client) {
    return { error: "No se encontraron expedientes asociados a este DNI." }
  }

  // En un entorno real, enviaríamos un OTP. Aquí simulamos éxito
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
