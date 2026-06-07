"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { userKey } from "@/lib/storageUsuario";
import {
  guardarProgreso,
  obtenerProgresoLocal,
} from "@/lib/syncProgreso";

export default function FalladasPage() {
  const [falladas, setFalladas] = useState<any[]>([]);
  const [modalMensaje, setModalMensaje] = useState("");
  const [mostrarModalMensaje, setMostrarModalMensaje] = useState(false);
  
  const mostrarAlertaBonita = (mensaje: string) => {
    setModalMensaje(mensaje);
    setMostrarModalMensaje(true);
  };
  useEffect(() => {
    const guardadas = localStorage.getItem(userKey("preguntasFalladas"));

    if (guardadas) {
      setFalladas(JSON.parse(guardadas));
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-6 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl"
      >
        ← Volver
      </Link>

      <div className="flex items-center gap-4 mb-6">

  <h1 className="text-4xl font-bold">
    ❌ Preguntas falladas
  </h1>

  <div className="bg-red-500 text-white px-4 py-1 rounded-xl font-bold text-xl">
    {falladas.length}
  </div>

</div>

      <p className="text-slate-300 mb-8">
        Aquí aparecerán las preguntas que fallaste y aún tienes pendientes por reforzar.
      </p>

      {falladas.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-2">Sin pendientes 🎉</h2>
          <p className="text-slate-300">
            No tienes preguntas falladas pendientes por repasar.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {falladas.map((pregunta, index) => (
            <div key={index} className="bg-slate-800 rounded-2xl p-6">
              <p className="text-sm text-red-400 mb-2">
                Pregunta fallada {index + 1}
              </p>

              <h2 className="text-xl font-bold mb-4">
                {pregunta.pregunta}
              </h2>

              <div className="space-y-2 mb-4">
              {pregunta.opciones?.map((opcion: string, i: number) => (
  <button
    key={i}
    onClick={async () => {
      if (i === pregunta.correcta) {
        const nuevasFalladas = falladas.filter((_, pos) => pos !== index);
        const resueltasGuardadas = JSON.parse(
          localStorage.getItem(userKey("preguntasResueltas")) || "[]"
        );
        
        const existe = resueltasGuardadas.some(
          (p: any) => p.pregunta === pregunta.pregunta
        );
        
        if (!existe) {
          resueltasGuardadas.push({
            ...pregunta,
            origen: "recuperada",
            fecha: new Date().toISOString(),
          });
        
          localStorage.setItem(
            userKey("preguntasResueltas"),
            JSON.stringify(resueltasGuardadas)
          );
        }
        setFalladas(nuevasFalladas);
        localStorage.setItem(userKey("preguntasFalladas"), JSON.stringify(nuevasFalladas));
        const usuario = JSON.parse(
          localStorage.getItem("usuarioActual") || "{}"
        );
        
        if (usuario.correo) {
          await guardarProgreso(
            usuario.correo,
            obtenerProgresoLocal()
          );
        }
      } else {
        mostrarAlertaBonita("Respuesta incorrecta. Inténtalo otra vez.");
      }
    }}
    className="w-full text-left bg-slate-700 hover:bg-slate-600 rounded-xl p-3"
  >
    {opcion}
  </button>
))}
              </div>

              
            </div>
          ))}
        </div>
      )}
      {mostrarModalMensaje && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-7 text-center">
      <div className="text-5xl mb-4">
        ⚠️
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
        Atención
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