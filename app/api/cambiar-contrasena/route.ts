import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Datos inválidos." },
        { status: 400 }
      );
    }

    const { data: reset, error: resetError } = await supabase
      .from("password_resets")
      .select("*")
      .eq("token", token)
      .eq("usado", false)
      .maybeSingle();

    if (resetError || !reset) {
      return NextResponse.json(
        { error: "El enlace ya fue utilizado o no es válido." },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("usuarios")
      .update({ password })
      .eq("correo", reset.correo);

    if (updateError) {
      return NextResponse.json(
        { error: "No se pudo actualizar la contraseña." },
        { status: 500 }
      );
    }

    await supabase
      .from("password_resets")
      .update({ usado: true })
      .eq("token", token);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}