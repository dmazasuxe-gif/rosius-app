import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Consulta tu caso | ROSIUS",
  description: "Consulta de manera segura el estado de tu expediente jurídico.",
};

export default function ConsultaPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Minimalista */}
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

      {/* Main Content */}
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
            <form className="space-y-6">
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

              <div className="space-y-4">
                <Button type="button" className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base shadow-md">
                  Solicitar código de acceso
                </Button>
                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                  Por seguridad, enviaremos un código temporal al correo electrónico o teléfono asociado a este DNI.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
