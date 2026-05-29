"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AjustesPage() {

    const [mostrarTemporizador, setMostrarTemporizador] = useState(true);
    const [mostrarExplicacion, setMostrarExplicacion] = useState(true);
  
    useEffect(() => {
  
      const temporizadorGuardado = localStorage.getItem("mostrarTemporizador");
  
      if (temporizadorGuardado !== null) {
        setMostrarTemporizador(JSON.parse(temporizadorGuardado));
      }
  
      const explicacionGuardada = localStorage.getItem("mostrarExplicacion");
  
      if (explicacionGuardada !== null) {
        setMostrarExplicacion(JSON.parse(explicacionGuardada));
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

      <h1 className="text-4xl font-bold mb-8">
        ⚙️ Ajustes
      </h1>

      {/* APARIENCIA */}
      <div className="bg-slate-800 rounded-2xl p-6 mb-6">

        <h2 className="text-2xl font-bold mb-4">
        🎯 Preferencias de estudio
        </h2>

        <div className="space-y-4 mt-4">

<label className="flex items-center justify-between bg-slate-800 p-4 rounded-xl">
  <span>⏱ Mostrar temporizador</span>

  <input
    type="checkbox"
    checked={mostrarTemporizador}
    onChange={(e) => {
      localStorage.setItem(
        "mostrarTemporizador",
        JSON.stringify(e.target.checked)
      );
      setMostrarTemporizador(e.target.checked);
    }}
    className="w-5 h-5"
  />
</label>

<label className="flex items-center justify-between bg-slate-800 p-4 rounded-xl">
  <span>📖 Mostrar explicación automática</span>

  <input
    type="checkbox"
    checked={mostrarExplicacion}
    onChange={(e) => {
      localStorage.setItem(
        "mostrarExplicacion",
        JSON.stringify(e.target.checked)
      );
      setMostrarExplicacion(e.target.checked);
    }}
    className="w-5 h-5"
  />
</label>

</div>
      
        </div>

      
      {/* PREGUNTAS FALLADAS */}
      <div className="bg-slate-800 rounded-2xl p-6 mb-6">

        <h2 className="text-2xl font-bold mb-4">
          ❌ Preguntas falladas
        </h2>

        <button
          onClick={() => {
            localStorage.removeItem("preguntasFalladas");
            alert("Preguntas falladas eliminadas");
          }}
          className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-bold"
        >
          🗑 Vaciar preguntas falladas
        </button>

      </div>

      {/* PROGRESO */}
      <div className="bg-slate-800 rounded-2xl p-6 mb-6">

        <h2 className="text-2xl font-bold mb-4">
          📊 Progreso y estadísticas
        </h2>

        <button
          onClick={() => {

            localStorage.removeItem("progresoGestion");
            localStorage.removeItem("progresoCuidado");
            localStorage.removeItem("progresoEtica");
            localStorage.removeItem("progresoInvestigacion");
            localStorage.removeItem("progresoSaludPublica");
            localStorage.removeItem("progresoMixto");

            localStorage.removeItem("historialExamenes");

            alert("Progreso reiniciado");

            window.location.reload();

          }}
          className="bg-orange-600 hover:bg-orange-700 px-5 py-3 rounded-xl font-bold"
        >
          🔄 Reiniciar progreso
        </button>

        <p className="text-slate-300 mt-4">
          Se eliminarán estadísticas, historial, precisión y progreso acumulado de todas las áreas.
        </p>

      </div>

      {/* META DIARIA */}
      <div className="bg-slate-800 rounded-2xl p-6 mb-6">

        <h2 className="text-2xl font-bold mb-4">
          🎯 Meta diaria
        </h2>

        <p className="text-slate-300 mb-5">
          Selecciona cuántas preguntas deseas resolver diariamente.
        </p>

        <div className="flex gap-3 flex-wrap">

          {[10, 20, 50, 100].map((meta) => (
            <button
              key={meta}
              onClick={() => {
                localStorage.setItem("metaDiaria", String(meta));
                alert(`Meta diaria actualizada a ${meta} preguntas`);
              }}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-bold"
            >
              {meta} preguntas
            </button>
          ))}

        </div>
        </div>

{/* RESTABLECER APP */}
<div className="bg-slate-800 rounded-2xl p-6 mb-6">

<h2 className="text-2xl font-bold mb-4">
♻️ Restablecer aplicación
</h2>

<p className="text-slate-300 mb-5">
  Se eliminarán todos los datos almacenados localmente y la aplicación volverá a su estado inicial. Las preguntas ya resueltas podrán volver a aparecer nuevamente en prácticas y simulacros.
</p>

<button
  onClick={() => {

    localStorage.clear();

    alert("Aplicación restablecida");

    window.location.reload();

  }}
  className="bg-red-700 hover:bg-red-800 px-5 py-3 rounded-xl font-bold"
>
  ⚠️ Formatear datos
</button>

</div>

            
    </main>
  );
}