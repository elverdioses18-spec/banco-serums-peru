import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { correo, nombre, subscription } = body;

    if (!correo || !subscription?.endpoint) {
      return NextResponse.json(
        { error: "Faltan datos para guardar la suscripción." },
        { status: 400 }
      );
    }

    const p256dh = subscription.keys?.p256dh;
    const auth = subscription.keys?.auth;

    if (!p256dh || !auth) {
      return NextResponse.json(
        { error: "La suscripción no tiene claves válidas." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          correo,
          nombre: nombre || null,
          endpoint: subscription.endpoint,
          p256dh,
          auth,
          user_agent: req.headers.get("user-agent") || null,
          activa: true,
        },
        { onConflict: "endpoint" }
      );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Suscripción push guardada correctamente.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno al guardar la suscripción." },
      { status: 500 }
    );
  }
}