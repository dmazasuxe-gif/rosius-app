"use client"

import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2, FileText, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { lookupCase } from "../actions";
import { useRouter } from "next/navigation";

export default function ConsultaPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleCaseSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await lookupCase(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      router.push(`/consulta/${result.clientId}`);
    }
    
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border shadow-sm flex items-center justify-center bg-white">
              <img src="/logo-light.png" alt="ROSIUS Logo" className="w-full h-full object-cover dark:hidden" />
              <img src="/logo-dark.png" alt="ROSIUS Logo" className="w-full h-full object-cover hidden dark:block" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-widest text-primary">ROSIUS</span>
            </div>
          </Link>
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-gradient-to-br from-secondary to-secondary/90 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="mx-auto bg-accent/20 border border-accent/50 w-16 h-16 rounded-full flex items-center justify-center mb-4 relative z-10 backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8 text-accent" />
            </div>
            <h1 className="font-heading text-2xl font-bold relative z-10">Estado de tu Caso</h1>
            <p className="text-white/80 mt-2 text-sm relative z-10">
              Acceso seguro, directo y confidencial a tu expediente legal.
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleCaseSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="dni" className="text-sm font-medium text-foreground">
                    Documento Nacional de Identidad (DNI)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input 
                      id="dni" 
                      name="dni" 
                      type="text" 
                      maxLength={8}
                      placeholder="Ingresa los 8 dígitos"
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent transition-all text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium text-foreground">
                    Código de Expediente
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input 
                      id="code" 
                      name="code" 
                      type="text" 
                      placeholder="Ej: EXP-2026-001"
                      className="w-full h-12 pl-10 pr-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent transition-all text-foreground"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
                  <p className="text-red-500 text-sm text-center font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-4 pt-2">
                <Button type="submit" disabled={loading} className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground text-base shadow-md font-medium transition-all">
                  {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Verificar e Ingresar"}
                </Button>
                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                  Toda la información contenida está protegida bajo el secreto profesional abogado-cliente.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
