"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function RecuperarContrasenaContenido() {
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get("token");

  const [correo, setCorreo] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);


  // PEDIR CORREO
  const enviarCorreo = async () => {
    setCargando(true);

    const res = await fetch("/api/recuperar-contrasena", {
      method: "POST",
      body: JSON.stringify({
        correo,
      }),
    });

    const data = await res.json();

    setCargando(false);

    if (!res.ok) {
      setMensaje(data.error);
      return;
    }

    setMensaje(
      "Te enviamos un correo con el enlace para cambiar tu contraseña."
    );
  };


  // CAMBIAR PASSWORD
  const cambiarPassword = async () => {
    if (password1.length < 6) {
      setMensaje("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }
  
    if (password1 !== password2) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }
  
    const res = await fetch("/api/cambiar-contrasena", {
      method: "POST",
      body: JSON.stringify({
        token,
        password: password1,
      }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      setMensaje(data.error);
      return;
    }
  
    setMensaje("Contraseña actualizada correctamente.");
  
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#020817] flex items-center justify-center px-4 text-white">

      <div className="bg-[#081120] border border-blue-500/30 rounded-3xl p-7 max-w-md w-full text-center">

        <h1 className="text-3xl font-extrabold mb-5">
          Recuperar contraseña
        </h1>


        {!token ? (
          <>
            <p className="text-slate-300 mb-4">
              Ingresa el correo registrado en RutaSERUMS.
            </p>

            <input
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e)=>setCorreo(e.target.value)}
              className="w-full bg-slate-900 rounded-xl px-4 py-3 mb-4"
            />

            <button
              onClick={enviarCorreo}
              className="bg-blue-600 px-8 py-3 rounded-xl font-bold"
            >
              {cargando ? "Enviando..." : "Enviar enlace"}
            </button>
          </>
        ) : (
          <>

            <p className="text-slate-300 mb-4">
              Crea tu nueva contraseña.
            </p>

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password1}
              onChange={(e)=>setPassword1(e.target.value)}
              className="w-full bg-slate-900 rounded-xl px-4 py-3 mb-3"
            />

            <input
              type="password"
              placeholder="Repite nueva contraseña"
              value={password2}
              onChange={(e)=>setPassword2(e.target.value)}
              className="w-full bg-slate-900 rounded-xl px-4 py-3 mb-4"
            />

            <button
              onClick={cambiarPassword}
              className="bg-blue-600 px-8 py-3 rounded-xl font-bold"
            >
              Cambiar contraseña
            </button>

          </>
        )}

        {mensaje && (
          <p className="text-blue-300 mt-5 text-sm">
            {mensaje}
          </p>
        )}

      </div>
    </main>
  );
}
export default function RecuperarContrasena() {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center">
            Cargando...
          </div>
        }
      >
        <RecuperarContrasenaContenido />
      </Suspense>
    );
  }