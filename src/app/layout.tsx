import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Chatbot from "@/components/chatbot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ROSIUS | La ley, a tu alcance",
  description: "Plataforma jurídica personal dedicada a la difusión de información legal y a la atención de personas que necesitan orientación jurídica en el Perú.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={cn(
        "min-h-screen bg-background font-sans text-foreground antialiased selection:bg-accent/30 selection:text-foreground",
        inter.variable,
        playfair.variable
      )}>
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
