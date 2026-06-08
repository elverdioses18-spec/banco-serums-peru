"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function AdminPage() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [vistaAdmin, setVistaAdmin] = useState("solicitudes");
const [usuarios, setUsuarios] = useState<any[]>([]);
  const [autorizado, setAutorizado] = useState(false);
const [passwordAdmin, setPasswordAdmin] = useState("");
const [errorAdmin, setErrorAdmin] = useState("");
const [filtroEstado, setFiltroEstado] = useState("todos");
const [busquedaCorreo, setBusquedaCorreo] = useState("");
const [mostrarPassword, setMostrarPassword] = useState(false);

  const cargarSolicitudes = async () => {
    setCargando(true);
    
    
    const { data, error } = await supabase
      .from("solicitudes_premium")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) {
     mostrarAlertaBonita("Error cargando solicitudes: " + error.message);
      setCargando(false);
      return;
    }

    setSolicitudes(data || []);
    setCargando(false);
  };

  const cargarUsuarios = async () => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("created_at", { ascending: false });
  
    if (error) {
      mostrarAlertaBonita("Error cargando usuarios: " + error.message);
      return;
    }
  
    setUsuarios(data || []);
  };
  useEffect(() => {
    cargarSolicitudes();
    cargarUsuarios();
  }, []);

  useEffect(() => {
    const canal = supabase
      .channel("solicitudes-premium-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "solicitudes_premium",
        },
        () => {
          cargarSolicitudes();
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(canal);
    };
  }, []);
  useEffect(() => {
    const canal = supabase
      .channel("usuarios-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "usuarios",
        },
        () => {
          cargarUsuarios();
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  const aprobarPremium = async (correo: string, idSolicitud: number) => {
    const { error: errorUsuario } = await supabase
      .from("usuarios")
      .update({ premium: true })
      .eq("correo", correo);

    if (errorUsuario) {
      mostrarAlertaBonita("Error activando premium: " + errorUsuario.message);
      return;
    }

    const { error: errorSolicitud } = await supabase
      .from("solicitudes_premium")
      .update({ estado: "aprobado" })
      .eq("id", idSolicitud);

    if (errorSolicitud) {
      mostrarAlertaBonita("Premium activado, pero no se pudo actualizar la solicitud.");
      return;
    }

    mostrarAlertaBonita("Premium aprobado correctamente.");
    cargarSolicitudes();
  };
  const quitarPremium = async (correo: string, idSolicitud: number) => {
    const confirmar = confirm(`¿Quitar Premium a ${correo}?`);
  
    if (!confirmar) return;
     
    const { error: errorUsuario } = await supabase
      .from("usuarios")
      .update({ premium: false })
      .eq("correo", correo);
  
    if (errorUsuario) {
      mostrarAlertaBonita("Error quitando premium: " + errorUsuario.message);
      return;
    }
  
    await supabase
      .from("solicitudes_premium")
      .update({ estado: "pendiente" })
      .eq("id", idSolicitud);
  
      mostrarAlertaBonita("Premium retirado correctamente.");
    cargarSolicitudes();
  };
  const eliminarSolicitud = async (idSolicitud: number) => {
    const confirmar = confirm("¿Eliminar esta solicitud de la bandeja?");
  
    if (!confirmar) return;
  
    const { error } = await supabase
      .from("solicitudes_premium")
      .delete()
      .eq("id", idSolicitud);
  
    if (error) {
      mostrarAlertaBonita("Error eliminando solicitud: " + error.message);
      return;
    }
  
    mostrarAlertaBonita("Solicitud eliminada de la bandeja.");
    cargarSolicitudes();
  };
  const [modalMensaje, setModalMensaje] = useState("");
      const [mostrarModalMensaje, setMostrarModalMensaje] = useState(false);
      
      const mostrarAlertaBonita = (mensaje: string) => {
        setModalMensaje(mensaje);
        setMostrarModalMensaje(true);
      };
  if (!autorizado) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="bg-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl">
          <h1 className="text-3xl font-extrabold mb-4 text-center">
            Acceso Admin
          </h1>
  
          <div className="relative">
          <input
            type={mostrarPassword ? "text" : "password"}
            placeholder="Contraseña de administrador"
            value={passwordAdmin}
            onChange={(e) => setPasswordAdmin(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-800 text-white  border mb-4 border-zinc-600 "
          />
          <button
    type="button"
    onClick={() => setMostrarPassword(!mostrarPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {mostrarPassword ? "🙈" : "👁️"}
  </button>
</div>
  
          {errorAdmin && (
            <p className="text-red-400 text-sm font-bold mb-3">
              {errorAdmin}
            </p>
          )}
  
          <button
            onClick={() => {
              if (passwordAdmin === "tuopiytuopiyD18elverdioses") {
                setAutorizado(true);
              } else {
                setErrorAdmin("Contraseña incorrecta.");
              }
            }}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold"
          >
            Ingresar
          </button>
        </div>
      </main>
    );
  }
  const solicitudesFiltradas = solicitudes.filter((item) => {
    const coincideEstado =
      filtroEstado === "todos" ? true : item.estado === filtroEstado;
  
    const coincideCorreo = item.correo
      ?.toLowerCase()
      .includes(busquedaCorreo.toLowerCase());
  
    return coincideEstado && coincideCorreo;
  });
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6">
          Panel Admin - Solicitudes Premium
        </h1>
        <div className="flex gap-2 mb-4">
  <button
    onClick={() => setVistaAdmin("solicitudes")}
    className={`flex-1 py-3 rounded-xl font-bold ${
      vistaAdmin === "solicitudes"
        ? "bg-blue-600 text-white"
        : "bg-slate-800 text-slate-300"
    }`}
  >
    Solicitudes
  </button>

  <button
    onClick={() => setVistaAdmin("usuarios")}
    className={`flex-1 py-3 rounded-xl font-bold ${
      vistaAdmin === "usuarios"
        ? "bg-blue-600 text-white"
        : "bg-slate-800 text-slate-300"
    }`}
  >
    Usuarios
  </button>
</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
  <select
    value={filtroEstado}
    onChange={(e) => setFiltroEstado(e.target.value)}
    className="bg-slate-800 border border-slate-700 text-white p-3 rounded-xl"
  >
    <option value="todos">Todos</option>
    <option value="pendiente">Pendientes</option>
    <option value="aprobado">Aprobados</option>
    <option value="rechazado">Rechazados</option>
  </select>

  <input
    type="text"
    placeholder="Buscar por correo..."
    value={busquedaCorreo}
    onChange={(e) => setBusquedaCorreo(e.target.value)}
    className="bg-slate-800 border border-slate-700 text-white p-3 rounded-xl"
  />
</div>

{vistaAdmin === "usuarios" && (
  <div className="space-y-4">
    {usuarios.length === 0 ? (
      <p className="text-slate-300">No hay usuarios registrados.</p>
    ) : (
      usuarios.map((usuario) => (
        <div
          key={usuario.id}
          className="bg-slate-800 rounded-2xl p-5 border border-slate-700"
        >
          <p><b>Nombre:</b> {usuario.nombre}</p>
          <p><b>Correo:</b> {usuario.correo}</p>
          <p>
            <b>Premium:</b>{" "}
            {usuario.premium ? (
              <span className="text-green-400 font-bold">Sí</span>
            ) : (
              <span className="text-yellow-400 font-bold">No</span>
            )}
          </p>
        </div>
      ))
    )}
  </div>
)}

{vistaAdmin === "solicitudes" && (
  <div>
        {cargando ? (
          <p>Cargando solicitudes...</p>
        ) : solicitudes.length === 0 ? (
          <p>No hay solicitudes todavía.</p>
        ) : (
          <div className="space-y-4">
            {solicitudesFiltradas.map((item) => (
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

<button
  onClick={() => quitarPremium(item.correo, item.id)}
  className="px-4 py-3 rounded-xl font-bold bg-yellow-600 hover:bg-yellow-500"
>
  Quitar Premium
</button>

<button
  onClick={() => eliminarSolicitud(item.id)}
  className="px-4 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-500"
>
  🗑️ Eliminar de bandeja
</button>

                </div>
              </div>
            ))}
          </div>
                )}
                </div>
              )}
                    </div>
      
      {mostrarModalMensaje && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-7 text-center">
      <div className="text-5xl mb-4">
        ⚠️
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
        Atención
      </h2>

      <p className="text-slate-600 leading-relaxed mb-6">
        {modalMensaje}
      </p>

      <button
        onClick={() => setMostrarModalMensaje(false)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl"
      >
        Entendido
      </button>
    </div>
  </div>
)}
    </main>
  );
}