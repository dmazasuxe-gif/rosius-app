import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

export const metadata = {
  title: "Gestión de Casos | ROSIUS Admin",
};

export default function AdminCasos() {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Casos y Expedientes</h1>
          <p className="text-muted-foreground mt-1">Administra los casos de tus clientes y sube actualizaciones.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo Caso
        </Button>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border/50 bg-muted/20 flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por DNI o N° Expediente..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Expediente</th>
                <th className="px-6 py-4 font-medium">Cliente (DNI)</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Última Act.</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 font-medium text-primary">EXP-2026-001</td>
                <td className="px-6 py-4">
                  <p className="font-medium text-foreground">Juan Pérez</p>
                  <p className="text-xs text-muted-foreground">74581236</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded-full text-xs font-medium">
                    En Proceso
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">Hace 2 días</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="outline" size="sm" className="text-xs">
                    Administrar
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
