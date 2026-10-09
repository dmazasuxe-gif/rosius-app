"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Scale, X, Send, Bot, User } from "lucide-react"

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) }),
      });

      if (!response.ok) throw new Error("Error en la respuesta");
      
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: data.content }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "Lo siento, hubo un error de conexión. Intenta de nuevo más tarde." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-secondary hover:bg-secondary/90 transition-transform duration-300 ${isOpen ? "scale-0" : "scale-100"} z-50`}
      >
        <Scale className="h-8 w-8 text-accent" />
      </Button>

      <div 
        className={`fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[85vh] bg-background border border-border/50 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 transform origin-bottom-right z-50 overflow-hidden ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"}`}
      >
        <div className="bg-secondary p-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Scale className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg leading-tight">ROSIUS IA</h3>
              <p className="text-xs text-white/70">Asistente Jurídico Virtual</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground p-4">
              <Bot className="h-12 w-12 text-border" />
              <p className="text-sm">
                Hola, soy ROSIUS IA. Estoy aquí para orientarte sobre leyes y derechos en Perú. ¿En qué te puedo ayudar hoy?
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-primary text-white' : 'bg-secondary/10 text-secondary'}`}>
                    {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-card border border-border/50 text-card-foreground rounded-tl-none shadow-sm'}`}>
                    {m.content}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[85%]">
                <div className="shrink-0 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-3 rounded-2xl bg-card border border-border/50 text-card-foreground rounded-tl-none shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-border/50 bg-background shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta legal..."
              className="w-full h-12 pl-4 pr-12 rounded-full border border-input bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !input.trim()} 
              className="absolute right-1 w-10 h-10 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            La IA puede cometer errores. Esta información no reemplaza el consejo legal directo.
          </p>
        </div>
      </div>
    </>
  )
}
