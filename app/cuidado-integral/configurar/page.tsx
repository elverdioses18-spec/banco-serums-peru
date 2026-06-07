"use client";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import BloqueoRegistro from "../../../components/BloqueoRegistro";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ConfigurarSimulacro() {
  const [mostrarPremium, setMostrarPremium] = useState(false);
  const [mostrarBloqueo, setMostrarBloqueo] = useState(false);
  const [esPremium, setEsPremium] = useState(false);
  const usuarioRegistrado =
  typeof window !== "undefined" &&
  localStorage.getItem("usuarioActual");
  
if (!usuarioRegistrado) {
  return <BloqueoRegistro />;
}
  const router = useRouter();
  const entrarGratis20 = async () => {
    
    const usuario = JSON.parse(localStorage.getItem("usuarioActual") || "{}");
  
    if (!usuario.correo) return;
  
    const { data } = await supabase
      .from("usuarios")
      .select("gratis_bloqueado, premium")
      .eq("correo", usuario.correo)
      .single();
  
    if (!data?.premium && data?.gratis_bloqueado) {
      
      setMostrarBloqueo(true);
      return;
    }
  
    await supabase
      .from("usuarios")
      .update({ gratis_bloqueado: true })
      .eq("correo", usuario.correo);
  
    router.push("/cuidado-integral?cantidad=20");
  };
  useEffect(() => {
  const usuarioRegistrado =
    localStorage.getItem("usuarioActual");

  if (!usuarioRegistrado) {
    router.push("/login");
    return;
  }

  setEsPremium(
    localStorage.getItem("premium") === "true"
  );
}, []);
  return (
    <main className="min-h-screen bg-[#edf3f8] flex items-center justify-center p-6">
      <input id="premium-modal" type="checkbox" className="peer hidden" />
      <div className="bg-white rounded-3xl shadow-sm p-10 max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-blue-950 mb-4">
        Cuidado Integral
        </h1>

        <p className="text-slate-600 text-xl mb-10">
          Selecciona cuántas preguntas deseas resolver.
        </p>

        <div className="grid grid-cols-3 gap-5 mb-10">
        <button
  onClick={entrarGratis20}
  className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-28 md:h-auto md:py-8 flex items-center justify-center text-3xl font-bold transition-all duration-150 active:scale-95 active:translate-y-1"
>
  20
</button>

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
  {mostrarBloqueo && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
    <div className="bg-slate-800 p-8 rounded-2xl max-w-lg text-center text-white">
      <h1 className="text-3xl font-bold mb-4">
        Acceso bloqueado
      </h1>

      <p className="text-lg mb-6">
        Ya agotaste tus 20 preguntas gratis. Activa Premium para seguir practicando.
      </p>

      <button
        onClick={() => setMostrarBloqueo(false)}
        className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold"
      >
        Entendido
      </button>
    </div>
  </div>
)}
</main>
  );
}