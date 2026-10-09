"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Upload, Activity } from "lucide-react"

export function ManageCaseDialog({ caseId }: { caseId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updateText, setUpdateText] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    // Aquí conectaríamos con el Server Action para añadir la actualización
    // y subir el PDF al bucket si hay un archivo seleccionado.
    setTimeout(() => {
      setLoading(false)
      setIsOpen(false)
      setUpdateText("")
      // window.location.reload()
    }, 1500)
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline" 
        size="sm" 
        className="text-xs border-primary/20 hover:bg-primary hover:text-primary-foreground"
      >
        Administrar
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border/50 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/30 shrink-0">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                <h2 className="font-heading text-xl font-bold">Administrar Caso</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="manage-case-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Nueva Actualización / Estado
                    </label>
                    <textarea 
                      name="update_text"
                      value={updateText}
                      onChange={(e) => setUpdateText(e.target.value)}
                      required 
                      rows={4}
                      placeholder="Ej: Se presentó el escrito de apelación ante la sala correspondiente..." 
                      className="w-full p-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-none" 
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="is_internal" name="is_internal" className="rounded border-input text-accent focus:ring-accent" />
                    <label htmlFor="is_internal" className="text-sm text-muted-foreground">Nota interna (El cliente no podrá verla)</label>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border/50">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Adjuntar Documento PDF (Opcional)
                  </label>
                  <div className="border-2 border-dashed border-input rounded-xl p-6 text-center hover:bg-muted/30 transition-colors">
                    <input type="file" id="case-file-upload" accept=".pdf" className="hidden" />
                    <label htmlFor="case-file-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium text-foreground">Haz clic para subir un PDF</span>
                      <span className="text-xs text-muted-foreground mt-1">Sube la resolución o documento relacionado</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="is_public_doc" name="is_public_doc" defaultChecked className="rounded border-input text-accent focus:ring-accent" />
                    <label htmlFor="is_public_doc" className="text-sm text-muted-foreground">Permitir que el cliente descargue este documento</label>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-border/50 flex justify-end gap-3 bg-background shrink-0">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit" form="manage-case-form" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {loading ? "Guardando..." : "Guardar Actualización"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
