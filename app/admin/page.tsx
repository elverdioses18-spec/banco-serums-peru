"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarSolicitudes = async () => {
    setCargando(true);

    const { data, error } = await supabase
      .from("solicitudes_premium")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Error cargando solicitudes: " + error.message);
      setCargando(false);
      return;
    }

    setSolicitudes(data || []);
    setCargando(false);
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const aprobarPremium = async (correo: string, idSolicitud: number) => {
    const { error: errorUsuario } = await supabase
      .from("usuarios")
      .update({ premium: true })
      .eq("correo", correo);

    if (errorUsuario) {
      alert("Error activando premium: " + errorUsuario.message);
      return;
    }

    const { error: errorSolicitud } = await supabase
      .from("solicitudes_premium")
      .update({ estado: "aprobado" })
      .eq("id", idSolicitud);

    if (errorSolicitud) {
      alert("Premium activado, pero no se pudo actualizar la solicitud.");
      return;
    }

    alert("Premium aprobado correctamente.");
    cargarSolicitudes();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6">
          Panel Admin - Solicitudes Premium
        </h1>

        {cargando ? (
          <p>Cargando solicitudes...</p>
        ) : solicitudes.length === 0 ? (
          <p>No hay solicitudes todavía.</p>
        ) : (
          <div className="space-y-4">
            {solicitudes.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800 rounded-2xl p-5 border border-slate-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <p>
                    <b>Nombre:</b> {item.nombre}
                  </p>
                  <p>
                    <b>Correo:</b> {item.correo}
                  </p>
                  <p>
                    <b>Código:</b> {item.codigo_pago}
                  </p>
                  <p>
                    <b>Estado:</b>{" "}
                    <span className="font-bold text-yellow-300">
                      {item.estado}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <a
                    href={item.voucher_url}
                    target="_blank"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-bold text-center"
                  >
                    Ver voucher
                  </a>

                  <button
                    onClick={() => aprobarPremium(item.correo, item.id)}
                    disabled={item.estado === "aprobado"}
                    className={`px-4 py-3 rounded-xl font-bold ${
                      item.estado === "aprobado"
                        ? "bg-slate-600 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-500"
                    }`}
                  >
                    {item.estado === "aprobado"
                      ? "Premium aprobado"
                      : "Aprobar Premium"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}