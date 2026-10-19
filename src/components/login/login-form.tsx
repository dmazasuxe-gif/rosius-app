"use client"

import { useState } from "react"
import { User, KeyRound, Eye, EyeOff, Loader2, Mail, Phone, UserPlus, LogIn, CreditCard } from "lucide-react"
import { LoginSettings } from "@/types/login-settings"
import { clientLogin, registerClient } from "@/app/actions"

interface LoginFormProps {
  settings: LoginSettings;
}

export function LoginForm({ settings }: LoginFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  
  // Login form state
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  // Register form state
  const [regDni, setRegDni] = useState("")
  const [regFullName, setRegFullName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [showRegPassword, setShowRegPassword] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode)
    setError(null)
    setSuccessMsg(null)
    setLoading(false)
  }

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const cleanUser = username.trim()
    const cleanPass = password.trim()

    if (!cleanUser || !cleanPass) {
      setError("Por favor completa tu usuario o DNI y contraseña.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    const formData = new FormData()
    formData.append("username", cleanUser)
    formData.append("password", cleanPass)

    try {
      const result = await clientLogin(formData)
      if (result.error) {
        setError(result.error)
        setLoading(false)
      } else if (result.success && result.clientId) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("rosius_client_id", result.clientId)
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = `/consulta/${result.clientId}`
        }
      } else {
        setError("No se pudo iniciar sesión. Verifica tus datos.")
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setError("Ocurrió un error inesperado al conectar con el servidor.")
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const cleanDni = regDni.trim()
    const cleanName = regFullName.trim()
    const cleanPass = regPassword.trim()

    if (!cleanDni || cleanDni.length !== 8) {
      setError("El DNI debe contener exactamente 8 dígitos.")
      return
    }
    if (!cleanName) {
      setError("Por favor ingresa tu nombre completo.")
      return
    }
    if (!cleanPass || cleanPass.length < 4) {
      setError("La contraseña debe tener mínimo 4 caracteres.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    const formData = new FormData()
    formData.append("dni", cleanDni)
    formData.append("fullName", cleanName)
    formData.append("email", regEmail.trim())
    formData.append("phone", regPhone.trim())
    formData.append("password", cleanPass)

    try {
      const result = await registerClient(formData)
      if (result.error) {
        setError(result.error)
        setLoading(false)
      } else if (result.success && result.clientId) {
        setSuccessMsg("¡Cuenta creada con éxito! Ingresando a tu panel...")
        if (typeof window !== "undefined") {
          sessionStorage.setItem("rosius_client_id", result.clientId)
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = `/consulta/${result.clientId}`
        }
      } else {
        setError("No se pudo completar el registro.")
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setError("Ocurrió un error al procesar el registro.")
      setLoading(false)
    }
  }

  return (
    <div className="relative flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-8 lg:py-10 bg-white text-slate-800 rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl">
      <div className="w-full max-w-sm mx-auto space-y-5">
        
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

        {/* MODE SWITCHER TABS: Iniciar Sesión / Crear Cuenta */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === "login"
                ? "bg-white text-[#0c2340] shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === "register"
                ? "bg-white text-[#d31027] shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Crear Cuenta
          </button>
        </div>

        {/* HEADINGS */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0c2340]">
            {mode === "login" ? settings.loginTitle : "Crear Cuenta Nueva"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            {mode === "login" 
              ? settings.loginSubtitle 
              : "Regístrate con tu DNI para dar seguimiento a tus trámites legales."}
          </p>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-600 animate-in fade-in">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 text-xs rounded-xl bg-green-50 border border-green-200 text-green-700 animate-in fade-in flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin shrink-0 text-green-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
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
              className="w-full h-11 rounded-xl font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 bg-[#0c2340] hover:bg-[#07182f] text-white active:scale-[0.99] cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Ingresando a tu panel...</span>
                </>
              ) : (
                <span>Iniciar sesión</span>
              )}
            </button>

            {/* SWITCH TO REGISTER LINK */}
            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                ¿No tienes una cuenta aún?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="text-[#d31027] font-semibold hover:underline"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            {/* DNI */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <CreditCard className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type="text"
                maxLength={8}
                value={regDni}
                onChange={(e) => setRegDni(e.target.value.replace(/\D/g, ""))}
                placeholder="DNI (8 dígitos)*"
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#d31027] focus:border-transparent transition-all shadow-sm"
                required
              />
            </div>

            {/* NOMBRE COMPLETO */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type="text"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                placeholder="Nombres y Apellidos completos*"
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#d31027] focus:border-transparent transition-all shadow-sm"
                required
              />
            </div>

            {/* CORREO (OPCIONAL) */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="Correo electrónico (opcional)"
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#d31027] focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* TELÉFONO (OPCIONAL) */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="Teléfono / Celular (opcional)"
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#d31027] focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* CONTRASEÑA */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type={showRegPassword ? "text" : "password"}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Crea una contraseña segura*"
                className="w-full h-11 pl-11 pr-11 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#d31027] focus:border-transparent transition-all shadow-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowRegPassword(!showRegPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showRegPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* SUBMIT REGISTER BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 bg-[#d31027] hover:bg-[#b00d1f] text-white active:scale-[0.99] cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creando cuenta e ingresando...</span>
                </>
              ) : (
                <span>Crear mi cuenta e ingresar</span>
              )}
            </button>

            {/* SWITCH TO LOGIN */}
            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                ¿Ya tienes una cuenta registrada?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-[#0c2340] font-semibold hover:underline"
                >
                  Iniciar sesión
                </button>
              </p>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}
