"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function FalladasPage() {
  const [falladas, setFalladas] = useState<any[]>([]);

  useEffect(() => {
    const guardadas = localStorage.getItem("preguntasFalladas");

    if (guardadas) {
      setFalladas(JSON.parse(guardadas));
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-6 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl"
      >
        ← Volver
      </Link>

      <div className="flex items-center gap-4 mb-6">

  <h1 className="text-4xl font-bold">
    ❌ Preguntas falladas
  </h1>

  <div className="bg-red-500 text-white px-4 py-1 rounded-xl font-bold text-xl">
    {falladas.length}
  </div>

</div>

      <p className="text-slate-300 mb-8">
        Aquí aparecerán las preguntas que fallaste y aún tienes pendientes por reforzar.
      </p>

      {falladas.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-2">Sin pendientes 🎉</h2>
          <p className="text-slate-300">
            No tienes preguntas falladas pendientes por repasar.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {falladas.map((pregunta, index) => (
            <div key={index} className="bg-slate-800 rounded-2xl p-6">
              <p className="text-sm text-red-400 mb-2">
                Pregunta fallada {index + 1}
              </p>

              <h2 className="text-xl font-bold mb-4">
                {pregunta.pregunta}
              </h2>

              <div className="space-y-2 mb-4">
              {pregunta.opciones?.map((opcion: string, i: number) => (
  <button
    key={i}
    onClick={() => {
      if (i === pregunta.correcta) {
        const nuevasFalladas = falladas.filter((_, pos) => pos !== index);
        setFalladas(nuevasFalladas);
        localStorage.setItem("preguntasFalladas", JSON.stringify(nuevasFalladas));
      } else {
        alert("Respuesta incorrecta. Inténtalo otra vez.");
      }
    }}
    className="w-full text-left bg-slate-700 hover:bg-slate-600 rounded-xl p-3"
  >
    {opcion}
  </button>
))}
              </div>

              
            </div>
          ))}
        </div>
      )}
    </main>
  );
}