"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  UserCircle,
  Trophy,
  Users,
  ClipboardCheck,
  Clock,
  CalendarDays,
  Info,
  CheckCircle,
} from "lucide-react";
import { Medal } from "lucide-react";

export default function RankingSimulacroPage() {
  const [resultados, setResultados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [simulacroActual, setSimulacroActual] = useState<any>(null);

  useEffect(() => {
    cargarRanking();
  }, []);

  const cargarRanking = async () => {
    setCargando(true);
  
    const { data: simulacroData, error: errorSimulacro } = await supabase
      .from("simulacros_evento")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();
  
    if (errorSimulacro) {
      console.error("Error simulacro:", errorSimulacro);
      setResultados([]);
      setCargando(false);
      return;
    }
  
    if (!simulacroData?.id) {
      console.log("No hay simulacro actual");
      setResultados([]);
      setCargando(false);
      return;
    }
  
    setSimulacroActual(simulacroData);
  
    const { data, error } = await supabase
      .from("simulacro_resultados")
      .select("*")
      .eq("simulacro_id", simulacroData.id)
      .order("puntaje", { ascending: false })
      .order("tiempo_segundos", { ascending: true });
  
    if (error) {
      console.error("Error ranking:", error);
      setResultados([]);
      setCargando(false);
      return;
    }
  
    setResultados(data || []);
    setCargando(false);
  };
  const formatearTiempo = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
  };
  const obtenerEstadoSimulacro = () => {
    if (!simulacroActual?.fecha_inicio || !simulacroActual?.fecha_fin) {
      return "programado";
    }
  
    const ahora = new Date().getTime();
    const inicio = new Date(simulacroActual.fecha_inicio).getTime();
    const fin = new Date(simulacroActual.fecha_fin).getTime();
  
    if (ahora < inicio) return "programado";
    if (ahora >= inicio && ahora <= fin) return "activo";
    return "finalizado";
  };
  
  const estadoSimulacro = obtenerEstadoSimulacro();
  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center text-[#06194a]">
        Cargando ranking...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-[#06194a]">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* HEADER */}
        <div className="bg-[#07347e] text-white rounded-3xl px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <Link
              href="/simulacro-evento"
              className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center"
            >
              <ArrowLeft className="w-8 h-8" />
            </Link>

            <div>
              <h1 className="text-3xl font-extrabold leading-tight">
                Ruta SERUMS
              </h1>
              <p className="text-lg text-white/90">
                Prepárate, práctica y aprueba
              </p>
            </div>
          </div>

          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
            <UserCircle className="w-10 h-10 text-black" />
          </div>
        </div>

        {/* CARD PRINCIPAL */}
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">

          {/* HERO */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-5">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-purple-600" />
              </div>

              <div>
              <span
  className={`inline-block text-white text-xs font-extrabold px-3 py-1 rounded-lg mb-2 ${
    estadoSimulacro === "programado"
      ? "bg-purple-600"
      : estadoSimulacro === "activo"
      ? "bg-green-600"
      : "bg-slate-500"
  }`}
>
  {estadoSimulacro === "programado"
    ? "PRÓXIMO EVENTO"
    : estadoSimulacro === "activo"
    ? "EVENTO ACTIVO"
    : "EVENTO TERMINADO"}
</span>

                <h2 className="text-2xl font-extrabold">
                {simulacroActual?.titulo || "Simulacro"}
                </h2>

                <p className="text-slate-600 text-lg">
  Disponible del{" "}
  {simulacroActual
    ? new Date(simulacroActual.fecha_inicio).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
      })
    : "-"}
  {" "}al{" "}
  {simulacroActual
    ? new Date(simulacroActual.fecha_fin).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
      })
    : "-"}
</p>
              </div>
            </div>
            {resultados.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center min-w-[190px]">
              <div className="flex justify-center mb-1">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-green-700 font-extrabold">
                Ya participaste
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Tu posición actual
              </p>
              <p className="text-3xl font-extrabold text-purple-700">
                #{resultados.length || 1}
              </p>
            </div>
            )}
          </div>
        

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 border border-slate-200 rounded-2xl overflow-hidden mb-5">
            <div className="p-4 flex items-center gap-3 border-r border-b md:border-b-0 border-slate-200">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-slate-600">Participantes</p>
                <p className="text-2xl font-extrabold">{resultados.length}</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-3 md:border-r border-b md:border-b-0 border-slate-200">
              <ClipboardCheck className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-slate-600">Preguntas</p>
                <p className="text-2xl font-extrabold">
  {simulacroActual?.cantidad_preguntas || 0}
</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-3 border-r border-slate-200">
              <Clock className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-slate-600">Tiempo límite</p>
                <p className="text-2xl font-extrabold">60 min</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-3">
              <CalendarDays className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-slate-600">Termina en:</p>
                <p className="text-xl font-extrabold text-purple-700">
  {simulacroActual
    ? new Date(simulacroActual.fecha_fin).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
      })
    : "-"}
</p>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="border-b border-slate-200 mb-4">
            <div className="grid grid-cols-2 text-center font-bold">
              <div className="text-purple-700 py-3 border-b-4 border-purple-600">
                Ranking general
              </div>
              <div className="text-slate-500 py-3">
                Mis resultados
              </div>
            </div>
          </div>

          {/* INFO */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3 mb-5 text-blue-800">
            <Info className="w-5 h-5" />
            <p>
              El ranking se ordena por: 1. Mayor puntaje&nbsp;&nbsp; 2. Menor tiempo
            </p>
          </div>

        {/* TABLA RANKING */}
<div className="overflow-x-auto">
  <table className="w-full min-w-[650px] border-collapse">
    <thead>
      <tr className="border-b border-slate-200 text-slate-500">
        <th className="text-left py-4 px-4 font-bold">Posición</th>
        <th className="text-left py-4 px-4 font-bold">Participante</th>
        <th className="text-left py-4 px-4 font-bold">Puntaje</th>
        <th className="text-left py-4 px-4 font-bold">Tiempo</th>
      </tr>
    </thead>

    <tbody>
      {resultados.length === 0 ? (
        <tr>
          <td colSpan={4} className="text-center text-slate-500 py-10">
            Aún no hay resultados registrados.
          </td>
        </tr>
      ) : (
        resultados.map((item, index) => (
          <tr key={item.id} className="border-b border-slate-100">
            <td className="py-4 px-4">
              <div className="flex items-center gap-3">
              <div className="w-8 flex justify-center">
  {index === 0 && (
    <Medal className="w-7 h-7 text-yellow-500 fill-yellow-400" />
  )}

  {index === 1 && (
    <Medal className="w-7 h-7 text-slate-400 fill-slate-300" />
  )}

  {index === 2 && (
    <Medal className="w-7 h-7 text-orange-500 fill-orange-300" />
  )}
</div>
                <span className="font-semibold">{index + 1}</span>
              </div>
            </td>

            <td className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  👤
                </div>
                <span className="font-semibold whitespace-nowrap">
                  {item.nombre || "Usuario"}
                </span>
              </div>
            </td>

            <td className="py-4 px-4 font-bold whitespace-nowrap">
              <span className="text-purple-700 text-xl">{item.puntaje}</span>{" "}
              / {item.total_preguntas}
            </td>

            <td className="py-4 px-4 font-semibold text-slate-600 whitespace-nowrap">
              {formatearTiempo(item.tiempo_segundos || 0)}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
          {/* MENSAJE FINAL */}
          <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3 text-blue-800">
            <Trophy className="w-5 h-5" />
            <p>El ranking se actualiza en tiempo real.</p>
          </div>
        </section>
      </div>
    </main>
  );
}