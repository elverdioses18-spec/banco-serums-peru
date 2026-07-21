"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RegaloPage() {
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const verificarPremium = async () => {
      const usuarioGuardado = localStorage.getItem("usuarioActual");
  
      if (!usuarioGuardado) return;
  
      const usuario = JSON.parse(usuarioGuardado);
  
      const { data } = await supabase
        .from("usuarios")
        .select("premium")
        .eq("correo", usuario.correo)
        .single();
  
      if (data?.premium === true) {
        localStorage.setItem("premium", "true");
  
        localStorage.setItem(
          "usuarioActual",
          JSON.stringify({
            ...usuario,
            premium: true,
          })
        );
  
        setPremium(true);
      } else {
        setPremium(false);
      }
    };
  
    verificarPremium();
  }, []);

  const abrirMaterial = () => {
    window.location.assign("/materiales");
  };

  return (
    <main className="min-h-screen bg-[#020817] text-white px-4 py-8 flex justify-center items-start pt-20">
      <div className="w-full max-w-md bg-[#081120] border border-blue-500/30 rounded-3xl p-8 text-center shadow-2xl">
        {premium ? (
          <>
            <div className="text-6xl mb-4">🎁</div>

            <h1 className="text-3xl font-extrabold mb-3">
              Regalo Premium
            </h1>

            <p className="text-slate-300 mb-6">
              Como usuario Premium, tienes acceso a material complementario de estudio para apoyar tu preparación SERUMS.
            </p>

            <button
  onClick={abrirMaterial}
  className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold transition active:scale-95"
>
  Abrir material
</button>

            <p className="text-slate-500 text-sm mt-4">
              No compartas este material, es valioso para ti. 
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">🔒</div>

            <h1 className="text-3xl font-extrabold mb-3">
              Regalo Premium
            </h1>

            <p className="text-slate-300 mb-6">
              Este beneficio está disponible solo para usuarios Premium.
            </p>

            <Link
  href="/premium"
  className="inline-block bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold transition active:scale-95"
>
  Activar Premium
</Link>
          </>
        )}
      </div>
    </main>
  );
}