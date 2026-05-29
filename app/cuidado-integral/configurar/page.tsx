"use client";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfigurarSimulacro() {
  const [mostrarPremium, setMostrarPremium] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const usuarioRegistrado =
      localStorage.getItem("usuarioActual");
  
    if (!usuarioRegistrado) {
      router.push("/login");
    }
  }, []);
  return (
    <main className="min-h-screen bg-[#edf3f8] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-sm p-10 max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-blue-950 mb-4">
        Cuidado Integral
        </h1>

        <p className="text-slate-600 text-xl mb-10">
          Selecciona cuántas preguntas deseas resolver.
        </p>

        <div className="grid grid-cols-3 gap-5 mb-10">
          <Link href="/cuidado-integral?cantidad=20" className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-8 text-3xl font-bold transition hover:scale-105">
            20
          </Link>

          <button
  onClick={() => setMostrarPremium(true)}
  className="bg-slate-400 text-white rounded-2xl py-8 text-3xl font-bold cursor-not-allowed"
>
  🔒 35
</button>

<button
  onClick={() => setMostrarPremium(true)}
  className="bg-slate-400 text-white rounded-2xl py-8 text-3xl font-bold cursor-not-allowed"
>
  🔒 50
</button>
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
{mostrarPremium && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
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