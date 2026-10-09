import Link from "next/link";
import { Scale, Users, FileText, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-secondary text-secondary-foreground flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <Scale className="h-4 w-4 text-accent" />
          </div>
          <div>
            <span className="font-heading font-bold text-lg text-accent tracking-widest">ROSIUS</span>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm">
            <FileText className="h-4 w-4" />
            Resumen
          </Link>
          <Link href="/admin/casos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm">
            <Users className="h-4 w-4" />
            Casos y Clientes
          </Link>
          <Link href="/admin/ajustes" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm">
            <Settings className="h-4 w-4" />
            Página y Ajustes
          </Link>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors text-sm w-full text-left">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
