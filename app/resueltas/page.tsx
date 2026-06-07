"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { userKey } from "@/lib/storageUsuario";

export default function ResueltasPage() {
  const [resueltas, setResueltas] = useState<any[]>([]);

  useEffect(() => {
    const guardadas = JSON.parse(
      localStorage.getItem(userKey("preguntasResueltas")) || "[]"
    );

    setResueltas(guardadas);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">

        <Link
          href="/"
          className="inline-block mb-4 bg-white border px-4 py-2 rounded-xl shadow-sm font-semibold text-[#06194a]"
        >
          ← Volver al inicio
        </Link>

        <div className="bg-white rounded-3xl shadow-md p-6 border mb-6">
          <h1 className="text-3xl font-extrabold text-[#06194a] mb-2">
            📚 Preguntas Resueltas
          </h1>

          <p className="text-slate-600">
            Aquí encontrarás las preguntas que ya resolviste correctamente.
          </p>

          <p className="mt-4 font-bold text-green-600">
            Total resueltas: {resueltas.length}
          </p>
        </div>

        {resueltas.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-6 border text-center">
            <p className="text-slate-600">
              Aún no tienes preguntas resueltas guardadas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {resueltas.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-md p-5 border"
              >
                <div className="flex justify-between gap-3 mb-3">
                  <span className="text-sm font-bold text-green-600">
                    ✅ Resuelta
                  </span>

                  <span className="text-xs text-slate-400">
                    {item.origen === "examen"
                      ? "Correcta en examen"
                      : "Corregida desde falladas"}
                  </span>
                </div>

                <h2 className="font-bold text-[#06194a] mb-3">
                  {index + 1}. {item.pregunta}
                </h2>

                <div className="space-y-2 text-sm">
                  {item.opciones?.map((opcion: string, i: number) => (
                    <div
                      key={i}
                      className={`p-2 rounded-xl border ${
                        i === item.correcta
                          ? "bg-green-50 border-green-400 text-green-700 font-bold"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}. {opcion}
                    </div>
                  ))}
                </div>

                {item.explicacion && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-3 text-sm text-slate-700">
                    <strong>Explicación:</strong> {item.explicacion}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}