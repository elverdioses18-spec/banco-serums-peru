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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center leading-tight">
          Activa Ruta <span className="text-blue-500">SERUMS Premium</span>
        </h1>
  
        <p className="text-slate-300 mt-4 text-lg text-center">
          Sigue estos pasos para crear tu acceso y enviar tu comprobante.
        </p>
  
        <div className="mt-8 space-y-6">
  
          {/* PASO 1 */}
          <section className="bg-[#081120] border border-blue-500/30 rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-xl">
                1
              </div>
  
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold">
                  Realiza el pago
                </h2>
  
                <p className="text-slate-300 mt-2">
                  Escanea el QR y realiza el pago único de <b>S/20</b> por Yape o Plin.
                </p>
  
                <div className="mt-5 bg-white rounded-3xl p-4 w-fit text-center">
                 <img
                  src="/qryape.png"
                alt="QR Yape"
                  className="w-56 h-56 object-contain"
                 />

                   <p className="text-slate-800 font-bold mt-2">
                Nombre: Elver Di*
                  </p>
                  </div>
              </div>
            </div>
          </section>
  
          {/* PASO 2 */}
          <section className="bg-[#081120] border border-blue-500/30 rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-xl">
                2
              </div>
  
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold">
                  Completa tus datos
                </h2>
  
                <p className="text-slate-300 mt-2 mb-4">
                  Coloca el correo con el que ingresarás a RutaSERUMS.pe 
                  Si ya tienes cuenta, usa el mismo correo registrado.
                </p>
  
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Correo con el que ingresarás a RutaSERUMS"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none"
                  />
  
                  {buscandoUsuario && (
                    <p className="text-sm text-slate-400">Buscando usuario...</p>
                  )}
  
                  {usuarioExistente && (
                    <div className="bg-green-500/15 border border-green-500/40 rounded-xl px-4 py-3 text-green-300 text-sm font-semibold">
                      Usuario registrado. Solo completa el comprobante de pago.
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
                </div>
              </div>
            </div>
          </section>
  
          {/* PASO 3 */}
          <section className="bg-[#081120] border border-blue-500/30 rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-xl">
                3
              </div>
  
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold">
                  Envía tu comprobante
                </h2>
  
                <p className="text-slate-300 mt-2 mb-4">
                  Coloca el N° de operación de Yape/Plin y adjunta la captura del pago.
                </p>
  
                <div className="space-y-4">
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
                </div>
              </div>
            </div>
          </section>
  
          {/* PASO 4 */}
          <section className="bg-blue-600/10 border border-blue-500/30 rounded-3xl p-6 text-center">
            <h2 className="text-2xl font-extrabold">
              4. Activación Premium
            </h2>
  
            <p className="text-slate-300 mt-2">
              Revisaremos tu pago y activaremos tu acceso Premium.
            </p>
          </section>
        </div>
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