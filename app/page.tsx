"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { preguntas as preguntasSaludPublica } from "@/data/preguntas";
import { preguntasGestion } from "@/data/gestion";
import { preguntasCuidadoIntegral } from "@/data/cuidadoIntegralData";
import { preguntasInvestigacion } from "@/data/investigacionData";
import { preguntasEtica } from "@/data/eticaData";
console.log(preguntasSaludPublica)

import {
  Users,
  Building2,
  Heart,
  FlaskConical,
  Scale,
  Flame,
} from "lucide-react";
const temas = [
  { nombre: "Salud Pública", desc: "Salud pública y epidemiología.", preguntas: `${preguntasSaludPublica.saludPublica.length} preguntas`, color: "bg-blue-600", icono: Users, ruta: "/salud-publica/configurar" },
  { nombre: "Gestión", desc: "Administración en salud y normativas del sector.", preguntas: `${preguntasGestion.length} preguntas`, color: "bg-green-600", icono: Building2, ruta: "/gestion/configurar" },
  { nombre: "Cuidado Integral", desc: "Atención integral, cursos de vida y casos clínicos.", preguntas: `${preguntasCuidadoIntegral.length} preguntas`, color: "bg-yellow-500", icono: Heart, ruta: "/cuidado-integral/configurar" },
  { nombre: "Investigación", desc: "Metodología de investigación y bioestadística.", preguntas: `${preguntasInvestigacion.length} preguntas`, color: "bg-purple-600", icono: FlaskConical, ruta: "/investigacion/configurar" },
  { nombre: "Ética", desc: "Bioética, ética médica y normativa legal.", preguntas: `${preguntasEtica.length} preguntas`, color: "bg-red-500", icono: Scale, ruta: "/etica/configurar" },
  { nombre: "Simulacro Mixto", desc: "Simulacro completo con preguntas de todos los temas.", preguntas: `${preguntasSaludPublica.saludPublica.length + preguntasGestion.length + preguntasCuidadoIntegral.length + preguntasInvestigacion.length + preguntasEtica.length} preguntas`, color: "bg-orange-500", icono: Flame, ruta: "/simulacro-mixto/configurar" },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [metaDiaria, setMetaDiaria] = useState<number>(50);
const [preguntasHoy, setPreguntasHoy] = useState(0);
const router = useRouter();
const [mostrarPremium, setMostrarPremium] = useState(false);
const [mostrarModalLogin, setMostrarModalLogin] = useState(false);
const [popupTema, setPopupTema] = useState<any>(null);
const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });


useEffect(() => {
  const usuario = localStorage.getItem("usuarioActual");


  const metaGuardada = Number(localStorage.getItem("metaDiaria") ?? "50");

  const historial = JSON.parse(
    localStorage.getItem("historialExamenes") || "[]"
  );

  const hoy = new Date().toLocaleDateString("es-PE");

  const totalHoy = historial
    .filter((examen: any) => examen.fecha === hoy)
    .reduce(
      (total: number, examen: any) =>
        total + examen.totalPreguntas,
      0
    );
    setMetaDiaria(metaGuardada);
    if (totalHoy >= metaGuardada) {

          
          
      setPreguntasHoy(0);
    
      return;
    
    }
  
  setPreguntasHoy(totalHoy);

}, []);
  const [progresoSalud, setProgresoSalud] = useState<any>(null);
  const [progresoCuidado, setProgresoCuidado] = useState<any>(null);
  const [progresoGestion, setProgresoGestion] = useState<any>(null);
const [progresoInvestigacion, setProgresoInvestigacion] = useState<any>(null);
const [progresoEtica, setProgresoEtica] = useState<any>(null);
const [progresoMixto, setProgresoMixto] = useState<any>(null);
  const [temaActivo, setTemaActivo] = useState("salud");
  const [esPremium, setEsPremium] = useState(false);
  

useEffect(() => {
  const premiumGuardado = localStorage.getItem("premium") === "true";
  setEsPremium(premiumGuardado);
}, []);
const [mostrarBloqueoPremium, setMostrarBloqueoPremium] = useState(false);

const LIMITE_GRATIS = 20;
useEffect(() => {
  const data = localStorage.getItem("progresoSaludPublica");

  if (data) {
    setProgresoSalud(JSON.parse(data));
  }
  const dataCuidado = localStorage.getItem("progresoCuidado");

if (dataCuidado) {
  setProgresoCuidado(JSON.parse(dataCuidado));
}
const dataGestion = localStorage.getItem("progresoGestion");
if (dataGestion) {
  setProgresoGestion(JSON.parse(dataGestion));
}

const dataInvestigacion = localStorage.getItem("progresoInvestigacion");
if (dataInvestigacion) {
  setProgresoInvestigacion(JSON.parse(dataInvestigacion));
}

const dataEtica = localStorage.getItem("progresoEtica");
if (dataEtica) {
  setProgresoEtica(JSON.parse(dataEtica));
}

const dataMixto = localStorage.getItem("progresoMixto");
if (dataMixto) {
  setProgresoMixto(JSON.parse(dataMixto));
}
}, []);
useEffect(() => {
  const scrollGuardado = sessionStorage.getItem("homeScroll");

  if (scrollGuardado) {
    setTimeout(() => {
      window.scrollTo(0, Number(scrollGuardado));
    }, 150);
  }

  const guardarScroll = () => {
    sessionStorage.setItem("homeScroll", String(window.scrollY));
  };

  window.addEventListener("scroll", guardarScroll);

  return () => {
    window.removeEventListener("scroll", guardarScroll);
  };
}, []);
const progresoActual =
  temaActivo === "salud"
    ? progresoSalud
    : temaActivo === "gestion"
    ? progresoGestion
    : temaActivo === "cuidado"
    ? progresoCuidado
    : temaActivo === "investigacion"
    ? progresoInvestigacion
    : temaActivo === "etica"
    ? progresoEtica
    : temaActivo === "mixto"
    ? progresoMixto
    : null;
  const [temaSeleccionado, setTemaSeleccionado] = useState(temas[0]);
  const colorPanel =
  temaSeleccionado.color === "bg-blue-600"
    ? "green"
    : temaSeleccionado.color === "bg-green-600"
    ? "green"
    : temaSeleccionado.color === "bg-yellow-500"
    ? "yellow"
    : temaSeleccionado.color === "bg-purple-600"
    ? "purple"
    : temaSeleccionado.color === "bg-red-500"
    ? "red"
    : "orange";
    const totalPreguntasResueltas =
  (progresoSalud?.avance || 0) +
  (progresoGestion?.avance || 0) +
  (progresoCuidado?.avance || 0) +
  (progresoInvestigacion?.avance || 0) +
  (progresoEtica?.avance || 0);

const precisionPromedio = Math.round(
  (
    (progresoSalud?.precision || 0) +
    (progresoGestion?.precision || 0) +
    (progresoCuidado?.precision || 0) +
    (progresoInvestigacion?.precision || 0) +
    (progresoEtica?.precision || 0)
  ) / 5
);
const rachaEstudio =
  (
    progresoSalud?.ultimaPractica ||
    progresoGestion?.ultimaPractica ||
    progresoCuidado?.ultimaPractica ||
    progresoInvestigacion?.ultimaPractica ||
    progresoEtica?.ultimaPractica
  )
    ? 1
    : 0;
    const progresoPopup =
  popupTema?.nombre === "Salud Pública"
    ? progresoSalud
    : popupTema?.nombre === "Gestión"
    ? progresoGestion
    : popupTema?.nombre === "Cuidado Integral"
    ? progresoCuidado
    : popupTema?.nombre === "Investigación"
    ? progresoInvestigacion
    : popupTema?.nombre === "Ética"
    ? progresoEtica
    : popupTema?.nombre === "Simulacro Mixto"
    ? progresoMixto
    : null;
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-[#06194a] overflow-x-hidden">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside
  className={`relative ${
    sidebarOpen ? "w-[220px]" : "w-[80px]"
  } shrink-0 bg-[#001f5c] text-white hidden md:flex flex-col transition-all duration-300`}
>
<button
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className="absolute top-26 right-1 text-xl hover:bg-white/10 rounded-xl p-1 transition"
>
  ☰
</button>
          <div className="h-[96px] px-8 flex items-center gap-8 bg-[#062b73]">
            
            <div className="min-w-max">
            <h1 className="text-2xl font-semibold whitespace-nowrap">Ruta SERUMS </h1>
            <p className="text-base text-blue-100 whitespace-nowrap">Prepárate, práctica y aprueba</p>
            </div>
          </div>
          <Link
  href="/"
  className="flex items-center gap-3 px-9 py-6 ml-2 mt-8 rounded-xl hover:bg-blue-800 transition mb-1"
>
  <span className="text-2xl">🏠</span>

  <span className="font-semibold text-lg">
    Inicio
  </span>
</Link>
          <div className="px-8 py-7">
          {sidebarOpen && (
  <p className="text-sm font-bold text-blue-200 mb-5">
    TEMAS
  </p>
)}

            <div className="space-y-1">
              {temas.map((tema) => (
                <div
                key={tema.nombre}
              
                onClick={(e) => {
                  setPopupTema(tema);
                
                  setPopupPos({
                    top: e.currentTarget.offsetTop,
                    left:
                      e.currentTarget.offsetLeft +
                      e.currentTarget.offsetWidth +
                      12,
                  });
                }}
                                  
                    className="flex items-center gap-3 p-2 rounded-xl transition hover:bg-blue-900 w-full text-left cursor-pointer select-none"
      
                >
                  <span className={`${tema.color} w-10 h-10 rounded-xl flex items-center justify-center text-2xl`}>
                  <tema.icono size={34} strokeWidth={2.5} />
                  </span>
                  {sidebarOpen && (
  <span className="text-base font-semibold">
    {tema.nombre}
  </span>
)}
                </div>
              ))}
             <Link
  href="/flashcards"
  className={`flex items-center ${
    sidebarOpen
  ? "gap-3 p-2 justify-start"
  : "justify-center px-6 p-3"
  } rounded-xl transition hover:bg-blue-900`}
>
  <span className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-2xl">
    🗂️
  </span>

  {sidebarOpen && (
    <span className="text-base font-semibold">
      Flashcards
    </span>
  )}
</Link>
            </div>

            <div className="border-t border-blue-800 my-7"></div>

            {sidebarOpen && (
  <p className="text-sm font-bold text-blue-200 mb-5">
    MI PROGRESO
  </p>
)}
            <div className="space-y-5 text-lg">
            <Link href="/estadisticas" className="flex items-center gap-2">
  <span>📊</span>
  {sidebarOpen && <span>Estadísticas</span>}
</Link>

<Link href="/falladas" className="flex items-center gap-2">
  <span>❌</span>
  {sidebarOpen && <span>Preguntas falladas</span>}
</Link>

<Link href="/reforzamiento" className="flex items-center gap-2">
  <span>🧠</span>
  {sidebarOpen && <span>Reforzamiento</span>}
</Link>

<Link href="/historial" className="flex items-center gap-2">
  <span>🕒</span>
  {sidebarOpen && <span>Historial de simulacros</span>}
</Link>


              
          
            </div>

            <div className="border-t border-blue-800 my-7"></div>

            {sidebarOpen && (
  <p className="text-sm font-bold text-blue-200 mb-5">
    CONFIGURACIÓN
  </p>
)}
            <div className="space-y-5 text-lg">
            <Link href="/ajustes" className="flex items-center gap-2">
  <span>⚙️</span>
  {sidebarOpen && <span>Ajustes</span>}
</Link>

            </div>
          </div>
          {popupTema && (
  <div
  className="absolute bg-white text-slate-900 rounded-2xl shadow-xl border p-5 w-72 z-50"
  style={{
    top: popupPos.top,
    left: popupPos.left,
  }}
>
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-lg">
        {popupTema.nombre}
      </h3>

      <button
        onClick={() => setPopupTema(null)}
        className="text-slate-500 hover:text-red-500"
      >
        ✕
      </button>
    </div>

    <div className="space-y-3">
    <p>📊 Precisión: {progresoPopup?.precision || 0}%</p>
<p>🔥 Racha: {rachaEstudio} días</p>
<p>📝 Resueltas: {progresoPopup?.avance || 0}</p>
🏆 Mejor resultado: {progresoPopup?.mejorResultado || 0}/{progresoPopup?.mejorTotal || 20}

      <div>
      <div className="flex justify-between mb-1">
  <span className="text-sm">Precisión</span>

  <span className="text-sm font-bold">
    {progresoPopup?.precision || 0}%
  </span>
</div>

<div className="w-full bg-slate-200 rounded-full h-3">
  <div
    className="bg-blue-600 h-3 rounded-full"
    style={{
      width: `${progresoPopup?.precision || 0}%`,
    }}
  />
</div>
      </div>
    </div>
  </div>
)}
        </aside>

        {/* CONTENIDO */}
        <section className="flex-1">

          {/* HEADER */}
          <header className="h-[96px] bg-[#062b73] text-white px-8 flex items-center justify-end gap-6">
          <button
  onClick={() => setMostrarPremium(true)}
  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-xl shadow-md"
>
  Ser Premium
</button>
         

            <div className="relative w-12 h-12 rounded-full bg-blue-900/60 flex items-center justify-center text-xl">
              🔔
              
            </div>

            <div className="w-14 h-14 rounded-full bg-white text-blue-900 flex items-center justify-center text-3xl">
              👤
            </div>

            <div>
  <Link
    href="/login"
    className="font-semibold hover:underline"
  >
    Iniciar sesión / Registrarse
  </Link>

  <p className="text-sm text-blue-100">
    Guarda tu progreso y estadísticas
  </p>
</div>
            
          </header>

          <div className="p-8">

            {/* BIENVENIDA */}
            <div className="relative bg-white rounded-3xl shadow-md border border-slate-100 p-4 mb-7 flex justify-between">
            <div className="absolute top-1 right-1 w-70 opacity-95 pointer-events-none">
  <img
    src="/logo.png.png"
    alt="Logo Banco SERUMS"
    className="w-full object-contain"
  />
</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">
                  ¡Bienvenido a Ruta SERUMS! 
                </h2>

                <p className="text-2x1 mb-4 leading-relaxed">
                  Plataforma de simulacros y banco de preguntas <br />
                  para el examen SERUMS.
                </p>

                <div className="grid grid-cols-3 gap-4 max-w-2xl">

                <div className="border border-slate-500 rounded-xl py-1 px-2 flex items-center gap-1">
    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl">
      ?
    </div>

        <div className="flex-2 text-center">
    <p className="text-sm font-semibold">
  Total de Preguntas resueltas
</p>

<p className="text-2xl font-extrabold">
  {totalPreguntasResueltas}
</p>
    </div>
  </div>

  <div className="border border-slate-500 rounded-xl py-2 px-3 flex items-center gap-2 w-[210px]">
  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-xl">
      🎯
    </div>

        <div className="flex-1 text-center">
    <p className="text-sm font-semibold">
  Precisión promedio
</p>

<p className="text-2xl font-extrabold">
  {precisionPromedio}%
</p>
    </div>
  </div>

  <div className="border border-slate-500 rounded-xl p-2 flex items-center gap-1">
    <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl">
      🗓️
    </div>

    <div>
    <p className="text-sm font-semibold">
  Racha de estudio
</p>

<p className="text-2xl font-extrabold">
  {rachaEstudio} días
</p>
    </div>
  </div>

</div>
              
</div>
            </div>

            {/* TARJETAS */}
            <h2 className="text-2xl font-bold mb-5">Elige un tema para comenzar</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 mb-7">
            {temas.map((tema) => (
  <div
    key={tema.nombre}
    onClick={() => {
      setTemaSeleccionado(tema);
    
      setTemaActivo(
        tema.nombre === "Salud Pública"
          ? "salud"
          : tema.nombre === "Gestión"
          ? "gestion"
          : tema.nombre === "Cuidado Integral"
          ? "cuidado"
          : tema.nombre === "Investigación"
          ? "investigacion"
          : tema.nombre === "Ética"
          ? "etica"
          : tema.nombre === "Simulacro Mixto"
          ? "mixto"
          : "salud"
      );
    }}
    className={`relative bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 py-4 px-4 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col
      temaSeleccionado.nombre === tema.nombre
      ? tema.color === "bg-blue-600"
      ? "border-blue-600 border-2"
      : tema.color === "bg-green-600"
      ? "border-green-600 border-2"
      : tema.color === "bg-yellow-500"
      ? "border-yellow-500 border-2"
      : tema.color === "bg-purple-600"
      ? "border-purple-600 border-2"
      : tema.color === "bg-red-500"
      ? "border-red-500 border-2"
      : "border-orange-500 border-2"
        : "border-slate-200"
    }`}
  >            
                 {temaSeleccionado.nombre === tema.nombre && (
  <span
    className={`absolute right-3 top-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold ${
      tema.color === "bg-blue-600"
        ? "bg-blue-600"
        : tema.color === "bg-green-600"
        ? "bg-green-600"
        : tema.color === "bg-yellow-500"
        ? "bg-yellow-500"
        : tema.color === "bg-purple-600"
        ? "bg-purple-600"
        : tema.color === "bg-red-500"
        ? "bg-red-500"
        : "bg-orange-500"
    }`}
  >
    ✓
  </span>
)}
                  <div className={`${tema.color} w-15 h-15 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white`}>
                  <tema.icono size={34} strokeWidth={2.5} />
                  </div>

                  <h3 className="text-xl font-bold min-h-[56px] flex items-center justify-center">
  {tema.nombre}
</h3>

<p className="text-sm min-h-[72px] flex items-center justify-center">
  {tema.desc}
</p>

                  <div className="text-sm bg-slate-100 rounded-full px-3 py-2 my-4">
                    {tema.preguntas}
                  </div>

                  <button
  onClick={() => {
    const preguntasRespondidas = Number(
      localStorage.getItem("preguntasUsadasGratis") || "0"
    );
    const usuarioRegistrado = localStorage.getItem("usuarioActual");

if (!usuarioRegistrado) {
  setMostrarModalLogin(true);
  return;
}
  
    if (!esPremium && preguntasRespondidas >= LIMITE_GRATIS) {
      setMostrarBloqueoPremium(true);
      return;
    }
  
    router.push(tema.ruta);
  }}
  className={`${tema.color} text-white rounded-2xl py-2 w-full font-bold cursor-pointer select-none`}
>
  Comenzar
</button>
                </div>
              ))}
            </div>

            {/* PANEL INFERIOR */}
            <div
  className={`relative bg-white border rounded-2xl p-4 shadow-sm grid grid-cols-1 xl:grid-cols-[1.2fr_1fr_1fr_0.8fr] gap-4 items-center ${
    temaSeleccionado.color === "bg-blue-600"
      ? "border-blue-600"
      : temaSeleccionado.color === "bg-green-600"
      ? "border-green-600"
      : temaSeleccionado.color === "bg-yellow-500"
      ? "border-yellow-500"
      : temaSeleccionado.color === "bg-purple-600"
      ? "border-purple-600"
      : temaSeleccionado.color === "bg-red-500"
      ? "border-red-500"
      : "border-orange-500"
  }`}
>
              <div className="flex items-center gap-4">
                <div className="text-7xl">🏆</div>

                <div>
                <h2
  className={`text-2xl font-bold mb-2 ${
    temaSeleccionado.color === "bg-blue-600"
      ? "text-blue-600"
      : temaSeleccionado.color === "bg-green-600"
      ? "text-green-600"
      : temaSeleccionado.color === "bg-yellow-500"
      ? "text-yellow-500"
      : temaSeleccionado.color === "bg-purple-600"
      ? "text-purple-600"
      : temaSeleccionado.color === "bg-red-500"
      ? "text-red-500"
      : "text-orange-500"
  }`}
>
  {temaSeleccionado.nombre}
</h2>
                  <p className="text-2x1 mb-4">
                    Pon a prueba tus conocimientos en administración en salud y normativas del sector.
                  </p>
                  <span
  className={`block w-fit mx-auto mt-3 px-3 py-1 rounded-lg text-center leading-tight ${
    temaSeleccionado.color === "bg-blue-600"
      ? "bg-blue-100 text-blue-700"
      : temaSeleccionado.color === "bg-green-600"
      ? "bg-green-100 text-green-700"
      : temaSeleccionado.color === "bg-yellow-500"
      ? "bg-yellow-100 text-yellow-700"
      : temaSeleccionado.color === "bg-purple-600"
      ? "bg-purple-100 text-purple-700"
      : temaSeleccionado.color === "bg-red-500"
      ? "bg-red-100 text-red-700"
      : "bg-orange-100 text-orange-700"
  }`}
>
<>
  980 preguntas
  <br />
  totales
</>
                  </span>
                </div>
              </div>

              <div className="absolute top-2 right-[220px] text-center">

  <p className="text 2x1 font-semibold text-slate-800">
    📘 Último examen
  </p>


</div>

<div className="border-l border-slate-400 pl-6 text-center">
              <p className="font-bold text-2xl mb-2 -mt-2">Avance general</p>
              <div
  className={`w-40 h-40 rounded-full border-[16px] flex items-center justify-center text-3xl font-bold mx-auto ${
    temaSeleccionado.color === "bg-blue-600"
      ? "border-blue-600"
      : temaSeleccionado.color === "bg-green-600"
      ? "border-green-600"
      : temaSeleccionado.color === "bg-yellow-500"
      ? "border-yellow-500"
      : temaSeleccionado.color === "bg-purple-600"
      ? "border-purple-600"
      : temaSeleccionado.color === "bg-red-500"
      ? "border-red-500"
      : "border-orange-500"
  }`}
>
{progresoActual?.porcentajeAvance || 0}%
                </div>
              </div>

              <div className="border-l border-slate-200 pl-3 pt-3 space-y-3">
              <div>
              <p className="font-bold text-xl text-slate-600">❔ Preguntas <br /> correctas</p>
  <p className="text-2xl font-bold ">
  {progresoActual?.correctas || 0} / {progresoActual?.total || 20}
</p>
</div>

<div className="mt-8">
  <p className="font-bold text-xl text-slate-600">🎯 Precisión</p>
  <p className="text-2xl font-bold">
  {progresoActual?.precision || 0}%
</p>
</div>
                
                
              </div>

              <div className="border-l border-slate-200 pl-0 -ml-20">
             
              <div className="mt-1 space-y-2">

  <div
  className={`rounded-xl p-4 ${
    temaSeleccionado.color === "bg-blue-600"
      ? "bg-blue-50"
      : temaSeleccionado.color === "bg-green-600"
      ? "bg-green-50"
      : temaSeleccionado.color === "bg-yellow-500"
      ? "bg-yellow-50"
      : temaSeleccionado.color === "bg-purple-600"
      ? "bg-purple-50"
      : temaSeleccionado.color === "bg-red-500"
      ? "bg-red-50"
      : "bg-orange-50"
  }`}
>
<p className="font-bold text-xl text-slate-600">
    Tiempo promedio
  </p>

  <p className="text-xl font-bold">
  {progresoActual?.tiempo || "--:--"}
  </p>
</div>

<div
  className={`rounded-xl p-4 ${
    temaSeleccionado.color === "bg-blue-600"
      ? "bg-blue-50"
      : temaSeleccionado.color === "bg-green-600"
      ? "bg-green-50"
      : temaSeleccionado.color === "bg-yellow-500"
      ? "bg-yellow-50"
      : temaSeleccionado.color === "bg-purple-600"
      ? "bg-purple-50"
      : temaSeleccionado.color === "bg-red-500"
      ? "bg-red-50"
      : "bg-orange-50"
  }`}
>
  <p className="font-bold text-xl text-slate-600">
    Última práctica
  </p>

  <p className="text-xl font-bold">
  {progresoActual?.ultimaPractica || "Sin prácticas"}
  </p>
</div>

</div> 
</div> 
</div>    
</div>     
{mostrarModalLogin && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-8 text-white shadow-2xl">

      <div className="text-5xl text-center mb-4">
        🔐
      </div>

      <h2 className="text-3xl font-bold text-center mb-4">
        Inicia sesión o regístrate
      </h2>

      <p className="text-slate-300 text-center leading-relaxed mb-6">
        Crea una cuenta gratuita para acceder a tus
        10 preguntas de prueba, estadísticas y reforzamiento.
      </p>

      <Link
        href="/login"
        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-2xl py-3 font-bold text-center block"
      >
        Iniciar sesión / Registrarse
      </Link>

      <button
        onClick={() => setMostrarModalLogin(false)}
        className="w-full mt-4 text-slate-400 hover:text-white transition"
      >
        Seguir explorando
      </button>

    </div>
  </div>
)}
{mostrarBloqueoPremium && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">

    <div className="bg-[#07142b] w-[420px] rounded-3xl p-8 text-white shadow-2xl border border-blue-900">

      <div className="text-6xl text-center mb-5">
        🔒
      </div>

      <h2 className="text-3xl font-bold text-center mb-4">
        Límite gratuito alcanzado
      </h2>

      <p className="text-slate-300 text-center leading-relaxed mb-6">
        Ya completaste tus preguntas gratuitas ✅
        <br /><br />
        Aún puedes revisar tus estadísticas, progreso y reforzamiento.
        <br /><br />
        Hazte Premium para desbloquear preguntas y simulacros SERUMS completos.
      </p>

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-2xl py-3 text-xl font-bold mb-3"
      >
        👑 Hazte Premium
      </button>

      <button
        onClick={() => setMostrarBloqueoPremium(false)}
        className="w-full text-slate-400 hover:text-white transition"
      >
        Seguir explorando
      </button>

    </div>

  </div>
)}
</section>
</div>
<div className="fixed bottom-2 right-1 bg-slate-900 text-white rounded-2xl shadow-xl p-2 border border-slate-100 z-30 w-31">
  
  <p className="text-sm text-slate-200">
    🎯 Meta diaria
  </p>

  <p className="text-3xl font-bold text-center">
    {preguntasHoy}/{metaDiaria}
  </p>

  <div className="w-full bg-slate-800 rounded-full h-2 mt-1">

    <div
      className="bg-blue-500 h-1 rounded-full"
      style={{
        width: `${Math.min(
          (preguntasHoy / metaDiaria) * 100,
          100
        )}%`,
      }}
    ></div>

  </div>

</div>
{mostrarPremium && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999] px-4">
    <div className="bg-white text-slate-900 rounded-3xl p-8 w-full max-w-lg relative shadow-2xl">

      <button
        onClick={() => setMostrarPremium(false)}
        className="absolute top-4 right-5 text-3xl font-bold text-slate-400 hover:text-slate-700"
      >
        ×
      </button>

      <h2 className="text-3xl font-extrabold mb-3 text-center">
        🌟 Acceso Premium
      </h2>

      <p className="text-center text-slate-600 mb-6">
        Desbloquea todo el banco SERUMS y prepárate.
      </p>

      <div className="space-y-3 mb-6 text-lg">
        <p>✅ Acceso a los simulacros </p>
        <p>✅ Todas las áreas desbloqueadas</p>
        <p>✅ Estadísticas y progreso completo</p>
        <p>✅ Reforzamiento inteligente</p>
        <p>✅ Acceso hasta en 2 dispositivos</p>
      </div>

      <div className="bg-yellow-100 border border-yellow-300 rounded-2xl p-4 mb-6 text-sm">
        Para activar tu acceso, escríbenos por WhatsApp con el correo que usaste al registrarte.
      </div>

      <a
        href="https://wa.me/TUNUMERO?text=Hola,%20quiero%20adquirir%20el%20acceso%20Premium%20SERUMS.%20Mi%20correo%20registrado%20es:"
        target="_blank"
        className="block text-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl text-lg"
      >
        Comprar por WhatsApp
      </a>

    </div>
  </div>
)}
</main>
);
}