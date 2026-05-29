"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function EstadisticasPage() {
  const [historial, setHistorial] = useState<any[]>([]);

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem("historialExamenes") || "[]");
    setHistorial(datos);
  }, []);

  const totalPreguntas = historial.reduce(
    (total, examen) => total + examen.totalPreguntas,
    0
  );

  const promedio =
    historial.length > 0
      ? (
          historial.reduce((total, examen) => total + examen.nota, 0) /
          historial.length
        ).toFixed(2)
      : "0.00";

  const mejorNota =
    historial.length > 0
      ? Math.max(...historial.map((examen) => examen.nota)).toFixed(2)
      : "0.00";

  const racha = historial.length > 0 ? "🔥 Activa" : "0 días";

  const calcularPromedioArea = (area: string) => {
    const examenesArea = historial.filter((examen) => examen.tema === area);

    if (examenesArea.length === 0) return 0;

    return Math.round(
      examenesArea.reduce((total, examen) => total + examen.nota, 0) /
        examenesArea.length *
        5
    );
  };

  const saludPublica = calcularPromedioArea("Salud Pública");
  const gestion = calcularPromedioArea("Gestión");
  const etica = calcularPromedioArea("Ética");
  const investigacion = calcularPromedioArea("Investigación");
  const cuidadoIntegral = calcularPromedioArea("Cuidado Integral");

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-6 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl"
      >
        ← Volver
      </Link>

      <h1 className="text-4xl font-bold mb-8">📊 Estadísticas</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 p-6 rounded-2xl">
          <p className="text-gray-400">Preguntas resueltas</p>
          <h2 className="text-3xl font-bold mt-2">{totalPreguntas}</h2>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">
          <p className="text-gray-400">Promedio</p>
          <h2 className="text-3xl font-bold mt-2">{promedio}</h2>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">
          <p className="text-gray-400">Mejor nota</p>
          <h2 className="text-3xl font-bold mt-2">{mejorNota}</h2>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">
          <p className="text-gray-400">Racha</p>
          <h2 className="text-3xl font-bold mt-2">{racha}</h2>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">Rendimiento por áreas</h2>

        {[
          ["Salud Pública", saludPublica],
          ["Gestión", gestion],
          ["Ética", etica],
          ["Investigación", investigacion],
          ["Cuidado Integral", cuidadoIntegral],
        ].map(([area, valor]: any) => (
          <div key={area} className="mb-5">
            <div className="flex justify-between mb-1">
              <span>{area}</span>
              <span>{valor}%</span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${valor}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}