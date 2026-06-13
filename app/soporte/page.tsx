"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
export default function SoportePage() {
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
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        
        <div className="max-w-4xl mx-auto">
        <Link
  href="/"
  className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-slate-100 hover:bg-slate-300 rounded-xl font-medium"
>
  ← Volver al inicio
</Link>
          <div className="bg-white rounded-3xl shadow-md p-6 border mb-6">
            <h1 className="text-3xl font-extrabold text-[#06194a] mb-2">
              ❓ Ayuda y Soporte
            </h1>
  
            <p className="text-slate-600">
              Encuentra respuestas rápidas o ponte en contacto con nosotros si necesitas ayuda.
            </p>
          </div>
  
          {/* Preguntas frecuentes */}
  
          <div className="bg-white rounded-3xl shadow-md p-6 border mb-6">
            <h2 className="text-2xl font-bold text-[#06194a] mb-4">
              ❓ Preguntas Frecuentes
            </h2>
  
            <div className="space-y-3 text-slate-700">
  
              <div className="p-3 bg-slate-50 rounded-xl border">
                <strong>¿Cómo funciona la plataforma?</strong>
                <p className="mt-1 text-sm">
                  Selecciona un tema o simulacro, responde las preguntas y revisa tus resultados al finalizar.
                </p>
                </div>
                
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border">
                <strong>¿Las preguntas se repiten?</strong>
                <p className="mt-1 text-sm">
                  Si, esto con la finalidad que el ulumno retenga la información, por 
                  otro lado el margen de repetidas es muy pequeño. 
                </p>
              </div>
  
              <div className="p-3 bg-slate-50 rounded-xl border">
                <strong>¿Qué incluye Premium?</strong>
                <p className="mt-1 text-sm">
                  Acceso completo a todas las preguntas, simulacros y futuras actualizaciones.
                </p>
              </div>
  
              <div className="p-3 bg-slate-50 rounded-xl border">
                <strong>¿Cuándo termina mi acceso?</strong>
                <p className="mt-1 text-sm">
                  El acceso Premium termina hasta el mismo día del exámen SERUMS.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border">
                <strong>¿Cómo realizo el pago?</strong>
                <p className="mt-1 text-sm">
                  Mediante Yape. Luego envías tu voucher para validación.
                </p>
              </div>
  
              <div className="p-3 bg-slate-50 rounded-xl border">
                <strong>¿Cuánto demora la activación?</strong>
                <p className="mt-1 text-sm">
                  Normalmente dentro de las siguientes horas después de verificar el pago.
                </p>
              </div>
  
              <div className="p-3 bg-slate-50 rounded-xl border">
                <strong>¿Puedo usar la plataforma desde celular?</strong>
                <p className="mt-1 text-sm">
                  Sí, Ruta SERUMS está optimizada para computadoras y dispositivos móviles.
                </p>
              </div>
  
              <div className="p-3 bg-slate-50 rounded-xl border">
                <strong>¿Las preguntas tienen explicación?</strong>
                <p className="mt-1 text-sm">
                  Sí, cada pregunta cuenta con su respectiva explicación y fundamento.
                </p>
                </div>


                <div className="p-3 bg-slate-50 rounded-xl border">
                <strong>¿Porqué aparecen menos preguntas en Falladas y resueltas?</strong>
                <p className="mt-1 text-sm">
                  Porqué el sistema no agrega a las páginas de Falladas y Resueltas las
                  mismas preguntas, si se repite en solo deja una.
                </p>


                <div className="p-3 bg-slate-50 rounded-xl border">
                <strong>¿Puedo compartir mi cuenta?</strong>
                <p className="mt-1 text-sm">
                  Sí, pero recuerda que tendras estadisticas compartidas, recuerda que buscas 
                  optimizar tu aprendizaje y avance.
                </p>
              </div>
  
            </div>
          </div>
  
          {/* Soporte */}
  
          <div className="bg-white rounded-3xl shadow-md p-6 border">
  
            <h2 className="text-2xl font-bold text-[#06194a] mb-2">
              💬 Contactar Soporte
            </h2>
  
            <p className="text-slate-600 mb-6">
              ¿Tienes problemas con pagos, acceso Premium, preguntas incorrectas o cualquier inconveniente?
            </p>
  
            <input
  type="text"
  placeholder="Nombre"
  value={nombre}
  readOnly
  className="w-full mb-4 p-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-700"
/>

<input
  type="email"
  placeholder="Correo electrónico"
  value={correo}
  readOnly
  className="w-full mb-4 p-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-700"
/>

<input
  type="text"
  placeholder="Asunto"
  value={asunto}
  onChange={(e) => setAsunto(e.target.value)}
  className="w-full mb-4 p-3 rounded-xl border border-slate-300"
/>

<textarea
  placeholder="Describe tu problema o consulta..."
  rows={6}
  value={mensaje}
  onChange={(e) => setMensaje(e.target.value)}
  className="w-full mb-4 p-3 rounded-xl border border-slate-300"
/>

{aviso && (
  <p className="mb-4 text-sm text-green-600 font-semibold">
    {aviso}
  </p>
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
          tipo: "soporte",
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
    setAviso("Tu mensaje fue enviado correctamente.");
  }}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-150 active:scale-95 active:translate-y-1 disabled:opacity-60"
>
  {enviando ? "Enviando..." : "Enviar mensaje"}
</button>
  
          </div>
  
        </div>
      </main>
    );
  }