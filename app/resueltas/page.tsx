"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { userKey } from "@/lib/storageUsuario";

export default function ResueltasPage() {
  const [resueltas, setResueltas] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [filtroArea, setFiltroArea] = useState("todas");

  useEffect(() => {
    const guardadas = JSON.parse(
      localStorage.getItem(userKey("preguntasResueltas")) || "[]"
    );

    setResueltas(guardadas);
  }, []);

  const totalExamen = resueltas.filter(
    (item) => item.origen === "examen"
  ).length;
  
  const totalRecuperadas = resueltas.filter(
    (item) => item.origen === "recuperada"
  ).length;

  const resueltasFiltradas = resueltas.filter((item) => {
  const coincideFiltro =
    filtro === "examen"
      ? item.origen === "examen"
      : filtro === "recuperada"
      ? item.origen === "recuperada"
      : true;

  const texto = `
    ${item.pregunta || ""}
    ${item.explicacion || ""}
    ${item.tema || ""}
    ${item.area || ""}
  `.toLowerCase();

  const coincideBusqueda = texto.includes(busqueda.toLowerCase());

  const coincideArea =
    filtroArea === "todas" ? true : item.area === filtroArea;

  return coincideFiltro && coincideBusqueda && coincideArea;
});
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">

        <Link
          href="/"
          className="inline-block mb-4 bg-white border px-4 py-2 rounded-xl shadow-sm font-semibold text-[#06194a]"
        >
          ← Volver al inicio
        </Link>

        <div className="bg-white rounded-3xl shadow-md p-6 border mb-6">
          <h1 className="text-3xl font-extrabold text-[#06194a] mb-2">
            📚 Preguntas Resueltas
          </h1>

          <p className="text-slate-600">
            Aquí encontrarás las preguntas que ya resolviste correctamente.
          </p>
          <p className="text-slate-300 mb-8">
        Nota: Si en caso responde la mis pregunta de manera correcta 2 veces, solo es agregada una de ellas. 
      </p>

         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
  <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
    <p className="text-sm text-green-700 font-semibold">
      Total resueltas
    </p>
    <p className="text-2xl font-extrabold text-green-700">
      {resueltas.length}
    </p>
  </div>

  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
    <p className="text-sm text-blue-700 font-semibold">
      Correctas en examen
    </p>
    <p className="text-2xl font-extrabold text-blue-700">
      {totalExamen}
    </p>
  </div>

  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
    <p className="text-sm text-purple-700 font-semibold">
      Corregidas en falladas
    </p>
    <p className="text-2xl font-extrabold text-purple-700">
      {totalRecuperadas}
    </p>
  </div>
</div>

<div className="flex flex-wrap gap-2 mt-4">
            
  <button
    onClick={() => setFiltro("todas")}
    className={`px-4 py-2 rounded-xl font-bold ${
      filtro === "todas"
        ? "bg-[#06194a] text-white"
        : "bg-slate-100 text-slate-700"
    }`}
  >
    Todas
  </button>

  <button
    onClick={() => setFiltro("examen")}
    className={`px-4 py-2 rounded-xl font-bold ${
      filtro === "examen"
        ? "bg-green-600 text-white"
        : "bg-slate-100 text-slate-700"
    }`}
  >
    Correctas en examen
  </button>

  <button
    onClick={() => setFiltro("recuperada")}
    className={`px-4 py-2 rounded-xl font-bold ${
      filtro === "recuperada"
        ? "bg-blue-600 text-white"
        : "bg-slate-100 text-slate-700"
    }`}
  >
    Corregidas en falladas
  </button>
</div>
<div className="flex flex-wrap gap-2 mt-4">
  
</div>

<input
  type="text"
  placeholder="Buscar por pregunta, explicación o tema..."
  value={busqueda}
  onChange={(e) => setBusqueda(e.target.value)}
  className="w-full mt-4 p-3 rounded-xl border border-slate-300"
/>
                 

        {resueltasFiltradas.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-6 border text-center">
            <p className="text-slate-600">
              Aún no tienes preguntas resueltas guardadas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {resueltasFiltradas.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-md p-5 border"
              >
                <div className="flex justify-between gap-3 mb-3">
                  <span className="text-sm font-bold text-green-600">
                    ✅ Resuelta
                  </span>

                  <span className="text-xs text-slate-400">
                    {item.origen === "examen"
                      ? "Correcta en examen"
                      : "Corregida desde falladas"}
                  </span>
                </div>

                <h2 className="font-bold text-[#06194a] mb-3">
                  {index + 1}. {item.pregunta}
                </h2>

                <div className="space-y-2 text-sm">
                  {item.opciones?.map((opcion: string, i: number) => (
                    <div
                      key={i}
                      className={`p-2 rounded-xl border ${
                        i === item.correcta
                          ? "bg-green-50 border-green-400 text-green-700 font-bold"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}. {opcion}
                    </div>
                  ))}
                </div>

                {item.explicacion && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-3 text-sm text-slate-700">
                    <strong>Explicación:</strong> {item.explicacion}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
     </div>
</div>
</main>
);
}