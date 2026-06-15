"use client";

import { useEffect, useState } from "react";
import PushNotificationButton from "@/components/PushNotificationButton";

export default function NotificationBell() {
  const [abierto, setAbierto] = useState(false);
  const [mostrarPendiente, setMostrarPendiente] = useState(false);
  const [correo, setCorreo] = useState("");

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual") || "{}");
    const correoUsuario = usuario?.correo;

    if (!correoUsuario) return;

    setCorreo(correoUsuario);

    const pushActivado = localStorage.getItem(`push_activado_${correoUsuario}`);
    const avisoVisto = localStorage.getItem(`push_aviso_visto_${correoUsuario}`);

    if (pushActivado || avisoVisto) {
      setMostrarPendiente(false);
      return;
    }

    if (Notification.permission === "granted") {
      localStorage.setItem(`push_activado_${correoUsuario}`, "true");
      setMostrarPendiente(false);
      return;
    }

    if (Notification.permission === "denied") {
      localStorage.setItem(`push_aviso_visto_${correoUsuario}`, "true");
      setMostrarPendiente(false);
      return;
    }

    setMostrarPendiente(true);
  }, []);

  const marcarComoVisto = () => {
    if (correo) {
      localStorage.setItem(`push_aviso_visto_${correo}`, "true");
    }
    setMostrarPendiente(false);
    setAbierto(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/60 text-xl hover:bg-blue-800"
      >
        🔔

        {mostrarPendiente && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            1
          </span>
        )}
      </button>

      {abierto && (
        <div className="absolute right-0 top-14 z-[9999] w-[420px] rounded-2xl bg-white p-4 text-gray-900 shadow-2xl">
          <h3 className="mb-3 text-lg font-bold">🔔 Notificaciones</h3>

          {mostrarPendiente ? (
            <div className="rounded-xl border border-purple-300 bg-white p-4">
             <p className="mb-3 text-sm leading-relaxed text-black">
  Activa las notificaciones para recibir avisos de:
  <br />
  ✅ Premium activado
  <br />
  ✅ Nuevos simulacros nacionales
  <br />
  ✅ Recordatorios antes del cierre
</p>

              <div className="flex flex-col gap-2">
                <PushNotificationButton />

                <button
                  type="button"
                  onClick={marcarComoVisto}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Más tarde
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No tienes notificaciones pendientes.
            </p>
          )}
        </div>
      )}
    </div>
  );
}