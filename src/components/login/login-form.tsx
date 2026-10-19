"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, KeyRound, Eye, EyeOff, Loader2, HelpCircle } from "lucide-react"
import { LoginSettings } from "@/types/login-settings"
import { clientLogin } from "@/app/actions"

interface LoginFormProps {
  settings: LoginSettings;
}

export function LoginForm({ settings }: LoginFormProps) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError("Por favor completa todos los campos obligatorios.")
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("username", username)
    formData.append("password", password)

    try {
      const result = await clientLogin(formData)
      if (result.error) {
        setError(result.error)
        setLoading(false)
      } else if (result.success && result.clientId) {
        router.push(`/consulta/${result.clientId}`)
      }
    } catch (err) {
      console.error(err)
      setError("Ocurrió un error inesperado al conectar con el servidor.")
      setLoading(false)
    }
  }

  const isFormFilled = username.trim().length > 0 && password.trim().length > 0

  return (
    <div className="relative flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 lg:py-12 bg-white text-slate-800 rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl">
      <div className="w-full max-w-sm mx-auto space-y-6">
        
        {/* TOP BADGE: Red Pill with Logo & Text */}
        <div className="flex justify-center">
          <div 
            className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl text-white shadow-md transition-transform hover:scale-105"
            style={{ backgroundColor: settings.primaryColor || "#d31027" }}
          >
            {settings.badgeLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={settings.badgeLogoUrl} 
                alt="Logo" 
                className="w-5 h-5 object-contain filter brightness-0 invert" 
              />
            ) : (
              <span className="font-serif font-black text-sm">U</span>
            )}
            <span className="font-heading font-bold text-base tracking-wide">
              {settings.badgeText}
            </span>
          </div>
        </div>

        {/* HEADINGS */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0c2340]">
            {settings.loginTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            {settings.loginSubtitle}
          </p>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div className="p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-600 animate-in fade-in">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* USERNAME FIELD */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <div className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={settings.usernamePlaceholder}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2340] focus:border-transparent transition-all shadow-sm"
              required
            />
          </div>

          {/* PASSWORD FIELD */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <div className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center">
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={settings.passwordPlaceholder}
              className="w-full h-12 pl-12 pr-11 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2340] focus:border-transparent transition-all shadow-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* FORGOT PASSWORD LINK */}
          <div className="text-center pt-1">
            <a
              href={settings.forgotPasswordUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-600 hover:underline"
            >
              ¿Olvidaste tu{" "}
              <span className="text-[#d31027] font-medium">contraseña</span> o{" "}
              <span className="text-[#d31027] font-medium">nombre de usuario</span>?
            </a>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-11 rounded-xl font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
              isFormFilled
                ? "bg-[#0c2340] hover:bg-[#07182f] text-white active:scale-[0.99]"
                : "bg-[#9ba6b5] text-white/90 cursor-pointer hover:bg-[#8895a7]"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verificando...</span>
              </>
            ) : (
              <span>Iniciar sesión</span>
            )}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400 font-normal">o</span>
          </div>
        </div>

        {/* GOOGLE LOGIN BUTTON */}
        {settings.googleEnabled && (
          <button
            type="button"
            onClick={() => alert("El acceso directo con Google está disponible para cuentas institucionales @ucvvirtual.edu.pe.")}
            className="w-full h-11 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 text-slate-700 text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{settings.googleBtnText}</span>
          </button>
        )}

        {/* USER MANUAL LINK */}
        <div className="text-center text-xs text-slate-500 pt-1">
          <span>{settings.manualText} </span>
          <a
            href={settings.manualUrl || "#"}
            className="text-blue-600 hover:underline font-medium"
          >
            {settings.manualLinkText}
          </a>
        </div>
      </div>

      {/* FLOATING HELP BUTTON (Bottom-Right, exactly as reference image) */}
      <div className="mt-8 lg:mt-0 lg:absolute lg:bottom-6 lg:right-6 flex justify-end">
        <a
          href={settings.helpUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors group"
        >
          <span className="font-medium">{settings.helpText}</span>
          <div 
            className="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
            style={{ backgroundColor: settings.primaryColor || "#d31027" }}
          >
            <HelpCircle className="w-4 h-4 stroke-[2.5]" />
          </div>
        </a>
      </div>
    </div>
  )
}
