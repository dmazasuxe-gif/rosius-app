import { supabase } from "@/lib/supabase";
import { ShieldCheck, FileText, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const instant = false;

type CaseUpdate = {
  id: string;
  description: string;
  created_at: string;
  is_internal_note: boolean;
};

type Case = {
  id: string;
  code: string;
  subject_type: string;
  status: string;
  case_updates?: CaseUpdate[];
};

export default async function ClientDashboard({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { data: client } = await supabase
    .from("clients")
    .select("*, cases(*, case_updates(*, created_at))")
    .eq("id", resolvedParams.id)
    .single();

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold">Cliente no encontrado</h1>
          <Link href="/consulta">
            <Button>Volver a intentar</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b border-border/50 bg-secondary text-white">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <span className="font-heading text-lg font-bold tracking-widest text-accent">ROSIUS</span>
          </Link>
          <div className="text-sm font-medium">
            Hola, {client.full_name}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-heading font-bold mb-8">Mis Expedientes</h1>

        {client.cases && client.cases.length > 0 ? (
          <div className="space-y-6">
            {client.cases.map((c: Case) => (
              <div key={c.id} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent" />
                      {c.code}
                    </h2>
                    <p className="text-muted-foreground mt-1">{c.subject_type}</p>
                  </div>
                  <span className="px-4 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-sm font-medium">
                    {c.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Últimas Actuaciones</h3>
                  {c.case_updates && c.case_updates.filter((u: CaseUpdate) => !u.is_internal_note).length > 0 ? (
                    <ul className="space-y-4">
                      {c.case_updates.filter((u: CaseUpdate) => !u.is_internal_note).map((update: CaseUpdate) => (
                        <li key={update.id} className="flex gap-4 items-start">
                          <div className="mt-1 bg-accent/20 p-2 rounded-full text-accent">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm text-foreground">{update.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(update.created_at).toLocaleDateString("es-PE")}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay actualizaciones recientes.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-2xl border border-border/50">
            <p className="text-muted-foreground">No tienes expedientes activos en este momento.</p>
          </div>
        )}
      </main>
    </div>
  );
}
