document.addEventListener("DOMContentLoaded", () => {
  const buscador = document.getElementById("buscador");
  if (!buscador) return;

  // 🔠 Función para normalizar términos (quitar acentos, espacios, símbolos)
  function normalizar(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  }

  // ⚠️ Crear mensaje visual si no hay resultados
  let mensaje = document.createElement("div");
  mensaje.id = "mensaje-busqueda";
  mensaje.textContent = "No se encontraron resultados.";
  mensaje.style.cssText = `
    display: none;
    text-align: center;
    color: var(--color-acento);
    font-weight: bold;
    padding: 10px;
    margin-top: 15px;
    background-color: #fffbe6;
    border-radius: 8px;
  `;
  buscador.insertAdjacentElement("afterend", mensaje);

  buscador.addEventListener("keypress", (e) => {
    if (e.key !== "Enter") return;

    const terminoOriginal = buscador.value.trim();
    const termino = terminoOriginal.toLowerCase();
    const terminoID = normalizar(terminoOriginal);
    let encontrado = false;

    // 1️⃣ Buscar coincidencia por ID normalizado
    const porID = document.getElementById(terminoID);
    if (porID) {
      porID.scrollIntoView({ behavior: "smooth", block: "center" });
      porID.classList.add("resaltado");
      setTimeout(() => porID.classList.remove("resaltado"), 2000);
      mensaje.style.display = "none";
      encontrado = true;
      return;
    }

    // 2️⃣ Buscar coincidencia parcial en texto visible y atributos accesibles
    const elementosTexto = document.querySelectorAll(
      ".contenido-card, .promo-item, .porfolio-item, .escapada-card, p, h1, h2, h3, h4, h5, h6, article, section, div"
    );

    for (let el of elementosTexto) {
      const visible = el.textContent?.toLowerCase() || "";
      const alt = el.getAttribute("alt")?.toLowerCase() || "";
      const title = el.getAttribute("title")?.toLowerCase() || "";
      const aria = el.getAttribute("aria-label")?.toLowerCase() || "";
      const textoTotal = `${visible} ${alt} ${title} ${aria}`;
      const textoNormalizado = normalizar(textoTotal);

      if (
        textoTotal.includes(termino) ||
        textoNormalizado.includes(terminoID)
      ) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("resaltado");
        setTimeout(() => el.classList.remove("resaltado"), 2000);
        mensaje.style.display = "none";
        encontrado = true;
        break;
      }
    }

    // 3️⃣ Redirección si no se encuentra contenido local
    if (!encontrado) {
      const rutaActual = window.location.pathname;
      const desdeContenido = rutaActual.includes("/html/");
      const rutas = {
        "inicio": desdeContenido ? "../index.html" : "index.html",
        "contenido": desdeContenido ? "contenido.html" : "html/contenido.html",
        "portafolio": desdeContenido ? "../portafolio.html" : "html/portafolio.html",
        "leon": desdeContenido ? "contenido.html#leon" : "html/contenido.html#leon",
        "esteli": desdeContenido ? "contenido.html#esteli" : "html/contenido.html#esteli",
        "granada": desdeContenido ? "contenido.html#granada" : "html/contenido.html#granada", 
        "costa-caribe-sur": desdeContenido ?  "contenido.html#costa-caribe-sur" : "html/contenido.html#costa-caribe-sur",
        "costa-caribe-norte": desdeContenido ? "contenido.html#costa-caribe-norte" : "html/contenido.html#costa-caribe-norte"
        // 👉 Podés agregar más claves aquí si querés incluir alias culturales, abreviaciones, etc.
      };

      if (rutas[terminoID]) {
        mensaje.style.display = "none";
        window.location.href = rutas[terminoID];
      } else {
        mensaje.style.display = "block";
        setTimeout(() => (mensaje.style.display = "none"), 3000);
      }
    }
  });
});