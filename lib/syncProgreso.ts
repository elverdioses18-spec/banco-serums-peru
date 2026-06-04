import { supabase } from "@/lib/supabase";
import { userKey } from "@/lib/storageUsuario";

export async function guardarProgreso(
  correo: string,
  datos: any
) {
  await supabase
    .from("progreso_usuarios")
    .upsert([
      {
        correo,
        datos,
        updated_at: new Date().toISOString(),
      },
    ]);
}

export async function cargarProgreso(
  correo: string
) {
  const { data } = await supabase
    .from("progreso_usuarios")
    .select("*")
    .eq("correo", correo)
    .single();

  return data?.datos || null;
}
export function obtenerProgresoLocal() {
    const claves = [
      "historialExamenes",
      "preguntasFalladas",
      "estadisticasPorTema",
      "progresoSaludPublica",
      "progresoGestion",
      "progresoCuidado",
      "progresoEtica",
      "progresoInvestigacion",
      "progresoMixto",
      "preguntasUsadasGratis",
      "flashcards",
    ];
  
    const datos: any = {};
  
    claves.forEach((clave) => {
        const valor = localStorage.getItem(userKey(clave));
  
      if (valor) {
        try {
          datos[clave] = JSON.parse(valor);
        } catch {
          datos[clave] = valor;
        }
      }
    });
  
    return datos;
  }