"use client";
import Link from "next/link";
import { useState } from "react";

export default function ConfigurarSimulacro() {
  const [mostrarPremium, setMostrarPremium] = useState(false);
  
  const esPremium =
  typeof window !== "undefined" &&
  localStorage.getItem("premium") === "true";
  const usuarioRegistrado =
  typeof window !== "undefined" &&
  localStorage.getItem("usuarioActual");
  if (!usuarioRegistrado) {
    return (
      <main className="min-h-screen bg-black/70 text-white flex items-center justify-center p-6">
        <div className="bg-white text-slate-900 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl">
          <h1 className="text-3xl font-bold mb-4 text-blue-950">
            Regístrate gratis
          </h1>
  
          <p className="text-lg mb-6 text-slate-600">
            Debes registrarte para acceder a tus 20 preguntas gratuitas.
          </p>
  
          <Link
            href="/login"
            className="block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold mb-3"
          >
            Ir a registrarme
          </Link>
  
          <Link
            href="/"
            className="inline-block text-slate-500 font-bold"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[#edf3f8] flex items-center justify-center p-6">
      <input id="premium-modal" type="checkbox" className="peer hidden" />
      <input id="registro-modal" type="checkbox" className="peer/registro hidden" />
      <div className="bg-white rounded-3xl shadow-sm p-10 max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-blue-950 mb-4">
          Salud Pública
        </h1>

        <p className="text-slate-600 text-xl mb-10">
          Selecciona cuántas preguntas deseas resolver.
        </p>

        <div className="grid grid-cols-3 gap-5 mb-10">
        {usuarioRegistrado ? (
  <Link
    href="/salud-publica?cantidad=20"
    className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-28 md:h-auto md:py-8 flex items-center justify-center text-3xl font-bold transition hover:scale-105"
  >
    20
  </Link>
) : (
  <label
    htmlFor="registro-modal"
    className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-28 md:h-auto md:py-8 flex items-center justify-center text-3xl font-bold cursor-pointer"
  >
    20
  </label>
)}

  {esPremium ? (
    <Link
      href="/salud-publica?cantidad=35"
      className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-28 md:h-auto md:py-8 flex items-center justify-center text-3xl font-bold transition hover:scale-105"
    >
      35
    </Link>
  ) : (
    <label
      htmlFor="premium-modal"
      className="bg-slate-400 text-white rounded-2xl h-28 md:h-auto md:py-8 flex items-center justify-center text-3xl font-bold cursor-pointer"
    >
      🔒 35
    </label>
  )}

  {esPremium ? (
    <Link
      href="/salud-publica?cantidad=50"
      className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-28 md:h-auto md:py-8 flex items-center justify-center text-3xl font-bold transition hover:scale-105"
    >
      50
    </Link>
  ) : (
    <label
      htmlFor="premium-modal"
      className="bg-slate-400 text-white rounded-2xl h-28 md:h-auto md:py-8 flex items-center justify-center text-3xl font-bold cursor-pointer"
    >
      🔒 50
    </label>
  )}
</div>

<div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
  <button
    onClick={() => history.back()}
    className="bg-slate-100 hover:bg-slate-200 text-blue-700 font-semibold px-5 py-3 rounded-xl transition"
  >
    ← Volver al examen
  </button>

  <Link
    href="/"
    className="text-blue-700 font-semibold hover:underline"
  >
    ← Volver al inicio
  </Link>
</div>

</div>
<div className="hidden peer-checked:flex fixed inset-0 bg-black/60 items-center justify-center z-[99999]">
    <div className="bg-white p-8 rounded-3xl max-w-md text-center">
      <h2 className="text-3xl font-bold mb-4 text-blue-900">
        🔒 Función Premium
      </h2>

      <div className="text-left text-slate-700 mb-6 space-y-3">
  <div>
    <p className="font-bold text-green-600">
      🎁 Plan Gratuito
    </p>

    <p>✅ 20 preguntas por simulacro</p>
    <p>✅ Acceso de prueba</p>
  </div>

  <div>
    <p className="font-bold text-amber-500">
      ⭐ Plan Premium
    </p>

    <p>✅ Simulacros de 20, 35 y 50 preguntas</p>
    <p>✅ Acceso ilimitado</p>
    <p>✅ Todas las áreas disponibles</p>
    <p>✅ Simulacros Mixtos completo</p>
  </div>
</div>

<label
  htmlFor="premium-modal"
  className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold cursor-pointer"
>
  Entendido
</label>
    </div>
  </div>
  <div className="hidden peer-checked/registro:flex fixed inset-0 bg-black/60 items-center justify-center z-[99999] p-4">
  <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
    <h2 className="text-3xl font-bold text-blue-950 mb-4">
      Regístrate gratis
    </h2>

    <p className="text-slate-600 text-lg mb-6">
      Debes registrarte para acceder a tus 20 preguntas gratuitas.
    </p>

    <Link
      href="/login"
      className="block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold mb-3"
    >
      Ir a registrarme
    </Link>

    <label
      htmlFor="registro-modal"
      className="inline-block text-slate-500 font-bold cursor-pointer"
    >
      Cerrar
    </label>
  </div>
</div>
</main>
  );
}