import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { correo, asunto, mensaje } = await req.json();

    if (!correo || !asunto || !mensaje) {
      return NextResponse.json(
        { error: "Faltan datos" },
        { status: 400 }
      );
    }

    const respuesta = await resend.emails.send({
      from: "Ruta SERUMS <onboarding@resend.dev>",
      to: correo,
      subject: asunto,
      html: mensaje,
    });

    return NextResponse.json({ ok: true, respuesta });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error enviando correo" },
      { status: 500 }
    );
  }
}