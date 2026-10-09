"use client"

import { Button } from "@/components/ui/button";
import { Save, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { saveSettings } from "@/app/actions";

export default function AdminAjustes() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    profile_image_url: "",
    hero_title: "Dra. Rosita Ysela Maza Suxe",
    hero_bio: "Soy abogada titulada...",
    contact_phone: "+51 999 999 999",
    contact_email: "contacto@rosius.pe",
    contact_address: "Av. Principal 123, Lima, Perú",
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (!error && data) {
        const newSettings = { ...settings };
        data.forEach((row: any) => {
          (newSettings as any)[row.key] = row.value;
        });
        setSettings(newSettings);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveSettings(settings);
      if (result.error) throw new Error(result.error);
      alert("Ajustes guardados correctamente.");
    } catch (err) {
      console.error(err);
      alert("Error al guardar ajustes.");
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `profile/photo_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("documents").getPublicUrl(filePath);
      
      setSettings(prev => ({ ...prev, profile_image_url: data.publicUrl }));
    } catch (err) {
      console.error(err);
      alert("Error al subir la imagen. Verifica si el bucket 'documents' existe y tiene permisos.");
    }
    setUploadingImage(false);
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Cargando ajustes...</div>;

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
              value={settings.hero_title}
              onChange={(e) => setSettings({...settings, hero_title: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Biografía</label>
            <textarea 
              rows={4}
              value={settings.hero_bio}
              onChange={(e) => setSettings({...settings, hero_bio: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Foto de Perfil</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border overflow-hidden relative">
                {settings.profile_image_url ? (
                  <img src={settings.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>RM</span>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs">...</div>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleImageUpload} 
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadingImage ? "Subiendo..." : "Subir nueva foto"}
              </Button>
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
                value={settings.contact_phone}
                onChange={(e) => setSettings({...settings, contact_phone: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Correo Electrónico</label>
              <input 
                type="email" 
                value={settings.contact_email}
                onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-foreground">Dirección de Oficina</label>
              <input 
                type="text" 
                value={settings.contact_address}
                onChange={(e) => setSettings({...settings, contact_address: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </section>

        <div className="pt-4 border-t border-border/50 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> 
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}
