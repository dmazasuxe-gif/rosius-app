import { DEFAULT_LOGIN_SETTINGS, LoginSettings, LoginSlide } from "@/types/login-settings";

interface SettingRow {
  key: string;
  value: string;
}

export function parseLoginSettings(rows: SettingRow[] | null): LoginSettings {
  if (!rows || rows.length === 0) {
    return DEFAULT_LOGIN_SETTINGS;
  }

  const map = new Map<string, string>();
  for (const row of rows) {
    map.set(row.key, row.value);
  }

  let parsedSlides: LoginSlide[] = DEFAULT_LOGIN_SETTINGS.slides;
  const rawSlides = map.get("login_slides");
  if (rawSlides) {
    try {
      const parsed = JSON.parse(rawSlides);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsedSlides = parsed;
      }
    } catch (e) {
      console.warn("Error parsing login_slides setting:", e);
    }
  }

  return {
    badgeText: map.get("login_badge_text") ?? DEFAULT_LOGIN_SETTINGS.badgeText,
    badgeLogoUrl: map.get("login_badge_logo_url") ?? DEFAULT_LOGIN_SETTINGS.badgeLogoUrl,
    welcomeLabel: map.get("login_welcome_label") ?? DEFAULT_LOGIN_SETTINGS.welcomeLabel,
    welcomeTitle: map.get("login_welcome_title") ?? DEFAULT_LOGIN_SETTINGS.welcomeTitle,
    loginTitle: map.get("login_title") ?? DEFAULT_LOGIN_SETTINGS.loginTitle,
    loginSubtitle: map.get("login_subtitle") ?? DEFAULT_LOGIN_SETTINGS.loginSubtitle,
    usernamePlaceholder: map.get("login_username_placeholder") ?? DEFAULT_LOGIN_SETTINGS.usernamePlaceholder,
    passwordPlaceholder: map.get("login_password_placeholder") ?? DEFAULT_LOGIN_SETTINGS.passwordPlaceholder,
    forgotPasswordText: map.get("login_forgot_password_text") ?? DEFAULT_LOGIN_SETTINGS.forgotPasswordText,
    forgotPasswordUrl: map.get("login_forgot_password_url") ?? DEFAULT_LOGIN_SETTINGS.forgotPasswordUrl,
    googleBtnText: map.get("login_google_btn_text") ?? DEFAULT_LOGIN_SETTINGS.googleBtnText,
    googleEnabled: map.get("login_google_enabled") !== "false",
    manualText: map.get("login_manual_text") ?? DEFAULT_LOGIN_SETTINGS.manualText,
    manualLinkText: map.get("login_manual_link_text") ?? DEFAULT_LOGIN_SETTINGS.manualLinkText,
    manualUrl: map.get("login_manual_url") ?? DEFAULT_LOGIN_SETTINGS.manualUrl,
    helpText: map.get("login_help_text") ?? DEFAULT_LOGIN_SETTINGS.helpText,
    helpUrl: map.get("login_help_url") ?? DEFAULT_LOGIN_SETTINGS.helpUrl,
    primaryColor: map.get("login_primary_color") ?? DEFAULT_LOGIN_SETTINGS.primaryColor,
    secondaryColor: map.get("login_secondary_color") ?? DEFAULT_LOGIN_SETTINGS.secondaryColor,
    slides: parsedSlides,
  };
}
