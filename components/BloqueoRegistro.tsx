import Link from "next/link";

export default function BloqueoRegistro() {
  return (
    <main className="min-h-screen bg-black/70 text-white flex items-center justify-center p-6">
      <div className="bg-white text-slate-900 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl">
        <h1 className="text-3xl font-bold mb-4 text-blue-950">
          Regístrate gratis
        </h1>

        <p className="text-lg mb-6 text-slate-600">
          Debes registrarte para acceder a tus 20 preguntas gratuitas.
        </p>

        <Link
          href="/login"
          className="block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold mb-3"
        >
          Ir a registrarme
        </Link>

        <Link
          href="/"
          className="inline-block text-slate-500 font-bold"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}