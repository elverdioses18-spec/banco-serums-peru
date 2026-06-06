"use client";

import { useState } from "react";

export default function InfoTooltip({
  texto,
  children,
}: {
  texto: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  const mostrarEnMovil = () => {
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
    }, 5000);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={mostrarEnMovil}
    >
      {children}

      {visible && (
        <div className="absolute z-[99999] left-1/2 -translate-x-1/2 mt-2 w-56 bg-slate-900/80 text-white text-xs rounded-xl px-3 py-2 shadow-xl border border-slate-700">
          {texto}
        </div>
      )}
    </div>
  );
}