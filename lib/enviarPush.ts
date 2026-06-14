import webpush from "web-push";
import { supabase } from "@/lib/supabase";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function enviarPushPorCorreo(
  correo: string,
  titulo: string,
  mensaje: string,
  url = "/"
) {
  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("correo", correo)
    .eq("activa", true);

  if (error || !data?.length) {
    console.error("No se encontraron suscripciones:", error);
    return;
  }

  const payload = JSON.stringify({
    title: titulo,
    body: mensaje,
    url,
  });

  for (const sub of data) {
    try {
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
    } catch (err) {
      console.error("Error enviando push:", err);
    }
  }
}