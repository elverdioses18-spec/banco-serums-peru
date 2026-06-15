import { NextResponse } from "next/server";
import { enviarPushATodos } from "@/lib/enviarPush";

export async function POST() {
  try {
    await enviarPushATodos(
      "📝 Nuevo simulacro nacional",
      "Ya está disponible un nuevo simulacro en Ruta SERUMS.",
      "/simulacro-evento"
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }
}