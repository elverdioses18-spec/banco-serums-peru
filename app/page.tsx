"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { preguntas } from "@/data/preguntas";
const temas = [
  { nombre: "Salud Pública", desc: "Salud pública y epidemiología.", preguntas: "1,250 preguntas", color: "bg-blue-600", icono: "👥", ruta: "/salud-publica/configurar" },
  { nombre: "Gestión", desc: "Administración en salud y normativas del sector.", preguntas: "980 preguntas", color: "bg-green-600", icono: "🏢", ruta: "/gestion/configurar" },
  { nombre: "Cuidado Integral", desc: "Atención integral, cursos de vida y casos clínicos.", preguntas: "1,320 preguntas", color: "bg-yellow-500", icono: "💛", ruta: "/cuidado-integral/configurar" },
  { nombre: "Investigación", desc: "Metodología de investigación y bioestadística.", preguntas: "870 preguntas", color: "bg-purple-600", icono: "🧪", ruta: "/investigacion/configurar" },
  { nombre: "Ética", desc: "Bioética, ética médica y normativa legal.", preguntas: "610 preguntas", color: "bg-red-500", icono: "⚖️", ruta: "/etica/configurar" },
  { nombre: "Simulacro Mixto", desc: "Simulacro completo con preguntas de todos los temas.", preguntas: "100 preguntas", color: "bg-orange-500", icono: "🔥", ruta: "/simulacro-mixto/configurar" },
];

export default function Home() {
  const [progresoSalud, setProgresoSalud] = useState<any>(null);
  const [progresoCuidado, setProgresoCuidado] = useState<any>(null);
  const [progresoGestion, setProgresoGestion] = useState<any>(null);
const [progresoInvestigacion, setProgresoInvestigacion] = useState<any>(null);
const [progresoEtica, setProgresoEtica] = useState<any>(null);
const [progresoMixto, setProgresoMixto] = useState<any>(null);
  const [temaActivo, setTemaActivo] = useState("salud");
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
  return (
    <main className="min-h-screen bg-[#edf3f8] text-[#06194a]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="w-[290px] shrink-0 bg-[#001f5c] text-white hidden md:flex flex-col">
          <div className="h-[96px] px-6 flex items-center gap-4 bg-[#062b73]">
            
            <div className="min-w-max">
            <h1 className="text-2xl font-bold whitespace-nowrap">Banco SERUMS Perú</h1>
            <p className="text-base text-blue-100 whitespace-nowrap">Prepárate, práctica y aprueba</p>
            </div>
          </div>
          <Link
  href="/"
  className="flex items-center gap-3 px-10 py-4 ml-2 mt-4 rounded-xl hover:bg-blue-800 transition mb-1"
>
  <span className="text-2xl">🏠</span>

  <span className="font-semibold text-lg">
    Inicio
  </span>
</Link>
          <div className="px-6 py-7">
            <p className="text-sm font-bold text-blue-200 mb-5">TEMAS SERUMS</p>

            <div className="space-y-3">
              {temas.map((tema) => (
                <Link
                key={tema.nombre}
                href={tema.ruta}
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
                                  
                    className="flex items-center gap-4 p-3 rounded-xl transition hover:bg-blue-900"
      
                >
                  <span className={`${tema.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}>
                    {tema.icono}
                  </span>
                  <span className="text-lg font-semibold">{tema.nombre}</span>
                </Link>
              ))}
            </div>

            <div className="border-t border-blue-800 my-7"></div>

            <p className="text-sm font-bold text-blue-200 mb-5">MI PROGRESO</p>
            <div className="space-y-5 text-lg">
              <p>📊 Estadísticas</p>
              <p>⭐ Preguntas favoritas</p>
              <p>❌ Preguntas falladas</p>
              <p>🕘 Historial de simulacros</p>
            </div>

            <div className="border-t border-blue-800 my-7"></div>

            <p className="text-sm font-bold text-blue-200 mb-5">CONFIGURACIÓN</p>
            <div className="space-y-5 text-lg">
              <p>⚙️ Ajustes</p>
              <p>↪️ Cerrar sesión</p>
            </div>
          </div>
        </aside>

        {/* CONTENIDO */}
        <section className="flex-1">

          {/* HEADER */}
          <header className="h-[96px] bg-[#062b73] text-white px-8 flex items-center justify-end gap-6">
            <div className="w-12 h-12 rounded-full bg-blue-900/60 flex items-center justify-center text-xl">🌙</div>

            <div className="relative w-12 h-12 rounded-full bg-blue-900/60 flex items-center justify-center text-xl">
              🔔
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">3</span>
            </div>

            <div className="w-14 h-14 rounded-full bg-white text-blue-900 flex items-center justify-center text-3xl">
              👤
            </div>

            <div>
              <p className="font-bold">¡Hola, Estudiante!</p>
              <p className="text-sm text-blue-100">Vamos por más 💪</p>
            </div>

            <span className="text-2xl">⌄</span>
          </header>

          <div className="p-8">

            {/* BIENVENIDA */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-7 flex justify-between items-center">
              <div className="flex-1">
                <h2 className="text-4xl font-bold mb-4">
                  ¡Bienvenido a Banco SERUMS Perú! 👋
                </h2>

                <p className="text-xl mb-8 leading-relaxed">
                  Plataforma de simulacros y banco de preguntas <br />
                  para el examen SERUMS.
                </p>

                <div className="grid grid-cols-3 gap-6 max-w-4xl">
                  <div className="border border-slate-200 rounded-xl p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl">❔</div>
                    <div>
  <p className="text-sm">Preguntas resueltas</p>

  <p className="text-3xl font-bold">
    {preguntas.saludPublica.length}
  </p>
</div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl">🎯</div>
                    <div>
                      <p className="text-sm">Precisión promedio</p>
                      <p className="text-3xl font-bold">78%</p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl">📅</div>
                    <div>
                      <p className="text-sm">Racha de estudio</p>
                      <p className="text-3xl font-bold">7 días</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden xl:block absolute left-310 top-15">
              <img
  src="/logo.png.png"
  alt="Logo"
  className="w-[400px] h-[420px] object-contain"
 />
</div>
            </div>

            {/* TARJETAS */}
            <h2 className="text-2xl font-bold mb-5">Elige un tema para comenzar</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-7">
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
    className={`relative bg-white rounded-2xl border p-5 text-center shadow-sm hover:scale-[1.03] transition cursor-pointer ${
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
                  <div className={`${tema.color} w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white`}>
                    {tema.icono}
                  </div>

                  <h3 className="text-xl font-bold mb-2">{tema.nombre}</h3>
                  <p className="text-sm min-h-[62px]">{tema.desc}</p>

                  <div className="text-sm bg-slate-100 rounded-full px-3 py-2 my-4">
                    {tema.preguntas}
                  </div>

                  <Link
  href={tema.ruta}
  className={`${tema.color} text-white rounded-lg py-2 w-full font-bold block`}
>
  Comenzar
</Link>
                </div>
              ))}
            </div>

            {/* PANEL INFERIOR */}
            <div
  className={`bg-white border rounded-2xl p-6 shadow-sm grid grid-cols-1 xl:grid-cols-[360px_220px_300px_1fr] gap-6 items-center ${
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
              <div className="flex items-center gap-6">
                <div className="text-8xl">🏆</div>

                <div>
                <h2
  className={`text-3xl font-bold mb-2 ${
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
  className={`px-5 py-2 rounded-lg ${
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
                    980 preguntas totales
                  </span>
                </div>
              </div>

              <div className="border-l border-slate-200 pl-6 text-center">
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

              <div className="border-l border-slate-200 pl-6 space-y-3">
              <div>
              <p className="font-bold text-xl text-slate-600">❔ Preguntas correctas</p>
  <p className="text-3xl font-bold">
  {progresoActual?.correctas || 0} / {progresoActual?.total || 20}
</p>
</div>

<div className="mt-8">
  <p className="font-bold text-xl text-slate-600">🎯 Precisión</p>
  <p className="text-3xl font-bold">
  {progresoActual?.precision || 0}%
</p>
</div>
                
                
              </div>

              <div className="border-l border-slate-200 pl-6">
             
                <div className="mt-6 space-y-4">

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
<p className="font-bold text-2xl text-slate-600">
    Tiempo promedio
  </p>

  <p className="text-2xl font-bold">
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
  <p className="font-bold text-2xl text-slate-600">
    Última práctica
  </p>

  <p className="text-2xl font-bold">
  {progresoActual?.ultimaPractica || "Sin prácticas"}
  </p>
</div>

</div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}