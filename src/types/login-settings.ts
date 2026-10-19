export interface LoginSlide {
  id: string;
  imageUrl: string;
  tag: string;
  title: string;
}

export interface LoginSettings {
  badgeText: string;
  badgeLogoUrl: string;
  welcomeLabel: string;
  welcomeTitle: string;
  loginTitle: string;
  loginSubtitle: string;
  usernamePlaceholder: string;
  passwordPlaceholder: string;
  forgotPasswordText: string;
  forgotPasswordUrl: string;
  googleBtnText: string;
  googleEnabled: boolean;
  manualText: string;
  manualLinkText: string;
  manualUrl: string;
  helpText: string;
  helpUrl: string;
  primaryColor: string;
  secondaryColor: string;
  slides: LoginSlide[];
}

export const DEFAULT_LOGIN_SETTINGS: LoginSettings = {
  badgeText: "Trilce UCV",
  badgeLogoUrl: "/ucv-logo.png",
  welcomeLabel: "BIENVENIDO A",
  welcomeTitle: "TRILCE UCV",
  loginTitle: "Iniciar sesión",
  loginSubtitle: "Bienvenido de nuevo. Ingrese sus credenciales para continuar.",
  usernamePlaceholder: "Usuario o DNI*",
  passwordPlaceholder: "Contraseña*",
  forgotPasswordText: "¿Olvidaste tu contraseña o nombre de usuario?",
  forgotPasswordUrl: "https://wa.me/51999999999?text=Hola,%20olvide%20mis%20credenciales%20de%20acceso",
  googleBtnText: "Acceder con Google",
  googleEnabled: true,
  manualText: "Manual del usuario",
  manualLinkText: "Descargar tutorial",
  manualUrl: "#",
  helpText: "¿Necesitas ayuda?",
  helpUrl: "https://wa.me/51999999999?text=Hola,%20necesito%20ayuda%20para%20iniciar%20sesion",
  primaryColor: "#d31027",
  secondaryColor: "#0c2340",
  slides: [
    {
      id: "1",
      imageUrl: "/slides/slide-1.jpg",
      tag: "Campus",
      title: "Ate"
    },
    {
      id: "2",
      imageUrl: "/slides/slide-2.jpg",
      tag: "Facultad",
      title: "Derecho y Biblioteca"
    }
  ]
};
