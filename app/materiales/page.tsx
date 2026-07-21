"use client";

import { useEffect, useState } from "react";

type Carpeta = {
  nombre: string;
  ruta: string;
  tipo: "carpeta";
};

type Archivo = {
  nombre: string;
  ruta: string;
  tipo: "archivo";
  tamaño: number;
  url: string;
};

export default function MaterialesPage() {
  const [prefix, setPrefix] = useState("");
  const [carpetas, setCarpetas] = useState<Carpeta[]>([]);
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [verificandoPremium, setVerificandoPremium] = useState(true);

  const cargarMateriales = async (ruta = "") => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(
        `/api/materiales?prefix=${encodeURIComponent(ruta)}`
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.error || "No se pudieron cargar los materiales.");
      }

      setPrefix(ruta);
      setCarpetas(data.carpetas || []);
      setArchivos(data.archivos || []);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los materiales.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMateriales();
  }, []);

  const volver = () => {
    if (!prefix) return;

    const partes = prefix.split("/").filter(Boolean);
    partes.pop();

    const rutaAnterior =
      partes.length > 0 ? `${partes.join("/")}/` : "";

    cargarMateriales(rutaAnterior);
  };

  const formatearTamaño = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const esVideo = (nombre: string) =>
    /\.(mp4|webm|mov|mkv)$/i.test(nombre);

  const esPdf = (nombre: string) => /\.pdf$/i.test(nombre);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioActual");
  
    if (!usuarioGuardado) {
      window.location.href = "/login";
      return;
    }
  
    const usuario = JSON.parse(usuarioGuardado);
  
    if (!usuario.premium) {
      window.location.href = "/premium";
      return;
    }
  
    setVerificandoPremium(false);
  }, []);

  if (verificandoPremium) {
    return (
      <main className="min-h-screen bg-[#020817] text-white flex items-center justify-center">
        Verificando acceso...
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-[#020817] text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Materiales de estudio
          </h1>

          <p className="text-slate-400 mt-2">
            PDFs, simulacros, apuntes y videos de RutaSERUMS.
          </p>
        </div>

        {prefix && (
          <button
            onClick={volver}
            className="mb-6 bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-2xl font-semibold transition"
          >
            ← Volver
          </button>
        )}

        {cargando && (
          <div className="bg-[#081120] border border-slate-800 rounded-3xl p-10 text-center">
            Cargando materiales...
          </div>
        )}

        {error && !cargando && (
          <div className="bg-red-950/40 border border-red-500/30 rounded-3xl p-6 text-red-200">
            {error}
          </div>
        )}

        {!cargando && !error && (
          <div className="space-y-8">
            {carpetas.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Carpetas</h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {carpetas.map((carpeta) => (
                    <button
                      key={carpeta.ruta}
                      onClick={() => cargarMateriales(carpeta.ruta)}
                      className="bg-[#081120] border border-blue-500/20 hover:border-blue-500 rounded-3xl p-6 text-left transition active:scale-[0.98]"
                    >
                      <div className="text-4xl mb-4">📁</div>

                      <h3 className="font-bold text-lg break-words">
                        {carpeta.nombre}
                      </h3>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {archivos.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Archivos</h2>

                <div className="space-y-3">
                  {archivos.map((archivo) => (
                    <div
                      key={archivo.ruta}
                      className="bg-[#081120] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="text-3xl shrink-0">
                          {esVideo(archivo.nombre)
                            ? "🎥"
                            : esPdf(archivo.nombre)
                            ? "📄"
                            : "📎"}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold break-words">
                            {archivo.nombre}
                          </p>

                          <p className="text-sm text-slate-400 mt-1">
                            {formatearTamaño(archivo.tamaño)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 shrink-0">
                        <a
                          href={archivo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl font-semibold transition"
                        >
                          Ver
                        </a>

                        <a
                          href={archivo.url}
                          download
                          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl font-semibold transition"
                        >
                          Descargar
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {carpetas.length === 0 && archivos.length === 0 && (
              <div className="bg-[#081120] border border-slate-800 rounded-3xl p-10 text-center text-slate-400">
                Esta carpeta está vacía.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}