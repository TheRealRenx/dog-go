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

  // ✅ 1. Redirigir desde el formulario con efecto de carga (solo si no hay mapa)
  const form = document.getElementById("data-form");
  const buscarBtn = document.getElementById("buscar-btn");

  if (form && !document.getElementById("map")) {
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

// ------------------------------------------------------
// ✅ 4. Google Maps: inicializar mapa y mostrar marcadores
// ------------------------------------------------------

let map;
let markers = [];
let infoWindow;

const puntosIniciales = [
  {
    lat: -12.0941451,
    lng: -77.0241542,
    title: "Colegio Alfonso Ugarte",
    content: "<b>Colegio Alfonso Ugarte</b><br>San Isidro, Lima"
  },
  {
    lat: -12.100867,
    lng: -77.034787,
    title: "Parque El Olivar",
    content: "<b>Parque El Olivar</b><br>San Isidro"
  },
  {
    lat: -12.0976793,
    lng: -77.0364448,
    title: "Centro Comercial Camino Real",
    content: "<b>Centro Comercial Camino Real</b><br>San Isidro"
  }
];


function initMap() {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return; // Evita error si no existe el contenedor

  const centro = { lat: -12.097179, lng: -77.033779 };
  map = new google.maps.Map(mapDiv, {
    zoom: 12,
    center: centro
  });

  infoWindow = new google.maps.InfoWindow();
  dibujarMarcadores(puntosIniciales);

  // Si existe el formulario, lo usamos para actualizar puntos
  const form = document.getElementById("data-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const mascotas = document.getElementById("mascotas")?.value || 0;

      // Genera puntos de prueba cerca de Lima
      const nuevos = Array.from({ length: 3 }, (_, i) => {
        const lat = -12.0464 + (Math.random() - 0.5) * 0.05;
        const lng = -77.0428 + (Math.random() - 0.5) * 0.05;
        return {
          lat, lng,
          title: `Cuidador ${i + 1}`,
          content: `<b>Cuidador ${i + 1}</b><br>Mascotas: ${mascotas}`
        };
      });

      dibujarMarcadores(nuevos);
    });
  }
}

function dibujarMarcadores(puntos) {
  limpiarMarcadores();

  const bounds = new google.maps.LatLngBounds();

  puntos.forEach(p => {
    const marker = new google.maps.Marker({
      position: { lat: p.lat, lng: p.lng },
      map,
      title: p.title || "Punto"
    });

    marker.addListener("click", () => {
      infoWindow.setContent(p.content || `<strong>${p.title || "Punto"}</strong>`);
      infoWindow.open(map, marker);
    });

    markers.push(marker);
    bounds.extend(marker.getPosition());
  });

  if (!bounds.isEmpty()) {
    map.fitBounds(bounds);
  }
}

function limpiarMarcadores() {
  markers.forEach(m => m.setMap(null));
  markers = [];
}
