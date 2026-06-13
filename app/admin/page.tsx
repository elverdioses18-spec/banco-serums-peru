"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function AdminPage() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [vistaAdmin, setVistaAdmin] = useState("solicitudes");
const [usuarios, setUsuarios] = useState<any[]>([]);
const [progresosUsuarios, setProgresosUsuarios] = useState<any[]>([]);
  const [autorizado, setAutorizado] = useState(false);
const [passwordAdmin, setPasswordAdmin] = useState("");
const [errorAdmin, setErrorAdmin] = useState("");
const [filtroEstado, setFiltroEstado] = useState("todos");
const [busquedaCorreo, setBusquedaCorreo] = useState("");
const [mostrarPassword, setMostrarPassword] = useState(false);
const [tituloSimulacro, setTituloSimulacro] = useState("");
const [descripcionSimulacro, setDescripcionSimulacro] = useState("");
const [soloPremiumSimulacro, setSoloPremiumSimulacro] = useState(false);
const [fechaInicio, setFechaInicio] = useState("");
const [numeroSimulacro, setNumeroSimulacro] = useState(1);
const [fechaFin, setFechaFin] = useState("");
const [cantidadPreguntas, setCantidadPreguntas] = useState(50);
const [tiempoMinutos, setTiempoMinutos] = useState(60);
const [guardandoSimulacro, setGuardandoSimulacro] = useState(false);
const [simulacroActual, setSimulacroActual] = useState<any>(null);
const [cargandoSimulacroActual, setCargandoSimulacroActual] = useState(true);
const [totalInscritosSimulacro, setTotalInscritosSimulacro] = useState(0);
const [totalRindieronSimulacro, setTotalRindieronSimulacro] = useState(0);
const [totalPendientesSimulacro, setTotalPendientesSimulacro] = useState(0);
const [editandoSimulacro, setEditandoSimulacro] = useState(false);
const [guardandoEdicionSimulacro, setGuardandoEdicionSimulacro] = useState(false);

const [editTituloSimulacro, setEditTituloSimulacro] = useState("");
const [editDescripcionSimulacro, setEditDescripcionSimulacro] = useState("");
const [editSoloPremiumSimulacro, setEditSoloPremiumSimulacro] = useState(false);
const [editFechaInicio, setEditFechaInicio] = useState("");
const [editFechaFin, setEditFechaFin] = useState("");
const [editCantidadPreguntas, setEditCantidadPreguntas] = useState(50);
const [editTiempoMinutos, setEditTiempoMinutos] = useState(60);
const [textoPreguntasSimulacro, setTextoPreguntasSimulacro] = useState("");
const [importandoPreguntas, setImportandoPreguntas] = useState(false);

const cargarSimulacroActual = async () => {
  setCargandoSimulacroActual(true);

  const { data, error } = await supabase
    .from("simulacros_evento")
    .select("*")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(error);
    setCargandoSimulacroActual(false);
    return;
  }

  setSimulacroActual(data);
  if (data) {
    setEditTituloSimulacro(data.titulo || "");
    setEditDescripcionSimulacro(data.descripcion || "");
    setEditFechaInicio(
      data.fecha_inicio
        ? new Date(data.fecha_inicio).toISOString().slice(0, 16)
        : ""
    );
    setEditFechaFin(
      data.fecha_fin
        ? new Date(data.fecha_fin).toISOString().slice(0, 16)
        : ""
    );
    setEditCantidadPreguntas(data.cantidad_preguntas || 50);
    setEditTiempoMinutos(data.tiempo_minutos || 60);
  }
  if (data?.id) {
    const { count: inscritos } = await supabase
      .from("simulacro_inscritos")
      .select("*", { count: "exact", head: true })
      .eq("simulacro_id", data.id);
  
    const { count: rindieron } = await supabase
      .from("simulacro_resultados")
      .select("*", { count: "exact", head: true })
      .eq("simulacro_id", data.id);
  
    setTotalInscritosSimulacro(inscritos || 0);
    setTotalRindieronSimulacro(rindieron || 0);
    setTotalPendientesSimulacro(
      (inscritos || 0) - (rindieron || 0)
    );
  }
  setCargandoSimulacroActual(false);
};
const importarPreguntasSimulacro = async () => {
  if (!simulacroActual?.id) {
    alert("No hay simulacro actual.");
    return;
  }

  if (!textoPreguntasSimulacro.trim()) {
    alert("Pega las preguntas antes de importar.");
    return;
  }

  setImportandoPreguntas(true);

  try {
    const texto = `[${textoPreguntasSimulacro}]`;

    const preguntas = Function(`"use strict"; return (${texto});`)();

    if (!Array.isArray(preguntas) || preguntas.length === 0) {
      alert("No se detectaron preguntas válidas.");
      setImportandoPreguntas(false);
      return;
    }

    const letras = ["A", "B", "C", "D"];

    const preguntasParaInsertar = preguntas.map((item: any, index: number) => ({
      simulacro_id: simulacroActual.id,
      pregunta: item.pregunta,
      opcion_a: item.opciones?.[0] || "",
      opcion_b: item.opciones?.[1] || "",
      opcion_c: item.opciones?.[2] || "",
      opcion_d: item.opciones?.[3] || "",
      correcta: letras[item.correcta],
      explicacion: item.explicacion || "",
      orden: index + 1,
    }));

    const { error } = await supabase
      .from("simulacro_preguntas")
      .insert(preguntasParaInsertar);

    setImportandoPreguntas(false);

    if (error) {
      console.error(error);
      alert("Error al importar preguntas.");
      return;
    }

    alert(`Se importaron ${preguntas.length} preguntas correctamente.`);
    setTextoPreguntasSimulacro("");
    await cargarSimulacroActual();
  } catch (error) {
    console.error(error);
    setImportandoPreguntas(false);
    alert("Formato inválido. Revisa comas, llaves y corchetes.");
  }
};
const guardarEdicionSimulacro = async () => {
  if (!simulacroActual?.id) return;

  setGuardandoEdicionSimulacro(true);

  const { error } = await supabase
    .from("simulacros_evento")
    .update({
      titulo: editTituloSimulacro,
      descripcion: editDescripcionSimulacro,
      fecha_inicio: new Date(editFechaInicio).toISOString(),
      fecha_fin: new Date(editFechaFin).toISOString(),
      cantidad_preguntas: editCantidadPreguntas,
      tiempo_minutos: editTiempoMinutos,
    })
    .eq("id", simulacroActual.id);

  setGuardandoEdicionSimulacro(false);

  if (error) {
    console.error(error);
    alert("Error al editar simulacro.");
    return;
  }

  alert("Simulacro actualizado correctamente.");
  setEditandoSimulacro(false);
  await cargarSimulacroActual();
};
const crearSimulacroEvento = async () => {
  if (!tituloSimulacro || !fechaInicio || !fechaFin) {
    alert("Completa título, fecha de inicio y fecha de fin.");
    return;
  }

  setGuardandoSimulacro(true);
  const { data: simulacroExistente } = await supabase
  .from("simulacros_evento")
  .select("id")
  .eq("numero_simulacro", numeroSimulacro)
  .maybeSingle();

if (simulacroExistente) {
  setGuardandoSimulacro(false);
  alert("Ya existe un simulacro con ese número. Usa otro número.");
  return;
}

  const { error } = await supabase.from("simulacros_evento").insert({
    titulo: tituloSimulacro,
    numero_simulacro: numeroSimulacro,
    descripcion: descripcionSimulacro,
    fecha_inicio: new Date(fechaInicio).toISOString(),
    fecha_fin: new Date(fechaFin).toISOString(),
    cantidad_preguntas: cantidadPreguntas,
    tiempo_minutos: tiempoMinutos,
    estado: "programado",
    solo_premium: soloPremiumSimulacro,
  });

  setGuardandoSimulacro(false);

  if (error) {
    console.error(error);
    alert("Error al crear simulacro.");
    return;
  }

  alert("Simulacro creado correctamente.");

  await cargarSimulacroActual();

  setTituloSimulacro("");
  setNumeroSimulacro(1);
  setDescripcionSimulacro("");
  setFechaInicio("");
  setFechaFin("");
  setCantidadPreguntas(50);
  setTiempoMinutos(60);
  setSoloPremiumSimulacro(false);
};

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
    cargarProgresosUsuarios();
  }, []);

  useEffect(() => {
    cargarSimulacroActual();
  }, []);

  const cargarProgresosUsuarios = async () => {
    const { data, error } = await supabase
      .from("progreso_usuarios")
      .select("*");
  
    if (error) {
      mostrarAlertaBonita("Error cargando progresos: " + error.message);
      return;
    }
  
    setProgresosUsuarios(data || []);
  };
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
  const obtenerResueltasUsuario = (correo: string) => {
    const progreso = progresosUsuarios.find(
      (item) => item.correo === correo
    );
  
    return progreso?.datos?.preguntasResueltas?.length || 0;
  };
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

<button
  onClick={() => setVistaAdmin("crearSimulacro")}
  className={`flex-1 py-3 rounded-xl font-bold ${
    vistaAdmin === "crearSimulacro"
      ? "bg-purple-600 text-white"
      : "bg-slate-800 text-slate-300"
  }`}
>
  Crear simulacro
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
        className="bg-slate-800 rounded-2xl p-5 border border-slate-700 flex items-center justify-between gap-4"
      >
         <div>
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
<div className="bg-slate-900 rounded-xl p-4 border border-slate-700 text-center min-w-[110px]">
<p className="text-xs text-slate-400">📚 Resueltas</p>
  <p className="text-2xl font-extrabold text-blue-400">
  {obtenerResueltasUsuario(usuario.correo)}
  </p>
</div>
        </div>
      ))
    )}
  </div>
)}

{vistaAdmin === "crearSimulacro" && (
  <>
  
<section className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-6 space-y-4 mb-6 text-white">
  <h2 className="text-2xl font-extrabold text-[#06174a]">
    Crear simulacro evento
  </h2>

  <input
    type="text"
    placeholder="Título del simulacro"
    value={tituloSimulacro}
    onChange={(e) => setTituloSimulacro(e.target.value)}
    className="w-full bg-slate-900 border border-slate-500 text-white rounded-xl p-3"
  />
  <input
  type="number"
  placeholder="Número de simulacro"
  value={numeroSimulacro}
  onChange={(e) => setNumeroSimulacro(Number(e.target.value))}
  className="w-full bg-slate-900 border border-slate-500 text-white rounded-xl p-3"
/>

  <textarea
    placeholder="Descripción"
    value={descripcionSimulacro}
    onChange={(e) => setDescripcionSimulacro(e.target.value)}
    className="w-full bg-slate-900 border border-slate-500 text-white rounded-xl p-3"
  />

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="font-bold text-sm">Inicio</label>
      <input
        type="datetime-local"
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
        className="w-full bg-slate-900 border border-slate-500 text-white rounded-xl p-3"
      />
    </div>

    <div>
      <label className="font-bold text-sm">Fin</label>
      <input
        type="datetime-local"
        value={fechaFin}
        onChange={(e) => setFechaFin(e.target.value)}
       className="w-full bg-slate-900 border border-slate-500 text-white rounded-xl p-3"
      />
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="font-bold text-sm">Cantidad de preguntas</label>
      <input
        type="number"
        value={cantidadPreguntas}
        onChange={(e) => setCantidadPreguntas(Number(e.target.value))}
        className="w-full bg-slate-900 border border-slate-500 text-white rounded-xl p-3"
      />
    </div>

    <div>
      <label className="font-bold text-sm">Tiempo límite en minutos</label>
      <input
        type="number"
        value={tiempoMinutos}
        onChange={(e) => setTiempoMinutos(Number(e.target.value))}
        className="w-full bg-slate-900 border border-slate-500 text-white rounded-xl p-3"
      />
    </div>
  </div>
  <div className="flex items-center gap-3 mt-4">
  <input
    type="checkbox"
    checked={soloPremiumSimulacro}
    onChange={(e) => setSoloPremiumSimulacro(e.target.checked)}
    className="w-5 h-5"
  />

  <label className="text-white font-medium">
    ⭐ Simulacro exclusivo para usuarios Premium
  </label>
</div>
  <button
    onClick={crearSimulacroEvento}
    disabled={guardandoSimulacro}
    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold py-3 rounded-xl"
  >
    {guardandoSimulacro ? "Creando..." : "Crear simulacro"}
  </button>
</section>

<section className="bg-slate-800 rounded-2xl p-5 border border-slate-700 mt-6">
  <h2 className="text-xl font-bold text-white mb-4">
    📌 Simulacro actual
  </h2>

  {cargandoSimulacroActual ? (
    <p className="text-slate-400">
      Cargando simulacro...
    </p>
  ) : !simulacroActual ? (
    <p className="text-slate-400">
      No hay simulacros creados.
    </p>
  ) : (
    <div className="space-y-2 text-slate-200">
      <p>
        <b>ID:</b> {simulacroActual.id}
      </p>

      <p>
        <b>Título:</b> {simulacroActual.titulo}
      </p>

      <p>
        <b>Preguntas:</b> {simulacroActual.cantidad_preguntas}
      </p>

      <p>
        <b>Tiempo:</b> {simulacroActual.tiempo_minutos} min
      </p>

      <p>
  <b>Tipo:</b>{" "}
  {simulacroActual.solo_premium
    ? "👑 Premium"
    : "🏆 Gratuito"}
</p>

      <p>
  <b>👥 Inscritos:</b> {totalInscritosSimulacro}
</p>

<p>
  <b>📝 Rindieron:</b> {totalRindieronSimulacro}
</p>

<p>
  <b>⏳ Pendientes:</b> {totalPendientesSimulacro}
</p>
      <p>
        <b>Inicio:</b>{" "}
        {new Date(
          simulacroActual.fecha_inicio
        ).toLocaleString("es-PE")}
      </p>

      <p>
        <b>Fin:</b>{" "}
        {new Date(
          simulacroActual.fecha_fin
        ).toLocaleString("es-PE")}
      </p>
      <button
  onClick={() => setEditandoSimulacro(true)}
  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl"
>
  ✏️ Editar simulacro
</button>
<div className="mt-6 border-t border-slate-700 pt-5">
  <h3 className="text-lg font-bold text-white mb-2">
    📋 Importar preguntas
  </h3>

  <p className="text-sm text-slate-400 mb-3">
    Pega aquí las preguntas del simulacro en formato objeto.
  </p>

  <textarea
    value={textoPreguntasSimulacro}
    onChange={(e) => setTextoPreguntasSimulacro(e.target.value)}
    placeholder={`{
  pregunta: "Texto de la pregunta...",
  opciones: [
    "Opción A",
    "Opción B",
    "Opción C",
    "Opción D"
  ],
  correcta: 1,
  explicacion: "Explicación..."
},`}
    className="w-full min-h-[260px] rounded-xl p-4 bg-slate-900 border border-slate-600 text-white text-sm font-mono"
  />

  <button
  onClick={importarPreguntasSimulacro}
   
    disabled={importandoPreguntas}
    className="mt-3 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold py-3 rounded-xl"
  >
    {importandoPreguntas ? "Importando..." : "Importar preguntas"}
  </button>
</div>
{editandoSimulacro && (
  <div className="mt-5 border-t border-slate-700 pt-5 space-y-3">
    <input
      type="text"
      value={editTituloSimulacro}
      onChange={(e) => setEditTituloSimulacro(e.target.value)}
      className="w-full rounded-xl p-3 bg-slate-900 border border-slate-600 text-white"
    />

    <textarea
      value={editDescripcionSimulacro}
      onChange={(e) => setEditDescripcionSimulacro(e.target.value)}
      className="w-full rounded-xl p-3 bg-slate-900 border border-slate-600 text-white"
    />

    <input
      type="datetime-local"
      value={editFechaInicio}
      onChange={(e) => setEditFechaInicio(e.target.value)}
      className="w-full rounded-xl p-3 bg-slate-900 border border-slate-600 text-white"
    />

    <input
      type="datetime-local"
      value={editFechaFin}
      onChange={(e) => setEditFechaFin(e.target.value)}
      className="w-full rounded-xl p-3 bg-slate-900 border border-slate-600 text-white"
    />

    <input
      type="number"
      value={editCantidadPreguntas}
      onChange={(e) => setEditCantidadPreguntas(Number(e.target.value))}
      className="w-full rounded-xl p-3 bg-slate-900 border border-slate-600 text-white"
    />

    <input
      type="number"
      value={editTiempoMinutos}
      onChange={(e) => setEditTiempoMinutos(Number(e.target.value))}
      className="w-full rounded-xl p-3 bg-slate-900 border border-slate-600 text-white"
    />

    <div className="flex gap-3">
    <button
  onClick={guardarEdicionSimulacro}
  disabled={guardandoEdicionSimulacro}
  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-3 rounded-xl"
>
  {guardandoEdicionSimulacro ? "Guardando..." : "Guardar cambios"}
</button>

      <button
        onClick={() => setEditandoSimulacro(false)}
        className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-xl"
      >
        Cancelar
      </button>
    </div>
  </div>
)}
    </div>
  )}
</section>
  </>
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