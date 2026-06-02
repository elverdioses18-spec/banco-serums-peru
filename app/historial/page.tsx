"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HistorialPage() {
  const [historial, setHistorial] = useState<any[]>([]);
  const [filtroTema, setFiltroTema] = useState("Todos");
const [ordenNota, setOrdenNota] = useState("reciente");

  useEffect(() => {
    const guardado = localStorage.getItem("historialExamenes");

    if (guardado) {
      setHistorial(JSON.parse(guardado));
    }
  }, []);
  const historialFiltrado = historial
  .filter((item: any) =>
    filtroTema === "Todos" ? true : item.tema === filtroTema
  )
  .sort((a: any, b: any) => {
    if (ordenNota === "mayor") return b.nota - a.nota;
    if (ordenNota === "menor") return a.nota - b.nota;
    return 0;
  });

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-6 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl"
      >
        ← Volver
      </Link>

      <h1 className="text-4xl font-bold mb-3">
        🕘 Historial de simulacros
      </h1>

      <p className="text-slate-300 mb-8">
        Aquí aparecerán los últimos 100 exámenes realizados.
      </p>

      {historial.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-2">Sin historial todavía</h2>
          <p className="text-slate-300">
            Cuando termines un examen, aparecerá aquí.
          </p>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
  <select
    value={filtroTema}
    onChange={(e) => setFiltroTema(e.target.value)}
    className="bg-slate-800 text-white border border-slate-600 rounded-xl p-3"
  >
    <option>Todos</option>
    <option>Salud Pública</option>
    <option>Gestión</option>
    <option>Cuidado Integral</option>
    <option>Ética</option>
    <option>Investigación</option>
    <option>Simulacro Mixto</option>
  </select>

  <select
    value={ordenNota}
    onChange={(e) => setOrdenNota(e.target.value)}
    className="bg-slate-800 text-white border border-slate-600 rounded-xl p-3"
  >
    <option value="reciente">Más recientes</option>
    <option value="mayor">Mayor nota a menor</option>
    <option value="menor">Menor nota a mayor</option>
  </select>
</div>
        <div className="space-y-4">
          {historialFiltrado.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h2 className="text-xl font-bold">{item.tema}</h2>
                <p className="text-slate-400">
                  {item.fecha} · {item.hora}
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <span className="bg-slate-700 px-4 py-2 rounded-xl">
                  {item.totalPreguntas} preguntas
                </span>

                <span className="bg-green-600 px-4 py-2 rounded-xl font-bold">
                  {item.correctas}/{item.totalPreguntas}
                </span>

                <span className="bg-blue-600 px-4 py-2 rounded-xl font-bold">
                  Nota: {item.nota}/20
                </span>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </main>
  );
}