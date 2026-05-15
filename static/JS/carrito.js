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
localStorage.removeItem("carrito")
if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
} else {
  localStorage.setItem("carrito", JSON.stringify([]));
//  carrito = JSON.parse(localStorage.getItem("carrito"));
carrito = [{id: "1", cantidad: "2"}]
}

// Mostrar productos en el carrito
function mostrarProductos() {
  compras.innerHTML = "";
  carrito.forEach((producto) => {
    const productoCompleto = productos.find((p) => parseInt(p.id) === parseInt(producto.id));
    const li = document.createElement("li");
    li.innerHTML = `
                <div class="item-carrito">
                    <div><img src="${productoCompleto.imagen}" alt="Ropa" width="150px"></div>
                    <div class="producto-info">
                        <h5>${productoCompleto.descripcion}</h5>
                        <p>Talle: ${productoCompleto.talle}</p>
                        <p>Cantidad: <input type="number" min="1" step="1" value="${producto.cantidad}"></p>
                        <p>Por prenda: $${productoCompleto.precioOriginal}</p>
                        <p>Total: $${Number(productoCompleto.precioOriginal) * Number(producto.cantidad)}</p>
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
