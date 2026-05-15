// Elementos del DOM
const contenedor = document.getElementById("contenedor-productos-galeria");
const checkboxes = document.querySelectorAll('#filtros input[type="checkbox"]');
const botonesTalle = document.querySelectorAll('.botonesTalleRopa');
const rangePrecio = document.querySelector('#precioFiltro input[type="range"]');
let talleSeleccionado = null;

// Lista de Productos
const productos = JSON.parse(localStorage.getItem("productosAses")) || [];
// Carrito
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function mostrarGaleria(lista) {
  contenedor.innerHTML = "";
  if (lista.length === 0) {
    contenedor.innerHTML =
      "<p>No se encontraron productos en esta categoría.</p>";
    return;
  }

  lista.forEach((p) => {
    if (p.cantidad <= 0) return;

    const div = document.createElement("div");
    div.className = "gorra";
    div.innerHTML = `
                <div class="card">
                    <img src="${p.imagen}" alt="${p.marca}" width="100">
                    <h4>${p.marca}</h4>
                    <p>Talle: ${p.talle}</p>
                    <p class="precio">Precio: $${p.enOferta ? p.precioFinal : p.precioOriginal}</p>
                    <button class="carrito">Agregar al carrito</button>
                </div>
            `;

    const boton = div.querySelector(".carrito");

    boton.addEventListener("click", () => {
      const productoEnCarrito = carrito.find((item) => item.id === p.id);

      if (productoEnCarrito) {
        if (productoEnCarrito.cantidad < p.cantidad) {
          productoEnCarrito.cantidad++;
        } else {
          alert("No hay más stock disponible");
          return;
        }
      } else {
        carrito.push({ id: p.id, cantidad: 1 });
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      alert("Agregado con exito")
    });

    contenedor.appendChild(div);
  });
}

// Carga inicial
mostrarGaleria(productos);
