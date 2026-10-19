import { supabase } from "@/lib/supabase"
import { parseLoginSettings } from "@/lib/login-settings"
import { LoginCarousel } from "@/components/login/login-carousel"
import { LoginForm } from "@/components/login/login-form"

export const metadata = {
  title: "Iniciar sesión | Trilce UCV",
  description: "Portal de acceso institucional y consulta de clientes.",
}

export const instant = false;

export default async function LoginPage() {
  const { data: rows } = await supabase.from("site_settings").select("key, value")
  const settings = parseLoginSettings(rows)

  return (
    <main className="min-h-screen w-full bg-[#e8ecf2] flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans">
      {/* Centered Split Card */}
      <div className="w-full max-w-[1040px] bg-white rounded-3xl shadow-[0_25px_70px_-15px_rgba(12,35,64,0.25)] border border-slate-200/60 grid grid-cols-1 lg:grid-cols-2 overflow-hidden animate-in fade-in zoom-in-[0.99] duration-500">
        {/* Left Side: Visual Carousel */}
        <LoginCarousel 
          slides={settings.slides} 
          welcomeLabel={settings.welcomeLabel} 
          welcomeTitle={settings.welcomeTitle} 
        />

        {/* Right Side: Login Form */}
        <LoginForm settings={settings} />
      </div>
    </main>
  )
}
