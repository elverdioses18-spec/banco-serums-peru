export function guardarHistorialExamen({
    tema,
    totalPreguntas,
    correctas,
  }: {
    tema: string;
    totalPreguntas: number;
    correctas: number;
  }) {
    const historialActual = JSON.parse(
      localStorage.getItem("historialExamenes") || "[]"
    );
  
    const nota = Number(((correctas / totalPreguntas) * 20).toFixed(2));
  
    const nuevoRegistro = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString("es-PE"),
      hora: new Date().toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      tema,
      totalPreguntas,
      correctas,
      nota,
    };
  
    const historialActualizado = [nuevoRegistro, ...historialActual].slice(0, 100);
  
    localStorage.setItem(
      "historialExamenes",
      JSON.stringify(historialActualizado)
    );
  }