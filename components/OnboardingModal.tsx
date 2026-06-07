"use client";

import { useState } from "react";

type OnboardingModalProps = {
  onClose: () => void;
};

const slides = [
    {
      numero: "1/4",
      icono: "👋",
      titulo: "Bienvenido a Ruta SERUMS",
      subtitulo: "Tu plataforma de preparación para el SERUMS",
      descripcion:
        "Prepárate con una herramienta diseñada para ayudarte a practicar, evaluar tu progreso y reforzar tus conocimientos de forma inteligente.",
      items: [
        "✅ Más de 2300 preguntas estilo examen",
        "✅ Simulacros cronometrados",
        "✅ Banco comentado con respuestas explicadas",
        "✅ Seguimiento de tu avance",
      ],
      imagen: "🧑‍⚕️",
    },
    {
      numero: "2/4",
      icono: "📝",
      titulo: "Practica como en el examen",
      subtitulo: "Entrena con preguntas reales y simulacros",
      descripcion:
        "Resuelve preguntas por áreas o realiza simulacros mixtos para medir tu preparación antes del examen.",
      items: [
        "📚 Banco de Preguntas: más de 2300 preguntas organizadas por áreas.",
        "🔥 Simulacro Mixto: pon a prueba tus conocimientos con exámenes cronometrados.",
        "📖 Banco Comentado: cada pregunta incluye explicación para reforzar el aprendizaje.",
        "🎯 Practica por áreas o realiza simulacros completos.",
      ],
      imagen: "⏱️",
    },
    {
      numero: "3/4",
      icono: "📊",
      titulo: "Aprende de tus errores",
      subtitulo: "Convierte cada práctica en progreso",
      descripcion:
        "Después de cada simulacro podrás revisar tus resultados, detectar errores y reforzar lo que necesitas mejorar.",
      items: [
        "📊 Estadísticas: visualiza tu rendimiento y evolución.",
        "❌ Preguntas Falladas: vuelve a resolver las preguntas incorrectas.",
        "📚 Preguntas Resueltas: consulta las preguntas que ya dominaste y repásalas cuando quieras.",
        "🕒 Historial: revisa tus notas y exámenes anteriores.",
      ],
      imagen: "📈",
    },
    {
      numero: "4/4",
      icono: "🧠",
      titulo: "Refuerza tus puntos débiles",
      subtitulo: "Estudia de forma más inteligente",
      descripcion:
        "Ruta SERUMS te ayuda a organizar mejor tu estudio y enfocarte en las áreas donde más necesitas practicar.",
      items: [
        "🧠 Reforzamiento: identifica las áreas que necesitan más estudio.",
        "📒 Flashcards: guarda apuntes, conceptos y datos importantes.",
        "🎯 Seguimiento personalizado: conoce tus fortalezas y enfócate donde más lo necesitas.",
        "🚀 Todo diseñado para ayudarte a llegar mejor preparado al examen SERUMS.",
      ],
      imagen: "🎯",
    },
  ];

export default function OnboardingModal({ onClose }: OnboardingModalProps) {
  const [slideActual, setSlideActual] = useState(0);

  const slide = slides[slideActual];
  const esUltimo = slideActual === slides.length - 1;

  const siguiente = () => {
    if (esUltimo) {
      onClose();
      return;
    }

    setSlideActual((prev) => prev + 1);
  };

  const anterior = () => {
    if (slideActual > 0) {
      setSlideActual((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden">

        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 text-2xl font-bold z-10"
        >
          ×
        </button>

        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-blue-50 text-blue-700 font-bold px-4 py-1 rounded-full text-sm">
          {slide.numero}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 md:p-10 pt-16">

          <div>
          <div className="flex items-start gap-3 mb-3">
  <div className="text-3xl md:text-4xl">
    {slide.icono}
  </div>

  <h2 className="text-xl md:text-3xl font-extrabold text-[#06194a] leading-tight">
    {slide.titulo}
  </h2>
</div>

            <p className="text-blue-700 font-semibold mb-3">
              {slide.subtitulo}
            </p>

            <p className="text-slate-600 mb-5 leading-relaxed">
              {slide.descripcion}
            </p>

            <div className="space-y-3">
              {slide.items.map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-green-500 font-bold">●</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center text-8xl shadow-inner">
              {slide.imagen}
            </div>
          </div>

        </div>

        <div className="flex items-center justify-between px-8 md:px-10 pb-8">

          <button
            onClick={anterior}
            disabled={slideActual === 0}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              slideActual === 0
                ? "text-slate-300 cursor-not-allowed"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            ← Anterior
          </button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setSlideActual(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === slideActual
                    ? "w-8 bg-blue-600"
                    : "w-2.5 bg-slate-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={siguiente}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg transition-all duration-150 active:scale-95"
          >
            {esUltimo ? "Entendido, comenzar 🚀" : "Siguiente →"}
          </button>

        </div>
      </div>
    </div>
  );
}