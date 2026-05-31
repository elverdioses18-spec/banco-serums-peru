"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { preguntasInvestigacion } from "@/data/investigacionData";
import { guardarFalladas } from "@/lib/falladas";
import { guardarHistorialExamen } from "@/lib/historial";

function InvestigacionContent() {
  const searchParams = useSearchParams();

const cantidad = Number(searchParams.get("cantidad")) || 20;
const [preguntasTema, setPreguntasTema] = useState<any[]>([]);

useEffect(() => {
  setPreguntasTema(
    [...preguntasInvestigacion]
      .sort(() => Math.random() - 0.5)
      .slice(0, cantidad)
  );
}, [cantidad]);

  const [respuestas, setRespuestas] = useState<{ [key: number]: number }>({});
  const [finalizado, setFinalizado] = useState(false);
  const [revision, setRevision] = useState<number | null>(null);
  const [segundos, setSegundos] = useState(0);
  const [mostrarTemporizador, setMostrarTemporizador] = useState(true);
  const [bloqueoAcceso, setBloqueoAcceso] = useState("");
  useEffect(() => {
    const usuarioRegistrado = localStorage.getItem("usuarioActual");
  
    const preguntasRespondidas = Number(
      localStorage.getItem("preguntasUsadasGratis") || "0"
    );
  
    const premiumGuardado =
      localStorage.getItem("premium") === "true";
  
    if (!usuarioRegistrado) {
      setBloqueoAcceso(
        "Debes registrarte para acceder a tus 20 preguntas gratis."
      );
      return;
    }
  
    if (!premiumGuardado && preguntasRespondidas >= 20) {
      setBloqueoAcceso(
        "Ya agotaste tus 20 preguntas gratis. Activa Premium para seguir practicando."
      );
      return;
    }
  }, []);
  useEffect(() => {
    const usuarioRegistrado = localStorage.getItem("usuarioActual");
  
    const preguntasRespondidas = Number(
      localStorage.getItem("preguntasUsadasGratis") || "0"
    );
  
    const premiumGuardado =
      localStorage.getItem("premium") === "true";
  
    if (!usuarioRegistrado) {
      setBloqueoAcceso(
        "Debes registrarte para acceder a tus 20 preguntas gratis."
      );
      return;
    }
  
    if (!premiumGuardado && preguntasRespondidas >= 10) {
      setBloqueoAcceso(
        "Ya agotaste tus 20 preguntas gratis. Activa Premium para seguir practicando."
      );
      return;
    }
  }, []);
  useEffect(() => {
    if (finalizado) return;
  
    const intervalo = setInterval(() => {
      setSegundos((prev) => prev + 1);
    }, 1000);
  
    return () => clearInterval(intervalo);
  }, [finalizado]);
  useEffect(() => {

    const temporizadorGuardado =
      localStorage.getItem("mostrarTemporizador");
  
    if (temporizadorGuardado !== null) {
  
      setMostrarTemporizador(
        JSON.parse(temporizadorGuardado)
      );
  
    }
  
  }, []);
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  
  const tiempoFormateado = `${minutos.toString().padStart(2, "0")}:${segundosRestantes
    .toString()
    .padStart(2, "0")}`;
    const responder = (numeroPregunta: number, alternativa: number) => {
      if (finalizado) return;
    
      if (respuestas[numeroPregunta] === undefined) {
        const usadas = Number(localStorage.getItem("preguntasUsadasGratis") || "0");
        localStorage.setItem("preguntasUsadasGratis", String(usadas + 1));
      }
      const preguntaActual = preguntasTema[numeroPregunta];
      const temaPregunta = preguntaActual.tema || "Sin tema";
      const esCorrecta = alternativa === preguntaActual.correcta;
      
      const estadisticasTema = JSON.parse(
        localStorage.getItem("estadisticasPorTema") || "{}"
      );
      
      if (!estadisticasTema[temaPregunta]) {
        estadisticasTema[temaPregunta] = {
          correctas: 0,
          incorrectas: 0,
        };
      }
      
      if (esCorrecta) {
        estadisticasTema[temaPregunta].correctas += 1;
      } else {
        estadisticasTema[temaPregunta].incorrectas += 1;
      }
      
      localStorage.setItem(
        "estadisticasPorTema",
        JSON.stringify(estadisticasTema)
      );
      setRespuestas({
        ...respuestas,
        [numeroPregunta]: alternativa,
      });
    };

  const totalRespondidas = Object.keys(respuestas).length;

  if (revision !== null) {
    const pregunta = preguntasTema[revision];
    const respuestaUsuario = respuestas[revision];

    return (
      <main className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
        <div className="bg-slate-800 p-8 rounded-2xl max-w-3xl w-full">
          <button
            onClick={() => setRevision(null)}
            className="mb-6 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl"
          >
            ← Volver a resultados
          </button>

          <h1 className="text-3xl font-bold mb-6">Revisión de pregunta</h1>

          <h2 className="text-2xl font-semibold mb-6">
            {pregunta.pregunta}
          </h2>

          <div className="flex flex-col gap-3 mb-6">
            {pregunta.opciones.map((opcion: string, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-xl ${
                  index === pregunta.correcta
                    ? "bg-green-600"
                    : index === respuestaUsuario
                    ? "bg-red-600"
                    : "bg-slate-700"
                }`}
              >
                {String.fromCharCode(65 + index)}) {opcion}
              </div>
            ))}
          </div>

          <div className="bg-white text-slate-900 p-5 rounded-xl">
            <p className="mb-2">
              <strong>Tu respuesta:</strong>{" "}
              {String.fromCharCode(65 + respuestaUsuario)}){" "}
              {pregunta.opciones[respuestaUsuario]}
            </p>

            <p className="mb-2">
              <strong>Respuesta correcta:</strong>{" "}
              {String.fromCharCode(65 + pregunta.correcta)}){" "}
              {pregunta.opciones[pregunta.correcta]}
            </p>

            <p>
              <strong>Fundamento:</strong> {pregunta.explicacion}
            </p>
          </div>
        </div>
      </main>
    );
  }
  const correctas = Object.keys(respuestas).filter(
    (key) =>
      respuestas[Number(key)] ===
      preguntasTema[Number(key)].correcta
  ).length;
  if (finalizado) {
   
    return (
      <main className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
        <div className="bg-slate-800 p-8 rounded-2xl max-w-3xl w-full">
          <h1 className="text-4xl font-bold mb-4">Resultados</h1>

          <p className="text-xl mb-6">
            Puntaje: {correctas} / {preguntasTema.length}
          </p>
          <div className="flex gap-4 mt-6 mb-6">
  <Link href="/gestion/configurar" className="bg-slate-600 hover:bg-slate-500 text-white px-5 py-3 rounded-xl font-bold">
    ⬅️ Volver
  </Link>

  <button
    onClick={() => {
      setRespuestas({});
      setFinalizado(false);
      setRevision(null);
      setSegundos(0);
    }}
    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-bold"
  >
    🔄 Repetir examen
  </button>

  <Link href="/investigacion/configurar" className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-3 rounded-xl font-bold">
    🎲 Nuevo examen
  </Link>
</div>
          <div className="flex flex-col gap-3">
            {preguntasTema.map((pregunta, index) => {
              const esCorrecta = respuestas[index] === pregunta.correcta;

              return (
                <button
                  key={index}
                  onClick={() => !esCorrecta && setRevision(index)}
                  className={`p-4 rounded-xl text-left ${
                    esCorrecta
                      ? "bg-green-600"
                      : "bg-red-600 hover:bg-red-500"
                  }`}
                >
                  Pregunta {index + 1}:{" "}
                  {esCorrecta ? "Correcta" : "Incorrecta - clic para revisar"}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    );
  }
  if (bloqueoAcceso) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="bg-slate-800 p-8 rounded-2xl max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-4">
            Acceso bloqueado
          </h1>
  
          <p className="text-lg mb-6">
            {bloqueoAcceso}
          </p>
  
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold"
          >
            Volver al inicio
          </a>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[#edf3f8] flex">
  <Sidebar />

  <div className="flex-1 bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          Mini simulacro: Investigación
        </h1>
        {mostrarTemporizador && (
  <div className="sticky top-6 ml-auto mr-0 w-fit bg-blue-600 text-white px-5 py-3 rounded-2xl text-2xl font-bold">
    ⏱ {tiempoFormateado}
  </div>
)}
        <p className="text-slate-300 mb-8">
          Respondidas: {totalRespondidas} / {preguntasTema.length}
        </p>

        <div className="flex flex-col gap-8">
          {preguntasTema.map((pregunta, index) => (
            <div key={index} className="bg-slate-800 p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-5">
                {index + 1}. {pregunta.pregunta}
              </h2>

              <div className="flex flex-col gap-3">
                {pregunta.opciones.map((opcion: string, opcionIndex: number) => (
                  <button
                    key={opcionIndex}
                    onClick={() => responder(index, opcionIndex)}
                    className={`p-4 rounded-xl text-left ${
                      respuestas[index] === opcionIndex
                        ? "bg-yellow-500 text-slate-900"
                        : "bg-blue-600 hover:bg-blue-500"
                    }`}
                  >
                    {String.fromCharCode(65 + opcionIndex)}) {opcion}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            const correctas = Object.keys(respuestas).filter(
              (key) =>
                respuestas[Number(key)] ===
                preguntasTema[Number(key)].correcta
            ).length;
          
            guardarFalladas(preguntasTema, respuestas);
            guardarHistorialExamen({
              tema: "Investigación",
              totalPreguntas: preguntasTema.length,
              correctas,
            });
            setFinalizado(true);
          
            
            const precision = Math.round(
              (correctas / preguntasTema.length) * 100
            );
          
            const progresoAnterior = JSON.parse(
              localStorage.getItem("progresoInvestigacion") || "{}"
            );
          
            const avanceAnterior = progresoAnterior.avance || 0;
          
            const nuevoAvance = Math.min(
              avanceAnterior + preguntasTema.length,
              preguntasInvestigacion.length
            );
          
            const porcentajeAvance = Math.round(
              (nuevoAvance / preguntasInvestigacion.length) * 100
            );
          
            const progreso = {
              correctas,
              total: preguntasTema.length,
              precision,
              avance: nuevoAvance,
              porcentajeAvance,
              ultimaPractica: new Date().toLocaleString(),
              tiempo: tiempoFormateado,
              mejorResultado: Math.max(
                progresoAnterior.mejorResultado || 0,
                correctas
              ),
              mejorTotal: preguntasTema.length,
            };
          
            localStorage.setItem(
              "progresoInvestigacion",
              JSON.stringify(progreso)
            );
          }}
          disabled={totalRespondidas < preguntasTema.length}
          className={`mt-8 w-full p-4 rounded-2xl text-xl font-bold ${
            totalRespondidas < preguntasTema.length
              ? "bg-slate-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500"
          }`}
        >
          Finalizar simulacro
        </button>
      </div>
      </div>
    </main>
  );
}
export default function InvestigacionPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <InvestigacionContent />
    </Suspense>
  );
}