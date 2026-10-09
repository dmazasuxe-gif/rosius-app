"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Upload, Activity, History, Settings, Trash2 } from "lucide-react"
import { updateCaseStatus, deleteCase, getCaseUpdates } from "@/app/actions"

type ManageCaseDialogProps = {
  caseId: string;
  currentStatus: string;
  code: string;
}

export function ManageCaseDialog({ caseId, currentStatus, code }: ManageCaseDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updateText, setUpdateText] = useState("")
  const [status, setStatus] = useState(currentStatus)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const [activeTab, setActiveTab] = useState<"update" | "history" | "settings">("update")
  const [history, setHistory] = useState<any[]>([])
  const [historyLoaded, setHistoryLoaded] = useState(false)

  useEffect(() => {
    if (isOpen && activeTab === "history" && !historyLoaded) {
      getCaseUpdates(caseId).then(data => {
        setHistory(data)
        setHistoryLoaded(true)
      })
    }
  }, [isOpen, activeTab, caseId, historyLoaded])

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const isInternal = (document.getElementById("is_internal") as HTMLInputElement).checked
      const isPublicDoc = (document.getElementById("is_public_doc") as HTMLInputElement)?.checked ?? true

      const formData = new FormData()
      formData.append("caseId", caseId)
      formData.append("status", status)
      formData.append("updateText", updateText)
      formData.append("isInternal", isInternal.toString())
      formData.append("isPublicDoc", isPublicDoc.toString())
      
      if (selectedFile) {
        formData.append("file", selectedFile)
      }

      const result = await updateCaseStatus(formData)
      
      if (result.success) {
        setLoading(false)
        setIsOpen(false)
        setUpdateText("")
        setSelectedFile(null)
        setHistoryLoaded(false)
      } else {
        alert(result.error)
        setLoading(false)
      }
    } catch (err: any) {
      console.error(err)
      alert("Ocurrió un error inesperado al guardar la actualización.")
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este caso? Esta acción no se puede deshacer.")) return;
    setLoading(true)
    const result = await deleteCase(caseId)
    if (result.success) {
      setIsOpen(false)
    } else {
      alert(result.error)
      setLoading(false)
    }
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
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-xl border border-border/50 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/30 shrink-0">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                <h2 className="font-heading text-xl font-bold">Expediente: {code}</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex border-b border-border/50">
              <button 
                onClick={() => setActiveTab("update")}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'update' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'}`}
              >
                <Activity className="w-4 h-4" /> Nueva Actualización
              </button>
              <button 
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'history' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'}`}
              >
                <History className="w-4 h-4" /> Historial
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'settings' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'}`}
              >
                <Settings className="w-4 h-4" /> Ajustes del Caso
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-muted/10 flex-1">
              {activeTab === "update" && (
                <form id="manage-case-form" onSubmit={handleUpdateSubmit} className="space-y-6">
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Estado del Caso
                      </label>
                      <select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        <option value="Caso recibido">Caso recibido</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="En Audiencia">En Audiencia</option>
                        <option value="Esperando Resolución">Esperando Resolución</option>
                        <option value="Resuelto">Resuelto</option>
                        <option value="Apelado">Apelado</option>
                        <option value="Cerrado">Cerrado</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Detalle de la Actualización
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
                      <label htmlFor="is_internal" className="text-sm font-medium text-foreground">Nota interna (El cliente no podrá verla)</label>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border/50">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Adjuntar Documento PDF (Opcional)
                    </label>
                    <div className="border-2 border-dashed border-input rounded-xl p-6 text-center hover:bg-muted/30 transition-colors">
                      <input 
                        type="file" 
                        id="case-file-upload" 
                        accept=".pdf" 
                        className="hidden" 
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                      <label htmlFor="case-file-upload" className="cursor-pointer flex flex-col items-center">
                        <Upload className={`w-8 h-8 mb-2 ${selectedFile ? 'text-accent' : 'text-muted-foreground'}`} />
                        <span className="text-sm font-medium text-foreground">
                          {selectedFile ? selectedFile.name : "Haz clic para subir un PDF"}
                        </span>
                        {!selectedFile && <span className="text-xs text-muted-foreground mt-1">Sube la resolución o documento relacionado</span>}
                      </label>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <input type="checkbox" id="is_public_doc" name="is_public_doc" defaultChecked className="rounded border-input text-accent focus:ring-accent" />
                      <label htmlFor="is_public_doc" className="text-sm font-medium text-foreground">Permitir que el cliente descargue este documento</label>
                    </div>
                  </div>
                </form>
              )}

              {activeTab === "history" && (
                <div className="space-y-4">
                  <h3 className="font-semibold mb-4">Historial de Actualizaciones</h3>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {history.length > 0 ? history.map((update, idx) => (
                      <div key={update.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className={`flex items-center justify-center w-4 h-4 rounded-full border-2 ${idx === 0 ? 'border-accent bg-background' : 'border-border bg-muted'} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow`} />
                        <div className={`w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-border/50 bg-card shadow-sm ${idx > 0 ? 'opacity-70' : ''}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-semibold ${idx === 0 ? 'text-accent' : 'text-muted-foreground'}`}>
                              {new Date(update.created_at).toLocaleDateString("es-PE")}
                            </span>
                            {update.is_internal_note && <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">Nota Interna</span>}
                          </div>
                          <p className="text-sm text-foreground">{update.description}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-muted-foreground pl-8">No hay actualizaciones todavía.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex flex-col items-center text-center">
                    <Trash2 className="w-8 h-8 text-destructive mb-2" />
                    <h3 className="font-semibold text-destructive mb-1">Zona de Peligro</h3>
                    <p className="text-sm text-destructive/80 mb-4 max-w-sm">
                      Al eliminar este expediente, se borrarán todas sus actualizaciones y documentos asociados de forma permanente.
                    </p>
                    <Button onClick={handleDelete} disabled={loading} variant="outline" className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive hover:text-white">
                      Eliminar Expediente Completo
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-border/50 flex justify-end gap-3 bg-background shrink-0">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cerrar</Button>
              {activeTab === "update" && (
                <Button type="submit" form="manage-case-form" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {loading ? "Guardando..." : "Guardar Actualización"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
