"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, X, Upload } from "lucide-react"

export function NewCaseDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    // Aquí conectaríamos con el Server Action para crear cliente y caso
    // y subiríamos el archivo PDF inicial al bucket.
    setTimeout(() => {
      setLoading(false)
      setIsOpen(false)
      // window.location.reload()
    }, 1500)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
        <Plus className="w-4 h-4" /> Nuevo Caso
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border/50 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/30 shrink-0">
              <h2 className="font-heading text-xl font-bold">Registrar Nuevo Caso</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="new-case-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-4">
                  <h3 className="font-semibold border-b border-border/50 pb-2">Datos del Cliente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">DNI</label>
                      <input name="dni" type="text" maxLength={8} required className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Teléfono</label>
                      <input name="phone" type="text" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre Completo</label>
                    <input name="full_name" type="text" required className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email (Opcional)</label>
                    <input name="email" type="email" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="font-semibold border-b border-border/50 pb-2">Datos del Expediente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Código Expediente</label>
                      <input name="code" type="text" required placeholder="Ej: EXP-2026-001" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Materia</label>
                      <input name="subject_type" type="text" required placeholder="Ej: Demanda por Alimentos" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Expediente PDF (Opcional)</label>
                    <div className="border-2 border-dashed border-input rounded-xl p-6 text-center hover:bg-muted/30 transition-colors">
                      <input 
                        type="file" 
                        id="file-upload" 
                        accept=".pdf" 
                        className="hidden" 
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <Upload className={`w-8 h-8 mb-2 ${selectedFile ? 'text-accent' : 'text-muted-foreground'}`} />
                        <span className="text-sm font-medium text-foreground">
                          {selectedFile ? selectedFile.name : "Haz clic para subir un PDF"}
                        </span>
                        {!selectedFile && <span className="text-xs text-muted-foreground mt-1">Máx. 10MB</span>}
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-border/50 flex justify-end gap-3 bg-background shrink-0">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit" form="new-case-form" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {loading ? "Guardando..." : "Crear Expediente"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
