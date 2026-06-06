"use client";
import Link from "next/link";
import BloqueoRegistro from "../../../components/BloqueoRegistro";
import { useEffect, useState } from "react";

export default function ConfigurarSimulacro() {
  const [mostrarPremium, setMostrarPremium] = useState(false);
  const [esPremium, setEsPremium] = useState(false);
  const usuarioRegistrado =
  typeof window !== "undefined" &&
  localStorage.getItem("usuarioActual");
  useEffect(() => {
    setEsPremium(localStorage.getItem("premium") === "true");
  }, []);

if (!usuarioRegistrado) {
  return <BloqueoRegistro />;
}
  return (
    <main className="min-h-screen bg-[#edf3f8] flex items-center justify-center p-6">
      <input id="premium-modal" type="checkbox" className="peer hidden" />
      <div className="bg-white rounded-3xl shadow-sm p-10 max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-blue-950 mb-4">
          Ética
        </h1>

        <p className="text-slate-600 text-xl mb-10">
          Selecciona cuántas preguntas deseas resolver.
        </p>

        <div className="grid grid-cols-3 gap-5 mb-10">
          <Link href="/etica?cantidad=20" className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-28 md:h-auto md:py-8 flex items-center justify-center text-3xl font-bold transition hover:scale-105">
            20
          </Link>

          {esPremium ? (
  <Link
    href="/cuidado-integral?cantidad=35"
    className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-28 md:h-auto md:py-8 flex items-center justify-center text-3xl font-bold"
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
    href="/cuidado-integral?cantidad=50"
    className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-28 md:h-auto md:py-8 flex items-center justify-center text-3xl font-bold"
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
        ⭐ Beneficios Premium
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
          <p>✅ Simulacro Mixto completo</p>
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
</main>
  );
}