"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  ExternalLink, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { saveSettings } from "@/app/actions"
import { DEFAULT_LOGIN_SETTINGS, LoginSettings, LoginSlide } from "@/types/login-settings"
import { parseLoginSettings } from "@/lib/login-settings"

export default function AdminLoginSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const [settings, setSettings] = useState<LoginSettings>(DEFAULT_LOGIN_SETTINGS)
  
  // Slide addition form states
  const [newSlideUrl, setNewSlideUrl] = useState("")
  const [newSlideTag, setNewSlideTag] = useState("Campus")
  const [newSlideTitle, setNewSlideTitle] = useState("")
  const [uploadingSlide, setUploadingSlide] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const slideFileInputRef = useRef<HTMLInputElement>(null)
  const logoFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase.from("site_settings").select("key, value")
        if (!error && data) {
          const parsed = parseLoginSettings(data)
          setSettings(parsed)
        }
      } catch (e) {
        console.error("Error al cargar configuración:", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Subir imagen de slide a Supabase Storage
  const handleSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingSlide(true)
    try {
      const fileExt = file.name.split(".").pop()
      const filePath = `slides/slide_${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, file)
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("documents").getPublicUrl(filePath)
      setNewSlideUrl(data.publicUrl)
    } catch (err) {
      console.error(err)
      alert("No se pudo subir la imagen al bucket de Supabase. Puedes ingresar una URL directa.")
    } finally {
      setUploadingSlide(false)
    }
  }

  // Subir logo de insignia a Supabase Storage
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    try {
      const fileExt = file.name.split(".").pop()
      const filePath = `branding/logo_${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, file)
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("documents").getPublicUrl(filePath)
      setSettings(prev => ({ ...prev, badgeLogoUrl: data.publicUrl }))
    } catch (err) {
      console.error(err)
      alert("No se pudo subir el logo al almacenamiento.")
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleAddSlide = () => {
    if (!newSlideUrl.trim()) {
      alert("Por favor ingresa o sube una imagen para la diapositiva.")
      return
    }
    const newSlide: LoginSlide = {
      id: Date.now().toString(),
      imageUrl: newSlideUrl.trim(),
      tag: newSlideTag.trim() || "Campus",
      title: newSlideTitle.trim() || "Sede",
    }
    setSettings(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide]
    }))
    setNewSlideUrl("")
    setNewSlideTitle("")
  }

  const handleDeleteSlide = (id: string) => {
    setSettings(prev => ({
      ...prev,
      slides: prev.slides.filter(s => s.id !== id)
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveSuccess(false)
    setErrorMessage(null)

    const payload: Record<string, string> = {
      login_badge_text: settings.badgeText,
      login_badge_logo_url: settings.badgeLogoUrl,
      login_welcome_label: settings.welcomeLabel,
      login_welcome_title: settings.welcomeTitle,
      login_title: settings.loginTitle,
      login_subtitle: settings.loginSubtitle,
      login_username_placeholder: settings.usernamePlaceholder,
      login_password_placeholder: settings.passwordPlaceholder,
      login_forgot_password_text: settings.forgotPasswordText,
      login_forgot_password_url: settings.forgotPasswordUrl,
      login_google_btn_text: settings.googleBtnText,
      login_google_enabled: settings.googleEnabled ? "true" : "false",
      login_manual_text: settings.manualText,
      login_manual_link_text: settings.manualLinkText,
      login_manual_url: settings.manualUrl,
      login_help_text: settings.helpText,
      login_help_url: settings.helpUrl,
      login_primary_color: settings.primaryColor,
      login_secondary_color: settings.secondaryColor,
      login_slides: JSON.stringify(settings.slides),
    }

    try {
      const result = await saveSettings(payload)
      if (result.error) {
        setErrorMessage(result.error)
      } else {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 4000)
      }
    } catch (e) {
      console.error(e)
      setErrorMessage("Error de conexión al guardar los ajustes.")
    } finally {
      setSaving(false)
    }
  }

  const handleResetDefaults = () => {
    if (confirm("¿Deseas restablecer todos los valores al estilo Trilce UCV predeterminado?")) {
      setSettings(DEFAULT_LOGIN_SETTINGS)
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground">Cargando personalizador de Login...</div>
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Personalizar Inicio de Sesión
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Configura el 100% de la pantalla de login (carrusel de imágenes, textos Trilce UCV, logo, colores y enlaces).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open("/login", "_blank")}
            className="flex items-center gap-2 text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ver Login en Vivo
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 shadow-md"
          >
            <Save className="w-4 h-4" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">¡Cambios guardados con éxito! La pantalla de login se ha actualizado.</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: CARRUSEL DE IMÁGENES (LADO IZQUIERDO) */}
      <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-border/50 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-accent" />
              Carrusel de Imágenes (Lado Izquierdo)
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Agrega, edita o elimina las imágenes de fondo que se mostrarán en la animación del login.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium">
            {settings.slides.length} diapositivas
          </span>
        </div>

        {/* Current Slides List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settings.slides.map((slide, index) => (
            <div 
              key={slide.id || index}
              className="group relative rounded-xl border border-border/60 overflow-hidden bg-muted/20 shadow-sm transition-all hover:border-accent"
            >
              <div 
                className="h-36 w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url('${slide.imageUrl}')` }}
              >
                <div className="absolute inset-0 bg-black/40" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] bg-black/60 text-white font-medium">
                  #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteSlide(slide.id)}
                  aria-label="Eliminar diapositiva"
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-transform hover:scale-105"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 space-y-2 bg-card">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Etiqueta
                  </span>
                  <input
                    type="text"
                    value={slide.tag}
                    onChange={(e) => {
                      const updated = [...settings.slides]
                      updated[index].tag = e.target.value
                      setSettings({ ...settings, slides: updated })
                    }}
                    placeholder="Ej: Campus"
                    className="w-full px-2 py-1 text-xs rounded border border-input bg-background"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Título de Sede
                  </span>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => {
                      const updated = [...settings.slides]
                      updated[index].title = e.target.value
                      setSettings({ ...settings, slides: updated })
                    }}
                    placeholder="Ej: Ate"
                    className="w-full px-2 py-1 text-xs rounded border border-input bg-background font-medium"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Slide Form */}
        <div className="p-5 rounded-xl border border-dashed border-border bg-muted/10 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Agregar Nueva Imagen al Carrusel
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">
                URL de Imagen o Subir Archivo
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSlideUrl}
                  onChange={(e) => setNewSlideUrl(e.target.value)}
                  placeholder="https://... o sube una foto desde tu equipo"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-input bg-background"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={slideFileInputRef}
                  className="hidden"
                  onChange={handleSlideImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => slideFileInputRef.current?.click()}
                  disabled={uploadingSlide}
                  className="shrink-0 text-xs"
                >
                  <Upload className="w-3.5 h-3.5 mr-1" />
                  {uploadingSlide ? "Subiendo..." : "Subir Imagen"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Etiqueta</label>
                <input
                  type="text"
                  value={newSlideTag}
                  onChange={(e) => setNewSlideTag(e.target.value)}
                  placeholder="Campus"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Título</label>
                <input
                  type="text"
                  value={newSlideTitle}
                  onChange={(e) => setNewSlideTitle(e.target.value)}
                  placeholder="Ate"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              onClick={handleAddSlide}
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Añadir a la lista
            </Button>
          </div>
        </div>

        {/* Textos del Carrusel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Texto pre-título del carrusel
            </label>
            <input
              type="text"
              value={settings.welcomeLabel}
              onChange={(e) => setSettings({ ...settings, welcomeLabel: e.target.value })}
              className="w-full px-4 py-2 text-sm rounded-lg border border-input bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Título principal del carrusel (ej: TRILCE UCV)
            </label>
            <input
              type="text"
              value={settings.welcomeTitle}
              onChange={(e) => setSettings({ ...settings, welcomeTitle: e.target.value })}
              className="w-full px-4 py-2 text-sm rounded-lg border border-input bg-background font-bold"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: INSIGNIA, LOGO Y COLORES */}
      <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-border/50 pb-4">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Insignia de Cabecera y Colores Institucionales
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Personaliza el logo UCV, la insignia superior del formulario y la paleta de colores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Texto de la insignia roja
            </label>
            <input
              type="text"
              value={settings.badgeText}
              onChange={(e) => setSettings({ ...settings, badgeText: e.target.value })}
              className="w-full px-4 py-2 text-sm rounded-lg border border-input bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Logo de la Insignia (UCV o personalizado)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.badgeLogoUrl}
                onChange={(e) => setSettings({ ...settings, badgeLogoUrl: e.target.value })}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-input bg-background"
              />
              <input
                type="file"
                accept="image/*"
                ref={logoFileInputRef}
                className="hidden"
                onChange={handleLogoUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => logoFileInputRef.current?.click()}
                disabled={uploadingLogo}
                className="text-xs shrink-0"
              >
                <Upload className="w-3.5 h-3.5 mr-1" />
                {uploadingLogo ? "Subiendo..." : "Subir Logo"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Color Primario (Rojo UCV)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer border border-border"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="w-32 px-3 py-1.5 text-xs font-mono rounded-lg border border-input bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Color Secundario (Azul Marino UCV)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer border border-border"
              />
              <input
                type="text"
                value={settings.secondaryColor}
                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                className="w-32 px-3 py-1.5 text-xs font-mono rounded-lg border border-input bg-background"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FORMULARIO Y TEXTOS DEL LOGIN */}
      <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-border/50 pb-4">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Textos del Formulario de Inicio de Sesión
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Modifica los encabezados, ayudas y textos de los campos de acceso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Título del formulario</label>
            <input
              type="text"
              value={settings.loginTitle}
              onChange={(e) => setSettings({ ...settings, loginTitle: e.target.value })}
              className="w-full px-4 py-2 text-sm rounded-lg border border-input bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Subtítulo del formulario</label>
            <input
              type="text"
              value={settings.loginSubtitle}
              onChange={(e) => setSettings({ ...settings, loginSubtitle: e.target.value })}
              className="w-full px-4 py-2 text-sm rounded-lg border border-input bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Placeholder de Usuario</label>
            <input
              type="text"
              value={settings.usernamePlaceholder}
              onChange={(e) => setSettings({ ...settings, usernamePlaceholder: e.target.value })}
              className="w-full px-4 py-2 text-sm rounded-lg border border-input bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Placeholder de Contraseña</label>
            <input
              type="text"
              value={settings.passwordPlaceholder}
              onChange={(e) => setSettings({ ...settings, passwordPlaceholder: e.target.value })}
              className="w-full px-4 py-2 text-sm rounded-lg border border-input bg-background"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-foreground">Enlace de recuperación (WhatsApp o Formulario)</label>
            <input
              type="text"
              value={settings.forgotPasswordUrl}
              onChange={(e) => setSettings({ ...settings, forgotPasswordUrl: e.target.value })}
              className="w-full px-4 py-2 text-sm rounded-lg border border-input bg-background"
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: SOPORTE, MANUAL Y AYUDA */}
      <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-border/50 pb-4">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Soporte, Manual y Enlaces de Ayuda
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Gestiona el botón flotante de ayuda y el enlace de descarga del manual de usuario.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Texto del Manual</label>
            <input
              type="text"
              value={settings.manualText}
              onChange={(e) => setSettings({ ...settings, manualText: e.target.value })}
              className="w-full px-4 py-2 text-sm rounded-lg border border-input bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Texto del Enlace Tutorial</label>
            <input
              type="text"
              value={settings.manualLinkText}
              onChange={(e) => setSettings({ ...settings, manualLinkText: e.target.value })}
              className="w-full px-4 py-2 text-sm rounded-lg border border-input bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Texto del Botón de Ayuda</label>
            <input
              type="text"
              value={settings.helpText}
              onChange={(e) => setSettings({ ...settings, helpText: e.target.value })}
              className="w-full px-4 py-2 text-sm rounded-lg border border-input bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Enlace o WhatsApp de Ayuda</label>
            <input
              type="text"
              value={settings.helpUrl}
              onChange={(e) => setSettings({ ...settings, helpUrl: e.target.value })}
              className="w-full px-4 py-2 text-sm rounded-lg border border-input bg-background"
            />
          </div>
        </div>
      </section>

      {/* Bottom Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-border/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleResetDefaults}
          className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablecer estilo Trilce UCV predeterminado
        </Button>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 px-6 shadow-md"
        >
          <Save className="w-4 h-4" />
          {saving ? "Guardando..." : "Guardar Todos los Cambios"}
        </Button>
      </div>
    </div>
  )
}
