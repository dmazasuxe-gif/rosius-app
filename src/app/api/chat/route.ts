import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        role: "assistant",
        content: "Para usar el asistente, el administrador debe configurar la variable de entorno GEMINI_API_KEY en Vercel."
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const systemInstruction = `
Eres "ROSIUS IA", el asistente jurídico virtual de la abogada Rosita Ysela Maza Suxe y su plataforma ROSIUS en Perú.
Tu objetivo es orientar a las personas sobre sus derechos, leyes peruanas, procedimientos civiles, penales y laborales.
REGLAS ESTRICTAS:
1. Explica los conceptos de forma sencilla y clara.
2. NUNCA garantices un resultado legal ni ofrezcas respuestas definitivas sobre un caso particular sin revisión profesional.
3. SIEMPRE aclara que eres un asistente de IA y que la consulta no sustituye a la asesoría directa de la abogada Rosita.
4. Si hay plazos legales urgentes, pide al usuario que contacte inmediatamente a la abogada.
5. NO inventes números de leyes o artículos.
6. Termina tus respuestas ofreciendo que contacten a la firma mediante el formulario web.
    `;

    // Extraer el último mensaje del usuario para enviarlo a Gemini
    const lastMessage = messages[messages.length - 1].content;
    
    // Preparar el historial (opcional, pero ayuda a Gemini a tener contexto)
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "SYSTEM PROMPT INICIAL: " + systemInstruction }] },
        { role: "model", parts: [{ text: "Entendido. Soy ROSIUS IA, seguiré estrictamente todas las reglas." }] },
        ...history
      ],
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ role: "assistant", content: text });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Ha ocurrido un error procesando la consulta." },
      { status: 500 }
    );
  }
}
