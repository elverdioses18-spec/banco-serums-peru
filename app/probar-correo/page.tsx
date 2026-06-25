"use client";

export default function ProbarCorreoPage() {
  const enviarCorreo = async () => {
    const res = await fetch("/api/admin/enviar-correo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: "rutaserum@gmail.com",
        asunto: "Prueba Ruta SERUMS",
        mensaje: "<h1>Hola bro 👋</h1><p>Este es un correo de prueba desde Ruta SERUMS.</p>",
      }),
    });

    const data = await res.json();
    console.log(data);
    alert(data.ok ? "Correo enviado" : "Error enviando correo");
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <button
        onClick={enviarCorreo}
        className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
      >
        Enviar correo de prueba
      </button>
    </main>
  );
}