import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { correo } = await req.json();

    const correoLimpio = correo.trim().toLowerCase();

    // 1. Verificar si existe usuario
    const { data: usuario } = await supabaseAdmin
      .from("usuarios")
      .select("correo")
      .eq("correo", correoLimpio)
      .maybeSingle();

    if (!usuario) {
      return NextResponse.json(
        { error: "No existe una cuenta con ese correo." },
        { status: 404 }
      );
    }

    // 2. Crear token seguro
    const token = crypto.randomBytes(32).toString("hex");

    // 3. Guardar token
    const { error } = await supabaseAdmin
      .from("password_resets")
      .insert([
        {
          correo: correoLimpio,
          token,
          usado: false,
        },
      ]);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

    const link = `https://www.rutaserums.pe/recuperar-contrasena?token=${token}`;

    // 4. Enviar correo
    await resend.emails.send({
      from: "Ruta SERUMS <soporte@rutaserums.pe>",
      to: correoLimpio,
      subject: "Recupera tu contraseña - Ruta SERUMS",
      html: `
        <h2>Recuperar contraseña</h2>

        <p>Solicitaste cambiar tu contraseña de Ruta SERUMS.</p>

        <p>Presiona el siguiente botón:</p>

        <a 
          href="${link}"
          style="
            background:#2563eb;
            color:white;
            padding:12px 20px;
            border-radius:10px;
            text-decoration:none;
            font-weight:bold;
          "
        >
          Cambiar contraseña
        </a>

        <p>Este enlace es temporal.</p>
      `,
    });

    return NextResponse.json({
      ok: true,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}