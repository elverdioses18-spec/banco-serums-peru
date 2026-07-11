import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
      throw new Error("Faltan variables de Supabase.");
    }

    const supabaseAdmin = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabaseAdmin
      .from("maraton_inscripciones")
      .select("grupo")
      .eq("estado", "aprobado");

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    const grupo1 = (data || []).filter(
      (item) => Number(item.grupo) === 1
    ).length;

    const grupo2 = (data || []).filter(
      (item) => Number(item.grupo) === 2
    ).length;

    return NextResponse.json({
      grupo1,
      grupo2,
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