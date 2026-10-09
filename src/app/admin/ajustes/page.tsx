import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export const metadata = {
  title: "Ajustes de Página | ROSIUS Admin",
};

export default function AdminAjustes() {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 max-w-3xl">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Ajustes de la Página</h1>
        <p className="text-muted-foreground mt-1">Modifica los textos e imágenes de la página principal (Landing Page).</p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6 space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold border-b border-border/50 pb-2">Sección: Sobre Mí</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Título de presentación</label>
            <input 
              type="text" 
              defaultValue="Dra. Rosita Ysela Maza Suxe"
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Biografía</label>
            <textarea 
              rows={4}
              defaultValue="Soy abogada titulada por la Universidad..., con especialización en Derecho Civil y Penal. Mi compromiso es brindarte una defensa transparente, honesta y eficaz."
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Foto de Perfil</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border">
                RM
              </div>
              <Button variant="outline" size="sm">Subir nueva foto</Button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-heading font-semibold border-b border-border/50 pb-2">Información de Contacto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Teléfono</label>
              <input 
                type="text" 
                defaultValue="+51 999 999 999"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Correo Electrónico</label>
              <input 
                type="email" 
                defaultValue="contacto@rosius.pe"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-foreground">Dirección de Oficina</label>
              <input 
                type="text" 
                defaultValue="Av. Principal 123, Lima, Perú"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </section>

        <div className="pt-4 border-t border-border/50 flex justify-end">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
            <Save className="w-4 h-4" /> Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
