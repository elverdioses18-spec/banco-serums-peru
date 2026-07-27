"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { examenesPasados } from "@/data/examenesPasados";
import { supabase } from "@/lib/supabase";
import { guardarFalladas } from "@/lib/falladas";

type Pregunta = {
  pregunta: string;
  opciones: string[];
  respuesta: string;
};

function mezclarArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function formatearTiempo(segundos: number) {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
}

const nombresExamenes: Record<string, string> = {
  "2024-ii-a": "EXAMEN 2024 - II - A",
  "2024-ii-b": "EXAMEN 2024 - II - B",
  "2025-i-a": "EXAMEN 2025 - I - A",
  "2025-i-b": "EXAMEN 2025 - I - B",
  "2025-ii": "EXAMEN 2025 - II",
  "2026-i": "EXAMEN 2026 - I",
  mixto: "EXAMEN MIXTO",
};

export default function ExamenConvocatoriaPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const convocatoria = params.convocatoria as string;
const cantidad = Number(searchParams.get("cantidad") || 20);
const [verificandoAcceso, setVerificandoAcceso] = useState(true);
const [mostrarModalPremium, setMostrarModalPremium] = useState(false);
const examenesGratis = [
  "2024-ii-a",
  "2024-ii-b",
];

useEffect(() => {
  async function verificarAcceso() {
    const usuarioLocal = JSON.parse(
      localStorage.getItem("usuarioActual") || "{}"
    );

    if (!usuarioLocal?.correo) {
      router.replace("/login");
      return;
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select("correo, nombre, premium, gratis_usado")
      .eq("correo", usuarioLocal.correo)
      .single();

    const usuarioActualizado = data || usuarioLocal;

    localStorage.setItem(
      "usuarioActual",
      JSON.stringify({
        ...usuarioLocal,
        ...usuarioActualizado,
      })
    );

    const esGratis = examenesGratis.includes(convocatoria);

    if (!esGratis && usuarioActualizado?.premium !== true) {
      setVerificandoAcceso(false);
      setMostrarModalPremium(true);
      return;
    }

    setVerificandoAcceso(false);
  }

  verificarAcceso();
}, [router, convocatoria]);

function normalizarPregunta(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[¿?¡!.,;:()[\]"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const todasLasPreguntas = Object.values(examenesPasados).flat() as Pregunta[];

const preguntasMixtasSinDuplicados = Array.from(
  todasLasPreguntas.reduce((mapa, pregunta) => {
    const clave = normalizarPregunta(pregunta.pregunta);

    if (!mapa.has(clave)) {
      mapa.set(clave, pregunta);
    }

    return mapa;
  }, new Map<string, Pregunta>())
).map(([, pregunta]) => pregunta);

function normalizarPregunta(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[¿?¡!.,;:()[\]"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const todasLasPreguntas = Object.values(examenesPasados).flat() as Pregunta[];

const preguntasMixtasSinDuplicados = Array.from(
  todasLasPreguntas.reduce((mapa, pregunta) => {
    const clave = normalizarPregunta(pregunta.pregunta);

    if (!mapa.has(clave)) {
      mapa.set(clave, pregunta);
    }

    return mapa;
  }, new Map<string, Pregunta>())
).map(([, pregunta]) => pregunta);

const preguntasBase: Pregunta[] =
  convocatoria === "mixto"
    ? preguntasMixtasSinDuplicados
    : ((examenesPasados[
        convocatoria as keyof typeof examenesPasados
      ] || []) as Pregunta[]);
        
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [finalizado, setFinalizado] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [intento, setIntento] = useState(1);
  const [paginaActual, setPaginaActual] = useState(1);
const preguntasPorPagina = 10;

  const preguntasSeleccionadas = useMemo(() => {
    return mezclarArray(preguntasBase).slice(0, cantidad);
  }, [convocatoria, cantidad, intento]);

  const totalPaginas = Math.ceil(
    preguntasSeleccionadas.length / preguntasPorPagina
  );
  
  const inicioPagina = (paginaActual - 1) * preguntasPorPagina;
  
  const preguntasPagina = preguntasSeleccionadas.slice(
    inicioPagina,
    inicioPagina + preguntasPorPagina
  );

  useEffect(() => {
    if (finalizado) return;

    const intervalo = setInterval(() => {
      setSegundos((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [finalizado]);

  const respondidas = Object.keys(respuestas).length;

  const correctas = preguntasSeleccionadas.reduce((total, pregunta, index) => {
    return respuestas[index] === pregunta.respuesta ? total + 1 : total;
  }, 0);

  const incorrectas = finalizado
    ? preguntasSeleccionadas.length - correctas
    : 0;

  const nota20 =
    preguntasSeleccionadas.length > 0
      ? ((correctas / preguntasSeleccionadas.length) * 20).toFixed(2)
      : "0.00";
      if (verificandoAcceso) {
        return (
          <main className="min-h-screen flex items-center justify-center">
            <div className="rounded-3xl bg-white p-6 shadow-md">
              Verificando acceso...
            </div>
          </main>
        );
      }
      
      if (mostrarModalPremium) {
        return (
          <main className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6">
            <div className="max-w-md w-full rounded-3xl bg-white p-6 shadow-xl text-center">
              <div className="text-5xl mb-4">🔒</div>
      
              <h1 className="text-2xl font-extrabold text-[#06194a]">
                Acceso solo para usuarios premium
              </h1>
      
              <p className="mt-3 text-slate-600">
                Los exámenes pasados están disponibles únicamente para usuarios premium.
              </p>
      
              <Link
                href="/"
                className="mt-5 inline-block rounded-xl bg-purple-600 px-6 py-3 font-bold text-white"
              >
                Ver Premium
              </Link>
            </div>
          </main>
        );
      }
  if (!preguntasBase.length) {
    return (
      <main className="min-h-screen bg-[#f4f7fb] p-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-md">
          <h1 className="text-2xl font-extrabold text-[#06194a]">
            Examen no encontrado
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Convocatoria recibida: {convocatoria}
          </p>

          <Link
            href="/examenes-pasados"
            className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
          >
            Volver
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/examenes-pasados"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-[#06194a] shadow-sm border border-slate-100 hover:bg-purple-50"
          >
            ← Volver
          </Link>
  
          <div className="rounded-2xl bg-white px-5 py-3 text-center shadow-md border border-purple-100">
            <p className="text-xs font-bold text-slate-500">Cronómetro</p>
            <p className="text-2xl font-extrabold text-purple-700">
              {formatearTiempo(segundos)}
            </p>
          </div>
        </div>
  
        <section className="rounded-3xl bg-[#07347e] p-6 text-white shadow-md">
          <p className="text-sm font-extrabold text-purple-200">Ruta SERUMS</p>
  
          <h1 className="mt-2 text-3xl font-black">
            {nombresExamenes[convocatoria] || convocatoria}
          </h1>
  
          <p className="mt-2 text-sm text-white/90">
            {preguntasSeleccionadas.length} preguntas seleccionadas
          </p>
        </section>
  
        {!finalizado && (
          <section className="sticky top-3 z-20 rounded-3xl border border-purple-100 bg-white p-5 shadow-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-[#06194a]">
                    Avance del examen
                  </p>
                  <p className="text-sm font-extrabold text-purple-700">
                    {respondidas}/{preguntasSeleccionadas.length}
                  </p>
                </div>
  
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-purple-600"
                    style={{
                      width: `${
                        preguntasSeleccionadas.length > 0
                          ? (respondidas / preguntasSeleccionadas.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
  
                <p className="mt-2 text-sm text-slate-600">
                  Responde todas las preguntas y finaliza el examen.
                </p>
              </div>
  
              <button
                onClick={async () => {
                  const preguntasAdaptadas = preguntasSeleccionadas.map((pregunta) => ({
                    ...pregunta,
                    correcta: pregunta.respuesta,
                    origen: `Examen pasado ${convocatoria}`,
                  }));
                
                  await guardarFalladas(preguntasAdaptadas, respuestas);
                
                  setFinalizado(true);
                }}
                disabled={respondidas < preguntasSeleccionadas.length}
                className={`rounded-2xl px-6 py-3 font-extrabold text-white shadow-md ${
                  respondidas < preguntasSeleccionadas.length
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                Finalizar examen
              </button>
            </div>
          </section>
        )}
  
        {finalizado && (
          <section className="rounded-3xl border border-green-100 bg-white p-6 shadow-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-[#06194a]">
                  Resultado final
                </h2>
                <p className="text-sm text-slate-600">
                  Revisa tu puntaje obtenido.
                </p>
              </div>
  
              <button
                onClick={() => {
                  setRespuestas({});
                  setFinalizado(false);
                  setSegundos(0);
                  setIntento((prev) => prev + 1);
                  setPaginaActual(1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-2xl bg-purple-600 px-6 py-3 font-extrabold text-white shadow-md hover:bg-purple-700"
              >
                🔄 Intentar nuevamente
              </button>
            </div>
  
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-2xl bg-blue-50 p-4 text-center">
                <p className="text-sm font-bold text-slate-600">Correctas</p>
                <p className="text-3xl font-black text-blue-700">{correctas}</p>
              </div>
  
              <div className="rounded-2xl bg-red-50 p-4 text-center">
                <p className="text-sm font-bold text-slate-600">Incorrectas</p>
                <p className="text-3xl font-black text-red-600">{incorrectas}</p>
              </div>
  
              <div className="rounded-2xl bg-purple-50 p-4 text-center">
                <p className="text-sm font-bold text-slate-600">Nota /20</p>
                <p className="text-3xl font-black text-purple-700">{nota20}</p>
              </div>
  
              <div className="rounded-2xl bg-cyan-50 p-4 text-center">
                <p className="text-sm font-bold text-slate-600">Tiempo</p>
                <p className="text-3xl font-black text-cyan-700">
                  {formatearTiempo(segundos)}
                </p>
              </div>
            </div>
          </section>
        )}
  
        <section className="space-y-5">
          {preguntasPagina.map((pregunta, index) => {
  const numeroReal = inicioPagina + index;
  const respuestaUsuario = respuestas[numeroReal];
            const esCorrecta = respuestaUsuario === pregunta.respuesta;
  
            return (
              <article
           key={index}
            className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
            >
                <div className="flex items-start gap-3">
                 
  
                  <div>
                    <p className="text-sm font-extrabold text-purple-700">
                      Pregunta {numeroReal + 1} de {preguntasSeleccionadas.length}
                    </p>
  
                    <p className="mt-2 text-sm font-extrabold leading-relaxed text-[#06194a]">
                      {pregunta.pregunta}
                    </p>
                  </div>
                </div>
  
                <div className="mt-5 grid gap-3">
                  {pregunta.opciones.map((opcion) => {
                    const seleccionada = respuestaUsuario === opcion;
                    const correcta = pregunta.respuesta === opcion;
  
                    let clase =
                      "border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50 text-[#06194a]";
  
                    if (finalizado && correcta) {
                      clase = "border-green-500 bg-green-50 text-green-800";
                    }
  
                    if (finalizado && seleccionada && !esCorrecta) {
                      clase = "border-red-500 bg-red-50 text-red-800";
                    }
  
                    if (!finalizado && seleccionada) {
                      clase =
                            "border-purple-400 bg-purple-100 text-purple-800 ring-1 ring-purple-200";
                    }
  
                    return (
                      <button
                        key={opcion}
                        onClick={() => {
                          if (finalizado) return;
                          setRespuestas((prev) => ({
                            ...prev,
                            [numeroReal]: opcion,
                          }));
                        }}
                        className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-bold shadow-sm transition ${clase}`}
                      >
                        {opcion}
                      </button>
                    );
                  })}
                  
                </div>
  
                {finalizado && (
                  <div
                    className={`mt-4 rounded-2xl p-3 text-sm font-extrabold ${
                      esCorrecta
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {esCorrecta ? (
                      <p>✅ Correcta</p>
                    ) : (
                      <p>
                        ❌ Incorrecta. Respuesta correcta: {pregunta.respuesta}
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
  {Array.from({ length: totalPaginas }).map((_, index) => {
    const pagina = index + 1;
    const activa = paginaActual === pagina;

    return (
      <button
        key={pagina}
        onClick={() => {
          setPaginaActual(pagina);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={`h-10 w-10 rounded-full text-sm font-extrabold shadow-sm transition ${
          activa
            ? "bg-purple-600 text-white"
            : "bg-white text-purple-700 border border-purple-200 hover:bg-purple-50"
        }`}
      >
        {pagina}
      </button>
    );
  })}
</div>
        </section>
      </div>
    </main>
  );
}