"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

type Pregunta = {
  id: number;
  pregunta: string;
  opcion_a: string;
  opcion_b: string;
  opcion_c: string;
  opcion_d: string;
  correcta: string;
};

export default function RevisionSimulacroPage() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [resultado, setResultado] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [sinPermiso, setSinPermiso] = useState(false);

  useEffect(() => {
    cargarRevision();
  }, []);

  const cargarRevision = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual") || "{}");

    if (!usuario?.correo) {
      setSinPermiso(true);
      setCargando(false);
      return;
    }

    const correoUsuario = usuario.correo.trim().toLowerCase();
    const { data: simulacroData } = await supabase
    .from("simulacros_evento")
    .select("*")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (!simulacroData) {
    setCargando(false);
    return;
  }
    const { data: resultadoData } = await supabase
      .from("simulacro_resultados")
      .select("*")
      .eq("simulacro_id", simulacroData.id)
      .ilike("correo", correoUsuario)
      .limit(1)
      .maybeSingle();

    if (!resultadoData) {
      setSinPermiso(true);
      setCargando(false);
      return;
    }

    const { data: preguntasData, error } = await supabase
      .from("simulacro_preguntas")
      .select("*")
      .eq("simulacro_id", simulacroData.id)
      .order("orden");

    if (error) {
      console.error(error);
      setCargando(false);
      return;
    }

    setResultado(resultadoData);
    setPreguntas(preguntasData || []);
    setCargando(false);
  };

  const textoOpcion = (pregunta: Pregunta, letra: string) => {
    if (letra === "A") return pregunta.opcion_a;
    if (letra === "B") return pregunta.opcion_b;
    if (letra === "C") return pregunta.opcion_c;
    if (letra === "D") return pregunta.opcion_d;
    return "Sin respuesta";
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center text-[#06194a]">
        Cargando revisión...
      </main>
    );
  }

  if (sinPermiso) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 flex items-center justify-center text-[#06194a]">
        <div className="bg-white rounded-2xl p-8 shadow-sm border text-center max-w-md">
          <div className="text-5xl mb-4">🔒</div>

          <h1 className="text-2xl font-extrabold mb-2">
            No puedes revisar este examen
          </h1>

          <p className="text-slate-600 mb-6">
            Solo podrás revisar tus respuestas cuando hayas terminado el simulacro.
          </p>

          <Link
            href="/simulacro-evento"
            className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl"
          >
            Volver al evento
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-[#06194a]">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-[#07347e] text-white rounded-2xl p-4 flex items-center gap-4 shadow-md">
          <Link href="/simulacro-evento" className="bg-white/10 p-3 rounded-xl">
            <ArrowLeft />
          </Link>

          <div>
            <h1 className="text-2xl font-extrabold">Revisión de mi examen</h1>
            <p className="text-sm text-white/80">
              Puntaje: {resultado.puntaje}/{resultado.total_preguntas} · Precisión:{" "}
              {resultado.porcentaje}%
            </p>
          </div>
        </div>

        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-blue-800">
          Aquí solo se muestran tus respuestas y la alternativa correcta.
        </section>

        <div className="space-y-4">
          {preguntas.map((pregunta, index) => {
            const respuestaUsuario = resultado.respuestas?.[pregunta.id];
            const esCorrecta = respuestaUsuario === pregunta.correcta;

            return (
              <section
                key={pregunta.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="font-extrabold text-lg">
                    {index + 1}. {pregunta.pregunta}
                  </h2>

                  {esCorrecta ? (
                    <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                  )}
                </div>

                <div className="space-y-2 text-sm md:text-base">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="font-bold">Tu respuesta: </span>
                    {respuestaUsuario || "Sin respuesta"} -{" "}
                    {textoOpcion(pregunta, respuestaUsuario)}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-800">
                    <span className="font-bold">Respuesta correcta: </span>
                    {pregunta.correcta} - {textoOpcion(pregunta, pregunta.correcta)}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}