"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ClipboardPlus,
  GraduationCap,
  Clock,
  List,
  Bookmark,
  ChevronRight,
  UserCircle,
} from "lucide-react";

type Pregunta = {
  id: number;
  pregunta: string;
  opcion_a: string;
  opcion_b: string;
  opcion_c: string;
  opcion_d: string;
  correcta: string;
};

export default function ExamenSimulacroEventoPage() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState("");
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const respuestasRef = useRef<Record<number, string>>({});
const [finalizado, setFinalizado] = useState(false);
const [puntaje, setPuntaje] = useState(0);
const [resultadoGuardado, setResultadoGuardado] = useState(false);
const [yaRindio, setYaRindio] = useState(false);
const [inicioExamen, setInicioExamen] = useState<number>(Date.now());
const [tiempoRestante, setTiempoRestante] = useState(0);
const [sinSesion, setSinSesion] = useState(false);
const [noInscrito, setNoInscrito] = useState(false);
const [simulacroActual, setSimulacroActual] = useState<any>(null);
const [modalInicio, setModalInicio] = useState(false);
const [esPremium, setEsPremium] = useState(false);
const [bloqueoPremium, setBloqueoPremium] = useState(false);

  useEffect(() => {
    cargarPreguntas();
  }, []);

  const cargarPreguntas = async () => {
    const { data: simulacroData } = await supabase
  .from("simulacros_evento")
  .select("*")
  .order("id", { ascending: false })
  .limit(1)
  .maybeSingle();

if (!simulacroData) {
  setCargando(false);
  return;
}

setSimulacroActual(simulacroData);
setTiempoRestante((simulacroData.tiempo_minutos || 60) * 60);
const premiumGuardado = localStorage.getItem("premium") === "true";
setEsPremium(premiumGuardado);

if (simulacroData.solo_premium && !premiumGuardado) {
  setBloqueoPremium(true);
  setCargando(false);
  return;
}
const usuarioModal = JSON.parse(
  localStorage.getItem("usuarioActual") || "{}"
);

const claveModal = `modalInicioVisto_${simulacroData.id}_${usuarioModal?.correo}`;

if (!localStorage.getItem(claveModal)) {
  setModalInicio(true);
}
    const { data, error } = await supabase
    .from("simulacro_preguntas")
    .select("*")
    .eq("simulacro_id", simulacroData.id)
    .order("orden");

    if (error) {
      console.error(error);
      setCargando(false);
      return;
    }

    setPreguntas(data || []);

    const usuario = JSON.parse(
      localStorage.getItem("usuarioActual") || "{}"
    );
    if (!usuario?.correo) {
      setSinSesion(true);
      setCargando(false);
      return;
    }
    
    const correoUsuario = usuario.correo.trim().toLowerCase();
    
    const { data: inscrito } = await supabase
      .from("simulacro_inscritos")
      .select("*")
      .eq("simulacro_id", simulacroData.id)
      .ilike("correo", correoUsuario)
      .limit(1)
      .maybeSingle();
    
    if (!inscrito) {
      setNoInscrito(true);
      setCargando(false);
      return;
    }
      if (usuario?.correo) {
     
      const { data: resultadoPrevio } = await supabase
        .from("simulacro_resultados")
        .select("*")
        .eq("simulacro_id", simulacroData.id)
        .ilike("correo", correoUsuario)
        .limit(1)
        .maybeSingle();
    
      if (resultadoPrevio) {
        setYaRindio(true);
        setCargando(false);
        return;
      }
    
      const { data: progreso } = await supabase
        .from("simulacro_progreso")
        .select("*")
        .eq("simulacro_id", simulacroData.id)
        .eq("correo", usuario.correo)
        .eq("estado", "en_progreso")
        .maybeSingle();
    
      if (progreso) {
        setIndiceActual(progreso.pregunta_actual || 0);
        setRespuestas(progreso.respuestas || {});
        respuestasRef.current = progreso.respuestas || {};

        if (progreso.tiempo_restante) {
          setTiempoRestante(progreso.tiempo_restante);
        }
    
        const respuestaGuardada =
          progreso.respuestas?.[data?.[progreso.pregunta_actual]?.id];
    
        if (respuestaGuardada) {
          setRespuestaSeleccionada(respuestaGuardada);
        }
      }
    }
    
    setCargando(false);
  };
   
  const preguntaActual = preguntas[indiceActual];
   
  const guardarProgreso = async (
  preguntaActualIndex: number,
  respuestasActuales: Record<number, string>,
  tiempoActual: number = tiempoRestante
) => {
  if (!simulacroActual?.id) return;
    const usuario = JSON.parse(
      localStorage.getItem("usuarioActual") || "{}"
    );
  
    if (!usuario?.correo) return;
  
    await supabase
      .from("simulacro_progreso")
      .upsert(
        {
          simulacro_id: simulacroActual.id,
          correo: usuario.correo,
          pregunta_actual: preguntaActualIndex,
          respuestas: respuestasActuales,
          tiempo_restante: tiempoActual,
          estado: "en_progreso",
        },
        {
          onConflict: "simulacro_id,correo",
        }
      );
  };
  useEffect(() => {
    if (finalizado || yaRindio || cargando || modalInicio) return;
  
    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          finalizarSimulacroAutomatico();
          return 0;
        }
  
        const nuevoTiempo = prev - 1;
  
        if (nuevoTiempo % 5 === 0) {
          guardarProgreso(indiceActual, respuestas, nuevoTiempo);
        }
  
        return nuevoTiempo;
      });
    }, 1000);
  
    return () => clearInterval(intervalo);
  }, [finalizado, yaRindio, cargando, modalInicio, indiceActual, respuestas]);
  if (!preguntaActual) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center text-[#06194a] p-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm border text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
  
          <h1 className="text-2xl font-extrabold mb-2">
            No hay preguntas cargadas
          </h1>
  
          <p className="text-slate-600 mb-6">
            Este simulacro aún no tiene preguntas registradas.
          </p>
  
          <a
            href="/simulacro-evento"
            className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl"
          >
            Volver al evento
          </a>
        </div>
      </main>
    );
  }
  if (bloqueoPremium) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border text-center max-w-md">
          <div className="text-5xl mb-4">👑</div>
  
          <h1 className="text-2xl font-extrabold mb-2">
            Simulacro exclusivo Premium
          </h1>
  
          <p className="text-slate-600 mb-6">
            Este simulacro está disponible solo para usuarios Premium.
          </p>
  
          <a
            href="/simulacro-evento"
            className="block bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-3 rounded-xl"
          >
            Volver al evento
          </a>
        </div>
      </main>
    );
  }
  if (sinSesion) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border text-center max-w-md">
          <div className="text-5xl mb-4">🔐</div>
  
          <h1 className="text-2xl font-extrabold mb-2">
            Debes iniciar sesión
          </h1>
  
          <p className="text-slate-600 mb-6">
            Inicia sesión para participar en el simulacro.
          </p>
  
          <a
            href="/login"
            className="block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl"
          >
            Iniciar sesión
          </a>
        </div>
      </main>
    );
  }
  if (noInscrito) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border text-center max-w-md">
          <div className="text-5xl mb-4">🚫</div>
  
          <h1 className="text-2xl font-extrabold mb-2">
            No estás inscrito
          </h1>
  
          <p className="text-slate-600 mb-6">
            Debes registrarte en el simulacro antes de rendirlo.
          </p>
  
          <a
            href="/simulacro-evento"
            className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl"
          >
            Volver al evento
          </a>
        </div>
      </main>
    );
  }
  if (yaRindio) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 text-[#06194a] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border text-center max-w-md">
          <div className="text-6xl mb-4">🏆</div>
  
          <h1 className="text-2xl font-extrabold mb-2">
            Ya participaste en este simulacro
          </h1>
  
          <p className="text-slate-600 mb-6">
            Solo se permite un intento por usuario.
          </p>
  
          <a
            href="/simulacro-evento/ranking"
            className="block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl"
          >
            Ver ranking
          </a>
        </div>
      </main>
    );
  }
  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center text-[#06194a]">
        Cargando preguntas...
      </main>
    );
  }
  const formatearTiempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const seg = segundos % 60;
  
    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
  };
  const finalizarSimulacroAutomatico = async () => {
    if (finalizado || resultadoGuardado) return;
  
    const respuestasActuales = respuestasRef.current;

    const correctas = preguntas.filter(
      (pregunta) => respuestasActuales[pregunta.id] === pregunta.correcta
    ).length;
  
    setPuntaje(correctas);
    await guardarResultado(correctas);
    setFinalizado(true);
  };
  const guardarResultado = async (correctas: number) => {
    if (resultadoGuardado) return;
    if (!simulacroActual?.id) return;
  
    const usuario = JSON.parse(
      localStorage.getItem("usuarioActual") || "{}"
    );
  
    if (!usuario?.correo) {
      alert("No se encontró usuario activo.");
      return;
    }
  
    const porcentaje = Math.round((correctas / preguntas.length) * 100);
  
    const { error } = await supabase
    .from("simulacro_resultados")
    .upsert(
      {
        simulacro_id: simulacroActual.id,
        correo: usuario.correo,
        nombre: usuario.nombre || "Usuario",
        avatar: usuario.avatar || "avatar1",
        puntaje: correctas,
        total_preguntas: preguntas.length,
        porcentaje,
        tiempo_segundos: Math.floor((Date.now() - inicioExamen) / 1000),
        respuestas: respuestasRef.current,
      },
      {
        onConflict: "simulacro_id,correo",
      }
    );
  
    if (error) {
      alert("Error guardando resultado.");
      console.error(error);
      return;
    }
  
    setResultadoGuardado(true);
  };
  if (finalizado) {
    const porcentaje = Math.round((puntaje / preguntas.length) * 100);
  
    return (
      <main className="min-h-screen bg-slate-50 p-4 text-[#06194a]">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-sm border text-center mt-10">
          <div className="text-6xl mb-4">🏆</div>
  
          <h1 className="text-3xl font-extrabold mb-2">
            Simulacro finalizado
          </h1>
  
          <p className="text-slate-600 mb-6">
            Este es tu resultado preliminar.
          </p>
  
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-sm text-slate-600">Puntaje</p>
              <p className="text-4xl font-extrabold text-blue-700">
                {puntaje}/{preguntas.length}
              </p>
            </div>
  
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
              <p className="text-sm text-slate-600">Precisión</p>
              <p className="text-4xl font-extrabold text-purple-700">
                {porcentaje}%
              </p>
            </div>
          </div>
  
          <div className="flex gap-3 justify-center">
            <a
              href="/simulacro-evento"
              className="bg-[#07347e] text-white px-6 py-3 rounded-xl font-bold"
            >
              Volver al evento
            </a>
  
            <a
              href="/"
              className="border border-[#07347e] text-[#07347e] px-6 py-3 rounded-xl font-bold"
            >
              Ir al inicio
            </a>
          </div>
        </div>
      </main>
    );
  }

  const opciones = [
    { letra: "A", texto: preguntaActual?.opcion_a },
    { letra: "B", texto: preguntaActual?.opcion_b },
    { letra: "C", texto: preguntaActual?.opcion_c },
    { letra: "D", texto: preguntaActual?.opcion_d },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-[#06194a]">
      {/* HEADER SUPERIOR */}
      <header className="bg-[#07347e] text-white px-6 py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <ClipboardPlus className="w-8 h-8 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold leading-tight">
                SERUMS PERÚ
              </h1>
              <p className="text-sm font-semibold text-white/90">
                Simulacro Nacional Gratuito
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-bold">
            <UserCircle className="w-8 h-8 text-blue-200" />
            <span>Estudiante</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* BANNER AZUL */}
        <section className="bg-[#07347e] text-white rounded-2xl px-4 md:px-8 py-7 flex flex-col md:flex-row gap-4 md:items-center md:justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-11 h-11 text-white" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold">
                Simulacro Nacional Gratuito
              </h2>
              <p className="text-xl font-extrabold">
               SERUMS 2026 - II
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">Tiempo restante</p>
                <p className="text-xl font-extrabold">
  {formatearTiempo(tiempoRestante)}
</p>
              </div>
            </div>

            
          </div>
        </section>

       {/* CARD PREGUNTA COMPACTA */}
<section className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200">
  <div className="inline-block bg-blue-50 text-blue-700 font-extrabold px-4 py-1.5 rounded-full text-xs mb-4">
    Pregunta {indiceActual + 1} de {preguntas.length}
  </div>

  <h3 className="text-lg md:text-xl font-extrabold mb-4 leading-snug">
    {preguntaActual?.pregunta}
  </h3>

  <div className="h-px bg-slate-200 mb-4"></div>

  <div className="space-y-3">
    {opciones.map((opcion) => {
      const activa = respuestaSeleccionada === opcion.letra;
      const yaRespondida = !!respuestas[preguntaActual.id];

      return (
        <button
          key={opcion.letra}
          onClick={() => {
            if (yaRespondida) return;
            setRespuestaSeleccionada(opcion.letra);
          }}
          disabled={yaRespondida}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
            activa
              ? "bg-blue-50 border-blue-600"
              : "bg-white border-slate-200 hover:border-blue-400"
          } ${yaRespondida ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              activa ? "border-blue-600" : "border-slate-300"
            }`}
          >
            {activa && (
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            )}
          </span>

          <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-extrabold shrink-0 text-sm">
            {opcion.letra}
          </span>

          <span className="text-sm md:text-base leading-snug">
            {opcion.texto}
          </span>
        </button>
      );
    })}
  </div>

  <div className="mt-5 flex flex-col md:flex-row justify-between gap-3">
    <button className="border border-slate-200 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-slate-600 font-semibold text-sm">
      <Bookmark className="w-4 h-4" />
      Marcar para revisar después
    </button>

    <button
      onClick={async () => {
        if (!respuestaSeleccionada) {
          alert("Selecciona una respuesta");
          return;
        }

        const nuevasRespuestas = {
          ...respuestas,
          [preguntaActual.id]: respuestaSeleccionada,
        };

        setRespuestas(nuevasRespuestas);
        respuestasRef.current = nuevasRespuestas;

        if (indiceActual < preguntas.length - 1) {
          await guardarProgreso(indiceActual + 1, nuevasRespuestas);

          const siguienteIndice = indiceActual + 1;
          setIndiceActual(siguienteIndice);

          const siguientePregunta = preguntas[siguienteIndice];
          setRespuestaSeleccionada(nuevasRespuestas[siguientePregunta.id] || "");
        } else {
          const correctas = preguntas.filter(
            (pregunta) => nuevasRespuestas[pregunta.id] === pregunta.correcta
          ).length;

          setPuntaje(correctas);
          await guardarResultado(correctas);
          setFinalizado(true);
        }
      }}
      className="bg-blue-600 hover:bg-blue-700 text-white px-1 py-2 rounded-xl font-bold flex items-center justify-center gap-2 text-sm md:text-base min-h-[50px]"
    >
      {indiceActual === preguntas.length - 1 ? "Finalizar" : "Siguiente"}
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
</section>

        {/* NAVEGACIÓN */}
        <section className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200">
        <h3 className="font-bold text-sm md:text-2xl">
  Navegación de preguntas
</h3>

<div className="flex flex-wrap gap-2 mt-3">
            {preguntas.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIndiceActual(index);

const pregunta = preguntas[index];
setRespuestaSeleccionada(respuestas[pregunta.id] || "");
                }}
                className={`w-10 h-10 rounded-full font-bold ${
                  indiceActual === index
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#07347e] text-white mt-10 px-6 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ClipboardPlus className="w-9 h-9" />
              <div>
                <h3 className="font-extrabold text-xl">SERUMS PERÚ</h3>
                <p className="text-sm text-white/80">
                  Simulacro Nacional Gratuito
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold mb-3">Enlaces</h4>
            <p className="text-white/80">Inicio</p>
            <p className="text-white/80">Simulacro Evento</p>
            <p className="text-white/80">Simulacro Mixto</p>
            <p className="text-white/80">Resultados</p>
          </div>

          <div>
            <h4 className="font-extrabold mb-3">Soporte</h4>
            <p className="text-white/80">Preguntas Frecuentes</p>
            <p className="text-white/80">Reglamento</p>
            <p className="text-white/80">Contacto</p>
          </div>

          <div>
            <h4 className="font-extrabold mb-3">Síguenos</h4>
            <p className="text-white/80">Facebook · Instagram</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-white/20 mt-6 pt-4 text-center text-white/70">
          © 2026 SERUMS PERÚ. Todos los derechos reservados.
        </div>
      </footer>
      {modalInicio && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 text-center border border-slate-100">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center text-4xl">
        🛡️
      </div>

      <h2 className="text-2xl font-extrabold text-[#06194a] mb-3">
        Antes de comenzar
      </h2>

      <p className="text-slate-600 leading-relaxed mb-4">
        Este simulacro está diseñado para medir tu preparación real. Evita copiar,
        buscar respuestas en otros medios o recibir ayuda externa.
      </p>

      <p className="text-slate-600 leading-relaxed mb-5">
        Hazlo con honestidad y a conciencia: el resultado te servirá para saber
        en qué temas debes reforzar antes del SERUMS.
      </p>

      <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-2xl p-3 text-sm mb-5">
        Al presionar <strong>Comenzar</strong>, el tiempo del simulacro empezará a correr.
        Mucha suerte.
      </div>

      <button
        onClick={() => {
  const usuarioModal = JSON.parse(
    localStorage.getItem("usuarioActual") || "{}"
  );

  const claveModal = `modalInicioVisto_${simulacroActual.id}_${usuarioModal?.correo}`;

  localStorage.setItem(claveModal, "true");
  setModalInicio(false);
}}
        className="mx-auto block bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 py-3 rounded-xl"
      >
        Comenzar
      </button>
    </div>
  </div>
)}
    </main>
  );
}