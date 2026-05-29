"use client";
import Link from "next/link";
import { useState } from "react";

export default function ConfigurarSimulacro() {
  const [mostrarPremium, setMostrarPremium] = useState(false);
  return (
    <main className="min-h-screen bg-[#edf3f8] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-sm p-10 max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-blue-950 mb-4">
          Simulacro Mixto
        </h1>

        <p className="text-slate-600 text-xl mb-10">
          Selecciona cuántas preguntas deseas resolver.
        </p>

        <div className="grid grid-cols-2 gap-5 mb-10">
        <button
  onClick={() => setMostrarPremium(true)}
  className="bg-slate-400 text-white rounded-2xl py-8 text-3xl font-bold cursor-not-allowed"
>
  🔒 25
</button>

          <button
  onClick={() => setMostrarPremium(true)}
  className="bg-slate-400 text-white rounded-2xl py-8 text-3xl font-bold cursor-not-allowed"
>
  🔒 50
</button>
<button
  onClick={() => setMostrarPremium(true)}
  className="bg-slate-400 text-white rounded-2xl py-8 text-3xl font-bold cursor-not-allowed"
>
  🔒 100
</button>
          
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
  <Link
    href="/simulacro-mixto"
    className="bg-slate-100 hover:bg-slate-200 text-blue-700 font-semibold px-5 py-3 rounded-xl transition"
  >
    ← Volver al examen
  </Link>

  <Link
    href="/"
    className="text-blue-700 font-semibold hover:underline"
  >
    ← Volver al inicio
  </Link>
</div>

</div>
{mostrarPremium && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-3xl max-w-md text-center shadow-2xl">
      <h2 className="text-3xl font-bold mb-4 text-blue-900">
        ⭐ Simulacro Mixto Premium
      </h2>

      <div className="text-left text-slate-700 mb-6 space-y-3">
        <p>
          El Simulacro Mixto está disponible exclusivamente para usuarios Premium.
        </p>

        <div>
          <p className="font-bold text-amber-500">
            Incluye preguntas combinadas de:
          </p>

          <p>✅ Salud Pública</p>
          <p>✅ Gestión</p>
          <p>✅ Cuidado Integral</p>
          <p>✅ Investigación</p>
          <p>✅ Ética</p>
        </div>

        <div>
          <p className="font-bold text-green-600">
            Beneficios Premium
          </p>

          <p>✅ Simulacros de 25, 50 y 100 preguntas</p>
          <p>✅ Acceso ilimitado</p>
          <p>✅ Todas las áreas disponibles</p>
          <p>✅ Estadísticas completas</p>
          <p>✅ Práctica sin restricciones</p>
        </div>
      </div>

      <button
        onClick={() => setMostrarPremium(false)}
        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold"
      >
        Entendido
      </button>
    </div>
  </div>
)}
</main>
  );
}