"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PremiumPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [codigoPago, setCodigoPago] = useState("");
  const [voucherPago, setVoucherPago] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  const [usuarioExistente, setUsuarioExistente] = useState<any>(null);
  const [buscandoUsuario, setBuscandoUsuario] = useState(false);

  const [modalMensaje, setModalMensaje] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const mostrarAlertaBonita = (mensaje: string) => {
    setModalMensaje(mensaje);
    setMostrarModal(true);
  };

  useEffect(() => {
    const buscarUsuario = async () => {
      const correoLimpio = correo.trim().toLowerCase();
      const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio);

      setUsuarioExistente(null);

      if (!correoValido) return;

      setBuscandoUsuario(true);

      const { data } = await supabase
        .from("usuarios")
        .select("nombre, correo")
        .eq("correo", correoLimpio)
        .maybeSingle();

      if (data) {
        setUsuarioExistente(data);
        setNombre(data.nombre || "");
        setPassword("");
      }

      setBuscandoUsuario(false);
    };

    const timer = setTimeout(buscarUsuario, 600);
    return () => clearTimeout(timer);
  }, [correo]);

  const crearCuentaYSolicitud = async () => {
    if (enviando) return;
    setEnviando(true);
  
    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();
    const passwordLimpio = password.trim();
    const codigoLimpio = codigoPago.trim();
  
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio);
  
    if (!correoValido) {
      setEnviando(false);
      mostrarAlertaBonita("Ingresa un correo válido.");
      return;
    }
  
    if (!codigoLimpio) {
      setEnviando(false);
      mostrarAlertaBonita("Completa el N° de operación.");
      return;
    }
  
    if (!usuarioExistente && !nombreLimpio) {
      setEnviando(false);
      mostrarAlertaBonita("Completa tu nombre.");
      return;
    }
  
    if (!usuarioExistente && passwordLimpio.length < 6) {
      setEnviando(false);
      mostrarAlertaBonita("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }
  
    if (!voucherPago) {
      setEnviando(false);
      mostrarAlertaBonita("Debes adjuntar el voucher.");
      return;
    }
  
    const { data: solicitudPendiente } = await supabase
      .from("solicitudes_premium")
      .select("id")
      .eq("correo", correoLimpio)
      .eq("estado", "pendiente")
      .maybeSingle();
  
    if (solicitudPendiente) {
      setEnviando(false);
      mostrarAlertaBonita(
        "Ya tienes una solicitud Premium pendiente. Revisaremos tu comprobante y activaremos tu acceso cuando sea validado."
      );
      return;
    }

    if (!usuarioExistente) {
      const { error: errorUsuario } = await supabase.from("usuarios").insert([
        {
          nombre: usuarioExistente?.nombre || nombreLimpio,
          correo: correoLimpio,
          password: passwordLimpio,
          premium: false,
          avatar: "avatar1",
        },
      ]);

      if (errorUsuario) {
        setEnviando(false);
        mostrarAlertaBonita("Error al crear cuenta: " + errorUsuario.message);
        return;
      }
    }

    const nombreArchivo = `${Date.now()}-${voucherPago.name}`;

    const { error: uploadError } = await supabase.storage
      .from("vouchers-premium")
      .upload(nombreArchivo, voucherPago);

    if (uploadError) {
      setEnviando(false);
      mostrarAlertaBonita("Error al subir voucher: " + uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("vouchers-premium")
      .getPublicUrl(nombreArchivo);

    const { error: errorSolicitud } = await supabase
      .from("solicitudes_premium")
      .insert([
        {
          nombre: nombreLimpio,
          correo: correoLimpio,
          codigo_pago: codigoLimpio,
          voucher_url: urlData.publicUrl,
          estado: "pendiente",
        },
      ]);

    if (errorSolicitud) {
      setEnviando(false);
      mostrarAlertaBonita("Error al enviar solicitud: " + errorSolicitud.message);
      return;
    }

    setEnviando(false);

    mostrarAlertaBonita(
      usuarioExistente
        ? "✅ Comprobante enviado. Revisaremos tu pago y activaremos tu Premium."
        : "✅ Cuenta creada y comprobante enviado. Revisaremos tu pago y activaremos tu Premium."
    );

    setTimeout(() => {
      router.push("/login");
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-[#020817] text-white px-4 py-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <section>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Activa Ruta <span className="text-blue-500">SERUMS Premium</span>
          </h1>

          <p className="text-slate-300 mt-4 text-lg">
            Paga, coloca tu correo y sube tu comprobante. Si ya tienes cuenta, la detectaremos automáticamente.
          </p>

          <div className="mt-6 bg-blue-600/20 border border-blue-500/40 rounded-3xl p-5">
            <p className="text-lg text-slate-200">Pago único</p>
            <p className="text-5xl font-extrabold text-blue-400">S/ 20</p>
          </div>

          <div className="mt-6 grid gap-3 text-slate-200">
            <p>✅ +2300 preguntas tipo SERUMS</p>
            <p>✅ Simulacros por áreas y mixtos</p>
            <p>✅ Exámenes SERUMS anteriores</p>
            <p>✅ Ranking y estadísticas de avance</p>
            <p>✅ Acceso desde celular, tablet o laptop</p>
          </div>

          <div className="mt-6 bg-white rounded-3xl p-4 w-fit">
            <img
              src="/qryape.png"
              alt="QR Yape"
              className="w-56 h-56 object-contain"
            />
          </div>

          <p className="text-slate-400 mt-3 text-sm">
            Escanea el QR, realiza el pago y coloca tu N° de operación.
          </p>
        </section>

        <section className="bg-[#081120] border border-blue-500/30 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-3xl font-extrabold text-center mb-6">
            Enviar comprobante Premium
          </h2>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            />

            {buscandoUsuario && (
              <p className="text-sm text-slate-400">Buscando usuario...</p>
            )}

            {usuarioExistente && (
              <div className="bg-green-500/15 border border-green-500/40 rounded-xl px-4 py-3 text-green-300 text-sm font-semibold">
                ✅ Usuario registrado. Solo adjunta tu comprobante y N° de operación.
              </div>
            )}

            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={!!usuarioExistente}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none disabled:opacity-70"
            />

            {!usuarioExistente && (
              <input
                type="password"
                placeholder="Contraseña para crear tu cuenta"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none"
              />
            )}

            <input
              type="text"
              placeholder="N° de operación Yape / Plin"
              value={codigoPago}
              onChange={(e) => setCodigoPago(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            />

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Adjuntar voucher o captura del pago
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setVoucherPago(e.target.files?.[0] || null)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
              />
            </div>

            <button
              onClick={crearCuentaYSolicitud}
              disabled={enviando}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 py-4 rounded-2xl font-extrabold text-lg transition-all active:scale-95"
            >
              {enviando ? "Enviando..." : "Enviar comprobante y solicitar Premium"}
            </button>

            <p className="text-center text-slate-400 text-sm">
              Luego de verificar el pago, activaremos tu acceso Premium.
            </p>
          </div>
        </section>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-7 text-center">
            <p className="text-slate-700 leading-relaxed mb-6">
              {modalMensaje}
            </p>

            <button
              onClick={() => setMostrarModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </main>
  );
}