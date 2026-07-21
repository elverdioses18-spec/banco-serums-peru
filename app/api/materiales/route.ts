import { NextRequest, NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

const BUCKET = process.env.R2_BUCKET!;
const PUBLIC_URL =
  "https://pub-f7a2696a2d94479c897661684d6bd5d3.r2.dev";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix") || "";

    const resultado = await r2.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix,
        Delimiter: "/",
      })
    );

    const carpetas =
      resultado.CommonPrefixes?.map((item) => ({
        nombre: decodeURIComponent(
          (item.Prefix || "")
            .replace(prefix, "")
            .replace(/\/$/, "")
        ),
        ruta: item.Prefix || "",
        tipo: "carpeta",
      })) || [];

    const archivos =
      resultado.Contents?.filter(
        (item) => item.Key && item.Key !== prefix
      ).map((item) => {
        const ruta = item.Key!;

        return {
          nombre: ruta.replace(prefix, ""),
          ruta,
          tipo: "archivo",
          tamaño: item.Size || 0,
          url: `${PUBLIC_URL}/${ruta
            .split("/")
            .map(encodeURIComponent)
            .join("/")}`,
        };
      }) || [];

    return NextResponse.json({
      carpetas,
      archivos,
    });
  } catch (error) {
    console.error(error);

return NextResponse.json(
  {
    error: String(error),
  },
  { status: 500 }
);
  }
}