export function guardarFalladas(preguntas: any[], respuestas: any) {
  const falladasGuardadas = JSON.parse(
    localStorage.getItem("preguntasFalladas") || "[]"
  );

  const nuevasFalladas = preguntas.filter(
    (pregunta, index) => respuestas[index] !== pregunta.correcta
  );

  const respondidasBien = preguntas.filter(
    (pregunta, index) => respuestas[index] === pregunta.correcta
  );

  let actualizadas = falladasGuardadas.filter(
    (guardada: any) =>
      !respondidasBien.some(
        (bien: any) => bien.pregunta === guardada.pregunta
      )
  );

  nuevasFalladas.forEach((fallada: any) => {
    const yaExiste = actualizadas.some(
      (guardada: any) => guardada.pregunta === fallada.pregunta
    );

    if (!yaExiste) {
      actualizadas.push(fallada);
    }
  });

  localStorage.setItem(
    "preguntasFalladas",
    JSON.stringify(actualizadas)
  );
}