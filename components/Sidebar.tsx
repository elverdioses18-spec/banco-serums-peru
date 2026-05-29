"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
  Heart,
  FlaskConical,
  Scale,
  Flame,
} from "lucide-react";

const temas = [
  {
    nombre: "Salud Pública",
    ruta: "/salud-publica/configurar",
    color: "bg-blue-600",
    icono: Users,
  },
  {
    nombre: "Gestión",
    ruta: "/gestion/configurar",
    color: "bg-green-600",
    icono: Building2,
  },
  {
    nombre: "Cuidado Integral",
    ruta: "/cuidado-integral/configurar",
    color: "bg-yellow-500",
    icono: Heart,
  },
  {
    nombre: "Investigación",
    ruta: "/investigacion/configurar",
    color: "bg-purple-600",
    icono: FlaskConical,
  },
  {
    nombre: "Ética",
    ruta: "/etica/configurar",
    color: "bg-red-500",
    icono: Scale,
  },
  {
    nombre: "Simulacro Mixto",
    ruta: "/simulacro-mixto/configurar",
    color: "bg-orange-500",
    icono: Flame,
  },
  
];

export default function Sidebar() {
  const router = useRouter();
const [mostrarModalLogin, setMostrarModalLogin] = useState(false);
  const [cantidadFalladas, setCantidadFalladas] = useState(0);

  useEffect(() => {

    const actualizarFalladas = () => {
      const falladas = JSON.parse(
        localStorage.getItem("preguntasFalladas") || "[]"
      );
  
      setCantidadFalladas(falladas.length);
    };
  
    actualizarFalladas();
  
    window.addEventListener("storage", actualizarFalladas);
  
    const interval = setInterval(actualizarFalladas, 500);
  
    return () => {
      window.removeEventListener("storage", actualizarFalladas);
      clearInterval(interval);
    };
  
  }, []);
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
  <button
    key={tema.nombre}
    type="button"
    onClick={() => {
      const usuarioRegistrado = localStorage.getItem("usuarioActual");

      if (!usuarioRegistrado) {
        setMostrarModalLogin(true);
        return;
      }

      router.push(tema.ruta);
    }}
    className="flex items-center gap-4 p-3 rounded-xl transition hover:bg-blue-900 w-full text-left cursor-pointer"
  >
    <span
      className={`${tema.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}
    >
     <tema.icono size={28} />
    </span>

    <span className="text-lg font-semibold">
      {tema.nombre}
    </span>
  </button>
))}
        </div>
      </div>
      {mostrarModalLogin && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-8 text-white shadow-2xl">
      <div className="text-5xl text-center mb-4">🔐</div>

      <h2 className="text-3xl font-bold text-center mb-4">
        Inicia sesión o regístrate
      </h2>

      <p className="text-slate-300 text-center leading-relaxed mb-6">
        Crea una cuenta gratuita para acceder a tus 10 preguntas de prueba.
      </p>

      <Link
        href="/login"
        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-2xl py-3 font-bold text-center block"
      >
        Iniciar sesión / Registrarse
      </Link>

      <button
        onClick={() => setMostrarModalLogin(false)}
        className="w-full mt-4 text-slate-400 hover:text-white transition"
      >
        Seguir explorando
      </button>
    </div>
  </div>
)}
    </aside>
  );
}