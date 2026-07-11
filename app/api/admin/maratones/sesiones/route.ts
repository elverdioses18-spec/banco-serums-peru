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

export async function GET() {
  try {
    const supabaseAdmin = obtenerSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("maraton_sesiones")
      .select("*")
      .order("grupo", { ascending: true })
      .order("orden", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      sesiones: data ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, material_url, link_clase } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Falta el id de la sesión." },
        { status: 400 }
      );
    }

    const supabaseAdmin = obtenerSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("maraton_sesiones")
      .update({
        material_url: material_url?.trim() || null,
        link_clase: link_clase?.trim() || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      mensaje: "Sesión actualizada correctamente.",
      sesion: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}