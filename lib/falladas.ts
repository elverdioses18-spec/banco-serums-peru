import { userKey } from "./storageUsuario";
export function guardarFalladas(preguntas: any[], respuestas: any) {
  const falladasGuardadas = JSON.parse(
    localStorage.getItem(userKey("preguntasFalladas")) || "[]"
  );

  const nuevasFalladas = preguntas.filter(
    (pregunta, index) => respuestas[index] !== pregunta.correcta
  );

  const respondidasBien = preguntas.filter(
    (pregunta, index) => respuestas[index] === pregunta.correcta
  );
  
  const resueltasGuardadas = JSON.parse(
    localStorage.getItem(userKey("preguntasResueltas")) || "[]"
  );
  
  respondidasBien.forEach((pregunta: any) => {
    const existe = resueltasGuardadas.some(
      (p: any) => p.pregunta === pregunta.pregunta
    );
  
    if (!existe) {
      resueltasGuardadas.push({
        ...pregunta,
        origen: "examen",
        fecha: new Date().toISOString(),
      });
    }
  });
  
  localStorage.setItem(
    userKey("preguntasResueltas"),
    JSON.stringify(resueltasGuardadas)
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
    userKey("preguntasFalladas"),
    JSON.stringify(actualizadas)
  );
}