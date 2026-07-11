"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  CalendarDays,
  Clock3,
  FlaskConical,
  HeartPulse,
  Lightbulb,
  Scale,
  Target,
  Trophy,
  Users,
} from "lucide-react";

const beneficios = [
  {
    titulo: "Material exclusivo por cada bloque",
    descripcion: "Resúmenes finales, tablas y esquemas para cada área.",
    icono: BookOpen,
    iconClass: "benefitIcon purple",
  },
  {
    titulo: "Banco dirigido",
    descripcion: "Preguntas seleccionadas de alta probabilidad según estadísticas RutaSERUMS.",
    icono: Target,
    iconClass: "benefitIcon green",
  },
  {
    titulo: "Resolución de convocatorias pasadas",
    descripcion: "Análisis y explicación de exámenes anteriores para que practiques como en el examen real.",
    icono: CalendarDays,
    iconClass: "benefitIcon red",
  },
  {
    titulo: "Tips de descarte",
    descripcion: "Estrategias efectivas para eliminar opciones incorrectas y aumentar tu puntaje.",
    icono: Lightbulb,
    iconClass: "benefitIcon yellow",
  },
  {
    titulo: "Simulacros + Ranking",
    descripcion: "Compite en ranking en vivo y mide tu nivel con simulacros exclusivos.",
    icono: Trophy,
    iconClass: "benefitIcon orange",
  },
  {
    titulo: "Errores frecuentes",
    descripcion: "Reforzamos las preguntas donde más fallan los postulantes.",
    icono: BarChart3,
    iconClass: "benefitIcon rose",
  },
  
];

const menuTemas = [
  { href: "/salud-publica/configurar", label: "Salud Pública", icon: Users, tono: "blue" },
  { href: "/gestion/configurar", label: "Gestión", icon: BarChart3, tono: "green" },
  { href: "/etica/configurar", label: "Ética", icon: Scale, tono: "red" },
  { href: "/investigacion/configurar", label: "Investigación", icon: FlaskConical, tono: "purple" },
  { href: "/cuidado-integral/configurar", label: "Cuidado Integral", icon: HeartPulse, tono: "yellow" },
  { href: "/simulacro-mixto/configurar", label: "Simulacro Mixto", icon: Trophy, tono: "orange" },
];

export default function MaratonesPage() {
  const router = useRouter();

  const [inscripcion, setInscripcion] = useState<any>(null);
  const [sesionesAlumno, setSesionesAlumno] = useState<any[]>([]);
  const [cargandoAlumno, setCargandoAlumno] = useState(true);
  const [correoAlumno, setCorreoAlumno] = useState("");
  const [inscritosGrupo1, setInscritosGrupo1] = useState(0);
  
  const grupos = [
    {
      id: 1,
      nombre: "CRONOGRAMA Y TEMARIO",
      tema: "blue",
      inscritos: inscritosGrupo1,
      cuposTotales: 300,
      sesiones: [
        { dia: "DÍA 1", fecha: "30", mes: "JULIO", area: "SALUD PÚBLICA", descripcion: "Epidemiología, promoción, programas de salud, indicadores y más.", icono: Users, tono: "blue" },
        { dia: "DÍA 2", fecha: "01", mes: "AGOSTO", area: "INVESTIGACIÓN + ÉTICA", descripcion: "Metodología de investigación, bioestadística, ética y normativa legal.", icono: FlaskConical, tono: "purple" },
        { dia: "DÍA 3", fecha: "05", mes: "AGOSTO", area: "GESTIÓN", descripcion: "Administración, planificación, financiamiento, recursos humanos y más.", icono: BarChart3, tono: "green" },
        { dia: "DÍA 4", fecha: "07", mes: "AGOSTO", area: "CUIDADO INTEGRAL", descripcion: "Medicina, cirugía, gineco, pediatría, emergencias y más.", icono: HeartPulse, tono: "yellow" },
      ],
    },
    ];
  const cargarAlumno = async (correo: string) => {
    try {
      const respuesta = await fetch(
        `/api/maratones/mi-inscripcion?correo=${encodeURIComponent(   
          correo 
        )}`,
        {
          cache: "no-store",
        }
      );
  
      const resultado = await respuesta.json();
  
      if (!respuesta.ok) {
        console.error(resultado.error);
        return;
      }
  
      setInscripcion(resultado.inscripcion);
      setSesionesAlumno(resultado.sesiones || []);
    } catch (error) {
      console.error("Error cargando matrícula:", error);
    } finally {
      setCargandoAlumno(false);
    }
  };
  
  
  /* CARGA INICIAL */
  useEffect(() => {
    const usuario = JSON.parse(
      localStorage.getItem("usuarioActual") || "{}"
    );
  
    if (!usuario.correo) {
      setCargandoAlumno(false);
      return;
    }
  
    setCorreoAlumno(usuario.correo);
    cargarAlumno(usuario.correo);
  }, []);
  
  
  /* REVISAR CAMBIOS AUTOMÁTICAMENTE CADA 3 SEGUNDOS */
  useEffect(() => {
    if (!correoAlumno) return;
  
    const intervalo = setInterval(() => {
      cargarAlumno(correoAlumno);
    }, 3000);
  
    return () => {
      clearInterval(intervalo);
    };
  }, [correoAlumno]);

  const cargarCupos = async () => {
    try {
      const respuesta = await fetch("/api/maratones/cupos", {
        cache: "no-store",
      });
  
      const resultado = await respuesta.json();
  
      if (!respuesta.ok) {
        console.error("Error cargando cupos:", resultado.error);
        return;
      }
  
      setInscritosGrupo1(resultado.grupo1 || 0);
      
    } catch (error) {
      console.error("Error cargando cupos:", error);
    }
  };
  
  const obtenerTextoCupos = (
    cuposTotales: number,
    inscritos: number
  ) => {
    const restantes = Math.max(cuposTotales - inscritos, 0);
  
    if (restantes === 0) {
      return "Grupo completo";
    }
  
    if (restantes <= 5) {
      return `¡Últimos ${restantes} cupos!`;
    }
  
    if (restantes <= 50) {
      return `Quedan ${restantes} cupos`;
    }
  
    return "Cupos disponibles";
  };

  useEffect(() => {
    cargarCupos();
  
    const intervaloCupos = setInterval(() => {
      cargarCupos();
    }, 3000);
  
    return () => {
      clearInterval(intervaloCupos);
    };
  }, []);
  return (
    <main className="rfPage">
      <aside className="rfSidebar">
        <div className="brand">
          <img src="/logo.png" alt="Ruta SERUMS" />
          <div>
            <strong>Ruta SERUMS</strong>
            <span>Prepárate, práctica y aprueba</span>
          </div>
        </div>

        <nav>
          <Link className="navMain" href="/">⌂ <span>Inicio</span></Link>

          <p className="navTitle">TEMAS</p>
          {menuTemas.map(({ href, label, icon: Icon, tono }) => (
            <Link className="navItem" href={href} key={label}>
              <span className={`navIcon ${tono}`}><Icon size={21} /></span>
              <span>{label}</span>
            </Link>
          ))}

          <Link className="navItem" href="/flashcards">
            <span className="navIcon cyan">▣</span><span>Flashcards</span>
          </Link>
          <Link className="navItem" href="/regalo">
            <span className="navIcon pink">🎁</span><span>Regalo</span>
          </Link>

          <div className="navDivider" />
          <p className="navTitle">MI PROGRESO</p>
          <Link className="navSimple" href="/estadisticas">▥ <span>Estadísticas</span></Link>
          <Link className="navSimple" href="/resueltas">☷ <span>Preguntas</span></Link>
          <Link className="navSimple" href="/historial">◷ <span>Historial</span></Link>
          <Link className="navSimple" href="/falladas">☒ <span>Falladas</span></Link>
          <Link className="navSimple" href="/resueltas">☑ <span>Resueltas</span></Link>

          <Link className="navMaraton" href="/maratones">
            <span>🔥</span><strong>Maratones</strong><b>NUEVO</b>
          </Link>
        </nav>
      </aside>

      <section className="rfShell">
        <header className="rfTopbar">
          <button className="hamb">☰</button>
          <div className="topActions">
          
            <span className="bell">🔔<b>1</b></span>
            <span className="avatar">👨🏻‍⚕️</span>
            <div className="account"><strong>Elver</strong><span>Mi cuenta⌄</span></div>
          </div>
        </header>

        <div className="rfContent">
          <section className="heroCard">
            <div className="heroCopy">
              <div className="heroTitleRow">
                <h1>MARATON INTENSIVA SERUMS 2026-II</h1><span>🔥</span>
              </div>
              <div className="alertLine">
                <AlertCircle size={17} />
                <strong>Sprint final de 2 semanas para que llegues 100% preparado.</strong>
              </div>
              

              <div className="heroStats">
              <Stat
  icon={Clock3}
  title="Horario"
  value={
    <>
      <span className="horarioPc">7:00 p.m. - 3:00 a.m.</span>

      <span className="horarioMovil">
        7:00 p.m. -<br />
        3:00 a.m.
      </span>
    </>
  }
  sub="Cada día de preparación"
/>
                <Stat icon={CalendarDays} title="Examen" value="09" extra="AGOSTO" sub="" />
                <Stat icon={Users} title="Cupos limitados" value="300 por grupo" sub="¡Asegura tu cupo ahora!" />
                <Stat icon={Target} title="Inversión única" value="S/ 69" sub="Acceso a las 4 sesiones" />
              </div>
            </div>
            <img className="heroArtwork" src="/ruta-final-hero.png" alt="" />
          </section>

          <section className="benefitsBox">
            <h2>✦ ¿QUÉ INCLUYE LA MARATON INTENSIVA SERUMS?</h2>
            <div className="benefitsGrid">
              {beneficios.map(({ titulo, descripcion, icono: Icon, iconClass }) => (
                <article className="benefitCard" key={titulo}>
                  <span className={iconClass}><Icon size={25} /></span>
                  <h3>{titulo}</h3>
                  <p>{descripcion}</p>
                </article>
              ))}
            </div>
          </section>

          {/* MATRÍCULA PENDIENTE */}
{inscripcion?.estado === "pendiente" && (
  <section className="aprobadoBox">
    <div className="aprobadoHeader">
      <div className="check">⏳</div>

      <h3>Matrícula en revisión</h3>

      <p>
        Hemos recibido tu comprobante y estamos verificando el pago.
      </p>

      <p>
        Grupo seleccionado:{" "}
        <b>GRUPO {inscripcion.grupo}</b>
      </p>
    </div>
  </section>
)}

{/* MATRÍCULA APROBADA */}
{inscripcion?.estado === "aprobado" && (
  <section className="aprobadoBox">
    <div className="aprobadoHeader">
 
  <div className="aprobadoTexto">
    <span className="aprobadoEtiqueta">
      ACCESO CONFIRMADO
    </span>

    <h2>
      ¡Bienvenido a nuestra Maratón Intensiva!
    </h2>

    <p>
      Tu matrícula fue aprobada correctamente.
    </p>

    <div className="aprobadoDatos">
      <span>
        👥 GRUPO {inscripcion.grupo}
      </span>

      <span>
        🕖 7:00 p.m. - 3:00 a.m.
      </span>

      <span>
        🔥 4 noches intensivas
      </span>
    </div>
  </div>
</div>

    <div className="sesionesGrid">
      {sesionesAlumno.map((s: any) => (
        <div
        className={`sesionCard sesionTema${s.orden}`}
        key={s.id}
      >
        <div className="sesionBarra" />
      
        <div className="sesionCabecera">
          <div className="sesionIdentidad">
            <div className="sesionIcono">
              {s.orden === 1 && "👥"}
              {s.orden === 2 && "🩺"}
              {s.orden === 3 && "📋"}
              {s.orden === 4 && "🔬"}
            </div>
      
            <div className="sesionTituloBloque">
              <span className="sesionDia">
                DÍA {s.orden}
              </span>
      
              <h3>{s.area}</h3>
            </div>
          </div>
      
          <div className="sesionFecha">
            <span>📅</span>
      
            <strong>
              {new Date(s.fecha_inicio).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "long",
              })}
            </strong>
      
            <small>
              {new Date(s.fecha_inicio).getFullYear()}
            </small>
          </div>
        </div>
      
        <p className="sesionDescripcion">
          {s.descripcion}
        </p>
      
        <div className="sesionHora">
          <span>◷</span>
          <strong>7:00 p.m. - 3:00 a.m.</strong>
        </div>
      
        <div className="sesionBotones">
  {s.material_url ? (
    <a
      href={s.material_url}
      target="_blank"
      rel="noopener noreferrer"
      className="botonMaterialActivo"
    >
      📄 Abrir material
    </a>
  ) : (
    <button
      type="button"
      disabled
      className="botonMaterialBloqueado"
    >
      🔒 Material disponible próximamente
    </button>
  )}

  {s.link_clase ? (
    <a
      href={s.link_clase}
      target="_blank"
      rel="noopener noreferrer"
      className="botonClaseActivo"
    >
      ▶ Entrar a la clase
    </a>
  ) : (
    <button
      type="button"
      disabled
      className="botonClaseBloqueado"
    >
      🎥 Enlace de clase próximamente
    </button>
  )}
</div>
      </div>
      ))}
    </div>
  </section>
)}

{/* PERSONA SIN INSCRIPCIÓN */}
{!inscripcion && !cargandoAlumno && (
  <>
    <h2 className="groupsTitle">
  CONOCE EL CRONOGRAMA Y TEMARIO
</h2>

    <section className="groupsGrid">
      {grupos.map((grupo) => (
        <article className="groupCard" key={grupo.id}>
          <header className={`groupHeader ${grupo.tema}`}>
          <div>
  <BookOpen size={25} />
  <strong>{grupo.nombre}</strong>
  <span>Cupos limitados</span>
</div>

          </header>

          <div className="sessions">
            {grupo.sesiones.map((s) => {
              const Icon = s.icono;

              return (
                <div
                  className="session"
                  key={`${grupo.id}-${s.fecha}`}
                >
                  <div className="dateBox">
                    <small>{s.dia}</small>
                    <strong>{s.fecha}</strong>
                    <small>{s.mes}</small>
                  </div>

                  <span className={`sessionIcon ${s.tono}`}>
                    <Icon size={25} />
                  </span>

                  <div className="sessionCopy">
                    <h3 className={s.tono}>{s.area}</h3>
                    <p>{s.descripcion}</p>
                  </div>

                  <div className="timeBox">
                    <Clock3 size={14} />
                    <b>7:00 p.m.</b>
                    <span>a</span>
                    <b>3:00 a.m.</b>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className={`enroll ${grupo.tema}`}
            onClick={() =>
              router.push(
                `/maratones/inscripcion?grupo=${grupo.id}`
              )
            }
          >
            Inscribirme ahora {" "}
            <span>→</span>
          </button>
        </article>
      ))}
    </section>
  </>
)}

        </div>
      </section>

      <style jsx global>{`
        *{box-sizing:border-box} body{margin:0}
        .rfPage{min-height:100vh;background:#f4f8fd;color:#071d4b;display:flex;font-family:Arial,Helvetica,sans-serif}
        .rfSidebar{width:250px;min-height:100vh;background:linear-gradient(180deg,#001d58,#00184b);color:#fff;flex:0 0 250px}
       .brand{height:64px;background:#062b73;display:flex;align-items:center;gap:10px;padding:0 14px;overflow:hidden}
.brand img{width:45px;height:45px;object-fit:contain;flex-shrink:0}.brand div{display:flex;flex-direction:column;justify-content:center;min-width:0}.brand strong{font-size:18px;line-height:20px;display:block;white-space:nowrap}.brand span{font-size:10px;line-height:12px;color:#dbeafe;white-space:nowrap}
        .rfSidebar nav{padding:18px 14px}.navMain,.navItem,.navSimple,.navMaraton{color:#fff;text-decoration:none;display:flex;align-items:center;border-radius:9px}
        .navMain{gap:12px;padding:10px 14px;background:#123c82;font-weight:700;margin-bottom:18px}.navTitle{font-size:12px;font-weight:700;color:#cbd5e1;margin:16px 8px 10px}
        .navItem{gap:10px;padding:6px 8px;font-size:15px;font-weight:600}.navIcon{width:35px;height:35px;border-radius:9px;display:flex;align-items:center;justify-content:center}
        .navIcon.blue{background:#2563eb}.navIcon.green{background:#00a63d}.navIcon.red{background:#ff2f3a}.navIcon.purple{background:#8b16e8}.navIcon.yellow{background:#f2ae00}.navIcon.orange{background:#ff6500}.navIcon.cyan{background:#09a7c8}.navIcon.pink{background:#e50064}
        .navDivider{height:1px;background:#1d4e91;margin:18px 0}.navSimple{gap:10px;padding:8px 8px;font-size:15px}
        .navMaraton{margin-top:22px;padding:10px 12px;background:#123d84;gap:10px}.navMaraton b{margin-left:auto;background:#7c16e8;border-radius:10px;padding:3px 7px;font-size:10px}
        .rfShell{min-width:0;flex:1}.rfTopbar{height:64px;background:#062b73;display:flex;align-items:center;justify-content:space-between;padding:0 28px;color:#fff}
        .hamb{background:none;border:0;color:#fff;font-size:25px}.topActions{display:flex;align-items:center;gap:15px}.premium{background:#ffc400;color:#09225d;border:0;border-radius:10px;padding:10px 20px;font-weight:800}
        .bell{position:relative;font-size:20px}.bell b{position:absolute;right:-7px;top:-8px;background:red;color:#fff;border-radius:50%;font-size:10px;width:16px;height:16px;display:flex;align-items:center;justify-content:center}
        .avatar{width:44px;height:44px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:22px}.account{display:flex;flex-direction:column}.account span{font-size:12px;color:#dbeafe}
        .rfContent{
 padding:10px 20px 18px;
 max-width:1500px;
 margin:0 auto;
}
       .heroCard{
  min-height:250px;
  height:auto;
  background:#fff;
  border:1px solid #e5eaf2;
  border-radius:20px;
  display:grid;
  grid-template-columns:minmax(0,1fr) 420px;
  align-items:center;
  overflow:hidden;
  padding:18px 16px 18px 22px;
}
        .heroTitleRow{display:flex;align-items:center;gap:10px}.heroTitleRow h1{font-size:31px;line-height:1;margin:0;font-weight:900}.heroTitleRow span{font-size:30px}
        .alertLine{display:flex;align-items:center;gap:7px;color:#ef1b1b;margin-top:9px;font-size:14px}.heroSub{font-size:15px;margin:8px 0 14px}
        .heroStats{
  display:grid;
  grid-template-columns:1.45fr .85fr 1.05fr .85fr;
  gap:10px;
}
        .stat{
          min-width:0;
          height:95px;
          border:1px solid #d9e4f5;
          border-radius:12px;
          display:flex;
          align-items:center;
          gap:9px;
          padding:9px 10px;
          background:#fff;
        }
        .statIcon{
          width:42px;
          height:42px;
          border-radius:11px;
          background:#eef5ff;
          color:#0c5cff;
          display:flex;
          align-items:center;
          justify-content:center;
          flex:0 0 42px;
        }
        .stat>div{min-width:0}
        .stat small{
          display:block;
          font-size:10px;
          line-height:1.1;
          font-weight:700;
        }
        .stat strong{
          display:block;
          font-size:16px;
          line-height:1.05;
          font-weight:800;
        }
        .stat strong.nowrapValue{
          white-space:nowrap;
          font-size:14px;
        }
        .stat em{
          display:block;
          font-style:normal;
          font-size:11px;
          line-height:1.1;
          font-weight:800;
        }
        .stat p{
          margin:4px 0 0;
          font-size:9px;
          line-height:1.15;
          color:#4b5d79;
        }
        .heroArtwork{
 width:115%;
 height:115%;
 object-fit:contain;
}
        .benefitsBox{margin-top:14px;border:1.5px dashed #b26cff;border-radius:16px;padding:8px 14px 12px;background:#fff}.benefitsBox h2{font-size:13px;margin:0 0 8px;font-weight:900}
        .benefitsGrid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}.benefitCard{height:165px;border:1px solid #e2e7ef;border-radius:11px;padding:9px 8px;text-align:center;background:#fff}
        .benefitIcon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin:0 auto 8px}.benefitIcon.purple{background:#ece0ff;color:#7b18dd}.benefitIcon.green{background:#dff8e7;color:#078b39}.benefitIcon.red{background:#ffe2e5;color:#ff3b45}.benefitIcon.yellow{background:#fff4c8;color:#0055bd}.benefitIcon.orange{background:#ffe8c8;color:#ff7b00}.benefitIcon.rose{background:#ffe0e3;color:#f04452}.benefitIcon.cyan{background:#e0f7f7;color:#079c9e}
        .benefitCard h3{font-size:12px;line-height:1.25;margin:0 0 8px}.benefitCard p{font-size:10.5px;line-height:1.45;margin:0}
        .groupsTitle{font-size:14px;margin:10px 0 7px;font-weight:900}.groupsTitle span{color:#8b16e8;font-size:25px}
        .groupsGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.groupCard{background:#fff;border:1px solid #e1e7ef;border-radius:14px;overflow:hidden}
        .groupHeader{height:38px;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 12px}.groupHeader.blue{background:linear-gradient(90deg,#1059f2,#004bdc)}.groupHeader.green{background:linear-gradient(90deg,#07862e,#006821)}
        .groupHeader>div{display:flex;align-items:center;gap:8px}.groupHeader strong{font-size:18px}.groupHeader span{font-size:10px}.groupHeader b{font-size:15px;border:1px solid rgba(255,255,255,.45);border-radius:14px;padding:3px 10px}
        .sessions{padding:8px 10px 4px}.session{height:61px;border:1px solid #e0e6ee;border-radius:10px;display:grid;grid-template-columns:56px 46px minmax(0,1fr) 76px;align-items:center;gap:8px;padding:5px 7px;margin-bottom:7px}
        .dateBox{height:50px;border:1px solid #dce3ed;border-radius:8px;background:#f8fafc;display:flex;flex-direction:column;align-items:center;justify-content:center}.dateBox small{font-size:8px;font-weight:800}.dateBox strong{font-size:22px;line-height:1}
        .sessionIcon{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center}.sessionIcon.blue{background:#e3edff;color:#0f5ff7}.sessionIcon.yellow{background:#fff3c9;color:#f2a900}.sessionIcon.green{background:#e3f8e8;color:#078c39}.sessionIcon.purple{background:#efe2ff;color:#8b16e8}
        .sessionCopy h3{font-size:12px;margin:0 0 4px}.sessionCopy h3.blue{color:#0d5cf6}.sessionCopy h3.yellow{color:#f0a000}.sessionCopy h3.green{color:#078b39}.sessionCopy h3.purple{color:#8b16e8}.sessionCopy p{font-size:9px;line-height:1.35;margin:0;color:#253653}
        .timeBox{height:49px;border:1px solid #dbe7fb;background:#f4f8ff;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#0a57f4;font-size:9px;line-height:1.05}.timeBox span{font-size:8px}
        .enroll{height:36px;margin:0 10px 10px;width:calc(100% - 20px);border:0;border-radius:7px;color:#fff;font-weight:800;font-size:14px}.enroll.blue{background:#0e5af5}.enroll.green{background:#079534}.enroll span{font-size:20px;margin-left:12px}
        .trustStrip{display:block;width:100%;height:73px;object-fit:cover;margin-top:14px;border-radius:13px}
        .aprobadoBox{
 margin-top:30px;
}

.aprobadoHeader{
 background:linear-gradient(135deg,#eefbf4 0%,#ffffff 55%,#edf5ff 100%);
 border:1px solid #7ee2a8;
 border-radius:22px;
 padding:24px 28px;
 margin:20px 0 24px;
 display:flex;
 align-items:center;
 gap:22px;
 box-shadow:0 12px 30px rgba(15,23,42,.08);
 position:relative;
 overflow:hidden;
}

.aprobadoHeader::after{
 content:"";
 position:absolute;
 width:180px;
 height:180px;
 border-radius:50%;
 background:rgba(34,197,94,.08);
 right:-70px;
 top:-70px;
}

.aprobadoIcono{
 width:72px;
 height:72px;
 border-radius:20px;
 background:linear-gradient(135deg,#22c55e,#079447);
 display:flex;
 align-items:center;
 justify-content:center;
 font-size:38px;
 box-shadow:0 10px 22px rgba(34,197,94,.28);
 flex-shrink:0;
 z-index:1;
}

.aprobadoTexto{
 min-width:0;
 z-index:1;
}

.aprobadoEtiqueta{
 display:inline-block;
 background:#dcfce7;
 color:#087a35;
 border-radius:999px;
 padding:5px 10px;
 font-size:10px;
 font-weight:900;
 letter-spacing:.8px;
 margin-bottom:8px;
}

.aprobadoTexto h2{
 margin:0;
 font-size:25px;
 line-height:1.15;
 color:#071d4b;
 font-weight:900;
}

.aprobadoTexto p{
 margin:7px 0 14px;
 color:#475569;
 font-size:14px;
}

.aprobadoDatos{
 display:flex;
 flex-wrap:wrap;
 gap:9px;
}

.aprobadoDatos span{
 background:#fff;
 border:1px solid #dbe7f4;
 color:#17305f;
 border-radius:10px;
 padding:8px 11px;
 font-size:12px;
 font-weight:800;
}

.check{
 font-size:40px;
}

.sesionesGrid{
 display:grid;
 grid-template-columns:repeat(2,1fr);
 gap:22px;
}

.sesionCard{
  background:#ffffff;
  border:1px solid #e2e8f0;
  border-radius:22px;
  padding:28px;
  box-shadow:0 10px 28px rgba(15,23,42,.08);
  position:relative;
  overflow:hidden;
}

.sesionBarra{
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:7px;
  background:#0d63f7;
}

.sesionTema2 .sesionBarra{
  background:#ff8a00;
}

.sesionTema3 .sesionBarra{
  background:#079447;
}

.sesionTema4 .sesionBarra{
  background:#7c2be8;
}

.sesionCabecera{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:20px;
}

.sesionIdentidad{
  display:flex;
  align-items:center;
  gap:18px;
  min-width:0;
}

.sesionIcono{
  width:74px;
  height:74px;
  border-radius:50%;
  background:#eaf2ff;
  color:#0d63f7;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:35px;
  flex-shrink:0;
}

.sesionTema2 .sesionIcono{
  background:#fff2d9;
  color:#ff8a00;
}

.sesionTema3 .sesionIcono{
  background:#e5f8ec;
  color:#079447;
}

.sesionTema4 .sesionIcono{
  background:#f0e8ff;
  color:#7c2be8;
}

.sesionTituloBloque{
  min-width:0;
}

.sesionDia{
  display:inline-block;
  background:#0d63f7;
  color:#fff;
  padding:7px 15px;
  border-radius:11px;
  font-size:12px;
  font-weight:900;
  line-height:1;
  margin-bottom:10px;
}

.sesionTema2 .sesionDia{
  background:#ff8a00;
}

.sesionTema3 .sesionDia{
  background:#079447;
}

.sesionTema4 .sesionDia{
  background:#7c2be8;
}

.sesionTituloBloque h3{
  margin:0;
  color:#071d4b;
  font-size:26px;
  line-height:1.15;
  font-weight:900;
}

.sesionFecha{
  min-width:155px;
  background:#eef5ff;
  border:1px solid #d5e4ff;
  border-radius:15px;
  padding:13px 15px;
  display:grid;
  grid-template-columns:auto 1fr;
  column-gap:9px;
  align-items:center;
  color:#123f88;
  text-align:left;
}

.sesionTema2 .sesionFecha{
  background:#fff6df;
  border-color:#ffe2a3;
  color:#a64f00;
}

.sesionTema3 .sesionFecha{
  background:#ebf9ef;
  border-color:#c9efd6;
  color:#08783a;
}

.sesionTema4 .sesionFecha{
  background:#f4ecff;
  border-color:#e2d0ff;
  color:#6b20c8;
}

.sesionFecha span{
  grid-row:1 / span 2;
  font-size:22px;
}

.sesionFecha strong{
  font-size:15px;
  line-height:1.2;
  font-weight:900;
}

.sesionFecha small{
  font-size:12px;
  font-weight:800;
}

.sesionDescripcion{
  margin:22px 0 16px;
  color:#475569;
  font-size:16px;
  line-height:1.55;
}

.sesionHora{
  display:inline-flex;
  align-items:center;
  gap:9px;
  margin-top:6px;
  padding:11px 16px;
  border-radius:12px;
  background:#eef5ff;
  color:#0d63f7;
  font-size:15px;
  font-weight:900;
}

.sesionTema2 .sesionHora{
  background:#fff5df;
  color:#ef7900;
}

.sesionTema3 .sesionHora{
  background:#eaf8ef;
  color:#078b39;
}

.sesionTema4 .sesionHora{
  background:#f3ebff;
  color:#7625db;
}

.sesionBotones{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:18px;
  margin-top:24px;
}

.sesionBotones button,
.sesionBotones a{
  min-height:76px;
  border-radius:15px;
  padding:15px 18px;
  border:0;
  font-size:16px;
  line-height:1.35;
  font-weight:900;
  text-decoration:none;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
}

.sesionBotones button:first-child,
.sesionBotones a:first-child{
  background:#eef5ff;
  color:#0d63f7;
  border:1px solid #d6e5ff;
}

.sesionBotones button:last-child,
.sesionBotones a:last-child{
  background:#0d63f7;
  color:#fff;
}

.sesionTema2 .sesionBotones button:first-child,
.sesionTema2 .sesionBotones a:first-child{
  background:#fff6df;
  color:#e97800;
  border-color:#ffe3ab;
}

.sesionTema2 .sesionBotones button:last-child,
.sesionTema2 .sesionBotones a:last-child{
  background:#ff7900;
}

.sesionTema3 .sesionBotones button:first-child,
.sesionTema3 .sesionBotones a:first-child{
  background:#eaf8ef;
  color:#078b39;
  border-color:#cdeed8;
}

.sesionTema3 .sesionBotones button:last-child,
.sesionTema3 .sesionBotones a:last-child{
  background:#079447;
}

.sesionTema4 .sesionBotones button:first-child,
.sesionTema4 .sesionBotones a:first-child{
  background:#f3ebff;
  color:#7625db;
  border-color:#e1d0ff;
}

.sesionTema4 .sesionBotones button:last-child,
.sesionTema4 .sesionBotones a:last-child{
  background:#7625db;
}

.sesionBotones button:disabled{
  opacity:1;
  cursor:not-allowed;
}
  .botonMaterialActivo,
.botonMaterialBloqueado,
.botonClaseActivo,
.botonClaseBloqueado{
  min-height:76px;
  border-radius:15px;
  padding:15px 18px;
  border:0;
  font-size:16px;
  line-height:1.35;
  font-weight:900;
  text-decoration:none;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
}

.botonMaterialActivo{
  background:#0d63f7;
  color:#fff;
}

.botonMaterialActivo:hover{
  background:#0756dc;
}

.botonMaterialBloqueado{
  background:#eef5ff;
  color:#6b7b91;
  border:1px solid #d6e5ff;
  cursor:not-allowed;
}

.botonClaseActivo{
  background:#ff0000;
  color:#fff;
}

.botonClaseActivo:hover{
  background:#d90000;
}

.botonClaseBloqueado{
  background:#e8eef6;
  color:#6b7b91;
  cursor:not-allowed;
}
  .horarioPc{
  display:inline;
}

.horarioMovil{
  display:none;
}
        @media(max-width:1100px){

.rfSidebar{
 display:none;
}

.heroCard{
 height:auto;
 grid-template-columns:1fr;
}

.heroArtwork{
 display:none;
}

.benefitsGrid{
 grid-template-columns:repeat(2,1fr);
}

.groupsGrid{
 grid-template-columns:1fr;
}

.rfContent{
 padding:12px;
}

.heroStats{
 grid-template-columns:repeat(2,1fr);
}

.trustStrip{
 display:none;
}

.aprobadoHeader{
 padding:18px;
 gap:14px;
 align-items:flex-start;
}

.aprobadoIcono{
 width:55px;
 height:55px;
 border-radius:16px;
 font-size:28px;
}

.aprobadoTexto h2{
 font-size:19px;
}

.aprobadoDatos{
 flex-direction:column;
}

.aprobadoDatos span{
 width:100%;
}
.sesionesGrid{
 grid-template-columns:1fr;
}

.sesionCabecera{
 flex-direction:column;
 align-items:flex-start;
}

.sesionFecha{
 width:100%;
}

.sesionBotones{
 flex-direction:column;
}


.sesionInfo button,
.sesionInfo a{
 width:100%;
}

}
.sesionBotones{
  grid-template-columns:1fr;
  gap:10px;
}

.sesionBotones button,
.sesionBotones a{
  min-height:58px;
}

.botonMaterialActivo,
.botonMaterialBloqueado,
.botonClaseActivo,
.botonClaseBloqueado{
    min-height:58px;
    font-size:14px;
    padding:12px;
}
    
.sesionDescripcion{
  font-size:14px;
}

.sesionHora{
  font-size:13px;
  padding:9px 12px;
}

/* CRONOGRAMA MÓVIL */

.groupCard{
  border-radius:18px;
}

.groupHeader{
  height:auto;
  min-height:64px;
  padding:12px 14px;
  align-items:center;
}

.groupHeader > div{
  align-items:center;
  gap:10px;
}

.groupHeader strong{
  font-size:17px;
  line-height:1.1;
}

.groupHeader span{
  display:block;
  font-size:10px;
  line-height:1.2;
}

.sessions{
  padding:10px;
}

.session{
  height:auto;
  min-height:0;
  display:grid;
  grid-template-columns:64px minmax(0,1fr);
  grid-template-areas:
    "date title"
    "date description"
    "date time";
  gap:4px 10px;
  padding:12px;
  margin-bottom:10px;
  align-items:start;
}

.dateBox{
  grid-area:date;
  width:64px;
  height:auto;
  min-height:92px;
  padding:8px 4px;
  align-self:stretch;
}

.dateBox small{
  font-size:9px;
}

.dateBox strong{
  font-size:28px;
}

.sessionIcon{
  display:none;
}

.sessionCopy{
  display:contents;
}

.sessionCopy h3{
  grid-area:title;
  margin:0;
  font-size:15px;
  line-height:1.2;
  font-weight:900;
}

.sessionCopy p{
  grid-area:description;
  margin:2px 0 0;
  font-size:11px;
  line-height:1.35;
  color:#334155;
}

.timeBox{
  grid-area:time;
  width:max-content;
  min-width:0;
  height:auto;
  margin-top:7px;
  padding:7px 10px;
  border-radius:9px;
  display:flex;
  flex-direction:row;
  align-items:center;
  gap:5px;
  font-size:10px;
  line-height:1;
}

.timeBox span{
  display:none;
}

.timeBox b{
  font-size:10px;
  line-height:1;
}

.enroll{
  height:48px;
  margin:2px 10px 10px;
  width:calc(100% - 20px);
  font-size:15px;
}
  
 .heroStats .stat:first-child em{
  font-size:9px;
  line-height:1.1;
  white-space:nowrap;
  letter-spacing:-0.25px;
  overflow:visible;
}
  .heroStats .stat:first-child{
  padding-left:8px;
  padding-right:6px;
}

.heroStats .stat:first-child > div:last-child{
  min-width:0;
  }       
  .horarioPc{
  display:none;
}

.horarioMovil{
  display:inline;
  font-size:11px;
  line-height:1.15;
}
  `}</style>
    </main>
  );
}

function Stat({
  icon: Icon,
  title,
  value,
  sub,
  extra,
}: {
  icon: React.ElementType;
  title: string;
  value: React.ReactNode;
  sub: string;
  extra?: string;
}) {
  return (
    <div className="stat">
      <span className="statIcon"><Icon size={24} /></span>
      <div>
        <small>{title}</small>
        <strong className={title === "Horario" ? "nowrapValue" : ""}>
          {value}
        </strong>
        {extra && <em>{extra}</em>}
        {sub && <p>{sub}</p>}
      </div>
    </div>
  );
}