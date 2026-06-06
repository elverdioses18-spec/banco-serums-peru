"use client";
import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { cargarProgreso } from "@/lib/syncProgreso";
import { userKey } from "@/lib/storageUsuario";

export default function LoginPage() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  

  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [nombreRegistro, setNombreRegistro] = useState("");
  const [correoRegistro, setCorreoRegistro] = useState("");
  const [passwordRegistro, setPasswordRegistro] = useState("");
  const ingresar = async () => {
    const correoLimpio = correo.trim().toLowerCase();
    const progreso = await cargarProgreso(correoLimpio);
    if (!correoLimpio || !password) {
      mostrarAlertaBonita("Completa tu correo y contraseña");
      return;
    }
    
  
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("correo", correoLimpio)
      .single();
        
    if (error || !data) {
      mostrarAlertaBonita("Usuariono encontrado");
      return;
    }
  
    if (data.password !== password) {
      mostrarAlertaBonita("Contraseña incorrecta");
      return;
    }
  
    localStorage.setItem(
      "usuarioActual",
      JSON.stringify({
        nombre: data.nombre,
        correo: data.correo,
        premium: data.premium,
      })
    );
  
    localStorage.setItem(
      "premium",
      data.premium ? "true" : "false"
    );
    const clavesProgreso = [
      "historialExamenes",
      "preguntasFalladas",
      "estadisticasPorTema",
      "progresoSaludPublica",
      "progresoGestion",
      "progresoCuidado",
      "progresoEtica",
      "progresoInvestigacion",
      "progresoMixto",
      "preguntasUsadasGratis",
      "flashcards",
    ];
    
    const progresoRemoto = await cargarProgreso(data.correo);
    
    clavesProgreso.forEach((clave) => {
      localStorage.removeItem(userKey(clave));
    });
    
    if (progresoRemoto && Object.keys(progresoRemoto).length > 0) {
      Object.entries(progresoRemoto).forEach(([clave, valor]) => {
        localStorage.setItem(
          userKey(clave),
          JSON.stringify(valor)
        );
      });
    }
    router.push("/");
  };
  const [modalMensaje, setModalMensaje] = useState("");
  const [mostrarModalMensaje, setMostrarModalMensaje] = useState(false);
  
  const mostrarAlertaBonita = (mensaje: string) => {
    setModalMensaje(mensaje);
    setMostrarModalMensaje(true);
  };
  return (
    <main className="min-h-screen bg-[#020817] text-white overflow-x-hidden relative px-4 py-6">
  
      {/* GLOW FONDO */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0f3fff22,transparent_35%)]"></div>
  
      {/* LOGO */}
      <div className="relative -left-23 md:absolute md:top-10 md:left-12 z-20 text-center md:text-left">
        <h1 className="text-xl font-extrabold">
        Ruta <span className="text-blue-500">SERUMS</span> 
        </h1>
      </div>
  
      {/* TEXTO IZQUIERDA */}
      <div className="relative md:absolute md:top-22 md:left-12 z-20 mb-6">
  
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
        <div className="hidden md:flex items-center gap-3 mt-2 mr-10">
  

  <div>
    <p className="text-4xl font-extrabold text-blue-500">
      +2300
    </p>

    <p className="text-white-400">
      preguntas tipo SERUMS
    </p>
  </div>
</div>
<div className="md:hidden absolute top-[50px] right-2 text-right z-20">
  <p className="text-4xl font-extrabold text-blue-500">
    +2300
  </p>

  <p className="text-base text-slate-300">
    preguntas
  </p>
</div>
  
      </div>
  
      {/* DASHBOARD */}
      <div
  className="relative md:absolute md:top-10 md:left-[300px] mt-8 md:mt-0 z-10"
  style={{
    transform: "perspective(1000px) rotateY(12deg) rotateX(3deg)",
  }}
>
  
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 px-0 py-2 rounded-2xl text-xl font-bold z-20">
        
        </div>
  
        <img
          src="/dashboard2.png"
          alt="dashboard"
          className="w-full md:w-[670px] rounded-[24px] md:rounded-[32px] border border-blue-500/20 shadow-[0_0_35px_#2563eb44]"
        />
  
      </div>
  
      {/* ESTADISTICAS */}
      <div
  className="hidden md:block absolute top-92 left-[310px]"
  style={{
    transform: "perspective(2000px) rotateY(30deg) rotateX(4deg)",
  }}
>
  
                <img
          src="/estadisticas2.png"
          alt="estadisticas"
          className="w-[300px] rounded-[42px] border border-blue-500/20 shadow-[0_0_35px_#2563eb44] drop-shadow-[0_0_8px_rgba(37,99,235,0.35)]transition duration-500 hover:scale-105"
        />
  
      </div>
  
      {/* REFORZAMIENTO */}
      <div
  className="hidden md:block absolute top-90 left-[580px]"
  style={{
    transform: "perspective(2000px) rotateY(-20deg) rotateX(4deg)",
  }}
>
    
        <img
          src="/reforzamiento2.png"
          alt="reforzamiento"
          className="w-[350px] rounded-[32px] border border-blue-500/40 shadow-[0_0_35px_#2563eb44] drop-shadow-[0_0_8px_rgba(37,99,235,0.35)] transition duration-500 hover:scale-105"
        />
  
      </div>
  
      {/* LOGIN */}
      <div className="relative md:absolute md:top-20 md:right-12 z-30 w-full max-w-[330px] mx-auto mt-8 md:-mt-15 border border-white/50 rounded-4xl p-6 backdrop-blur-sm">
  
        <div className="w-20 h-20 rounded-full border border-blue-500/40 flex items-center justify-center text-5xl mx-auto mb-4 text-blue-500">
          👤
        </div>
  
        <h2 className="text-2xl font-bold text-center mb-4" >
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
  
  <div className="flex gap-3">
  <button
    onClick={ingresar}
    className="flex-1 h-13 rounded-2xl bg-blue-600 hover:bg-blue-700 text-xl font-bold transition active:scale-95 active:translate-y-1 transition-all duration-150"
  >
    Ingresar
  </button>

  <button
   onClick={() => {
    setTimeout(() => {
      setMostrarRegistro(true);
    }, 120);
  }}
    className="flex-1 h-13 rounded-2xl bg-slate-700 hover:bg-slate-600 text-xl font-bold transition-all duration-150 active:scale-95 active:translate-y-1"
  >
    Registrarme
  </button>
</div>
  
        </div>
  
      </div>
      <div className="absolute top-6 right-6">
  
</div>
  
      {/* CARDS ABAJO */}
      <div className="relative md:absolute md:bottom-3 md:left-10 mt-8 grid grid-cols-2 md:flex gap-4 pb-8">

{/* CARD 1 */}
<div className="bg-[#081120]/90 border border-slate-800 rounded-3xl px-3 py-4 w-full md:w-[290px] flex flex-col md:flex-row items-center text-center md:text-left gap-3 md:gap-4">

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
<div className="bg-[#081120]/90 border border-slate-800 rounded-3xl px-3 py-4 w-full md:w-[290px] flex flex-col md:flex-row items-center text-center md:text-left gap-3 md:gap-4">

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
<div className="bg-[#081120]/90 border border-slate-800 rounded-3xl px-3 py-4 w-full md:w-[290px] flex flex-col md:flex-row items-center text-center md:text-left gap-3 md:gap-4">

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
<div className="bg-[#081120]/90 border border-slate-800 rounded-3xl px-3 py-4 w-full md:w-[290px] flex flex-col md:flex-row items-center text-center md:text-left gap-3 md:gap-4">

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
{mostrarRegistro && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-[#081120] border border-blue-500/30 rounded-3xl p-8 w-full max-w-md text-white shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Crear cuenta
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombreRegistro}
          onChange={(e) => setNombreRegistro(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none"
        />

        <input
          type="email"
          placeholder="Correo"
          value={correoRegistro}
          onChange={(e) => setCorreoRegistro(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={passwordRegistro}
          onChange={(e) => setPasswordRegistro(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none"
        />

        <button
       onClick={async () => {
        await new Promise(resolve =>
          setTimeout(resolve, 150)
        );
        const correoLimpio = correoRegistro.trim().toLowerCase();
        const nombreLimpio = nombreRegistro.trim();
      
        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio);
      
        if (!nombreLimpio || !correoLimpio || !passwordRegistro.trim()) {
          mostrarAlertaBonita("Completa nombre, correo y contraseña.");
          return;
        }
      
        if (!correoValido) {
          mostrarAlertaBonita("Ingresa un correo válido.");
          return;
        }
      
        if (passwordRegistro.length < 6) {
          mostrarAlertaBonita("La contraseña debe tener mínimo 6 caracteres.");
          return;
        }
      
        const { data: usuarioExistente } = await supabase
          .from("usuarios")
          .select("correo")
          .eq("correo", correoLimpio)
          .maybeSingle();
      
        if (usuarioExistente) {
          mostrarAlertaBonita("Este correo ya está registrado.");
          return;
        }
      
        const { error } = await supabase
          .from("usuarios")
          .insert([
            {
              nombre: nombreLimpio,
              correo: correoLimpio,
              password: passwordRegistro,
              premium: false,
            },
          ]);
      
        if (error) {
          mostrarAlertaBonita("Error al crear cuenta: " + error.message);
          return;
        }
      
        mostrarAlertaBonita("Cuenta creada correctamente. Ahora inicia sesión.");
      
        setNombreRegistro("");
        setCorreoRegistro("");
        setPasswordRegistro("");
        setMostrarRegistro(false);
      }}
          className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold transition-all duration-150 active:scale-95 active:translate-y-1"
        >
          Crear cuenta
        </button>

        <button
          onClick={() => {
            setTimeout(() => {
              setMostrarRegistro(false);
            }, 150);
          }}
          className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-xl font-bold transition-all duration-150 active:scale-95 active:brightness-90"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}
{mostrarModalMensaje && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-7 text-center">
      <div className="text-5xl mb-4">
        
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
        
      </h2>

      <p className="text-slate-600 leading-relaxed mb-6">
        {modalMensaje}
      </p>

      <button
        onClick={() => setMostrarModalMensaje(false)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl"
      >
        Entendido
      </button>
    </div>
  </div>
)}

    </main>
  );
}