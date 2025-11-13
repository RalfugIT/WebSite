// Mapeo de secciones con sus nombres para mostrar
const sectionNames = {
  exportacion: "Exportación",
  miacalidad: "Mia-Calidad",
  logistica: "Logística",
  esporeplus: "Esporeplus",
  logistichym: "Logistic HYM S.A.",
  preservacion: "Preservación de frutas y flores",
  filtros: "Filtros",
  sachetetileno: "Sachet de etileno",
  termografos: "Termógrafos",
  productorhogar: "Productor para el hogar",
  humego: "Humego",
  parchemujeres: "Parche/Mujeres",
  contactanos: "Contactanos",
};

// Renderizado específico para "Exportación" usando Exportamos.txt
async function showExportacion() {
  const contentArea = document.getElementById("content-area");
  contentArea.innerHTML = `
        <div class="content-section">
            <h2>Exportación</h2>
            <p>Cargando información...</p>
        </div>
    `;

  try {
    const resp = await fetch("Exportamos.txt", { cache: "no-store" });
    const text = await resp.text();

    // Parseo del archivo de texto a tarjetas
    const lines = text.split(/\r?\n/);
    let html = '<div class="content-section"><h2>Exportación</h2>';

    // Título principal "Productos"
    html += '<h3 class="products-title">Productos</h3>';
    html += '<div class="cards-container">';

    let currentProduct = null;
    let productInfo = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        continue;
      }

      // Líneas que terminan con ":" son títulos de productos
      if (/:$/.test(line)) {
        // Si hay un producto anterior, crear su tarjeta
        if (currentProduct) {
          html += createProductCard(currentProduct, productInfo);
          productInfo = [];
        }
        currentProduct = line.replace(/:$/, "");
      } else if (currentProduct) {
        // Agregar información al producto actual
        productInfo.push(line);
      }
    }

    // Crear tarjeta para el último producto
    if (currentProduct) {
      html += createProductCard(currentProduct, productInfo);
    }

    html += "</div></div>";
    contentArea.innerHTML = html;
  } catch (e) {
    contentArea.innerHTML = `
        <div class="content-section">
            <h2>Exportación</h2>
            <p>No se pudo cargar la información de Exportamos.txt.</p>
        </div>
    `;
  }
}

// Función para crear una tarjeta de producto
function createProductCard(productName, info) {
  const description = info.filter((line) => !line.includes("Clase")).join(" ");
  const clase = info.find((line) => line.includes("Clase")) || "";

  return `
    <div class="product-card">
      <div class="card-header">
        <h4>${productName}</h4>
      </div>
      <div class="card-body">
        <p class="card-description">${description}</p>
        ${clase ? `<div class="card-badge">${clase}</div>` : ""}
      </div>
      <div class="card-gradient"></div>
    </div>
  `;
}

// Función para mostrar el contenido de una sección
function showSection(sectionId) {
  const contentArea = document.getElementById("content-area");
  const sectionName = sectionNames[sectionId] || sectionId;

  // Si es Exportación, usamos el contenido del archivo
  if (sectionId === "exportacion") {
    // Actualizar estado activo del menú antes de cargar
    document.querySelectorAll(".menu a").forEach((link) => {
      link.classList.remove("active");
    });
    const activeLinkExp = document.querySelector(
      `[data-section="${sectionId}"]`
    );
    if (activeLinkExp) {
      activeLinkExp.classList.add("active");
    }
    showExportacion();
    return;
  }

  contentArea.innerHTML = `
        <div class="content-section">
            <h2>${sectionName}</h2>
            <p>Aquí va el contenido para ${sectionName}</p>
        </div>
    `;

  // Actualizar estado activo en el menú
  document.querySelectorAll(".menu a").forEach((link) => {
    link.classList.remove("active");
  });

  const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
  }
}

// Función para posicionar submenús
function positionSubmenu(submenu, parentItem) {
  const rect = parentItem.getBoundingClientRect();
  submenu.style.left = rect.right + 5 + "px";
  submenu.style.top = rect.top + "px";
}

// Agregar event listeners a todos los enlaces del menú
document.addEventListener("DOMContentLoaded", function () {
  const menuLinks = document.querySelectorAll(".menu a[data-section]");

  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const sectionId = this.getAttribute("data-section");
      showSection(sectionId);
    });
  });

  // Posicionar submenús al hacer hover
  const submenuItems = document.querySelectorAll(".has-submenu");
  submenuItems.forEach((item) => {
    const submenu = item.querySelector(".submenu");
    if (submenu) {
      item.addEventListener("mouseenter", function () {
        positionSubmenu(submenu, item);
      });

      // Mantener submenú visible cuando el mouse está sobre él
      submenu.addEventListener("mouseenter", function () {
        const parentItem = this.closest(".has-submenu");
        if (parentItem) {
          positionSubmenu(this, parentItem);
        }
      });
    }
  });

  // Reposicionar submenús al hacer scroll o redimensionar
  let repositionTimeout;
  window.addEventListener("scroll", function () {
    clearTimeout(repositionTimeout);
    repositionTimeout = setTimeout(function () {
      const visibleSubmenus = document.querySelectorAll(
        ".has-submenu:hover .submenu"
      );
      visibleSubmenus.forEach((submenu) => {
        const parentItem = submenu.closest(".has-submenu");
        if (parentItem) {
          positionSubmenu(submenu, parentItem);
        }
      });
    }, 10);
  });

  window.addEventListener("resize", function () {
    const visibleSubmenus = document.querySelectorAll(
      ".has-submenu:hover .submenu"
    );
    visibleSubmenus.forEach((submenu) => {
      const parentItem = submenu.closest(".has-submenu");
      if (parentItem) {
        positionSubmenu(submenu, parentItem);
      }
    });
  });
});
