document.addEventListener("DOMContentLoaded", () => {
  // ✅ 0. Cargar e incrustar el menú
  const menuContainer = document.getElementById("menu-container");
  if (menuContainer) {
    fetch("menu.html")
      .then(res => res.text())
      .then(html => {
        menuContainer.innerHTML = html;
      })
      .catch(err => console.error("Error cargando el menú:", err));
  }

  // ✅ 1. Redirigir desde el formulario con efecto de carga
  const form = document.getElementById("data-form");
  const buscarBtn = document.getElementById("buscar-btn");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (buscarBtn) {
        buscarBtn.classList.add("loading");
        buscarBtn.disabled = true;
        buscarBtn.innerHTML = `
          <i class="bi bi-search"></i>
          Buscando...
          <i class="bi bi-arrow-repeat spinner-icon"></i>
        `;
      }

      // Simula el proceso de búsqueda antes de redirigir
      setTimeout(() => {
        window.location.href = "list.html";
      }, 3000);
    });
  }

  // ✅ 2. Guardar nombre al hacer clic en "Seleccionar"
  const botones = document.querySelectorAll(".boton-seleccionar");
  if (botones.length > 0) {
    botones.forEach((boton) => {
      boton.addEventListener("click", () => {
        const card = boton.closest(".card-persona");
        const nombreDiv = card.querySelector(".nombre");
        if (!nombreDiv) return;
        const nombre = nombreDiv.textContent.trim();

        localStorage.setItem("nombreSeleccionado", nombre);
        window.location.href = "chat.html";
      });
    });
  }

  // ✅ 3. Mostrar nombre del contacto en el chat
  const header = document.getElementById("chat-header");
  if (header) {
    const nombre = localStorage.getItem("nombreSeleccionado") || "desconocido";
    header.textContent = `Chat con ${nombre}`;
  }
});
