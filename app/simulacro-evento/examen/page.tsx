"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Pregunta = {
  id: number;
  pregunta: string;
  opcion_a: string;
  opcion_b: string;
  opcion_c: string;
  opcion_d: string;
  correcta: string;
};

export default function ExamenSimulacroEventoPage() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPreguntas();
  }, []);

  const cargarPreguntas = async () => {
    const { data, error } = await supabase
      .from("simulacro_preguntas")
      .select("*")
      .order("orden");

    if (error) {
      console.error(error);
      return;
    }

    setPreguntas(data || []);
    setCargando(false);
  };

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Cargando preguntas...
      </main>
    );
  }

  const preguntaActual = preguntas[0];

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">

        <div className="bg-[#07347e] text-white rounded-2xl p-4 mb-4">
          <h1 className="text-2xl font-bold">
            Simulacro Nacional Gratuito
          </h1>

          <p>
            Pregunta 1 de {preguntas.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">

          <h2 className="text-xl font-bold mb-6">
            {preguntaActual?.pregunta}
          </h2>

          <div className="space-y-3">

            <button className="w-full text-left p-4 border rounded-xl">
              A) {preguntaActual?.opcion_a}
            </button>

            <button className="w-full text-left p-4 border rounded-xl">
              B) {preguntaActual?.opcion_b}
            </button>

            <button className="w-full text-left p-4 border rounded-xl">
              C) {preguntaActual?.opcion_c}
            </button>

            <button className="w-full text-left p-4 border rounded-xl">
              D) {preguntaActual?.opcion_d}
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}