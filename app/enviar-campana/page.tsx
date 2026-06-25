"use client";

export default function EnviarCampanaPage() {
  const enviar = async () => {
    if (!confirm("¿Seguro que quieres enviar el correo a todos los usuarios?")) return;

    const res = await fetch("/api/admin/enviar-campana", {
      method: "POST",
    });

    const data = await res.json();
    console.log(data);
    alert(`Enviados: ${data.enviados} / Total: ${data.total}`);
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={enviar}
        className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
      >
        Enviar campaña a todos
      </button>
    </main>
  );
}