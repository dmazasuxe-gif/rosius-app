"use client"

import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { lookupDni } from "../actions";
import { useRouter } from "next/navigation";

export default function ConsultaPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [clientId, setClientId] = useState("");
  const router = useRouter();

  async function handleDniSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await lookupDni(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setClientId(result.clientId!);
      setStep(2); // Pasar al paso de OTP
    }
    
    setLoading(false);
  }

  function handleOtpSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulamos validación de OTP exitosa
    setTimeout(() => {
      router.push(`/consulta/${clientId}`);
    }, 1000);
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
          <div className="bg-secondary p-8 text-center text-white">
            <div className="mx-auto bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-accent" />
            </div>
            <h1 className="font-heading text-2xl font-bold">Estado de tu Caso</h1>
            <p className="text-secondary-foreground/80 mt-2 text-sm">
              Acceso seguro y confidencial a tu expediente.
            </p>
          </div>

          <div className="p-8">
            {step === 1 ? (
              <form onSubmit={handleDniSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="dni" className="text-sm font-medium text-foreground">
                    Documento Nacional de Identidad (DNI)
                  </label>
                  <input 
                    id="dni" 
                    name="dni" 
                    type="text" 
                    maxLength={8}
                    placeholder="Ej: 12345678"
                    className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    required
                  />
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="space-y-4">
                  <Button type="submit" disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base shadow-md">
                    {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Solicitar código de acceso"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground leading-relaxed">
                    Por seguridad, enviaremos un código temporal al correo electrónico o teléfono asociado a este DNI.
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-8">
                <div className="space-y-2 text-center mb-6">
                  <p className="text-sm font-medium text-foreground">
                    Hemos enviado un código de 6 dígitos a tus medios de contacto registrados.
                  </p>
                </div>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="123456"
                    className="w-full h-12 px-4 rounded-lg border border-input bg-background text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-12 bg-accent hover:bg-accent/90 text-white text-base shadow-md">
                  {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Verificar e Ingresar"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
