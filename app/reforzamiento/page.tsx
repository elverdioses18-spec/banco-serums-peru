"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReforzamientoPage() {
  const [areas, setAreas] = useState<any[]>([]);
  const [falladas, setFalladas] = useState(0);

  useEffect(() => {
    const datos = [
      {
        nombre: "Gestión",
        progreso: JSON.parse(localStorage.getItem("progresoGestion") || "null"),
      },
      {
        nombre: "Investigación",
        progreso: JSON.parse(localStorage.getItem("progresoInvestigacion") || "null"),
      },
      {
        nombre: "Salud Pública",
        progreso: JSON.parse(localStorage.getItem("progresoSaludPublica") || "null"),
      },
      {
        nombre: "Cuidado Integral",
        progreso: JSON.parse(localStorage.getItem("progresoCuidado") || "null"),
      },
      {
        nombre: "Ética",
        progreso: JSON.parse(localStorage.getItem("progresoEtica") || "null"),
      },
    ];

    const areasProcesadas = datos.map((area) => ({
      nombre: area.nombre,
      precision: area.progreso?.precision || 0,
      avance: area.progreso?.avance || 0,
      erroresEstimados:
        area.progreso?.avance > 0
          ? Math.max(0, Math.round(area.progreso.avance * (100 - area.progreso.precision) / 100))
          : 0,
    }));

    setAreas(areasProcesadas);

    const preguntasFalladas = JSON.parse(
      localStorage.getItem("preguntasFalladas") || "[]"
    );

    setFalladas(preguntasFalladas.length);
  }, []);

  const areasPracticadas = areas.filter((area) => area.avance > 0);

  const areasDebiles = [...areasPracticadas].sort(
    (a, b) => a.precision - b.precision
  );

  const areasConMasErrores = [...areasPracticadas].sort(
    (a, b) => b.erroresEstimados - a.erroresEstimados
  );

  const areaRecomendada = areasConMasErrores[0]
  const estadisticasTema =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("estadisticasPorTema") || "{}")
    : {};
  
  const temasDebiles = Object.entries(estadisticasTema)
    .map(([tema, datos]: any) => {
      const total = datos.correctas + datos.incorrectas;
  
      const precision =
        total > 0
          ? Math.round((datos.correctas / total) * 100)
          : 0;
  
      return {
        tema,
        precision,
      };
    })
    .sort((a, b) => a.precision - b.precision)
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-6 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl"
      >
        ← Volver
      </Link>

      <h1 className="text-4xl font-bold mb-8">🧠 Reforzamiento</h1>

      <div className="bg-gradient-to-r from-red-20 to-orange-80 p-6 rounded-2xl mb-8">
        <h2 className="text-2xl font-bold mb-2">
          Área recomendada para reforzar
        </h2>

        {areaRecomendada ? (
          <p className="text-lg">
            Tu área con menor precisión actualmente es{" "}
            <span className="font-bold">{areaRecomendada.nombre}</span> con{" "}
            <span className="font-bold">{areaRecomendada.precision}%</span>.
            Te recomendamos reforzar esta área antes de realizar otro simulacro.
          </p>
        ) : (
          <p className="text-lg">
            Aún no hay datos suficientes. Realiza algunos simulacros para generar recomendaciones.
          </p>
        )}
        
            <h2 className="text-2xl font-bold mb-6">📊 Áreas débiles</h2>

        <div className="space-y-5">
          {areasDebiles.length > 0 ? (
            areasDebiles.map((area) => (
              <div key={area.nombre}>
                <div className="flex justify-between mb-1">
                  <span>{area.nombre}</span>
                  <span>{area.precision}%</span>
                </div>

                <div className="w-full bg-slate-700 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${
                      area.precision < 60
                        ? "bg-red-500"
                        : area.precision < 80
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${area.precision}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-300">
              Todavía no hay áreas practicadas.
            </p>
          )}
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl mb-8">
        <h2 className="text-2xl font-bold mb-6">❌ Áreas con más errores</h2>

        <div className="space-y-4">
          {areasConMasErrores.length > 0 ? (
            areasConMasErrores.map((area) => (
              <div
                key={area.nombre}
                className="bg-slate-700 p-4 rounded-xl flex justify-between"
              >
                <span>{area.nombre}</span>

                <span className="text-red-400 font-bold">
                  {area.erroresEstimados} errores estimados
                </span>
              </div>
            ))
          ) : (
            <p className="text-slate-300">
              Aún no hay errores registrados por área.
            </p>
          )}
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl">
  <h2 className="text-2xl font-bold mb-6">
    🎯 Objetivos recomendados
  </h2>

  <div className="space-y-4">
    {areaRecomendada ? (
      <>
        <div className="bg-slate-700 p-4 rounded-xl">
          🎯 Practica 20 preguntas de {areaRecomendada.nombre} para subir tu precisión.
        </div>

        <div className="bg-slate-700 p-4 rounded-xl">
          📈 Intenta llevar {areaRecomendada.nombre} por encima del 60%.
        </div>

        <div className="bg-slate-700 p-4 rounded-xl">
          🔥 Realiza 1 simulacro mixto después de reforzar tu área más débil.
        </div>
      </>
    ) : (
      <div className="bg-slate-700 p-4 rounded-xl">
        Realiza algunos simulacros para generar objetivos personalizados.
      </div>
    )}
  </div>
</div>
    </main>
  );
}