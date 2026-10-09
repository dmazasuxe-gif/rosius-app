export const metadata = {
  title: "Dashboard | ROSIUS Admin",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Resumen General</h1>
        <p className="text-muted-foreground mt-1">Bienvenida, Abogada Rosita Ysela Maza Suxe.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Casos Activos</h3>
          <p className="text-3xl font-heading font-bold mt-2">12</p>
        </div>
        <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Casos Resueltos</h3>
          <p className="text-3xl font-heading font-bold mt-2">48</p>
        </div>
        <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Nuevas Consultas</h3>
          <p className="text-3xl font-heading font-bold mt-2 text-accent">3</p>
        </div>
      </div>
      
      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-heading font-semibold mb-4">Actividad Reciente</h2>
        <div className="text-sm text-muted-foreground text-center py-12 border-2 border-dashed border-border rounded-xl">
          Aún no hay actividad reciente para mostrar.
        </div>
      </div>
    </div>
  );
}
