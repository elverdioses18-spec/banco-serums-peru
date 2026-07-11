"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  CheckCircle2,
  CreditCard,
  FileImage,
  Flame,
  LockKeyhole,
  LogIn,
  Upload,
  UserRound,
  Users,
} from "lucide-react";

type UsuarioActual = {
  nombre?: string;
  correo?: string;
};

export default function InscripcionMaraton() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [grupo, setGrupo] = useState(1);
  const [voucher, setVoucher] = useState<File | null>(null);

  const [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  const [verificandoUsuario, setVerificandoUsuario] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [exito, setExito] = useState(false);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const parametros = new URLSearchParams(window.location.search);
        const grupoUrl = Number(parametros.get("grupo"));

        if (grupoUrl === 1 || grupoUrl === 2) {
          setGrupo(grupoUrl);
        }

        const usuarioLocal: UsuarioActual = JSON.parse(
          localStorage.getItem("usuarioActual") || "{}"
        );

        if (!usuarioLocal.correo) {
          setUsuarioRegistrado(false);
          return;
        }

        const { data: usuario, error } = await supabase
          .from("usuarios")
          .select("nombre, correo")
          .eq("correo", usuarioLocal.correo)
          .maybeSingle();

        if (error || !usuario) {
          setUsuarioRegistrado(false);
          return;
        }

        setNombre(usuario.nombre || usuarioLocal.nombre || "");
        setCorreo(usuario.correo);
        setUsuarioRegistrado(true);
      } catch (error) {
        console.error("Error verificando usuario:", error);
        setUsuarioRegistrado(false);
      } finally {
        setVerificandoUsuario(false);
      }
    };

    cargarUsuario();
  }, []);

  const enviar = async () => {
    setMensaje("");
    setExito(false);

    if (!usuarioRegistrado || !nombre || !correo) {
      setMensaje("Debes iniciar sesión con una cuenta registrada.");
      return;
    }

    if (!voucher) {
      setMensaje("Selecciona el comprobante de pago.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(voucher.type)) {
      setMensaje("El comprobante debe ser JPG, PNG o WEBP.");
      return;
    }

    if (voucher.size > 5 * 1024 * 1024) {
      setMensaje("El comprobante no debe pesar más de 5 MB.");
      return;
    }

    setCargando(true);

    try {
      const consulta = await fetch(
        `/api/maratones/mi-inscripcion?correo=${encodeURIComponent(correo)}`,
        { cache: "no-store" }
      );

      const resultadoConsulta = await consulta.json();

      if (consulta.ok && resultadoConsulta.inscripcion) {
        const estado = resultadoConsulta.inscripcion.estado;

        setMensaje(
          estado === "aprobado"
            ? "Tu matrícula ya fue aprobada."
            : estado === "pendiente"
            ? "Ya tienes una matrícula en revisión."
            : "Ya existe una solicitud registrada con esta cuenta."
        );

        setCargando(false);
        return;
      }

      const extension =
        voucher.name.split(".").pop()?.toLowerCase() || "jpg";

      const nombreArchivo =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("vouchers-maraton")
        .upload(nombreArchivo, voucher, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("vouchers-maraton")
        .getPublicUrl(nombreArchivo);

      const { error: insertError } = await supabase
        .from("maraton_inscripciones")
        .insert({
          maraton_id: grupo,
          grupo,
          nombre,
          correo,
          whatsapp: "",
          voucher_url: publicUrlData.publicUrl,
          estado: "pendiente",
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setVoucher(null);
      setExito(true);
      setMensaje(
        "🔥 Inscripción enviada. Revisaremos tu pago y te avisaremos al aprobarla."
      );

      const inputArchivo = document.getElementById(
        "voucher-maraton"
      ) as HTMLInputElement | null;

      if (inputArchivo) {
        inputArchivo.value = "";
      }
    } catch (error) {
      console.error("Error enviando inscripción:", error);

      setMensaje(
        error instanceof Error
          ? `Error: ${error.message}`
          : "No se pudo enviar la inscripción."
      );
    } finally {
      setCargando(false);
    }
  };

  if (verificandoUsuario) {
    return (
      <main className="min-h-screen bg-[#020817] flex items-center justify-center px-5 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="font-bold">Verificando tu cuenta...</p>
        </div>
      </main>
    );
  }

  if (!usuarioRegistrado) {
    return (
      <main className="min-h-screen bg-[#020817] px-5 py-14 text-white">
        <section className="mx-auto max-w-xl rounded-3xl border border-blue-900 bg-[#081426] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
            <LockKeyhole size={32} />
          </div>

          <h1 className="text-3xl font-black">
            Inicia sesión para matricularte
          </h1>

          <p className="mt-4 leading-relaxed text-slate-300">
            Ruta Final SERUMS es exclusiva para usuarios registrados. Inicia
            sesión o crea tu cuenta antes de enviar el comprobante.
          </p>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-lg font-black hover:bg-blue-500"
          >
            <LogIn size={21} />
            Iniciar sesión
          </button>

          <button
            type="button"
            onClick={() => router.push("/maratones")}
            className="mt-3 w-full rounded-2xl border border-slate-700 px-5 py-4 font-bold text-slate-300 hover:bg-slate-800"
          >
            Volver a Ruta Final
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020817] px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-9 text-center">
          <div className="flex items-center justify-center gap-3">
            <Flame className="text-orange-500" size={40} />

            <h1 className="text-3xl font-black md:text-5xl">
              Matrícula Ruta Final SERUMS
            </h1>
          </div>

          <p className="mt-4 text-lg text-slate-300">
            Completa los pasos para reservar tu cupo en el Grupo {grupo}.
          </p>

          <div className="mx-auto mt-5 inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-5 py-2 font-black text-orange-300">
            Inversión única: S/ 69
          </div>
        </header>

        <section className="mb-6 rounded-3xl border border-blue-900 bg-[#081426] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <Paso numero="1" />

            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-black">Realiza el pago</h2>

              <p className="mt-2 text-slate-300">
                Escanea el QR y realiza el pago único de{" "}
                <strong className="text-white">S/ 69</strong> por Yape o Plin.
              </p>

              <div className="mt-6 flex justify-center">

<div className="rounded-2xl bg-white p-4 text-center inline-block">

  <img
    src="/qryape.png"
    alt="QR de pago Yape"
    style={{
      width: "160px",
      height: "160px",
      objectFit: "contain",
    }}
  />

  <p className="mt-2 text-xs font-black text-slate-900">
    Nombre: Elver Di*
  </p>

</div>

</div>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-3xl border border-blue-900 bg-[#081426] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <Paso numero="2" />

            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-black">
                Confirma tus datos y grupo
              </h2>

              <p className="mt-2 text-slate-300">
                Utilizaremos los datos de tu cuenta registrada. No podrás
                matricular otra dirección de correo desde esta sesión.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <CampoBloqueado
                  etiqueta="Nombre completo"
                  valor={nombre}
                  icono={<UserRound size={20} />}
                />

                <CampoBloqueado
                  etiqueta="Correo registrado"
                  valor={correo}
                  icono={<LockKeyhole size={20} />}
                />
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block font-bold text-slate-200">
                  Grupo
                </span>

                <select
  value={grupo}
  onChange={(e) => setGrupo(Number(e.target.value))}
  className="w-full rounded-2xl border border-slate-700 bg-[#0f1a30] px-4 py-4 font-bold text-white outline-none focus:border-blue-500"
>
  <option value={1} className="bg-slate-800 text-white">
    Grupo 1
  </option>
  
</select>
              </label>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-3xl border border-blue-900 bg-[#081426] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <Paso numero="3" />

            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-black">
                Envía tu comprobante
              </h2>

              <p className="mt-2 text-slate-300">
                Adjunta una captura clara donde se observe el pago realizado.
              </p>

              <label className="mt-6 block cursor-pointer rounded-2xl border-2 border-dashed border-slate-600 bg-[#0f1a30] p-7 text-center hover:border-blue-500">
                <input
                  id="voucher-maraton"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) =>
                    setVoucher(e.target.files?.[0] || null)
                  }
                />

                <FileImage
                  className="mx-auto mb-3 text-blue-400"
                  size={40}
                />

                <p className="font-black">
                  {voucher
                    ? voucher.name
                    : "Seleccionar voucher o captura del pago"}
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  JPG, PNG o WEBP. Máximo 5 MB.
                </p>
              </label>

              <button
                type="button"
                onClick={enviar}
                disabled={cargando || exito}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-lg font-black transition ${
                  exito
                    ? "cursor-not-allowed bg-green-700"
                    : "bg-blue-600 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                }`}
              >
                {exito ? (
                  <>
                    <CheckCircle2 size={22} />
                    Inscripción enviada
                  </>
                ) : cargando ? (
                  "Enviando inscripción..."
                ) : (
                  <>
                    <Upload size={22} />
                    Enviar comprobante y solicitar matrícula
                  </>
                )}
              </button>

              {mensaje && (
                <div
                  className={`mt-5 rounded-2xl border p-4 text-center font-bold ${
                    exito
                      ? "border-green-700 bg-green-950/50 text-green-300"
                      : "border-orange-700 bg-orange-950/40 text-orange-200"
                  }`}
                >
                  {mensaje}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-blue-900 bg-[#081426] p-7 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
            <span className="font-black">4</span>
          </div>

          <h2 className="text-2xl font-black">
            Verificación y activación
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Revisaremos tu pago desde el panel administrativo. Cuando sea
            aprobado, la página de Ruta Final cambiará automáticamente y
            mostrará tu grupo, fechas, materiales y enlace de cada clase.
          </p>
        </section>
      </div>
    </main>
  );
}

function Paso({ numero }: { numero: string }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-black">
      {numero}
    </div>
  );
}

function CampoBloqueado({
  etiqueta,
  valor,
  icono,
}: {
  etiqueta: string;
  valor: string;
  icono: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 font-bold text-slate-200">{etiqueta}</p>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-[#0f1a30] px-4 py-4 text-slate-300">
        <span className="text-blue-400">{icono}</span>
        <span className="min-w-0 truncate">{valor}</span>
      </div>
    </div>
  );
}

function DatoPago({
  titulo,
  valor,
  icono,
}: {
  titulo: string;
  valor: string;
  icono: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-700 bg-[#0f1a30] p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
        {icono}
      </div>

      <div>
        <p className="text-sm text-slate-400">{titulo}</p>
        <p className="font-black text-white">{valor}</p>
      </div>
    </div>
  );
}