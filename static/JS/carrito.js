// Referencias a los elementos del DOM
const compras = document.getElementById("compras");
const resumen = document.getElementById("resumen");

// Cupon
let cuponActivo = false;

// Lista de productos y del carrito actual
let productos = JSON.parse(localStorage.getItem("productosAses")) || [];
if (productos.length === 0) {
  alert("No hay productos cargados");
}

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
if (!localStorage.getItem("carrito")) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Mostrar productos en el carrito
function mostrarProductos() {
  compras.innerHTML = "";
  carrito.forEach((producto) => {
    const productoCompleto = productos.find(
      (p) => p.id === producto.id,
    );
    if (!productoCompleto) return;

    const precioVenta = productoCompleto.enOferta ? productoCompleto.precioFinal : productoCompleto.precioOriginal;
    const li = document.createElement("li");
    li.innerHTML = `
                <div class="item-carrito">
                    <div><img src="${productoCompleto.imagen}" alt="Ropa" width="150px"></div>
                    <div class="producto-info">
                        <h5>${productoCompleto.descripcion}</h5>
                        <p>Talle: ${productoCompleto.talle}</p>
                        <p>Cantidad: ${producto.cantidad}</p>
                        <p>Por prenda: $${precioVenta}</p>
                        <p>Total: $${Number(precioVenta) * Number(producto.cantidad)}</p>
                    </div>
                    <div>
                        <button class="btn-borrar" data-id="${producto.id}">Borrar</button>
                    </div>     
                </div>
            `;
    compras.appendChild(li);

    // Borrar producto del carrito
    const btnBorrar = li.querySelector(".btn-borrar");

    btnBorrar.addEventListener("click", () => {
      carrito = carrito.filter(
        (p) => parseInt(p.id) !== parseInt(producto.id)
      );

      localStorage.setItem("carrito", JSON.stringify(carrito));
      mostrarProductos();
      actualizarResumen();
    });
  });
}

// Calcular resumen
function actualizarResumen() {
  let subtotal = 0;

  carrito.forEach((producto) => {
    const productoCompleto = productos.find(
      (p) => parseInt(p.id) === parseInt(producto.id),
    );

    if (!productoCompleto) return;

    const precioVenta = productoCompleto.enOferta ? productoCompleto.precioFinal : productoCompleto.precioOriginal;
    subtotal += Number(precioVenta) * Number(producto.cantidad);
  });

  const envio = 5000;
  const impuestos = subtotal * 0.21;

  // Descuento
  let descuento = 0;

  if (cuponActivo) {
    descuento = subtotal * 0.15;
  }

  const total = subtotal + envio + impuestos - descuento;

  resumen.innerHTML = `
        <div class="datos-pedido">
            <h3>Resumen del pedido:</h3>
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <p>Envío: $${envio.toFixed(2)}</p>
            <p>Impuestos: $${impuestos.toFixed(2)}</p>
            <p>Cupón: -$${descuento.toFixed(2)}</p>
            <p>Total: $${total.toFixed(2)}</p>
        </div>
        <div>
            <form id="form-cupon">
                <input  type="text" id="input-cupon" placeholder="Código del cupón">
                <br>
                <button type="submit">
                    Aplicar Código
                </button>
            </form>
        </div>
        <button id="finalizar">
            Finalizar compra
        </button>
        <div>
            <img src="../assets/icons/tarjeta.png" alt="tarjetas" width="100px">
        </div>
    `;

  // Evento del cupón
  const formCupon = document.getElementById("form-cupon");

  formCupon.addEventListener("submit", (e) => {
    e.preventDefault();

    const codigo = document.getElementById("input-cupon").value;

    if (codigo.toLowerCase() === "descuento") {
      cuponActivo = true;

      actualizarResumen();
    } else {
      alert("Cupón inválido");
    }
  });

  // Botón finalizar compra
  const btnFinalizar = document.getElementById("finalizar");
  btnFinalizar.addEventListener("click", () => {
    let productosGuardados =
      JSON.parse(localStorage.getItem("productosAses")) || [];

    carrito.forEach((productoCarrito) => {
      const producto = productosGuardados.find(
        (p) => parseInt(p.id) === parseInt(productoCarrito.id),
      );

      if (!producto) return;

      producto.cantidad =
        Number(producto.cantidad) - Number(productoCarrito.cantidad);

      if (producto.cantidad < 0) {
        producto.cantidad = 0;
      }
    });

    // Guardar productos actualizados
    localStorage.setItem("productosAses", JSON.stringify(productosGuardados));

    // Vaciar carrito
    carrito = [];

    localStorage.setItem("carrito", JSON.stringify(carrito));

    mostrarProductos();
    actualizarResumen();

    alert("Compra realizada correctamente");
  });
}

// Ejecutar al cargar la página
mostrarProductos();
actualizarResumen();
