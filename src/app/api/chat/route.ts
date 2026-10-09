import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        role: "assistant",
        content: "Para usar el asistente, el administrador debe configurar la variable de entorno OPENAI_API_KEY en Vercel."
      });
    }

    const systemPrompt = `
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Ha ocurrido un error procesando la consulta." },
      { status: 500 }
    );
  }
}
