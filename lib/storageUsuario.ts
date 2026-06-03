export function getUsuarioCorreo() {
    if (typeof window === "undefined") return "invitado";
  
    const usuario = JSON.parse(localStorage.getItem("usuarioActual") || "{}");
    return usuario?.correo || "invitado";
  }
  
  export function userKey(key: string) {
    const correo = getUsuarioCorreo();
    return `${key}_${correo}`;
  }