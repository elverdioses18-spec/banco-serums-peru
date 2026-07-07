"use client";

import { useState } from "react";

export default function GeneradorPage() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [cantidad, setCantidad] = useState("20");
  const [area, setArea] = useState("Salud Pública");
  const [dificultad, setDificultad] = useState("Moderada-Alta");
  const [resultado, setResultado] = useState("");
const [generando, setGenerando] = useState(false);

const probarApi = async () => {
    setGenerando(true);
  
    const res = await fetch("/api/generador", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        archivo: pdf?.name,
        cantidad,
        area,
        dificultad,
      }),
    });
  
    const data = await res.json();
  
    setResultado(JSON.stringify(data, null, 2));
    setGenerando(false);
  };
  return (
    <main className="min-h-screen bg-[#020817] text-white p-6">

      <h1 className="text-4xl font-extrabold mb-2">
        Generador IA RutaSERUMS
      </h1>

      <p className="text-slate-400 mb-8">
        Genera preguntas estilo SERUMS usando documentos de teoría.
      </p>


      <div className="grid md:grid-cols-2 gap-6">


        {/* CONFIGURACIÓN */}
        <section className="bg-[#081120] border border-blue-500/30 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-5">
            Configuración
          </h2>


          <div className="space-y-5">


            <div>
              <label className="block mb-2 text-slate-300">
                PDF de teoría
              </label>

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setPdf(e.target.files?.[0] || null)
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3"
              />

              {pdf && (
                <p className="text-blue-400 text-sm mt-2">
                  Archivo: {pdf.name}
                </p>
              )}

            </div>


            <div>
              <label className="block mb-2 text-slate-300">
                Número de preguntas
              </label>

              <input
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3"
              />
            </div>



            <div>
              <label className="block mb-2 text-slate-300">
                Área
              </label>

              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3"
              >

                <option>Salud Pública</option>
                <option>Cuidado Integral</option>
                <option>Gestión</option>
                <option>Investigación</option>
                <option>Ética e Interculturalidad</option>

              </select>

            </div>



            <div>
              <label className="block mb-2 text-slate-300">
                Dificultad
              </label>

              <select
                value={dificultad}
                onChange={(e) => setDificultad(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3"
              >

                <option>Básica</option>
                <option>Moderada-Alta</option>
                <option>Difícil tipo examen</option>

              </select>
            </div>



            <button
  onClick={probarApi}
  className="w-full bg-blue-600 hover:bg-blue-500 rounded-2xl py-4 font-bold text-lg"
>
  {generando ? "Generando..." : "Generar preguntas"}
</button>


          </div>

        </section>


        {/* RESULTADO */}
        <section className="bg-[#081120] border border-slate-700 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-5">
            Preguntas generadas
          </h2>


          {resultado ? (
  <pre className="text-left text-sm whitespace-pre-wrap bg-slate-900 p-4 rounded-xl">
    {resultado}
  </pre>
) : (
  <div className="text-slate-400 text-center mt-20">
    Aquí aparecerán las preguntas generadas.

    <br />

    Podrás editar, descartar y exportar código.
  </div>
)}


        </section>


      </div>

    </main>
  );
}