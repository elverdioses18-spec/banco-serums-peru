"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ColaboraPage() {

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [asunto, setAsunto] = useState("");
    const [mensaje, setMensaje] = useState("");
  
    const [enviando, setEnviando] = useState(false);
    const [aviso, setAviso] = useState("");
    useEffect(() => {
        const usuario = JSON.parse(
          localStorage.getItem("usuarioActual") || "{}"
        );
      
        setNombre(usuario.nombre || "");
        setCorreo(usuario.correo || "");
      }, []);
  
    return (
        
      <main className="min-h-screen bg-zinc-950 text-white p-4">
        <Link
  href="/"
  className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-slate-800 hover:bg-slate-300 rounded-xl font-medium"
>
  ← Volver al inicio
</Link>
        <div className="max-w-3xl mx-auto">
            
  
          <h1 className="text-3xl font-bold mb-2">
            🚀 Colabora con Ruta SERUMS
          </h1>
  
          <p className="text-zinc-400 mb-8">
            ¿Tienes una idea, propuesta o te gustaría formar parte
            del crecimiento de Ruta SERUMS?
          </p>
  
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
  
            <h2 className="text-xl font-semibold mb-4">
              Quiero colaborar
            </h2>
  
            <p className="text-zinc-400 mb-6">
              Cuéntanos cómo te gustaría colaborar con nosotros.
            </p>
            <input
  type="text"
  placeholder="Nombre"
  value={nombre}
  readOnly
  className="w-full mb-4 p-3 rounded-xl bg-zinc-700 border border-zinc-600 text-white"
/>

<input
  type="email"
  placeholder="Correo electrónico"
  value={correo}
  readOnly
  className="w-full mb-4 p-3 rounded-xl bg-zinc-700 border border-zinc-600 text-white"
/>

<input
  type="text"
  placeholder="Asunto"
  value={asunto}
  onChange={(e) => setAsunto(e.target.value)}
  className="w-full mb-4 p-3 rounded-xl bg-zinc-800 border border-zinc-700"
/>

<textarea
  placeholder="Describe tu propuesta..."
  rows={5}
  value={mensaje}
  onChange={(e) => setMensaje(e.target.value)}
  className="w-full mb-4 p-3 rounded-xl bg-zinc-800 border border-zinc-700"
/>

{aviso && (
  <p className="mb-4 text-sm text-green-400">{aviso}</p>
)}

<button
  disabled={enviando}
  onClick={async () => {
    if (!nombre || !correo || !asunto || !mensaje) {
      setAviso("Completa todos los campos.");
      return;
    }

    setEnviando(true);

    const { error } = await supabase
      .from("mensajes_contacto")
      .insert([
        {
          tipo: "colabora",
          nombre,
          correo,
          asunto,
          mensaje,
        },
      ]);

    setEnviando(false);

    if (error) {
        console.log("ERROR SUPABASE:", error);
        setAviso("Error: " + error.message);
        return;
      }

    setNombre("");
    setCorreo("");
    setAsunto("");
    setMensaje("");
    setAviso("Tu propuesta fue enviada correctamente.");
  }}
  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all duration-150 active:scale-95 active:translate-y-1 disabled:opacity-60"
>
  {enviando ? "Enviando..." : "Enviar propuesta"}
</button>
          </div>
  
        </div>
      </main>
    );
  }
