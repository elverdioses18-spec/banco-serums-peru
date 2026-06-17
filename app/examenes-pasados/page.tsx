"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Shuffle,
  CheckCircle,
  ChevronRight,
  BarChart3,
  Flame,
  Lightbulb,
  Trophy,
  ClipboardCheck,
} from "lucide-react";
import { examenesPasados } from "@/data/examenesPasados";

const convocatorias = [
  {
    id: "2024-ii-a",
    nombre: "EXAMEN 2024 - II - A",
    total: examenesPasados["2024-ii-a"].length,
    gratis: true,
  },
  {
    id: "2024-ii-b",
    nombre: "EXAMEN 2024 - II - B",
    total: examenesPasados["2024-ii-b"].length,
    gratis: true,
  },
  {
    id: "2025-i-a",
    nombre: "EXAMEN 2025 - I - A",
    total: examenesPasados["2025-i-a"].length,
    gratis: false,
  },
  {
    id: "2025-i-b",
    nombre: "EXAMEN 2025 - I - B",
    total: examenesPasados["2025-i-b"].length,
    gratis: false,
  },
  {
    id: "2025-ii",
    nombre: "EXAMEN 2025 - II",
    total: examenesPasados["2025-ii"].length,
    gratis: false,
  },
  {
    id: "2026-i",
    nombre: "EXAMEN 2026 - I",
    total: examenesPasados["2026-i"].length,
    gratis: false,
  },
];

const cantidades = [20, 50, 100];

export default function ExamenesPasadosPage() {
  const [seleccion, setSeleccion] = useState<string | null>("2024-ii-a");
  const [imagenAbierta, setImagenAbierta] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-[#06194a]">
      <div className="max-w-6xl mx-auto space-y-5">

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white rounded-xl px-4 py-2 font-bold shadow-sm border border-slate-100 text-purple-700"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </Link>

        {/* HEADER */}
        <section className="bg-[#07347e] text-white rounded-3xl p-4 md:p-6 shadow-md overflow-hidden relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-4xl font-extrabold">
                Exámenes Pasados SERUMS
              </h1>
              <p className="mt-3 text-white/90 max-w-xl">
                Practica preguntas de convocatorias anteriores y refuerza los
                temas que más se repiten en el examen.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-2 max-w-lg">
              <div className="bg-white text-[#06194a] rounded-2xl p-4 shadow-md flex items-center justify-center">
              <p className="font-extrabold text-lg">
             6 Exámenes
            </p>
             </div>

             <div className="bg-white text-[#06194a] rounded-2xl p-4 shadow-md flex items-center justify-center">
             <p className="font-extrabold text-[18px] text-center">
  600+ Preguntas
</p>
             </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center">
                <Trophy className="w-14 h-14 text-white" />
              </div>
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                <FileText className="w-14 h-14 text-purple-700" />
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-5 items-start">

         {/* POR CONVOCATORIA */}
         <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 self-start w-full lg:w-[705px] lg:min-w-[705px]">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                <CalendarDays className="w-7 h-7 text-purple-700" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold">Por convocatoria</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Elige un examen SERUMS anterior y luego selecciona la cantidad
                  de preguntas.
                </p>
              </div>
            </div>

            <div className="grid gap-2 grid-cols-1 md:grid-cols-2 max-w-2xl">
              {convocatorias.map((item) => {
                const activo = seleccion === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setSeleccion(item.id)}
                    className={`rounded-2xl p-4 text-left border shadow-sm flex items-center justify-between transition ${
                      activo
                        ? "bg-purple-50 border-purple-400"
                        : "bg-white border-slate-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          activo ? "bg-purple-600" : "bg-purple-100"
                        }`}
                      >
                        <FileText
                          className={`w-7 h-7 ${
                            activo ? "text-white" : "text-purple-700"
                          }`}
                        />
                      </div>

                      <div>
  <div className="flex items-center gap-2">
    <p className="font-extrabold">{item.nombre}</p>

    {item.gratis && (
      <span className="rounded-full bg-amber-400 px-2 py-1 text-[10px] font-extrabold text-white">
        GRATIS
      </span>
    )}
  </div>

  <p className="text-sm text-slate-600 mt-1">
    {item.total} preguntas disponibles.
  </p>
</div>
                    </div>

                    {activo ? (
                      <CheckCircle className="w-6 h-6 text-purple-700" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-[#06194a]" />
                    )}
                  </button>
                );
              })}
            </div>

            {seleccion && seleccion !== "mixto" && (
              <div className="mt-5 w-full bg-purple-50 border border-purple-200 rounded-2xl p-4">
                <p className="font-extrabold">Cantidad de preguntas</p>
                <p className="text-sm text-slate-600 mt-1">
                  Selecciona cuántas preguntas deseas practicar del examen elegido.
                </p>

                <div className="mt-2 flex flex-col sm:flex-row justify-center gap-4">
                  {cantidades.map((cantidad) => (
                   <Link
                   key={cantidad}
                   href={`/examenes-pasados/${seleccion}?cantidad=${cantidad}`}
                   className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-2xl py-3 text-center font-extrabold shadow-md"
                 >
                      {cantidad}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            </section>
            
          

         {/* MIXTO */}
         <section
  className="hidden md:block bg-white rounded-3xl p-5 shadow-sm border border-slate-100 self-start"
  style={{ width: "580px", minWidth: "580px" }}
>
            <div className="flex justify-end mb-5">
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-sm font-extrabold flex items-center gap-1">
                <Flame className="w-4 h-4" />
                Más utilizado
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-purple-600 flex items-center justify-center shadow-md">
                <Shuffle className="w-11 h-11 text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold">Examen mixto</h2>
                <p className="text-sm text-slate-600 mt-2 leading-6">
                  Genera un examen con preguntas mezcladas de todas las
                  convocatorias disponibles.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSeleccion("mixto")}
              className="mt-6 mx-auto w-full max-w-[500px] bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-4 font-extrabold shadow-md flex items-center justify-center gap-2"
            >
              <Shuffle className="w-5 h-5" />
              Practicar mixto
            </button>

            {seleccion === "mixto" && (
  <div className="mt-6 w-full bg-purple-50 border border-purple-100 rounded-2xl p-4">
                <p className="font-extrabold">Cantidad de preguntas</p>

                <div className="mt-2 flex flex-wrap justify-center gap-3">
                  {cantidades.map((cantidad) => (
                   <Link
                   key={cantidad}
                   href={`/examenes-pasados/mixto?cantidad=${cantidad}`}
                   style={{ width: "115px" }}
                   className="w-full sm:w-[115px] bg-white border border-purple-100 text-purple-700 rounded-xl py-2 text-center font-extrabold"
                 >
                   {cantidad}
                 </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
          {/* MIXTO - MÓVIL */}
<section className="md:hidden w-full bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
  <div className="flex justify-end mb-4">
    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1">
      <Flame className="w-4 h-4" />
      Más utilizado
    </span>
  </div>

  <div className="flex items-center gap-4">
    <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center shadow-md shrink-0">
      <Shuffle className="w-9 h-9 text-white" />
    </div>

    <div>
      <h2 className="text-xl font-extrabold">Examen mixto</h2>
      <p className="text-xs text-slate-600 mt-1 leading-5">
        Preguntas mezcladas de todas las convocatorias disponibles.
      </p>
    </div>
  </div>

  <button
    onClick={() => setSeleccion("mixto")}
    className="mt-5 w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 font-extrabold shadow-md flex items-center justify-center gap-2"
  >
    <Shuffle className="w-5 h-5" />
    Practicar mixto
  </button>

  {seleccion === "mixto" && (
    <div className="mt-4 w-full bg-purple-50 border border-purple-100 rounded-2xl p-3">
      <p className="font-extrabold text-sm">Cantidad de preguntas</p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {cantidades.map((cantidad) => (
          <Link
            key={cantidad}
            href={`/examenes-pasados/mixto?cantidad=${cantidad}`}
            className="bg-white border border-purple-200 text-purple-700 rounded-xl py-2 text-center font-extrabold"
          >
            {cantidad}
          </Link>
        ))}
      </div>
    </div>
  )}
</section>
          </div>
          

        {/* DATOS */}
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-5">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-extrabold">Datos importantes</h2>
              <p className="text-sm text-slate-600">
                Información clave para mejorar tu preparación.
              </p>
            </div>
          </div>

          <img
  src="/imagenes/datos-serums.webp"
  alt="Datos importantes SERUMS"
  onClick={() => setImagenAbierta(true)}
  className="w-full rounded-2xl cursor-pointer transition hover:scale-[1.01]"
/>
        </section>
      </div>
      {imagenAbierta && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    onClick={() => setImagenAbierta(false)}
  >
    <div className="relative max-w-5xl w-full">
      <button
        onClick={() => setImagenAbierta(false)}
        className="absolute -top-12 right-0 bg-white rounded-full px-4 py-2 font-bold shadow-md"
      >
        ✕
      </button>

      <img
        src="/imagenes/datos-serums.webp"
        alt="Datos importantes SERUMS"
        className="w-full rounded-3xl shadow-2xl"
      />
    </div>
  </div>
)}
    </main>
  );
}