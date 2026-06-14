import { NextResponse } from "next/server";
import webpush from "web-push";
import { supabase } from "@/lib/supabase";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  try {
    const { correo } = await req.json();

    if (!correo) {
      return NextResponse.json(
        { error: "Falta el correo." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("correo", correo)
      .eq("activa", true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No hay suscripciones activas para este correo." },
        { status: 404 }
      );
    }

    const payload = JSON.stringify({
      title: "✅ Ruta SERUMS",
      body: "Tus notificaciones están funcionando correctamente.",
      url: "/ajustes",
    });

    for (const sub of data) {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Notificación de prueba enviada.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error enviando notificación de prueba." },
      { status: 500 }
    );
  }
}
