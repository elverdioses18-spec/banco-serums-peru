import Link from "next/link";

export default function ConfigurarSimulacro() {
  return (
    <main className="min-h-screen bg-[#edf3f8] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-sm p-10 max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-blue-950 mb-4">
        Cuidado Integral
        </h1>

        <p className="text-slate-600 text-xl mb-10">
          Selecciona cuántas preguntas deseas resolver.
        </p>

        <div className="grid grid-cols-3 gap-5 mb-10">
          <Link href="/cuidado-integral?cantidad=5" className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-8 text-3xl font-bold transition hover:scale-105">
            5
          </Link>

          <Link href="/cuidado-integral?cantidad=10" className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-8 text-3xl font-bold transition hover:scale-105">
            10
          </Link>

          <Link href="/cuidado-integral?cantidad=20" className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-8 text-3xl font-bold transition hover:scale-105">
            20
          </Link>
        </div>

        <Link href="/" className="text-blue-700 font-semibold hover:underline">
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}