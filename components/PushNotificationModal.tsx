"use client";

import { useEffect, useState } from "react";
import PushNotificationButton from "@/components/PushNotificationButton";

export default function PushNotificationModal() {
  const [mostrar, setMostrar] = useState(false);
  const [correo, setCorreo] = useState("");

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual") || "{}");
    const correoUsuario = usuario?.correo;

    if (!correoUsuario) return;

    const modalVisto = localStorage.getItem(`push_modal_visto_${correoUsuario}`);
    const pushActivado = localStorage.getItem(`push_activado_${correoUsuario}`);

    if (modalVisto || pushActivado) return;

    if (Notification.permission === "granted") return;
    if (Notification.permission === "denied") {
      localStorage.setItem(`push_modal_visto_${correoUsuario}`, "true");
      return;
    }

    setCorreo(correoUsuario);
    setMostrar(true);
  }, []);

  const cerrarModal = () => {
    if (correo) {
      localStorage.setItem(`push_modal_visto_${correo}`, "true");
    }
    setMostrar(false);
  };

  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
        <div className="mb-3 text-5xl">🔔</div>

        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Activa las notificaciones
        </h2>

        <p className="mb-4 text-sm text-gray-600">
          Te avisaremos cuando se active tu Premium, haya nuevos simulacros
          nacionales o un simulacro esté por finalizar.
        </p>

        <div className="mb-4">
          <PushNotificationButton />
        </div>

        <button
          onClick={cerrarModal}
          className="text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          Más tarde
        </button>
      </div>
    </div>
  );
}