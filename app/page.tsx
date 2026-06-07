"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { preguntas as preguntasSaludPublica } from "@/data/preguntas";
import { preguntasGestion } from "@/data/gestion";
import { preguntasCuidadoIntegral } from "@/data/cuidadoIntegralData";
import { preguntasInvestigacion } from "@/data/investigacionData";
import { preguntasEtica } from "@/data/eticaData";
import { supabase } from "@/lib/supabase";
import { userKey } from "@/lib/storageUsuario";
import {
  cargarProgreso,
  aplicarProgresoLocal,
} from "@/lib/syncProgreso";
console.log(preguntasSaludPublica)
import InfoTooltip from "@/components/InfoTooltip";
import {
  Users,
  Building2,
  Heart,
  FlaskConical,
  Scale,
  Flame,
} from "lucide-react";
const temas = [
  { nombre: "Salud Pública", desc: "Salud pública y epidemiología.", preguntas: `${preguntasSaludPublica.saludPublica.length} preguntas`, color: "bg-blue-600", icono: Users, ruta: "/salud-publica/configurar" , progresoKey: "progresoSaludPublica"},
  { nombre: "Gestión", desc: "Administración en salud y normativas del sector.", preguntas: `${preguntasGestion.length} preguntas`, color: "bg-green-600", icono: Building2, ruta: "/gestion/configurar",  progresoKey: "progresoGestion" },
  { nombre: "Ética", desc: "Bioética, ética médica y normativa legal.", preguntas: `${preguntasEtica.length} preguntas`, color: "bg-red-500", icono: Scale, ruta: "/etica/configurar", progresoKey: "progresoEtica" },
  { nombre: "Investigación", desc: "Metodología de investigación y bioestadística.", preguntas: `${preguntasInvestigacion.length} preguntas`, color: "bg-purple-600", icono: FlaskConical, ruta: "/investigacion/configurar", progresoKey: "progresoInvestigacion" },
  { nombre: "Cuidado Integral", desc: "Atención integral, cursos de vida y casos clínicos.", preguntas: `${preguntasCuidadoIntegral.length} preguntas`, color: "bg-yellow-500", icono: Heart, ruta: "/cuidado-integral/configurar", progresoKey: "progresoCuidado" },
  { nombre: "Simulacro Mixto", desc: "Simulacro completo con preguntas de todos los temas.", preguntas: `${preguntasSaludPublica.saludPublica.length + preguntasGestion.length + preguntasCuidadoIntegral.length + preguntasInvestigacion.length + preguntasEtica.length} preguntas`, color: "bg-orange-500", icono: Flame, ruta: "/simulacro-mixto/configurar", progresoKey: "progresoMixto" },
];

export default function Home() {
 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [metaDiaria, setMetaDiaria] = useState<number>(50);
const [preguntasHoy, setPreguntasHoy] = useState(0);
const router = useRouter();
const [mostrarPremium, setMostrarPremium] = useState(false);
const [mostrarModalLogin, setMostrarModalLogin] = useState(false);
const [popupTema, setPopupTema] = useState<any>(null);
const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
const [temaMovilActivo, setTemaMovilActivo] = useState<any>(null);
const cargarProgresoTemaMovil = (tema: any) => {
  const progreso = JSON.parse(
    localStorage.getItem(userKey(tema.progresoKey)) || "{}"
  );

  setProgresoPopup(progreso);
  setTemaMovilActivo(tema);
 };
 const [modalMensaje, setModalMensaje] = useState("");
const [mostrarModalMensaje, setMostrarModalMensaje] = useState(false);

const mostrarAlertaBonita = (mensaje: string) => {
  setModalMensaje(mensaje);
  setMostrarModalMensaje(true);
};
const [usuarioActual, setUsuarioActual] = useState<any>(null);
const [menuUsuarioOpen, setMenuUsuarioOpen] = useState(false);
const [modalPasswordOpen, setModalPasswordOpen] = useState(false);
const [passwordActual, setPasswordActual] = useState("");
const [passwordNueva, setPasswordNueva] = useState("");
const [passwordNueva2, setPasswordNueva2] = useState("");
const [mensajePassword, setMensajePassword] = useState("");
const [modalPerfilOpen, setModalPerfilOpen] = useState(false);
const [perfilNombre, setPerfilNombre] = useState("");
const [perfilCorreo, setPerfilCorreo] = useState("");
const [perfilCelular, setPerfilCelular] = useState("");
const [perfilCiudad, setPerfilCiudad] = useState("");
const [mensajePerfil, setMensajePerfil] = useState("");
const [progresoPopup, setProgresoPopup] = useState<any>(null);
const [mostrarPagoPremium, setMostrarPagoPremium] = useState(false);
const [nombrePago, setNombrePago] = useState("");
const [correoPago, setCorreoPago] = useState("");
const [codigoPago, setCodigoPago] = useState("");
const [voucherPago, setVoucherPago] = useState<File | null>(null);
const [mostrarPagoEnviado, setMostrarPagoEnviado] = useState(false);
const [mostrarPremiumActivado, setMostrarPremiumActivado] = useState(false);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("premium") === "true") {
    setMostrarPremium(true);
  }
}, []);

useEffect(() => {
  const sincronizarAlRecargar = async () => {
    const usuario = JSON.parse(
      localStorage.getItem("usuarioActual") || "{}"
    );
  
    if (!usuario.correo) return;
  
    const progresoRemoto = await cargarProgreso(usuario.correo);
  
    aplicarProgresoLocal(progresoRemoto);
  };
  
  sincronizarAlRecargar();
  const usuario = localStorage.getItem("usuarioActual");
  if (usuario) {
    setUsuarioActual(JSON.parse(usuario));
  }


  const metaGuardada = Number(localStorage.getItem("metaDiaria") ?? "50");

  const historial = JSON.parse(
    localStorage.getItem(userKey("historialExamenes")) || "[]"
  );

  const hoy = new Date().toLocaleDateString("es-PE");

  const totalHoy = historial
    .filter((examen: any) => examen.fecha === hoy)
    .reduce(
      (total: number, examen: any) =>
        total + examen.totalPreguntas,
      0
    );
    setMetaDiaria(metaGuardada);
    if (totalHoy >= metaGuardada) {

          
          
      setPreguntasHoy(0);
    
      return;
    
    }
  
  setPreguntasHoy(totalHoy);

}, []);
useEffect(() => {
  const verificarPremium = async () => {
    const usuario = JSON.parse(
      localStorage.getItem("usuarioActual") || "{}"
    );

    if (!usuario.correo) return;

    const premiumLocal =
      localStorage.getItem("premium") === "true";

    const { data } = await supabase
      .from("usuarios")
      .select("premium")
      .eq("correo", usuario.correo)
      .single();

    if (data?.premium === true && !premiumLocal) {
      localStorage.setItem("premium", "true");
      setMostrarPremiumActivado(true);
    }
  };

  verificarPremium();
}, []);
  const [progresoSalud, setProgresoSalud] = useState<any>(null);
  const [progresoCuidado, setProgresoCuidado] = useState<any>(null);
  const [progresoGestion, setProgresoGestion] = useState<any>(null);
const [progresoInvestigacion, setProgresoInvestigacion] = useState<any>(null);
const [progresoEtica, setProgresoEtica] = useState<any>(null);
const [progresoMixto, setProgresoMixto] = useState<any>(null);
  const [temaActivo, setTemaActivo] = useState("salud");
  const [esPremium, setEsPremium] = useState(false);
  

useEffect(() => {
  const premiumGuardado = localStorage.getItem("premium") === "true";
  setEsPremium(premiumGuardado);
}, []);
const [mostrarBloqueoPremium, setMostrarBloqueoPremium] = useState(false);

const LIMITE_GRATIS = 20;
useEffect(() => {
  const data = localStorage.getItem(userKey("progresoSaludPublica"));

  if (data) {
    setProgresoSalud(JSON.parse(data));
  }
  const dataCuidado = localStorage.getItem(userKey("progresoCuidado"));

if (dataCuidado) {
  setProgresoCuidado(JSON.parse(dataCuidado));
}
const dataGestion = localStorage.getItem(userKey("progresoGestion"));
if (dataGestion) {
  setProgresoGestion(JSON.parse(dataGestion));
}

const dataInvestigacion = localStorage.getItem(userKey("progresoInvestigacion"));
if (dataInvestigacion) {
  setProgresoInvestigacion(JSON.parse(dataInvestigacion));
}

const dataEtica = localStorage.getItem(userKey("progresoEtica"));
if (dataEtica) {
  setProgresoEtica(JSON.parse(dataEtica));
}

const dataMixto = localStorage.getItem(userKey("progresoMixto"));
if (dataMixto) {
  setProgresoMixto(JSON.parse(dataMixto));
}
}, []);
useEffect(() => {
  const scrollGuardado = sessionStorage.getItem("homeScroll");

  if (scrollGuardado) {
    setTimeout(() => {
      window.scrollTo(0, Number(scrollGuardado));
    }, 150);
  }

  const guardarScroll = () => {
    sessionStorage.setItem("homeScroll", String(window.scrollY));
  };

  window.addEventListener("scroll", guardarScroll);

  return () => {
    window.removeEventListener("scroll", guardarScroll);
  };
  setEsPremium(localStorage.getItem("premium") === "true");
}, []);
const progresoActual =
  temaActivo === "salud"
    ? progresoSalud
    : temaActivo === "gestion"
    ? progresoGestion
    : temaActivo === "cuidado"
    ? progresoCuidado
    : temaActivo === "investigacion"
    ? progresoInvestigacion
    : temaActivo === "etica"
    ? progresoEtica
    : temaActivo === "mixto"
    ? progresoMixto
    : null;
  const [temaSeleccionado, setTemaSeleccionado] = useState(temas[0]);
  const colorPanel =
  temaSeleccionado.color === "bg-blue-600"
    ? "green"
    : temaSeleccionado.color === "bg-green-600"
    ? "green"
    : temaSeleccionado.color === "bg-yellow-500"
    ? "yellow"
    : temaSeleccionado.color === "bg-purple-600"
    ? "purple"
    : temaSeleccionado.color === "bg-red-500"
    ? "red"
    : "orange";
    const totalPreguntasResueltas =
  (progresoSalud?.avance || 0) +
  (progresoGestion?.avance || 0) +
  (progresoCuidado?.avance || 0) +
  (progresoInvestigacion?.avance || 0) +
  (progresoEtica?.avance || 0) +
  (progresoMixto?.avance || 0);

  const precisiones = [
    progresoSalud?.precision,
    progresoGestion?.precision,
    progresoCuidado?.precision,
    progresoInvestigacion?.precision,
    progresoEtica?.precision,
    progresoMixto?.precision,
  ].filter((valor) => typeof valor === "number");
  
  const precisionPromedio =
    precisiones.length > 0
      ? Math.round(
          precisiones.reduce((total, valor) => total + valor, 0) /
            precisiones.length
        )
      : 0;
const rachaEstudio =
  (
    progresoSalud?.ultimaPractica ||
    progresoGestion?.ultimaPractica ||
    progresoCuidado?.ultimaPractica ||
    progresoInvestigacion?.ultimaPractica ||
    progresoEtica?.ultimaPractica
  )
    ? 1
    : 0;
    const progresoMovilActual = temaMovilActivo
  ? JSON.parse(
      localStorage.getItem(userKey(temaMovilActivo.progresoKey)) || "{}"
    )
  : {};
   return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-[#06194a] overflow-x-hidden">

<div className="block md:hidden fixed top-0 left-0 right-0 bottom-0 z-[9999] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
  <div className="min-h-screen text-[#06194a] p-4">
  <input id="menu-mobile" type="checkbox" className="peer hidden" />

  <div className="relative bg-[#07337a] text-white rounded-2xl p-4 mb-4 flex items-center gap-4">
    <label
  htmlFor="menu-mobile"
  className="relative z-[10050] text-2xl bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer select-none"
>
  ☰
</label>

<div className="flex-1">
<h1 className="text-2xl font-bold">Ruta SERUMS</h1>
        <p className="text-sm text-blue-100">Prepárate, práctica y aprueba</p>
        
        <div className="absolute right-4 top-4">
  <button
    onClick={() => setMenuUsuarioOpen(!menuUsuarioOpen)}
    className="w-11 h-11 rounded-full bg-white text-blue-900 flex items-center justify-center text-2xl shadow-md"
  >
    👤
  </button>

  {menuUsuarioOpen && (
    <div className="absolute right-0 top-14 w-56 bg-white text-slate-800 rounded-2xl shadow-xl p-3 z-[99999]">
      {usuarioActual ? (
        <>
          <p className="px-3 py-2 font-bold text-blue-900">
            {usuarioActual.nombre || usuarioActual.correo}
          </p>

          <button
  onClick={() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual") || "{}");

    setPerfilNombre(usuario.nombre || "");
    setPerfilCorreo(usuario.correo || "");
    setPerfilCelular(usuario.celular || "");
    setPerfilCiudad(usuario.ciudad || "");
    setMensajePerfil("");

    setModalPerfilOpen(true);
    setMenuUsuarioOpen(false);
  }}
  className="block w-full text-left px-3 py-2 hover:bg-slate-100 rounded-xl"
>
  Mi perfil
</button>

          <button
            onClick={() => {
              setModalPasswordOpen(true);
              setMenuUsuarioOpen(false);
              setMensajePassword("");
            }}
            className="block w-full text-left px-3 py-2 hover:bg-slate-100 rounded-xl"
          >
            Cambiar contraseña
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("usuarioActual");
              localStorage.removeItem("premium");
              window.location.href = "/login";
            }}
            className="block w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-xl"
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="block w-full text-left px-3 py-2 hover:bg-slate-100 rounded-xl font-bold"
          >
            Iniciar sesión
          </Link>

          <Link
            href="/login"
            className="block w-full text-left px-3 py-2 hover:bg-slate-100 rounded-xl font-bold"
          >
            Registrarme
          </Link>
        </>
      )}
    </div>
  )}
</div>
    
  </div>

    </div>
    <div
  onClick={() => {
    const menu = document.getElementById("menu-mobile") as HTMLInputElement;
    if (menu) menu.checked = false;
  }}
  className="fixed inset-0 z-[1000] bg-black/50 opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto transition-opacity duration-300"
>
    <div className="w-[280px] h-full bg-[#07337a] text-white p-5 pt-24 shadow-2xl overflow-y-auto">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold">Ruta SERUMS</h2>
        <p className="text-sm text-blue-100">Menú principal</p>
      </div>

      <button
  onClick={() => {
    const menu = document.getElementById(
      "menu-mobile"
    ) as HTMLInputElement;

    if (menu) menu.checked = false;
  }}
  className="text-4xl font-bold"
>
        ×
        </button>
    </div>

    <div className="space-y-4 text-lg font-bold">
    <Link href="/" className="block">🏠 Inicio</Link>
    <details className="block" onClick={(e) => e.stopPropagation()}>
  <summary className="cursor-pointer list-none py-2">
    👥 Salud Pública
  </summary>

  <div className="mt-2 ml-4 bg-white/10 rounded-xl p-3 text-sm">
    <div className="space-y-2">

    <p>📊 Precisión: {progresoSalud?.precision || 0}%</p>

<div>
  <div className="flex justify-between">
    <span>Progreso</span>
    <span>{progresoSalud?.porcentajeAvance || 0}%</span>
  </div>

  <div className="w-full bg-white/20 rounded-full h-2 mt-1">
    <div
      className="bg-green-400 h-2 rounded-full"
      style={{ width: `${progresoSalud?.porcentajeAvance || 0}%` }}
    ></div>
  </div>
</div>

<p>🔥 Racha: {rachaEstudio} días</p>
<p>📝 Resueltas: {progresoSalud?.avance || 0}</p>
<p>
  🏆 Mejor resultado: {progresoSalud?.mejorResultado || 0}/
  {progresoSalud?.mejorTotal || 20}
</p>

    </div>
  </div>
</details>

<details className="block" onClick={(e) => e.stopPropagation()}>
  <summary className="cursor-pointer list-none py-2">
    🏢 Gestión
  </summary>

  <div className="mt-2 ml-4 bg-white/10 rounded-xl p-3 text-sm">
    <div className="space-y-2">

    <p>📊 Precisión: {progresoGestion?.precision || 0}%</p>

<div>
  <div className="flex justify-between">
    <span>Progreso</span>
    <span>{progresoGestion?.porcentajeAvance || 0}%</span>
  </div>

  <div className="w-full bg-white/20 rounded-full h-2 mt-1">
    <div
      className="bg-green-400 h-2 rounded-full"
      style={{ width: `${progresoGestion?.porcentajeAvance || 0}%` }}
    ></div>
  </div>
</div>

<p>🔥 Racha: {rachaEstudio} días</p>
<p>📝 Resueltas: {progresoGestion?.avance || 0}</p>
<p>
  🏆 Mejor resultado: {progresoGestion?.mejorResultado || 0}/
  {progresoGestion?.mejorTotal || 20}
</p>
    </div>
  </div>
</details>

<details className="block" onClick={(e) => e.stopPropagation()}>
  <summary className="cursor-pointer list-none py-2">
    ⚖️ Ética
  </summary>

  <div className="mt-2 ml-4 bg-white/10 rounded-xl p-3 text-sm">
    <div className="space-y-2">

    <p>📊 Precisión: {progresoEtica?.precision || 0}%</p>

<div>
  <div className="flex justify-between">
    <span>Progreso</span>
    <span>{progresoEtica?.porcentajeAvance || 0}%</span>
  </div>

  <div className="w-full bg-white/20 rounded-full h-2 mt-1">
    <div
      className="bg-green-400 h-2 rounded-full"
      style={{ width: `${progresoEtica?.porcentajeAvance || 0}%` }}
    ></div>
  </div>
</div>

<p>🔥 Racha: {rachaEstudio} días</p>
<p>📝 Resueltas: {progresoEtica?.avance || 0}</p>
<p>
  🏆 Mejor resultado: {progresoEtica?.mejorResultado || 0}/
  {progresoEtica?.mejorTotal || 20}
</p>

    </div>
  </div>
</details>

<details className="block" onClick={(e) => e.stopPropagation()}>
  <summary className="cursor-pointer list-none py-2">
    🧪 Investigación
  </summary>

  <div className="mt-2 ml-4 bg-white/10 rounded-xl p-3 text-sm">
    <div className="space-y-2">

    <p>📊 Precisión: {progresoInvestigacion?.precision || 0}%</p>

<div>
  <div className="flex justify-between">
    <span>Progreso</span>
    <span>{progresoInvestigacion?.porcentajeAvance || 0}%</span>
  </div>

  <div className="w-full bg-white/20 rounded-full h-2 mt-1">
    <div
      className="bg-green-400 h-2 rounded-full"
      style={{ width: `${progresoInvestigacion?.porcentajeAvance || 0}%` }}
    ></div>
  </div>
</div>

<p>🔥 Racha: {rachaEstudio} días</p>
<p>📝 Resueltas: {progresoInvestigacion?.avance || 0}</p>
<p>
  🏆 Mejor resultado: {progresoInvestigacion?.mejorResultado || 0}/
  {progresoInvestigacion?.mejorTotal || 20}
</p>

    </div>
  </div>
</details>

<details className="block" onClick={(e) => e.stopPropagation()}>
  <summary className="cursor-pointer list-none py-2">
    💛 Cuidado Integral
  </summary>

  <div className="mt-2 ml-4 bg-white/10 rounded-xl p-3 text-sm">
    <div className="space-y-2">

    <p>📊 Precisión: {progresoCuidado?.precision || 0}%</p>

<div>
  <div className="flex justify-between">
    <span>Progreso</span>
    <span>{progresoCuidado?.porcentajeAvance || 0}%</span>
  </div>

  <div className="w-full bg-white/20 rounded-full h-2 mt-1">
    <div
      className="bg-green-400 h-2 rounded-full"
      style={{ width: `${progresoCuidado?.porcentajeAvance || 0}%` }}
    ></div>
  </div>
</div>

<p>🔥 Racha: {rachaEstudio} días</p>
<p>📝 Resueltas: {progresoCuidado?.avance || 0}</p>
<p>
  🏆 Mejor resultado: {progresoCuidado?.mejorResultado || 0}/
  {progresoCuidado?.mejorTotal || 20}
</p>

    </div>
  </div>
</details>

<details className="block" onClick={(e) => e.stopPropagation()}>
  <summary className="cursor-pointer list-none py-2">
    🔥 Simulacro Mixto
  </summary>

  <div className="mt-2 ml-4 bg-white/10 rounded-xl p-3 text-sm">
    <div className="space-y-2">

    <p>📊 Precisión: {progresoMixto?.precision || 0}%</p>

<div>
  <div className="flex justify-between">
    <span>Progreso</span>
    <span>{progresoMixto?.porcentajeAvance || 0}%</span>
  </div>

  <div className="w-full bg-white/20 rounded-full h-2 mt-1">
    <div
      className="bg-green-400 h-2 rounded-full"
      style={{ width: `${progresoMixto?.porcentajeAvance || 0}%` }}
    ></div>
  </div>
</div>

<p>🔥 Racha: {rachaEstudio} días</p>
<p>📝 Resueltas: {progresoMixto?.avance || 0}</p>
<p>
  🏆 Mejor resultado: {progresoMixto?.mejorResultado || 0}/
  {progresoMixto?.mejorTotal || 20}
</p>

    </div>
  </div>
</details>
    </div>
    <Link href="/flashcards" className="block py-5 font-bold">
  🗂️ Flashcards
</Link>
    <div className="border-t border-white/20 my-5"></div>

    <div className="space-y-4 text-lg font-bold">
    <Link href="/estadisticas" className="block">📊 Estadísticas</Link>
    <Link href="/resueltas" className="block">📚 Resueltas</Link>
<Link href="/falladas" className="block">❌ Preguntas falladas</Link>
<Link href="/reforzamiento" className="block">🧠 Reforzamiento</Link>
<Link href="/historial" className="block">🕘 Historial</Link>
<div className="border-t border-white/20 my-4"></div>
<Link href="/colabora" className="block">🚀 Colabora</Link>
<Link href="/soporte" className="block">
  ❓ Ayuda y Soporte
</Link>
<Link href="/ajustes" className="block">⚙️ Ajustes</Link>
    </div>
  </div>
</div>
    <div className="bg-white rounded-3xl shadow-md -p-1 mb-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-[#06194a] leading-tight">
            ¡Bienvenido a Ruta SERUMS!
          </h2>

          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Plataforma de simulacros y banco de preguntas para el examen SERUMS.
          </p>
        </div>

        <img
          src="/logo.png.png"
          alt="Ruta SERUMS"
          className="w-38 rounded-xl"
        />
      </div>
      {!esPremium && (
  <>
      {/* FRANJA PREMIUM MÓVIL */}
<div className="md:hidden bg-gradient-to-r from-yellow-50 to-white border border-yellow-400 rounded-2xl p-1 mb-5 shadow-sm flex items-center justify-between gap-3">
  <div className="flex items-center gap-3">
    <div className="w-14 h-14 rounded-full bg-yellow-500 text-white flex items-center justify-center text-3xl shadow-md">
      👑
    </div>

    <div>
      <h3 className="text-blue-950 font-bold text-base text-xs">
        ¡Desbloquea todo el potencial!
      </h3>
      <p className="text-blue-950 font-bold text-base text-xs">
      Hazte Premium
      </p>
    </div>
  </div>

  <button
  onClick={() => setMostrarPremium(true)}
  className="bg-yellow-500 hover:bg-yellow-400 text-white font-extrabold px-4 py-3 rounded-xl text-sm shadow-md whitespace-nowrap"
>
  ⭐ PREMIUM ›
</button>
</div>
</>
)}

      <div className="grid grid-cols-3 gap-3 mt-5">
        <div className="border border-slate-300 rounded-2xl p-1 text-center">
        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-xl mx-auto">
  ❔
</div>
<InfoTooltip texto="Muestra el número total de examenes realizados.">
          <p className="text-xs font-bold mt-1">Total</p>
          </InfoTooltip>
          <p className="text-xl font-extrabold">
  {totalPreguntasResueltas}
</p>
        </div>

        <div className="border border-slate-300 rounded-2xl p-1 text-center">
        <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-2xl mx-auto">
  🎯
</div>
           <InfoTooltip texto="Porcentaje promedio de respuestas correctas de todos tus examenes.">
          <p className="text-xs font-bold mt-1">Precisión</p>
          </InfoTooltip>
          <p className="text-xl font-extrabold">
  {precisionPromedio}%
</p>
        </div>

        <div className="border border-slate-300 rounded-2xl p-1 text-center">
        <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-2xl mx-auto">
  📅
</div>
         <InfoTooltip texto="Días consecutivos en los que has practicado en la plataforma.">
          <p className="text-xs font-bold mt-1">Racha</p>
          </InfoTooltip>
          <p className="text-xl font-extrabold">
  {rachaEstudio} días
</p>
          
        </div>
      </div>
    </div>
    <h2 className="text-xl font-extrabold mb-3">
  Elige un tema
</h2>

<div className="grid grid-cols-2 gap-3 mb-6">
  
  {temas.map((tema, index) => (
   <div
   key={index}
   onClick={() => {
    cargarProgresoTemaMovil(tema);
  }}
   className="bg-white rounded-2xl p-3 shadow-md cursor-pointer"
 >
   <div
  onClick={() => {
    cargarProgresoTemaMovil(tema);
  }}
  className="flex items-center gap-3 mb-3 cursor-pointer"
>
      <div
        className={`w-9 h-9 rounded-full ${tema.color} flex items-center justify-center text-white flex-shrink-0`}
      >
        <tema.icono size={20} />
      </div>
  
      <div className="min-w-0">
        <h3 className="font-bold text-[13px] leading-tight">
          {tema.nombre}
        </h3>
  
        <p className="text-[11px] text-slate-500 mt-1">
          {tema.preguntas}
        </p>
      </div>
      </div>
  
    <Link
  href={tema.ruta}
  onClick={(e) => e.stopPropagation()}
  className={`${tema.color} block text-center text-white w-full py-2 rounded-xl font-bold text-[12px] shadow-md transition-all duration-150 active:scale-95 active:translate-y-1 active:shadow-sm`}
>
  Comenzar
</Link>
    
  </div>
  
  ))}
</div>
  </div>
  {popupTema && (
  <div className="fixed inset-0 z-[] bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white text-slate-900 rounded-2xl shadow-xl border p-5 w-full max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">
          {popupTema.nombre}
        </h3>

        <button
          onClick={() => setPopupTema(null)}
          className="text-slate-500 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-3 text-sm">
  <p>📊 Precisión: {progresoPopup?.precision || 0}%</p>

  <div>
    <div className="flex justify-between text-xs mb-1">
      <span>Progreso</span>
      <span>{progresoPopup?.porcentajeAvance || 0}%</span>
    </div>

    <div className="w-full bg-slate-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full"
        style={{ width: `${progresoPopup?.porcentajeAvance || 0}%` }}
      ></div>
    </div>
  </div>

  <p>🔥 Racha: {rachaEstudio} días</p>
  <p>📝 Resueltas: {progresoPopup?.avance || 0}</p>
  <p>
    🏆 Mejor resultado: {progresoPopup?.mejorResultado || 0}/
    {progresoPopup?.mejorTotal || 20}
  </p>
</div>
    </div>
  </div>
)}
  <div className="bg-white rounded-2xl shadow-md p-3 mb-6 border border-blue-500">
  <div className="grid grid-cols-3 gap-3 items-center">

    <div>
      <h2 className="text-sm font-extrabold text-blue-600 mb-2">
      {(temaMovilActivo ?? temas[0]).nombre}
      </h2>

      <div className="flex items-center gap-1">
        <div className="text-4xl">🏆</div>

        <p className="text-[10px] text-slate-700 leading-tight">
        {(temaMovilActivo ?? temas[0]).desc}
        </p>
      </div>

      <div className="bg-blue-100 rounded-xl text-center text-blue-600 text-xs mt-3 py-1">
      {(temaMovilActivo ?? temas[0]).preguntas}
      </div>
    </div>

    <div className="text-center border-x border-slate-300 px-1">
    <InfoTooltip texto="Muestra tu avance total de respuestas del tema seleccionado.">
      <h2 className="text-sm font-extrabold mb-2">
        Avance general
      </h2>
      </InfoTooltip>

      <div className="w-24 h-24 rounded-full border-[12px] border-blue-100 flex items-center justify-center mx-auto">
        <span className="text-xl font-extrabold">
          {progresoPopup?.porcentajeAvance || 0}%
        </span>
      </div>
    </div>

    <div className="text-center space-y-8">
      <div>
      <InfoTooltip texto="Número de respuestas correctas de tu último examen.">
        <p className="text-sm font-bold">❔ Respuestas correctas</p>
        </InfoTooltip>
        <p className="text-x1 font-extrabold">
        {progresoPopup?.ultimoResultado || 0}/{progresoPopup?.ultimoTotal || 20}
        </p>
      </div>

      <div>
      <InfoTooltip texto="Porcentaje de respuestas correctas de tu último examen.">
        <p className="text-sm font-bold">🎯 Precisión</p>
        </InfoTooltip>
        <p className="text-x1 font-extrabold">
          {progresoPopup?.precision || 0}%
        </p>
      </div>
    </div>

  </div>

  <div className="grid grid-cols-2 gap-3 mt-3">
    <div className="bg-blue-50 rounded-2xl p-3">
      <p className="text-sm font-bold">Tiempo promedio</p>
      <p className="text-sm font-extrabold">
        {progresoPopup?.tiempo || "--:--"}
      </p>
    </div>

    <div className="bg-blue-50 rounded-2xl p-3">
      <p className="text-sm font-bold">Última práctica</p>
      <p className="text-sm font-extrabold">
        {progresoPopup?.ultimaPractica || "Sin prácticas"}
      </p>
    </div>
  </div>
</div>
</div>
  <div className="hidden md:block">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside
  className={`relative ${
    sidebarOpen ? "w-[220px]" : "w-[80px]"
  } shrink-0 bg-[#001f5c] text-white hidden md:flex flex-col transition-all duration-300`}
>
<button
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className="absolute top-26 right-1 text-xl hover:bg-white/10 rounded-xl p-1 transition"
>
  ☰
</button>
          <div className="h-[96px] px-8 flex items-center gap-8 bg-[#062b73]">
            
            <div className="min-w-max">
            <h1 className="text-2xl font-semibold whitespace-nowrap">Ruta SERUMS </h1>
            <p className="text-base text-blue-100 whitespace-nowrap">Prepárate, práctica y aprueba</p>
            </div>
          </div>
          <Link
  href="/"
  className="flex items-center gap-3 px-9 py-6 ml-2 mt-8 rounded-xl hover:bg-blue-800 transition mb-1"
>
  <span className="text-2xl">🏠</span>

  <span className="font-semibold text-lg">
    Inicio
  </span>
</Link>
          <div className="px-8 py-7">
          {sidebarOpen && (
  <p className="text-sm font-bold text-blue-200 mb-5">
    TEMAS
  </p>
)}

            <div className="space-y-1">
              {temas.map((tema) => (
                <div
                key={tema.nombre}
              
                onClick={(e) => {
                  const progreso = JSON.parse(
                    localStorage.getItem(userKey(tema.progresoKey)) || "{}"
                  );
                  
                  if (popupTema?.nombre === tema.nombre) {
                    setPopupTema(null);
                  } else {
                    setProgresoPopup(progreso);
                    setPopupTema(tema);
                  }
                
                  setPopupPos({
                    top: e.currentTarget.offsetTop,
                    left:
                      e.currentTarget.offsetLeft +
                      e.currentTarget.offsetWidth +
                      12,
                  });
                }}
                                  
                    className="flex items-center gap-3 p-2 rounded-xl transition hover:bg-blue-900 w-full text-left cursor-pointer select-none"
      
                >
                  <span className={`${tema.color} w-10 h-10 rounded-xl flex items-center justify-center text-2xl`}>
                  <tema.icono size={34} strokeWidth={2.5} />
                  </span>
                  {sidebarOpen && (
  <span className="text-base font-semibold">
    {tema.nombre}
  </span>
)}
                </div>
              ))}
             <Link
  href="/flashcards"
  className={`flex items-center ${
    sidebarOpen
  ? "gap-3 p-2 justify-start"
  : "justify-center px-6 p-3"
  } rounded-xl transition hover:bg-blue-900`}
>
  <span className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-2xl">
    🗂️
  </span>

  {sidebarOpen && (
    <span className="text-base font-semibold">
      Flashcards
    </span>
  )}
</Link>
            </div>

            <div className="border-t border-blue-800 my-7"></div>

            {sidebarOpen && (
  <p className="text-sm font-bold text-blue-200 mb-5">
    MI PROGRESO
  </p>
)}
            <div className="space-y-5 text-lg">
            <Link href="/estadisticas" className="flex items-center gap-2">
  <span>📊</span>
  {sidebarOpen && <span>Estadísticas</span>}
</Link>

<Link href="/resueltas" className="flex items-center gap-2">
  <span>📚</span>
  {sidebarOpen && <span>Preguntas resueltas</span>}
</Link>

<Link href="/falladas" className="flex items-center gap-2">
  <span>❌</span>
  {sidebarOpen && <span>Preguntas falladas</span>}
</Link>

<Link href="/reforzamiento" className="flex items-center gap-2">
  <span>🧠</span>
  {sidebarOpen && <span>Reforzamiento</span>}
</Link>

<Link href="/historial" className="flex items-center gap-2">
  <span>🕒</span>
  {sidebarOpen && <span>Historial de simulacros</span>}
</Link>


              
          
            </div>

            <div className="border-t border-blue-800 my-7"></div>

            {sidebarOpen && (
  <p className="text-sm font-bold text-blue-200 mb-5">
    CONFIGURACIÓN
  </p>
)}
            <div className="space-y-5 text-lg">
            <Link href="/colabora" className="flex items-center gap-2">
  <span>🚀</span>
  {sidebarOpen && <span>Colabora</span>}
</Link>
<Link href="/soporte" className="flex items-center gap-2">
  <span>❓</span>
  {sidebarOpen && <span>Ayuda y Soporte</span>}
</Link>
            <Link href="/ajustes" className="flex items-center gap-2">
  <span>⚙️</span>
  {sidebarOpen && <span>Ajustes</span>}
</Link>

            </div>
          </div>
          {popupTema && (
  <div
  className="absolute bg-white text-slate-900 rounded-2xl shadow-xl border p-5 w-72 z-50"
  style={{
    top: popupPos.top,
    left: popupPos.left,
  }}
>
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-lg">
        {popupTema.nombre}
      </h3>

      <button
        onClick={() => setPopupTema(null)}
        className="text-slate-500 hover:text-red-500"
      >
        ✕
      </button>
    </div>

    <div className="space-y-3">
    <p>📊 Precisión: {progresoPopup?.precision || 0}%</p>
<p>🔥 Racha: {rachaEstudio} días</p>
<p>📝 Resueltas: {progresoPopup?.avance || 0}</p>
🏆 Mejor resultado: {progresoPopup?.mejorResultado || 0}/{progresoPopup?.mejorTotal || 20}

      <div>
      <div className="flex justify-between mb-1">
  <span className="text-sm">Precisión</span>

  <span className="text-sm font-bold">
    {progresoPopup?.precision || 0}%
  </span>
</div>

<div className="w-full bg-slate-200 rounded-full h-3">
  <div
    className="bg-blue-600 h-3 rounded-full"
    style={{
      width: `${progresoPopup?.precision || 0}%`,
    }}
  />
</div>
      </div>
    </div>
  </div>
)}
        </aside>

        {/* CONTENIDO */}
        <section className="flex-1">

          {/* HEADER */}
          <header className="h-[96px] bg-[#062b73] text-white px-8 flex items-center justify-end gap-6">
          {esPremium ? (
  <div className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold">
    👑 Premium Activo
  </div>
) : (
  <button
    onClick={() => setMostrarPremium(true)}
    className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-4 py-2 rounded-xl font-bold"
  >
    Ser Premium
  </button>
)}
         

            <div className="relative w-12 h-12 rounded-full bg-blue-900/60 flex items-center justify-center text-xl">
              🔔
              
            </div>

            <div className="w-14 h-14 rounded-full bg-white text-blue-900 flex items-center justify-center text-3xl">
              👤
            </div>

            {usuarioActual ? (
  <div className="relative">
    <button
      onClick={() => setMenuUsuarioOpen(!menuUsuarioOpen)}
      className="font-semibold hover:underline"
    >
      {usuarioActual.nombre || usuarioActual.correo}
    </button>

    <p className="text-sm text-blue-100">
      Mi cuenta
    </p>

    {menuUsuarioOpen && (
      <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-2xl shadow-xl p-3 z-[9999]">
     <button
  onClick={() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual") || "{}");

    setPerfilNombre(usuario.nombre || "");
    setPerfilCorreo(usuario.correo || "");
    setPerfilCelular(usuario.celular || "");
    setPerfilCiudad(usuario.ciudad || "");
    setMensajePerfil("");

    setModalPerfilOpen(true);
    setMenuUsuarioOpen(false);
  }}
  className="block w-full text-left px-3 py-2 hover:bg-slate-100 rounded-xl"
>
  Mi perfil
</button>

        <button
  onClick={() => {
    setModalPasswordOpen(true);
    setMenuUsuarioOpen(false);
    setMensajePassword("");
  }}
  className="block w-full text-left px-3 py-2 hover:bg-slate-100 rounded-xl"
>
  Cambiar contraseña
</button>
        <button
          onClick={() => {
            localStorage.removeItem("usuarioActual");
            localStorage.removeItem("premium");
            window.location.href = "/login";
          }}
          className="block w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-xl"
        >
          Cerrar sesión
        </button>
      </div>
    )}
  </div>
) : (
  <div>
    <Link
      href="/login"
      className="font-semibold hover:underline"
    >
      Iniciar sesión / Registrarse
    </Link>

    <p className="text-sm text-blue-100">
      Guarda tu progreso y estadísticas
    </p>
  </div>
)}
            
          </header>

          <div className="p-8">

            {/* BIENVENIDA */}
            <div className="relative bg-white rounded-3xl shadow-md border border-slate-100 p-4 mb-7 flex justify-between">
            <div className="absolute top-1 right-1 w-70 opacity-95 pointer-events-none">
  <img
    src="/logo.png.png"
    alt="Logo Banco SERUMS"
    className="w-full object-contain"
  />
</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">
                  ¡Bienvenido a Ruta SERUMS! 
                </h2>

                <p className="text-2x1 mb-4 leading-relaxed">
                  Plataforma de simulacros y banco de preguntas <br />
                  para el examen SERUMS.
                </p>

                <div className="grid grid-cols-3 gap-4 max-w-2xl">

                <div className="border border-slate-500 rounded-xl py-1 px-2 flex items-center gap-1">
    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl">
      ?
    </div>

        <div className="flex-2 text-center">
  <InfoTooltip texto="Muestra el número total de examenes realizados.">
    <p className="text-sm font-semibold">
  Total de Preguntas resueltas
</p>
</InfoTooltip>

<p className="text-2xl font-extrabold">
  {totalPreguntasResueltas}
</p>
    </div>
  </div>

  <div className="border border-slate-500 rounded-xl py-2 px-3 flex items-center gap-2 w-[210px]">
  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-xl">
      🎯
    </div>

        <div className="flex-1 text-center">
        <InfoTooltip texto="Porcentaje promedio de respuestas correctas de todos tus examenes.">
    <p className="text-sm font-semibold">
  Precisión promedio
</p>
</InfoTooltip>

<p className="text-2xl font-extrabold">
  {precisionPromedio}%
</p>
    </div>
  </div>

  <div className="border border-slate-500 rounded-xl p-2 flex items-center gap-1">
    <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl">
      🗓️
    </div>

    <div>
    <InfoTooltip texto="Días consecutivos en los que has practicado en la plataforma.">
    <p className="text-sm font-semibold">
  Racha de estudio
</p>
</InfoTooltip>

<p className="text-2xl font-extrabold">
  {rachaEstudio} días
</p>
    </div>
  </div>

</div>
              
</div>
            </div>

            {/* TARJETAS */}
            <h2 className="text-2xl font-bold mb-5">Elige un tema para comenzar</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 mb-7">
            {temas.map((tema) => (
  <div
    key={tema.nombre}
    onClick={() => {
      setTemaSeleccionado(tema);
    
      setTemaActivo(
        tema.nombre === "Salud Pública"
          ? "salud"
          : tema.nombre === "Gestión"
          ? "gestion"
          : tema.nombre === "Cuidado Integral"
          ? "cuidado"
          : tema.nombre === "Investigación"
          ? "investigacion"
          : tema.nombre === "Ética"
          ? "etica"
          : tema.nombre === "Simulacro Mixto"
          ? "mixto"
          : "salud"
      );
    }}
    className={`relative bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200 py-4 px-4 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col
      temaSeleccionado.nombre === tema.nombre
      ? tema.color === "bg-blue-600"
      ? "border-blue-600 border-2"
      : tema.color === "bg-green-600"
      ? "border-green-600 border-2"
      : tema.color === "bg-yellow-500"
      ? "border-yellow-500 border-2"
      : tema.color === "bg-purple-600"
      ? "border-purple-600 border-2"
      : tema.color === "bg-red-500"
      ? "border-red-500 border-2"
      : "border-orange-500 border-2"
        : "border-slate-200"
    }`}
  >            
                 {temaSeleccionado.nombre === tema.nombre && (
  <span
    className={`absolute right-3 top-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold ${
      tema.color === "bg-blue-600"
        ? "bg-blue-600"
        : tema.color === "bg-green-600"
        ? "bg-green-600"
        : tema.color === "bg-yellow-500"
        ? "bg-yellow-500"
        : tema.color === "bg-purple-600"
        ? "bg-purple-600"
        : tema.color === "bg-red-500"
        ? "bg-red-500"
        : "bg-orange-500"
    }`}
  >
    ✓
  </span>
)}
                  <div className={`${tema.color} w-15 h-15 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white`}>
                  <tema.icono size={34} strokeWidth={2.5} />
                  </div>

                  <h3 className="text-xl font-bold min-h-[56px] flex items-center justify-center">
  {tema.nombre}
</h3>

<p className="text-sm min-h-[72px] flex items-center justify-center">
  {tema.desc}
</p>

                  <div className="text-sm bg-slate-100 rounded-full px-3 py-2 my-4">
                    {tema.preguntas}
                  </div>

                  <button
  onClick={() => {
    const preguntasRespondidas = Number(
      localStorage.getItem(userKey("preguntasUsadasGratis")) || "0"
    );
    const usuarioRegistrado = localStorage.getItem("usuarioActual");

if (!usuarioRegistrado) {
  setMostrarModalLogin(true);
  return;
}
  
    if (!esPremium && preguntasRespondidas >= LIMITE_GRATIS) {
      setMostrarBloqueoPremium(true);
      return;
    }
  
    router.push(tema.ruta);
  }}
  className={`${tema.color} text-white rounded-2xl py-2 w-full font-bold cursor-pointer select-none`}
>
  Comenzar
</button>
                </div>
              ))}
            </div>

            {/* PANEL INFERIOR */}
            <div
  className={`relative bg-white border rounded-2xl p-4 shadow-sm grid grid-cols-1 xl:grid-cols-[1.2fr_1fr_1fr_0.8fr] gap-4 items-center ${
    temaSeleccionado.color === "bg-blue-600"
      ? "border-blue-600"
      : temaSeleccionado.color === "bg-green-600"
      ? "border-green-600"
      : temaSeleccionado.color === "bg-yellow-500"
      ? "border-yellow-500"
      : temaSeleccionado.color === "bg-purple-600"
      ? "border-purple-600"
      : temaSeleccionado.color === "bg-red-500"
      ? "border-red-500"
      : "border-orange-500"
  }`}
>
              <div className="flex items-center gap-4">
                <div className="text-7xl">🏆</div>

                <div>
                <h2
  className={`text-2xl font-bold mb-2 ${
    temaSeleccionado.color === "bg-blue-600"
      ? "text-blue-600"
      : temaSeleccionado.color === "bg-green-600"
      ? "text-green-600"
      : temaSeleccionado.color === "bg-yellow-500"
      ? "text-yellow-500"
      : temaSeleccionado.color === "bg-purple-600"
      ? "text-purple-600"
      : temaSeleccionado.color === "bg-red-500"
      ? "text-red-500"
      : "text-orange-500"
  }`}
>
  {temaSeleccionado.nombre}
</h2>
                  <p className="text-2x1 mb-4">
                    Pon a prueba tus conocimientos en administración en salud y normativas del sector.
                  </p>
                  <span
  className={`block w-fit mx-auto mt-3 px-3 py-1 rounded-lg text-center leading-tight ${
    temaSeleccionado.color === "bg-blue-600"
      ? "bg-blue-100 text-blue-700"
      : temaSeleccionado.color === "bg-green-600"
      ? "bg-green-100 text-green-700"
      : temaSeleccionado.color === "bg-yellow-500"
      ? "bg-yellow-100 text-yellow-700"
      : temaSeleccionado.color === "bg-purple-600"
      ? "bg-purple-100 text-purple-700"
      : temaSeleccionado.color === "bg-red-500"
      ? "bg-red-100 text-red-700"
      : "bg-orange-100 text-orange-700"
  }`}
>
<>
  980 preguntas
  <br />
  totales
</>
                  </span>
                </div>
              </div>

              <div className="absolute top-2 right-[220px] text-center">

  <p className="text 2x1 font-semibold text-slate-800">
    📘 Último examen
  </p>


</div>

<div className="border-l border-slate-400 pl-6 text-center">
<InfoTooltip texto="Muestra tu avance total de respuestas del tema seleccionado.">
              <p className="font-bold text-2xl mb-2 -mt-2">Avance general</p>
              </InfoTooltip>
              <div
  className={`w-40 h-40 rounded-full border-[16px] flex items-center justify-center text-3xl font-bold mx-auto ${
    temaSeleccionado.color === "bg-blue-600"
      ? "border-blue-600"
      : temaSeleccionado.color === "bg-green-600"
      ? "border-green-600"
      : temaSeleccionado.color === "bg-yellow-500"
      ? "border-yellow-500"
      : temaSeleccionado.color === "bg-purple-600"
      ? "border-purple-600"
      : temaSeleccionado.color === "bg-red-500"
      ? "border-red-500"
      : "border-orange-500"
  }`}
>
{progresoActual?.porcentajeAvance || 0}%
                </div>
              </div>

              <div className="border-l border-slate-200 pl-3 pt-3 space-y-3">
              <div>
              <InfoTooltip texto="Número de respuestas correctas de tu último examen.">
              <p className="font-bold text-xl text-slate-600">❔ Respuestas <br /> correctas</p>
              </InfoTooltip>
  <p className="text-2xl font-bold ">
  {progresoActual?.correctas || 0} / {progresoActual?.total || 20}
</p>
</div>

<div className="mt-8">
<InfoTooltip texto="Porcentaje de respuestas correctas de tu último examen.">
  <p className="font-bold text-xl text-slate-600">🎯 Precisión</p>
  </InfoTooltip>
  <p className="text-2xl font-bold">
  {progresoActual?.precision || 0}%
</p>
</div>
                
                
              </div>

              <div className="border-l border-slate-200 pl-0 -ml-20">
             
              <div className="mt-1 space-y-2">

  <div
  className={`rounded-xl p-4 ${
    temaSeleccionado.color === "bg-blue-600"
      ? "bg-blue-50"
      : temaSeleccionado.color === "bg-green-600"
      ? "bg-green-50"
      : temaSeleccionado.color === "bg-yellow-500"
      ? "bg-yellow-50"
      : temaSeleccionado.color === "bg-purple-600"
      ? "bg-purple-50"
      : temaSeleccionado.color === "bg-red-500"
      ? "bg-red-50"
      : "bg-orange-50"
  }`}
>
<p className="font-bold text-xl text-slate-600">
    Tiempo promedio
  </p>

  <p className="text-xl font-bold">
  {progresoActual?.tiempo || "--:--"}
  </p>
</div>

<div
  className={`rounded-xl p-4 ${
    temaSeleccionado.color === "bg-blue-600"
      ? "bg-blue-50"
      : temaSeleccionado.color === "bg-green-600"
      ? "bg-green-50"
      : temaSeleccionado.color === "bg-yellow-500"
      ? "bg-yellow-50"
      : temaSeleccionado.color === "bg-purple-600"
      ? "bg-purple-50"
      : temaSeleccionado.color === "bg-red-500"
      ? "bg-red-50"
      : "bg-orange-50"
  }`}
>
  <p className="font-bold text-xl text-slate-600">
    Última práctica
  </p>

  <p className="text-xl font-bold">
  {progresoActual?.ultimaPractica || "Sin prácticas"}
  </p>
</div>

</div> 
</div> 
</div>    
</div>     
{mostrarModalLogin && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-8 text-white shadow-2xl">

      <div className="text-5xl text-center mb-4">
        🔐
      </div>

      <h2 className="text-3xl font-bold text-center mb-4">
        Inicia sesión o regístrate
      </h2>

      <p className="text-slate-300 text-center leading-relaxed mb-6">
        Crea una cuenta gratuita para acceder a tus
        20 preguntas de prueba, estadísticas y reforzamiento.
      </p>

      <Link
        href="/login"
        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-2xl py-3 font-bold text-center block"
      >
        Iniciar sesión / Registrarse
      </Link>

      <button
        onClick={() => setMostrarModalLogin(false)}
        className="w-full mt-4 text-slate-400 hover:text-white transition"
      >
        Seguir explorando
      </button>

    </div>
  </div>
)}
{mostrarBloqueoPremium && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">

    <div className="bg-[#07142b] w-[420px] rounded-3xl p-8 text-white shadow-2xl border border-blue-900">

      <div className="text-6xl text-center mb-5">
        🔒
      </div>

      <h2 className="text-3xl font-bold text-center mb-4">
        Límite gratuito alcanzado
      </h2>

      <p className="text-slate-300 text-center leading-relaxed mb-6">
        Ya completaste tus preguntas gratuitas ✅
        <br /><br />
        Aún puedes revisar tus estadísticas, progreso y reforzamiento.
        <br /><br />
        Hazte Premium para desbloquear preguntas y simulacros SERUMS completos.
      </p>

      <button
      onClick={() => {
        setMostrarBloqueoPremium(false);
        setMostrarPremium(true);
      }}
        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-2xl py-3 text-xl font-bold mb-3"
      >
        👑 Hazte Premium
      </button>

      <button
        onClick={() => setMostrarBloqueoPremium(false)}
        className="w-full text-slate-400 hover:text-white transition"
      >
        Seguir explorando
      </button>

    </div>

  </div>
)}
</section>
</div>
<div className="fixed bottom-2 right-1 bg-slate-900 text-white rounded-2xl shadow-xl p-2 border border-slate-100 z-30 w-31">
  
  <p className="text-sm text-slate-200">
    🎯 Meta diaria
  </p>

  <p className="text-3xl font-bold text-center">
    {preguntasHoy}/{metaDiaria}
  </p>

  <div className="w-full bg-slate-800 rounded-full h-2 mt-1">

    <div
      className="bg-blue-500 h-1 rounded-full"
      style={{
        width: `${Math.min(
          (preguntasHoy / metaDiaria) * 100,
          100
        )}%`,
      }}
    ></div>

  </div>

</div>

</div>
{modalPerfilOpen && (
  <div className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center p-4">
    <div className="bg-white text-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl">
      <h2 className="text-2xl font-bold text-blue-950 mb-4">
        Mi perfil
      </h2>

      <label className="block text-sm font-bold text-slate-600 mb-1">
        Nombre
      </label>
      <input
        type="text"
        value={perfilNombre}
        onChange={(e) => setPerfilNombre(e.target.value)}
        className="w-full border border-slate-300 rounded-xl p-3 mb-3"
      />

      <label className="block text-sm font-bold text-slate-600 mb-1">
        Correo
      </label>
      <input
        type="email"
        value={perfilCorreo}
        disabled
        className="w-full border border-slate-300 rounded-xl p-3 mb-3 bg-slate-100 text-slate-500"
      />

      <label className="block text-sm font-bold text-slate-600 mb-1">
        Celular
      </label>
      <input
        type="tel"
        value={perfilCelular}
        onChange={(e) => setPerfilCelular(e.target.value)}
        placeholder="Ej. 987654321"
        className="w-full border border-slate-300 rounded-xl p-3 mb-3"
      />

      <label className="block text-sm font-bold text-slate-600 mb-1">
        Ciudad
      </label>
      <input
        type="text"
        value={perfilCiudad}
        onChange={(e) => setPerfilCiudad(e.target.value)}
        placeholder="Ej. Tumbes"
        className="w-full border border-slate-300 rounded-xl p-3 mb-3"
      />

      <div className="bg-blue-50 text-blue-800 rounded-xl p-3 mb-3 text-sm font-bold">
        Tipo de cuenta:{" "}
        {localStorage.getItem("premium") === "true" ? "Premium" : "Gratis"}
      </div>

      {mensajePerfil && (
        <p className="text-sm text-green-600 mb-3 font-semibold">
          {mensajePerfil}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => {
            setModalPerfilOpen(false);
            setMensajePerfil("");
          }}
          className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold"
        >
          Cancelar
        </button>

        <button
          onClick={() => {
            const usuario = JSON.parse(localStorage.getItem("usuarioActual") || "{}");

            const usuarioActualizado = {
              ...usuario,
              nombre: perfilNombre,
              correo: perfilCorreo || usuario.correo,
              celular: perfilCelular,
              ciudad: perfilCiudad,
            };

            localStorage.setItem("usuarioActual", JSON.stringify(usuarioActualizado));
            setUsuarioActual(usuarioActualizado);
            setMensajePerfil("Perfil actualizado correctamente.");

            setTimeout(() => {
              setModalPerfilOpen(false);
              setMensajePerfil("");
            }, 800);
          }}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}
{mostrarPremiumActivado && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
      <div className="text-6xl mb-4">
        🎉
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
        Cuenta Premium activada
      </h2>

      <p className="text-slate-600 leading-relaxed mb-6">
        Tu acceso Premium ya está activo. Ya puedes usar todas las preguntas,
        simulacros y funciones desbloqueadas.
      </p>

      <button
        onClick={() => {
          setMostrarPremiumActivado(false);
          window.location.reload();
        }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl"
      >
        Actualizar mi cuenta
      </button>
    </div>
  </div>
)}
{modalPasswordOpen && (
  <div className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center p-4">
    <div className="bg-white text-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl">
      <h2 className="text-2xl font-bold text-blue-950 mb-4">
        Cambiar contraseña
      </h2>

      <input
        type="password"
        placeholder="Contraseña actual"
        value={passwordActual}
        onChange={(e) => setPasswordActual(e.target.value)}
        className="w-full border border-slate-300 rounded-xl p-3 mb-3"
      />

      <input
        type="password"
        placeholder="Nueva contraseña"
        value={passwordNueva}
        onChange={(e) => setPasswordNueva(e.target.value)}
        className="w-full border border-slate-300 rounded-xl p-3 mb-3"
      />

      <input
        type="password"
        placeholder="Repetir nueva contraseña"
        value={passwordNueva2}
        onChange={(e) => setPasswordNueva2(e.target.value)}
        className="w-full border border-slate-300 rounded-xl p-3 mb-3"
      />

      {mensajePassword && (
        <p className="text-sm text-red-600 mb-3 font-semibold">
          {mensajePassword}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => {
            setModalPasswordOpen(false);
            setPasswordActual("");
            setPasswordNueva("");
            setPasswordNueva2("");
            setMensajePassword("");
          }}
          className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold"
        >
          Cancelar
        </button>

        <button
          onClick={() => {
            const usuario = JSON.parse(
              localStorage.getItem("usuarioActual") || "{}"
            );

            if (!passwordActual.trim()) {
              setMensajePassword("Debes ingresar tu contraseña actual.");
              return;
            }

            if (passwordActual !== usuario.password) {
              setMensajePassword("La contraseña actual no es correcta.");
              return;
            }

            if (!passwordNueva.trim()) {
              setMensajePassword("Debes ingresar una nueva contraseña.");
              return;
            }

            if (passwordNueva.length < 6) {
              setMensajePassword("La nueva contraseña debe tener mínimo 6 caracteres.");
              return;
            }

            if (passwordNueva === usuario.password) {
              setMensajePassword("La nueva contraseña debe ser diferente a la actual.");
              return;
            }

            if (passwordNueva !== passwordNueva2) {
              setMensajePassword("Las nuevas contraseñas no coinciden.");
              return;
            }

            const usuarioActualizado = {
              ...usuario,
              password: passwordNueva,
            };

            localStorage.setItem(
              "usuarioActual",
              JSON.stringify(usuarioActualizado)
            );

            setUsuarioActual(usuarioActualizado);
            setPasswordActual("");
            setPasswordNueva("");
            setPasswordNueva2("");
            setMensajePassword("");
            setModalPasswordOpen(false);

            mostrarAlertaBonita("Contraseña actualizada correctamente");
          }}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}
{mostrarPremium && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999] px-4">
    <div className="bg-white text-slate-900 rounded-3xl p-8 w-full max-w-lg relative shadow-2xl">

      <button
        onClick={() => setMostrarPremium(false)}
        className="absolute top-4 right-5 text-3xl font-bold text-slate-400 hover:text-slate-700"
      >
        ×
      </button>

      <h2 className="text-3xl font-extrabold mb-3 text-center">
        🌟 Acceso Premium
      </h2>

      <p className="text-center text-slate-600 mb-6">
        Desbloquea todo el banco SERUMS y prepárate.
      </p>

      <div className="space-y-3 mb-6 text-lg">
      <p>✅ Más de 2300 preguntas  </p>
        <p>✅ simulacros ilimitados </p>
        <p>✅ Todas las áreas desbloqueadas</p>
        <p>✅ Historial completo</p>
        <p>✅ Estadísticas y progreso completo</p>
        <p>✅ Reforzamiento inteligente</p>
        <p>✅ Página de preguntas falladas</p>
      </div>

      <span className="text-center blocktext-slate-500 text-xl">
  Pago único:
</span>

<span className="text-center block text-4xl font-extrabold text-green-600">
  S/. 20
</span>

      <button
  onClick={() => {
    
    const usuario = JSON.parse(
      localStorage.getItem("usuarioActual") || "{}"
    );
  
    setNombrePago(usuario.nombre || "");
    setCorreoPago(usuario.correo || "");
  
    setMostrarPagoPremium(true);
  }}
  style={{ WebkitTapHighlightColor: "transparent" }}
  className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-150 active:scale-95 active:translate-y-1"
>
  Pagar
</button>

      </div>
</div>
)}
{mostrarPagoEnviado && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
      <div className="text-6xl mb-4">
        ✅
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
        Solicitud enviada
      </h2>

      <p className="text-slate-600 leading-relaxed mb-6">
        Su pago será verificado y su cuenta será activada en las próximas horas.
      </p>

      <button
        onClick={() => setMostrarPagoEnviado(false)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl"
      >
        Entendido
      </button>
    </div>
  </div>
)}
{mostrarPagoPremium && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999] px-4">
    <div className="bg-white text-slate-900 rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
      <button
        onClick={() => setMostrarPagoPremium(false)}
        className="absolute top-4 right-5 text-2xl font-bold text-slate-400 hover:text-slate-700"
      >
        ×
      </button>

      <h2 className="text-2xl font-extrabold mb-4 text-blue-950">
        Pago Premium
      </h2>

      <p className="text-center font-bold text-slate-700 mb-2">
        Escanea el QR con Yape
      </p>

      <img
        src="/qr-yape.png"
        alt="QR Yape"
        className="w-40 mx-auto mb-4"
      />

      <input
        type="text"
        placeholder="Nombre de usuario"
        value={nombrePago}
        onChange={(e) => setNombrePago(e.target.value)}
        className="w-full border border-slate-300 rounded-xl p-3 mb-3"
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        value={correoPago}
        onChange={(e) => setCorreoPago(e.target.value)}
        className="w-full border border-slate-300 rounded-xl p-3 mb-3"
      />

      <input
        type="text"
        placeholder="Código de comprobante"
        value={codigoPago}
        onChange={(e) => setCodigoPago(e.target.value)}
        className="w-full border border-slate-300 rounded-xl p-3 mb-3"
      />

<input
  key={voucherPago ? voucherPago.name : "sin-voucher"}
  type="file"
  accept="image/*,.pdf"
  id="voucher"
  className="hidden"
  onChange={(e) => setVoucherPago(e.target.files?.[0] || null)}
/>

<div className="mb-4">
  {!voucherPago ? (
    <label
      htmlFor="voucher"
      className="cursor-pointer block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition"
    >
      📎 Subir foto del comprobante
    </label>
  ) : (
    <div className="flex items-center justify-between bg-green-100 border border-green-300 rounded-xl px-4 py-3">
      <span className="text-green-800 font-semibold truncate">
        ✅ {voucherPago.name}
      </span>

      <button
        type="button"
        onClick={() => {
          setVoucherPago(null);
        }}
        className="ml-3 text-red-500 hover:text-red-700 text-xl"
      >
        🗑️
      </button>
    </div>
  )}
</div>

<button
  onClick={async () => {
    if (!voucherPago) {
      mostrarAlertaBonita("Debes adjuntar el voucher.");
      return;
    }
    
    const nombreArchivo = `${Date.now()}-${voucherPago.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from("vouchers-premium")
      .upload(nombreArchivo, voucherPago);
    
    if (uploadError) {
      mostrarAlertaBonita("Error al subir voucher: " + uploadError.message);
      return;
    }
    
    const { data: urlData } = supabase.storage
      .from("vouchers-premium")
      .getPublicUrl(nombreArchivo);
    
    const { error } = await supabase
      .from("solicitudes_premium")
      .insert([
        {
          nombre: nombrePago,
          correo: correoPago,
          codigo_pago: codigoPago,
          voucher_url: urlData.publicUrl,
          estado: "pendiente",
        },
      ]);
    
    if (error) {
      mostrarAlertaBonita("Error al enviar solicitud: " + error.message);
      return;
    }
    
    setNombrePago("");
setCorreoPago("");
setCodigoPago("");
setVoucherPago(null);
setMostrarPagoPremium(false);
setMostrarPagoEnviado(true);
  }}
  style={{ WebkitTapHighlightColor: "transparent" }}
  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl text-lg shadow-lg transition-all duration-150 active:scale-90 active:translate-y-2 active:shadow-none"
>
  Enviar solicitud
</button>
    </div>
  </div>
)}
{mostrarModalMensaje && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-7 text-center">
      <div className="text-5xl mb-4">
        ⚠️
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
        Atención
      </h2>

      <p className="text-slate-600 leading-relaxed mb-6">
        {modalMensaje}
      </p>

      <button
        onClick={() => setMostrarModalMensaje(false)}
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