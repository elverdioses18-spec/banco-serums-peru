import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data: usuarios, error } = await supabase
      .from("usuarios")
      .select("correo");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const correos = Array.from(
        new Set(
          (usuarios || [])
            .map((u) => u.correo)
            .filter((correo) => correo && correo.includes("@"))
        )
      ).slice(0, 98);

      const asunto = "⏳ Faltan 2 días para el Simulacro Nacional SERUMS gratuito";

      const html = `
      <div style="font-family:Arial,sans-serif;background:#f5f7fb;padding:30px;">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 4px 12px rgba(0,0,0,.08);">
      
          <h1 style="color:#0f172a;text-align:center;margin-bottom:10px;">
            🚨 Faltan solo 2 días
          </h1>
      
          <h2 style="color:#2563eb;text-align:center;margin-top:0;">
            Simulacro Nacional SERUMS 2026-II
          </h2>
      
          <p style="font-size:17px;color:#334155;line-height:1.7;">
            Hola 👋
          </p>
      
          <p style="font-size:17px;color:#334155;line-height:1.7;">
            Cada vez falta menos para nuestro <strong>Simulacro Nacional SERUMS GRATUITO</strong>.
          </p>
      
          <p style="font-size:17px;color:#334155;line-height:1.7;">
            Si aún no te has inscrito, este es el momento. Será una excelente oportunidad para evaluar tu nivel antes del examen SERUMS.
          </p>
      
          <div style="background:#eff6ff;border-left:5px solid #2563eb;padding:18px;border-radius:8px;margin:25px 0;">
            <strong>✅ Incluye:</strong><br><br>
            • 100 preguntas<br>
            • Ranking nacional en vivo<br>
            • Resultados al finalizar<br>
            • Participación totalmente gratuita
          </div>
      
          <div style="text-align:center;margin:35px 0;">
            <a href="https://rutaserums.pe"
               style="background:#2563eb;color:white;text-decoration:none;padding:16px 32px;border-radius:8px;font-size:18px;font-weight:bold;display:inline-block;">
               Registrarme ahora
            </a>
          </div>
      
          <p style="font-size:16px;color:#475569;text-align:center;">
            ⏳ No esperes hasta el último momento.
          </p>
      
          <hr style="margin:30px 0;border:none;border-top:1px solid #e2e8f0;">
      
          <p style="text-align:center;color:#64748b;font-size:14px;">
            Equipo Ruta SERUMS<br>
            <strong>https://rutaserums.pe</strong>
          </p>
      
        </div>
      </div>
      `;

    const enviados: string[] = [];
    const fallidos: any[] = [];

    for (const correo of correos) {
      const { error: resendError } = await resend.emails.send({
        from: "Ruta SERUMS <contacto@rutaserums.pe>",
        to: correo,
        subject: asunto,
        html,
      });

      if (resendError) {
        fallidos.push({ correo, error: resendError });
      } else {
        enviados.push(correo);
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    return NextResponse.json({
      ok: true,
      total: correos.length,
      enviados: enviados.length,
      fallidos: fallidos.length,
      detalleFallidos: fallidos,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error enviando campaña" },
      { status: 500 }
    );
  }
}