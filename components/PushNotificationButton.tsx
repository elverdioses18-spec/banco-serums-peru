"use client";

import { useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export default function PushNotificationButton() {
  const [loading, setLoading] = useState(false);

  const activarNotificaciones = async () => {
    try {
      setLoading(true);

      if (!("serviceWorker" in navigator)) {
        alert("Tu navegador no soporta Service Worker.");
        return;
      }

      if (!("PushManager" in window)) {
        alert("Tu navegador no soporta notificaciones push.");
        return;
      }

      const permiso = await Notification.requestPermission();

      if (permiso !== "granted") {
        alert("No aceptaste las notificaciones.");
        return;
      }

      await navigator.serviceWorker.register("/sw.js");

const registration = await navigator.serviceWorker.ready;

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicKey) {
        alert("Falta configurar NEXT_PUBLIC_VAPID_PUBLIC_KEY.");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const usuario = JSON.parse(localStorage.getItem("usuarioActual") || "{}");

      const correo = usuario?.correo;
      const nombre = usuario?.nombre || usuario?.nombres || null;

      if (!correo) {
        alert("Primero debes iniciar sesión para activar notificaciones.");
        return;
      }

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          nombre,
          subscription,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "No se pudo guardar la suscripción.");
        return;
      }

      alert("✅ Notificaciones activadas correctamente.");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al activar notificaciones.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={activarNotificaciones}
      disabled={loading}
      className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700 disabled:opacity-60"
    >
      {loading ? "Activando..." : "🔔 Activar notificaciones"}
    </button>
  );
}