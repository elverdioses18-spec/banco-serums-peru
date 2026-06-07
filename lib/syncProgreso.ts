import { supabase } from "@/lib/supabase";
import { userKey } from "@/lib/storageUsuario";

export async function guardarProgreso(correo: string, datos: any) {
  const { data: existente } = await supabase
    .from("progreso_usuarios")
    .select("id")
    .eq("correo", correo)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existente?.id) {
    await supabase
      .from("progreso_usuarios")
      .update({
        datos,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existente.id);
  } else {
    await supabase
      .from("progreso_usuarios")
      .insert([
        {
          correo,
          datos,
          updated_at: new Date().toISOString(),
        },
      ]);
  }
}

export async function cargarProgreso(correo: string) {
  const { data } = await supabase
    .from("progreso_usuarios")
    .select("*")
    .eq("correo", correo)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

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
      "preguntasResueltas",
      "flashcards",
      "onboardingVisto",
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
  export function aplicarProgresoLocal(datos: any) {
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
      "preguntasResueltas",
      "flashcards",
      "onboardingVisto",
    ];
  
    claves.forEach((clave) => {
      localStorage.removeItem(userKey(clave));
    });
  
    if (datos && Object.keys(datos).length > 0) {
      Object.entries(datos).forEach(([clave, valor]) => {
        localStorage.setItem(
          userKey(clave),
          JSON.stringify(valor)
        );
      });
    }
  }