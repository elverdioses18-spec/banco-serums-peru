import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { cantidad, area, dificultad } = await req.json();

    const respuesta = await openai.chat.completions.create({
        model: "gpt-5.4-mini",
      messages: [
        {
          role: "system",
          content: `
Eres un generador experto de preguntas tipo SERUMS Perú.

Genera preguntas estilo MINSA/CONAREME.

Reglas:
- 4 alternativas A, B, C y D.
- Preguntas analíticas.
- Casos clínicos cuando corresponda.
- Distractores creíbles.
- Evita preguntas simples de memoria.
- Alterna la respuesta correcta.
- Incluye explicación breve.
          `,
        },
        {
          role: "user",
          content: `
Genera ${cantidad} preguntas.

Área:
${area}

Dificultad:
${dificultad}

Devuelve en formato JSON:

[
 {
  "pregunta":"",
  "opciones":["","","",""],
  "correcta":0,
  "explicacion":""
 }
]
          `,
        },
      ],
    });

    return NextResponse.json({
      preguntas: respuesta.choices[0].message.content,
    });

  } catch (error:any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}