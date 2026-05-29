"use client";
import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const ingresar = () => {
    if (!correo || !password) {
      alert("Completa tu correo y contraseña");
      return;
    }

    localStorage.setItem(
      "usuarioActual",
      JSON.stringify({
        correo,
        premium: false,
      })
    );

    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#020817] text-white overflow-hidden relative">
  
      {/* GLOW FONDO */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0f3fff22,transparent_35%)]"></div>
  
      {/* LOGO */}
      <div className="absolute top-10 left-12 z-20">
        <h1 className="text-xl font-extrabold">
        Banco <span className="text-blue-500">SERUMS</span> Perú
        </h1>
      </div>
  
      {/* TEXTO IZQUIERDA */}
      <div className="absolute top-22 left-12 z-20">
  
        <h2 className="text-4xl font-extrabold leading-[1.05]">
          Prepárate.
          <br />
          Practica.
          <br />
          <span className="text-blue-500">
            Aprueba.
          </span>
        </h2>
  
        <p className="text-x1 text-slate-100 mt-3 max-w-x1 leading-relaxed">
          Simulacros, estadísticas, 
          <br />
          reforzamiento y preguntas 
          <br />
          falladas en una sola plataforma.
        </p>
  
      </div>
  
      {/* DASHBOARD */}
      <div
  className="absolute top-10 left-[300px]"
  style={{
    transform: "perspective(1000px) rotateY(12deg) rotateX(3deg)",
  }}
>
  
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 px-0 py-2 rounded-2xl text-xl font-bold z-20">
        
        </div>
  
        <img
          src="/dashboard.png"
          alt="dashboard"
          className="w-[670px] rounded-[32px] border border-blue-500/20 shadow-[0_0_35px_#2563eb44] drop-shadow-[0_0_8px_rgba(37,99,235,0.35)]transition duration-500 hover:scale-105"
        />
  
      </div>
  
      {/* ESTADISTICAS */}
      <div
  className="absolute top-92 left-[200px]"
  style={{
    transform: "perspective(2000px) rotateY(30deg) rotateX(4deg)",
  }}
>
  
                <img
          src="/estadisticas.png"
          alt="estadisticas"
          className="w-[300px] rounded-[42px] border border-blue-500/20 shadow-[0_0_35px_#2563eb44] drop-shadow-[0_0_8px_rgba(37,99,235,0.35)]transition duration-500 hover:scale-105"
        />
  
      </div>
  
      {/* REFORZAMIENTO */}
      <div
  className="absolute top-90 left-[470px]"
  style={{
    transform: "perspective(2000px) rotateY(-20deg) rotateX(4deg)",
  }}
>
    
        <img
          src="/reforzamiento.png"
          alt="reforzamiento"
          className="w-[350px] rounded-[32px] border border-blue-500/40 shadow-[0_0_35px_#2563eb44] drop-shadow-[0_0_8px_rgba(37,99,235,0.35)] transition duration-500 hover:scale-105"
        />
  
      </div>
  
      {/* LOGIN */}
      <div className="absolute top-8 right-10 w-[350px] rounded-[40px] border border-blue-500/40 bg-[#081120]/95 backdrop-blur-xl p-10 shadow-[0_0_80px_#2563eb44]">
  
        <div className="w-20 h-20 rounded-full border border-blue-500/40 flex items-center justify-center text-5xl mx-auto mb-8 text-blue-500">
          👤
        </div>
  
        <h2 className="text-2xl font-bold text-center mb-4">
          Crear cuenta
        </h2>
  
        <p className="text-center text-slate-300 text-2x1 mb-5">
          Ingresa tu correo para comenzar
          con preguntas gratis.
        </p>
  
        <div className="space-y-3">
  
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full h-15
             rounded-2xl bg-[#111c31] border border-slate-700 px-6 text-2x1 outline-none"
          />
  
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-15 rounded-2xl bg-[#111c31] border border-slate-700 px-6 text-2x1 outline-none"
          />
  
          <button
            onClick={ingresar}
            className="w-full h-13 rounded-2xl bg-blue-600 hover:bg-blue-700 text-xl font-bold transition"
          >
            Ingresar / Registrarme
          </button>
  
        </div>
  
      </div>
      <div className="absolute top-6 right-6">
  
</div>
  
      {/* CARDS ABAJO */}
<div className="absolute bottom-3 p-2 h-24 left-10 flex gap-4">

{/* CARD 1 */}
<div className="bg-[#081120]/90 border border-slate-800 rounded-3xl px-2 py-4 w-[290px] flex items-center gap-4">

  <div className="text-2xl">
    🎓
  </div>

  <div>

    <h3 className="text-3x1 font-bold leading-tight">
      Simulacros realistas
    </h3>

    <p className="text-slate-400 text-sm mt-1">
      Práctica con exámenes tipo SERUMS.
    </p>

  </div>

</div>

{/* CARD 2 */}
<div className="bg-[#081120]/90 border border-slate-800 rounded-3xl px-2 py-2 w-[290px] flex items-center gap-4">

  <div className="text-2xl">
    📊
  </div>

  <div>

    <h3 className="text-3x1 font-bold leading-tight">
      Estadísticas avanzadas
    </h3>

    <p className="text-slate-400 text-sm mt-1">
      Visualiza tu progreso en detalle.
    </p>

  </div>

</div>

{/* CARD 3 */}
<div className="bg-[#081120]/90 border border-slate-800 rounded-3xl px-2 py-4 w-[290px] flex items-center gap-4">

  <div className="text-2xl">
    🧠
  </div>

  <div>

    <h3 className="text-3x1 font-bold leading-tight">
      Reforzamiento inteligente
    </h3>

    <p className="text-slate-400 text-sm mt-1">
      Enfócate en tus áreas débiles.
    </p>

  </div>

</div>

{/* CARD 4 */}
<div className="bg-[#081120]/90 border border-slate-800 rounded-3xl px-2 py-4 w-[290px] flex items-center gap-4">

  <div className="text-2xl">
    ❌
  </div>

  <div>

    <h3 className="text-3x1 font-bold leading-tight">
      Preguntas falladas
    </h3>

    <p className="text-slate-400 text-sm mt-1">
      Repasa y aprende de tus errores.
    </p>

  </div>

</div>

</div>
  
    </main>
  );
}