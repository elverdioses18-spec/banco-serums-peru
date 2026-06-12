"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import {
  CalendarDays,
  ClipboardList,
  Trophy,
  Clock,
  User,
} from "lucide-react";

export default function SimulacroEventoPage() {
  const [simulacro, setSimulacro] = useState<any>(null);
  const [usuario, setUsuario] = useState<any>(null);
const [yaInscrito, setYaInscrito] = useState(false);
const [yaRindio, setYaRindio] = useState(false);
const [tieneProgreso, setTieneProgreso] = useState(false);
const [registrando, setRegistrando] = useState(false);
const [tiempoRestante, setTiempoRestante] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });
  const [modalRegistro, setModalRegistro] = useState(false);
  const [esPremium, setEsPremium] = useState(false);
  const [mostrarPremium, setMostrarPremium] = useState(false);
  useEffect(() => {
    const cargarSimulacro = async () => {
      const { data } = await supabase
        .from("simulacros_evento")
        .select("*")
        .order("id", { ascending: false })
.limit(1)
.maybeSingle();

      setSimulacro(data);
      if (data && usuarioGuardado?.correo) {
        const correoUsuario = usuarioGuardado?.correo?.trim().toLowerCase();
        if (!correoUsuario) return;

        const { data: inscrito } = await supabase
  .from("simulacro_inscritos")
  .select("*")
  .eq("simulacro_id", data.id)
  .ilike("correo", correoUsuario)
  .limit(1)
  .maybeSingle();

if (inscrito) {
  setYaInscrito(true);
} else {
  setYaInscrito(false);
}
      }
      const correoUsuario =
      usuarioGuardado?.correo?.trim()?.toLowerCase();
    
    if (!correoUsuario) return;
const { data: resultado } = await supabase
  .from("simulacro_resultados")
  .select("*")
  .eq("simulacro_id", data.id)
  .ilike("correo", correoUsuario)
  .limit(1)
  .maybeSingle();

if (resultado) {
  setYaRindio(true);
}
const { data: progreso } = await supabase
  .from("simulacro_progreso")
  .select("*")
  .eq("simulacro_id", data.id)
  .ilike("correo", correoUsuario)
  .eq("estado", "en_progreso")
  .maybeSingle();

if (progreso) {
  setTieneProgreso(true);
}
    };
    const usuarioGuardado = JSON.parse(
        localStorage.getItem("usuarioActual") || "{}"
      );
      const premiumGuardado = localStorage.getItem("premium") === "true";
setEsPremium(premiumGuardado);
     
      if (usuarioGuardado?.correo) {
        setUsuario(usuarioGuardado);
      }
    cargarSimulacro();
  }, []);

  useEffect(() => {
    const refrescarAlVolver = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
  
    window.addEventListener("pageshow", refrescarAlVolver);
  
    return () => {
      window.removeEventListener("pageshow", refrescarAlVolver);
    };
  }, []);
 
  const registrarseAlSimulacro = async () => {
    if (!usuario?.correo) {
      return;
    }
  
    setRegistrando(true);
  
    const { error } = await supabase
      .from("simulacro_inscritos")
      .insert({
        simulacro_id: simulacro.id,
        correo: usuario.correo,
        nombre: usuario.nombre || "Usuario",
      });
  
    setRegistrando(false);
  
    if (error) {
      alert("Error al registrarte. Intenta nuevamente.");
      return;
    }
  
    setYaInscrito(true);

    setModalRegistro(true);
  };

  useEffect(() => {
    if (!simulacro?.fecha_inicio) return;
  
    const calcularTiempo = () => {
      const ahora = new Date().getTime();
      const inicio = new Date(simulacro.fecha_inicio).getTime();
      const diferencia = inicio - ahora;
  
      if (diferencia <= 0) {
        setTiempoRestante({
          dias: 0,
          horas: 0,
          minutos: 0,
          segundos: 0,
        });
        return;
      }
  
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor(
        (diferencia / (1000 * 60 * 60)) % 24
      );
      const minutos = Math.floor(
        (diferencia / (1000 * 60)) % 60
      );
      const segundos = Math.floor(
        (diferencia / 1000) % 60
      );
  
      setTiempoRestante({
        dias,
        horas,
        minutos,
        segundos,
      });
    };
  
    calcularTiempo();
  
    const intervalo = setInterval(calcularTiempo, 1000);
  
    return () => clearInterval(intervalo);
  }, [simulacro]);
  const obtenerEstadoSimulacro = () => {
    if (!simulacro?.fecha_inicio || !simulacro?.fecha_fin) {
      return "programado";
    }
  
    const ahora = new Date().getTime();
    const inicio = new Date(simulacro.fecha_inicio).getTime();
    const fin = new Date(simulacro.fecha_fin).getTime();
  
    if (ahora < inicio) return "programado";
    if (ahora >= inicio && ahora <= fin) return "activo";
    return "finalizado";
  };
  
  const estadoSimulacro = obtenerEstadoSimulacro();
  
  
  if (!simulacro) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 text-[#06194a]">
        Cargando simulacro...
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-slate-50 p-3 text-[#06194a]">
      <div className="max-w-4xl mx-auto space-y-3">

        {/* HEADER */}
        <div className="bg-[#07347e] text-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl"
            >
              ←
            </Link>

            <div>
              <h1 className="text-2xl font-extrabold leading-tight">
                Ruta SERUMS
              </h1>
              <p className="text-sm text-white/90">
                Prepárate, práctica y aprueba
              </p>
            </div>
          </div>

          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl text-black">
            👤
          </div>
        </div>

        {/* HERO */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center text-4xl shrink-0">
                🏆
              </div>

              <div>
                <span className="inline-block bg-purple-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-lg mb-1">
                {estadoSimulacro === "programado"
  ? "PRÓXIMO EVENTO"
  : estadoSimulacro === "activo"
  ? "EVENTO ACTIVO"
  : "FINALIZADO"}
                </span>

                <h2 className="text-xl font-extrabold leading-tight">
                  {simulacro.titulo}
                </h2>

                <p className="text-sm text-slate-600 mt-1 leading-snug">
                  Pon a prueba tus conocimientos y compite con postulantes de todo el país.
                </p>
              </div>
            </div>

            <Image
  src="/logo.png.png"
  alt="Reloj con libros"
  width={210}
  height={150}
  className="hidden md:block object-contain"
/>
          </div>
        </section>

        {/* FECHAS + INFO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="w-7 h-7 text-purple-600" />
              <h3 className="text-xl font-extrabold">Fechas</h3>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                <div className="w-[2px] h-12 bg-purple-100"></div>
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              </div>

              <div>
                <p className="text-sm text-slate-600">Inicio:</p>
                <p className="text-base font-bold mb-4">
  {simulacro?.fecha_inicio
    ? new Date(simulacro.fecha_inicio).toLocaleString("es-PE", {
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "-"}
</p>

                <p className="text-sm text-slate-600">Fin:</p>
                <p className="text-base font-bold">
  {simulacro?.fecha_fin
    ? new Date(simulacro.fecha_fin).toLocaleString("es-PE", {
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "-"}
</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
            <ClipboardList className="w-7 h-7 text-purple-600" />
              <h3 className="text-xl font-extrabold">Información</h3>
            </div>

            <ul className="space-y-2 text-base">
              <li><span className="text-purple-600 font-bold">•</span> {simulacro.cantidad_preguntas} preguntas</li>
              <li><span className="text-purple-600 font-bold">•</span> Tiempo: {simulacro.tiempo_minutos} minutos</li>
              <li><span className="text-purple-600 font-bold">•</span> Un solo intento por usuario</li>
              <li><span className="text-purple-600 font-bold">•</span> Participación gratuita</li>
              <li><span className="text-purple-600 font-bold">•</span> Ranking nacional</li>
            </ul>
          </div>
        </section>
        <div className="bg-gradient-to-r from-yellow-50 to-white border border-yellow-400 rounded-2xl p-5 mb-5 shadow-sm">
  <div className="flex items-center gap-3 mb-3">
    <div className="w-14 h-14 rounded-full bg-yellow-500 text-white flex items-center justify-center text-3xl shadow-md">
      👑
    </div>

    <div>
      <h2 className="font-extrabold text-lg text-slate-800">
        Beneficios Premium
      </h2>

      <p className="text-sm text-slate-600">
        Lleva tu preparación SERUMS al siguiente nivel.
      </p>
    </div>
  </div>

  <div className="space-y-2 text-sm text-slate-700 mb-4">
    <p>✅ Simulacros semanales o quincenales</p>
    <p>✅ Explicaciones fundamentadas de cada pregunta</p>
    <p>✅ Acceso a simulacros anteriores</p>
    <p>✅ Revisión completa de respuestas</p>
    <p>✅ Ranking nacional detallado</p>
    <p>✅ Banco completo de preguntas</p>
  </div>

  <button
    onClick={() => setMostrarPremium(true)}
    className="w-full bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-3 rounded-xl"
  >
    ⭐ HAZTE PREMIUM
  </button>
</div>
        {/* RANKING */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-7 h-7 text-purple-600" />
              
                <h3 className="text-xl font-extrabold">
                  ¿Cómo funciona el ranking?
                </h3>
              </div>

              <p className="text-base mb-2">
                El ranking se ordena por:
              </p>

              <ol className="list-decimal list-inside text-base space-y-1">
                <li>Mayor puntaje</li>
                <li>Menor tiempo</li>
              </ol>
            </div>

            <Image
  src="/podio.png"
  alt="Podio ranking"
  width={150}
  height={100}
  className="block object-contain w-24 md:w-36"
/>
          </div>
        </section>

        {/* CUENTA REGRESIVA */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
          <Clock className="w-7 h-7 text-purple-600" />
            <h3 className="text-xl font-extrabold">
            {estadoSimulacro === "programado"
  ? "Cuenta regresiva para el inicio"
  : estadoSimulacro === "activo"
  ? "Tiempo restante del simulacro"
  : "Simulacro finalizado"}
            </h3>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
          {[
  [String(tiempoRestante.dias).padStart(2, "0"), "días"],
  [String(tiempoRestante.horas).padStart(2, "0"), "horas"],
  [String(tiempoRestante.minutos).padStart(2, "0"), "min"],
  [String(tiempoRestante.segundos).padStart(2, "0"), "seg"],
].map(([numero, texto]) => (
              <div
                key={texto}
                className="bg-purple-50 border border-purple-200 rounded-xl p-3"
              >
                <p className="text-2xl font-extrabold">{numero}</p>
                <p className="text-xs text-slate-600">{texto}</p>
              </div>
            ))}
          </div>
        </section>

       {/* PARTICIPAR */}
<section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
    <div className="flex items-start gap-3">
      <User className="w-8 h-8 text-purple-600" />

      <div>
        <h3 className="text-xl font-extrabold mb-1">
          Participa en el simulacro
        </h3>

        <p className="text-sm text-slate-600 leading-snug">
          Inicia sesión o crea tu cuenta para registrarte y participar.
        </p>
      </div>
    </div>

    {simulacro?.solo_premium && !esPremium ? (
      <div className="w-full md:w-72 md:justify-self-end bg-yellow-50 border border-yellow-400 rounded-xl p-4">
      <p className="font-bold text-yellow-700 mb-2">
        👑 Simulacro exclusivo Premium
      </p>
    
      <p className="text-sm text-slate-600 mb-3">
        Este simulacro está disponible solo para usuarios Premium.
      </p>
    
      <button
        onClick={() => setMostrarPremium(true)}
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-3 rounded-xl"
      >
        ⭐ HAZTE PREMIUM
      </button>
    </div>
    ) : !usuario?.correo ? (
  <Link
    href="/login"
    className="w-full md:w-72 md:justify-self-end bg-purple-600 hover:bg-purple-700 text-white text-center font-bold py-3 rounded-xl text-base shadow-md"
  >
    👤 Iniciar sesión
  </Link>
) : !yaInscrito ? (
  <button
    onClick={registrarseAlSimulacro}
    disabled={registrando}
    className="w-full md:w-60 md:justify-self-end bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-center font-bold py-3 rounded-xl"
  >
    {registrando ? "Registrando..." : "Registrarme al simulacro"}
  </button>
) : yaRindio ? (
  <div className="w-full md:w-60 md:justify-self-end space-y-2">
    <Link
      href="/simulacro-evento/revision"
      className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center font-bold py-3 rounded-xl"
    >
      📄 Revisar mi examen
    </Link>

    <Link
      href="/simulacro-evento/ranking"
      className="block w-full bg-yellow-500 hover:bg-yellow-600 text-white text-center font-bold py-3 rounded-xl"
    >
      🏆 Ver ranking
    </Link>
  </div>
) : estadoSimulacro === "activo" ? (
  <Link
    href="/simulacro-evento/examen"
    className="w-full md:w-60 md:justify-self-end bg-green-600 hover:bg-green-700 text-white text-center font-bold py-3 rounded-xl"
  >
    {tieneProgreso ? "🔁 Continuar simulacro" : "🚀 Iniciar simulacro"}
  </Link>
) : estadoSimulacro === "finalizado" ? (
  <Link
    href="/simulacro-evento/ranking"
    className="w-full md:w-60 md:justify-self-end bg-yellow-500 hover:bg-yellow-600 text-white text-center font-bold py-3 rounded-xl"
  >
    🏆 Ver ranking
  </Link>
) : (
  <div className="w-full md:w-72 md:justify-self-end bg-green-50 border border-green-300 text-green-700 font-bold text-center py-3 rounded-xl">
    ✅ Ya estás registrado
  </div>
)}
  </div>

  {!usuario?.correo && (
    <>
      <div className="flex items-center gap-3 my-3">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-sm font-bold text-slate-500">o</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      <Link
        href="/login"
        className="block w-full border border-purple-600 text-purple-700 text-center font-bold py-3 rounded-xl text-base"
      >
        👤 Crear cuenta
      </Link>
    </>
  )}

  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
    ℹ️ Al registrarte, quedarás inscrito automáticamente en el evento.
  </div>
</section>

      </div>
      {modalRegistro && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-6 text-center border border-slate-100">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-4xl">
        ✅
      </div>

      <h2 className="text-2xl font-extrabold text-[#06194a] mb-2">
        ¡Registro exitoso!
      </h2>

      <p className="text-slate-600 mb-5">
        Ya estás inscrito en el Simulacro Nacional Gratuito.
      </p>

      <button
        onClick={() => setModalRegistro(false)}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl"
      >
        Entendido
      </button>
    </div>
  </div>
)}
    </main>
  );
}