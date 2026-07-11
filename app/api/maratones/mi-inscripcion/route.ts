import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function obtenerSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Faltan variables de Supabase.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const correo = req.nextUrl.searchParams.get("correo")?.trim();

    if (!correo) {
      return NextResponse.json(
        { error: "Falta el correo." },
        { status: 400 }
      );
    }

    const supabaseAdmin = obtenerSupabaseAdmin();

    const { data: inscripcion, error } = await supabaseAdmin
      .from("maraton_inscripciones")
      .select("*")
      .eq("correo", correo)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (!inscripcion) {
      return NextResponse.json({
        inscripcion: null,
        sesiones: [],
      });
    }

    let sesiones: any[] = [];

    if (inscripcion.estado === "aprobado") {
      const { data, error: errorSesiones } = await supabaseAdmin
        .from("maraton_sesiones")
        .select("*")
        .eq("grupo", inscripcion.grupo)
        .eq("activo", true)
        .order("orden");

      if (errorSesiones) {
        return NextResponse.json(
          { error: errorSesiones.message },
          { status: 400 }
        );
      }

      sesiones = data ?? [];
    }

    return NextResponse.json({
      inscripcion,
      sesiones,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error interno.",
      },
      { status: 500 }
    );
  }
}