import { NextResponse } from "next/server";
import { enviarPushPorCorreo } from "@/lib/enviarPush";

export async function POST(req: Request) {
  try {
    const { correo } = await req.json();

    if (!correo) {
      return NextResponse.json(
        { error: "Falta el correo." },
        { status: 400 }
      );
    }

    await enviarPushPorCorreo(
      correo,
      "✅ Premium activado",
      "Tu cuenta Premium ya está activa en Ruta SERUMS.",
      "/"
    );

    return NextResponse.json({
      ok: true,
      message: "Notificación de Premium enviada.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error enviando notificación de Premium." },
      { status: 500 }
    );
  }
}