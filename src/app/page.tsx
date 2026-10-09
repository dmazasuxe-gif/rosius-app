import { Button } from "@/components/ui/button";
import { Scale, FileText, Newspaper, User, ChevronRight, ShieldCheck, Search } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const instant = false;

export default async function Home() {
  const { data: settingsData } = await supabase.from("site_settings").select("*");
  const settings: Record<string, string> = {
    profile_image_url: "",
    hero_title: "Dra. Rosita Ysela Maza Suxe",
    hero_bio: "Soy abogada titulada por la Universidad..., con especialización en Derecho Civil y Penal. Mi compromiso es brindarte una defensa transparente, honesta y eficaz.",
    contact_phone: "+51 999 999 999",
    contact_email: "contacto@rosius.pe",
    contact_address: "Av. Principal 123, Lima, Perú",
  };

  if (settingsData) {
    settingsData.forEach((row) => {
      settings[row.key] = row.value;
    });
  }

  const cleanPhone = settings.contact_phone.replace(/\D/g, "");

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {/* Logo en versión clara para modo oscuro, versión oscura para modo claro */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shadow-sm flex items-center justify-center bg-white">
              <img src="/logo-light.png" alt="ROSIUS Logo" className="w-full h-full object-cover dark:hidden" />
              <img src="/logo-dark.png" alt="ROSIUS Logo" className="w-full h-full object-cover hidden dark:block" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold tracking-widest text-primary">ROSIUS</span>
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">La ley, a tu alcance</span>
            </div>
          </Link>

          <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
            <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
            <Link href="/leyes" className="hover:text-accent transition-colors">Leyes y normas</Link>
            <Link href="/actualidad" className="hover:text-accent transition-colors">Actualidad</Link>
            <Link href="/articulos" className="hover:text-accent transition-colors">Artículos</Link>
            <Link href="/sobre-mi" className="hover:text-accent transition-colors">Sobre mí</Link>
            <Link href="/contacto" className="hover:text-accent transition-colors">Contacto</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/consulta" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
              Consultar mi caso
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative px-4 py-32 md:py-48 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-secondary/5 -z-10" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
          
          <div className="container mx-auto max-w-4xl text-center space-y-8 duration-1000">
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Comprende tus derechos.<br />
              Conoce las leyes.<br />
              <span className="text-accent italic">Toma mejores decisiones.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              ROSIUS es tu plataforma jurídica de confianza en el Perú. 
              Orientación legal clara, actualizada y accesible para proteger tus intereses y los de tu familia.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/consulta" className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto h-14 px-8 text-base">
                <Search className="mr-2 h-5 w-5" />
                Consultar el estado de mi caso
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                Explorar información jurídica
              </Button>
            </div>
          </div>
        </section>

        {/* SERVICES / FEATURES */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-heading text-3xl md:text-4xl font-bold">Servicios Jurídicos</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Soluciones legales adaptadas a tus necesidades, con transparencia y profesionalismo en cada paso.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Seguimiento de Casos",
                  description: "Consulta el avance de tu expediente en tiempo real con tu DNI y un código seguro.",
                  icon: ShieldCheck,
                },
                {
                  title: "ROSIUS IA",
                  description: "Asistente virtual disponible 24/7 para orientarte sobre normativa peruana general.",
                  icon: Scale,
                },
                {
                  title: "Leyes y Normas",
                  description: "Directorio actualizado de legislación peruana explicada de forma sencilla.",
                  icon: FileText,
                },
                {
                  title: "Actualidad Legislativa",
                  description: "Mantente informado sobre los últimos cambios en la normativa legal y cómo te afectan.",
                  icon: Newspaper,
                },
                {
                  title: "Análisis y Artículos",
                  description: "Opinión profesional y guías prácticas sobre derecho civil, penal, laboral y más.",
                  icon: FileText,
                },
                {
                  title: "Asesoría Profesional",
                  description: "Contacto directo con nuestra especialista para un análisis individualizado de tu caso.",
                  icon: User,
                },
              ].map((service, index) => (
                <div key={index} className="group relative p-8 rounded-2xl border border-border/50 bg-card hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                    <service.icon className="h-6 w-6 text-secondary group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Link href="#" className="inline-flex items-center text-sm font-medium text-primary group-hover:text-accent transition-colors">
                    Saber más <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOBRE MÍ SECTION */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                  {settings.profile_image_url ? (
                    <img src={settings.profile_image_url} alt={settings.hero_title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-secondary to-secondary/70 flex items-center justify-center text-white font-heading text-6xl">
                      RM
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full md:w-2/3 space-y-6">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Sobre Mí</h2>
                <h3 className="text-xl text-accent font-medium">{settings.hero_title}</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {settings.hero_bio}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div>
                    <strong className="block text-foreground mb-1">Colegiatura</strong>
                    <span className="text-muted-foreground text-sm">[Número de CAL o Colegio]</span>
                  </div>
                  <div>
                    <strong className="block text-foreground mb-1">Especialidades</strong>
                    <span className="text-muted-foreground text-sm">Derecho Civil, Penal, Laboral</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                    Ver perfil completo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACTO RÁPIDO */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-8">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">¿Necesitas asesoría legal?</h2>
            <p className="text-muted-foreground">
              Comunícate para analizar tu situación y encontrar la mejor estrategia legal. 
              Recuerda que este primer contacto no genera automáticamente una relación abogado-cliente.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-secondary hover:bg-secondary/90 text-white">
                  Contactar por WhatsApp
                </Button>
              </a>
              <Link href="/consulta">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base">
                  Consulta de Expediente
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-secondary text-secondary-foreground py-8 border-t border-white/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 space-y-2">
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold tracking-widest text-accent">ROSIUS</span>
                <span className="text-[9px] uppercase tracking-widest text-white/50">La ley, a tu alcance</span>
              </div>
              <p className="text-white/70 max-w-sm text-xs">
                Plataforma jurídica personal dedicada a la difusión de información legal y orientación jurídica en el Perú.
              </p>
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold mb-2 text-accent">Enlaces Rápidos</h4>
              <ul className="space-y-1 text-xs text-white/70">
                <li><Link href="/" className="hover:text-accent transition-colors">Leyes y normas (Pronto)</Link></li>
                <li><Link href="/consulta" className="hover:text-accent transition-colors">Consulta tu caso</Link></li>
                <li><Link href="/" className="hover:text-accent transition-colors">Actualidad jurídica (Pronto)</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold mb-2 text-accent">Legal</h4>
              <ul className="space-y-1 text-xs text-white/70">
                <li><Link href="/" className="hover:text-accent transition-colors">Privacidad</Link></li>
                <li><Link href="/" className="hover:text-accent transition-colors">Términos</Link></li>
                <li><a href={`https://wa.me/${cleanPhone}`} className="hover:text-accent transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-white/50">
            &copy; 2026 ROSIUS. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
