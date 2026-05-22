"use client";

import Link from "next/link";

const temas = [
  {
    nombre: "Salud Pública",
    ruta: "/salud-publica",
    color: "bg-blue-600",
    icono: "👥",
  },
  {
    nombre: "Gestión",
    ruta: "/gestion",
    color: "bg-green-600",
    icono: "🏢",
  },
  {
    nombre: "Cuidado Integral",
    ruta: "/cuidado-integral",
    color: "bg-yellow-500",
    icono: "💛",
  },
  {
    nombre: "Investigación",
    ruta: "/investigacion",
    color: "bg-purple-600",
    icono: "🧪",
  },
  {
    nombre: "Ética",
    ruta: "/etica",
    color: "bg-red-500",
    icono: "⚖️",
  },
  {
    nombre: "Simulacro Mixto",
    ruta: "/simulacro-mixto",
    color: "bg-orange-500",
    icono: "🔥",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-[290px] shrink-0 bg-[#001f5c] text-white hidden md:flex flex-col min-h-screen">
      <div className="p-6">
        <Link
          href="/"
          className="flex items-center gap-4 px-6 py-4 ml-2 mt-3 rounded-xl hover:bg-blue-800 transition mb-8"
        >
          <span className="text-2xl">🏠</span>

          <span className="font-semibold text-lg">
            Inicio
          </span>
        </Link>

        <p className="text-sm font-bold text-blue-200 mb-5">
          TEMAS SERUMS
        </p>

        <div className="space-y-3">
          {temas.map((tema) => (
            <Link
              key={tema.nombre}
              href={tema.ruta}
              className="flex items-center gap-4 p-3 rounded-xl transition hover:bg-blue-900"
            >
              <span
                className={`${tema.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}
              >
                {tema.icono}
              </span>

              <span className="text-lg font-semibold">
                {tema.nombre}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}