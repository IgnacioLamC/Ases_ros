// Referencias a los elementos del DOM
const compras = document.getElementById("compras");

// Lista de productos y del carrito actual
let productos;
let carrito;

if (localStorage.getItem("productosAses")) {
  productos = JSON.parse(localStorage.getItem("productosAses"));
} else {
  productos = [];
  alert("No hay productos cargados");
}

if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
} else {
  localStorage.setItem("carrito", JSON.stringify([]));
  carrito = JSON.parse(localStorage.getItem("carrito"));
}

// Mostrar productos en el carrito
function mostrarProductos() {
  compras.innerHTML = "";
  carrito.forEach((producto) => {
    const productoCompleto = productos.find((p) => p.id === parseInt(producto.id));
    const li = document.createElement("li");
    li.innerHTML = `
                <div class="item-carrito">
                    <div><img src="${productoCompleto.imagen}" alt="Ropa" width="150px"></div>
                    <div class="producto-info">
                        <h5>${productoCompleto.nombre}</h5>
                        <p>Descripción: ${productoCompleto.descripcion}</p>
                        <p>Talle: ${productoCompleto.talle}</p>
                        <p>Cantidad: <input type="number" min="1" step="1" value="${producto.cantidad}"></p>
                        <p>$${productoCompleto.precio}</p>
                    </div>
                    <div>
                        <button>Borrar</button>
                    </div>     
                </div>
            `;
    console.log("va");
    compras.appendChild(li);
  });
}

// Ejecutar al cargar la página
mostrarProductos();
