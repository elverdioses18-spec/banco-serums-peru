"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { userKey } from "@/lib/storageUsuario";
import {
  guardarProgreso,
  obtenerProgresoLocal,
  cargarProgreso,
} from "@/lib/syncProgreso";

type Flashcard = {
  id: number;
  tema: string;
  frente: string;
  reverso: string;
};

export default function FlashcardsPage() {
  const [tema, setTema] = useState("Salud Pública");
  const [frente, setFrente] = useState("");
  const [reverso, setReverso] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [mostrarPremium, setMostrarPremium] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [mostrarModalMensaje, setMostrarModalMensaje] = useState(false);
  
  const mostrarAlertaBonita = (mensaje: string) => {
    setModalMensaje(mensaje);
    setMostrarModalMensaje(true);
  };
  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem(userKey("flashcards")) || "[]");
    setFlashcards(guardadas);
  }, []);

  const guardarFlashcard = async () => {
    const esPremium = localStorage.getItem("premium") === "true";

if (!esPremium) {
  setMostrarPremium(true);
return;
}
    if (!frente.trim() || !reverso.trim()) {
      mostrarAlertaBonita("Completa el frente y reverso de la flashcard");
      return;
    }

    const nueva: Flashcard = {
      id: Date.now(),
      tema,
      frente,
      reverso,
    };

    const usuario = JSON.parse(
      localStorage.getItem("usuarioActual") || "{}"
    );
    
    let mezcladas = [nueva, ...flashcards];
    
    if (usuario.correo) {
      const progresoRemoto = await cargarProgreso(usuario.correo);
      const flashcardsRemotas = progresoRemoto?.flashcards || [];
    
      mezcladas = [
        ...mezcladas,
        ...flashcardsRemotas.filter(
          (remota: any) =>
            !mezcladas.some(
              (local: any) =>
                local.frente === remota.frente &&
                local.reverso === remota.reverso
            )
        ),
      ];
    }
    
    setFlashcards(mezcladas);
    localStorage.setItem(userKey("flashcards"), JSON.stringify(mezcladas));
    
    if (usuario.correo) {
      await guardarProgreso(
        usuario.correo,
        obtenerProgresoLocal()
      );
    }

    setFrente("");
    setReverso("");
  };

  const eliminarFlashcard = async (id: number) => {
    const actualizadas = flashcards.filter((card) => card.id !== id);
    setFlashcards(actualizadas);
    localStorage.setItem(userKey("flashcards"), JSON.stringify(actualizadas));
    const usuario = JSON.parse(
      localStorage.getItem("usuarioActual") || "{}"
    );
    
    if (usuario.correo) {
      await guardarProgreso(
        usuario.correo,
        obtenerProgresoLocal()
      );
    }
  };

  const filtradas = flashcards.filter((card) => card.tema === tema);

  return (
    <main className="min-h-screen bg-[#020817] text-white p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-6 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl"
      >
        ← Volver
      </Link>
  
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-extrabold">🗂 Flashcards</h1>
          <p className="text-slate-400 mt-2 text-lg">
            Crea y organiza tus tarjetas de estudio por tema.
          </p>
        </div>
  
        <div className="bg-slate-900 border border-blue-500/30 rounded-2xl px-6 py-4 shadow-[0_0_40px_#2563eb33]">
          <p className="text-slate-400 text-sm">Total flashcards</p>
          <p className="text-4xl font-extrabold">{flashcards.length}</p>
        </div>
      </div>
  
      <div className="grid grid-cols-1 xl:grid-cols-[520px_1fr] gap-6">
        {/* CREAR FLASHCARD */}
        <section className="bg-slate-900/80 border border-slate-700 rounded-3xl p-7 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-blue-400">
            📝 Crear nueva flashcard
          </h2>
  
          <label className="block mb-2 text-slate-300">Tema</label>
          <select
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="w-full mb-5 p-4 rounded-xl bg-slate-800 border border-blue-500/40 text-white outline-none"
          >
            <option>Salud Pública</option>
            <option>Gestión</option>
            <option>Cuidado Integral</option>
            <option>Investigación</option>
            <option>Ética</option>
          </select>
  
          <label className="block mb-2 text-slate-300">Frente de la tarjeta</label>
          <textarea
            value={frente}
            onChange={(e) => setFrente(e.target.value)}
            placeholder="Ejemplo: ¿Qué es transición epidemiológica?"
            className="w-full h-36 mb-5 p-4 rounded-2xl bg-slate-800 border border-slate-700 text-white outline-none resize-none"
          />
  
          <label className="block mb-2 text-slate-300">Reverso de la tarjeta</label>
          <textarea
            value={reverso}
            onChange={(e) => setReverso(e.target.value)}
            placeholder="Respuesta o explicación..."
            className="w-full h-36 mb-6 p-4 rounded-2xl bg-slate-800 border border-slate-700 text-white outline-none resize-none"
          />
  
          <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4 mb-6">
            <p className="font-bold text-blue-300 mb-2">
              💡 Consejos para buenas flashcards
            </p>
            <p className="text-sm text-slate-300">
              Usa preguntas claras al frente y respuestas cortas pero completas al reverso.
            </p>
          </div>
  
          <button
            onClick={guardarFlashcard}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-4 rounded-2xl font-bold text-lg shadow-lg"
          >
            Guardar flashcard ＋
          </button>
        </section>
  
        {/* LISTA FLASHCARDS */}
        <section className="bg-slate-900/80 border border-slate-700 rounded-3xl p-7 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-400">
              🗂 Tus flashcards
            </h2>
  
            <select
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
            >
              <option>Salud Pública</option>
              <option>Gestión</option>
              <option>Cuidado Integral</option>
              <option>Investigación</option>
              <option>Ética</option>
            </select>
          </div>
  
          <div className="space-y-4 max-h-[680px] overflow-y-auto pr-2">
            {filtradas.length === 0 ? (
              <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6 text-slate-400">
                Aún no tienes flashcards en esta área.
              </div>
            ) : (
              filtradas.map((card) => (
                <div
                  key={card.id}
                  className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 hover:border-blue-500/50 transition"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-xs text-purple-400 font-extrabold mb-1">
                        FRENTE
                      </p>
  
                      <h3 className="text-xl font-bold mb-4">
                        {card.frente}
                      </h3>
  
                      <p className="text-xs text-cyan-400 font-extrabold mb-1">
                        REVERSO
                      </p>
  
                      <p className="text-slate-300">
                        {card.reverso}
                      </p>
                    </div>
  
                    <button
                      onClick={() => eliminarFlashcard(card.id)}
                      className="text-red-400 hover:text-red-300 font-bold text-xl"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
      {mostrarPremium && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-[#07142b] w-[420px] rounded-3xl p-8 text-white shadow-2xl border border-blue-900">
      <div className="text-6xl text-center mb-5">🔒</div>

      <h2 className="text-3xl font-bold text-center mb-4">
        Flashcards Premium
      </h2>

      <p className="text-slate-300 text-center leading-relaxed mb-6">
        Puedes explorar esta sección, pero guardar tus propias flashcards es una función Premium.
        <br /><br />
        Organiza tus apuntes, crea tarjetas por tema y repasa de forma más inteligente.
      </p>

      <button className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-2xl py-3 text-xl font-bold mb-3">
        👑 Hazte Premium
      </button>

      <button
        onClick={() => setMostrarPremium(false)}
        className="w-full text-slate-400 hover:text-white transition"
      >
        Seguir explorando
      </button>
    </div>
  </div>
)}
{mostrarModalMensaje && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-7 text-center">
      <div className="text-5xl mb-4">
        ⚠️
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
        Atención
      </h2>

      <p className="text-slate-600 leading-relaxed mb-6">
        {modalMensaje}
      </p>

      <button
        onClick={() => setMostrarModalMensaje(false)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl"
      >
        Entendido
      </button>
    </div>
  </div>
)}
    </main>
  );
}