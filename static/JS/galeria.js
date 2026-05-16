// Elementos del DOM
const contenedor = document.getElementById("contenedor-productos-galeria");
const checkboxes = document.querySelectorAll('#filtros input[type="checkbox"]');
const botonesTalle = document.querySelectorAll('.botonesTalleRopa');
const rangePrecio = document.querySelector('#precioFiltro input[type="range"]');
const precioLabel = document.querySelector('#precioFiltro h2');
const inputBusqueda = document.querySelector('input[name="buscador"]');
const btnBuscar = document.querySelector('.btnBuscar');

let talleSeleccionado = null;

// Lista de Productos
const productos = JSON.parse(localStorage.getItem("productosAses")) || [];
// Carrito
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Rango de precio al principio
if (rangePrecio) {
    const maxPrecio = productos.reduce((max, p) => Math.max(max, p.enOferta ? p.precioFinal : p.precioOriginal), 0);
    rangePrecio.max = maxPrecio || 200000;
    rangePrecio.value = maxPrecio || 200000;
    if (precioLabel) precioLabel.textContent = `$0 - $${rangePrecio.value}`;
}

function mostrarGaleria(lista) {
    contenedor.innerHTML = "";
    if (lista.length === 0) {
        contenedor.innerHTML =
            "<p>No se encontraron productos con los filtros seleccionados.</p>";
        return;
    }

    lista.forEach((p) => {
        // Nada mas se muestra si hay stock
        if (p.cantidad <= 0) return;

        const div = document.createElement("div");
        div.className = "gorra";
        div.innerHTML = `
                <div class="card">
                    <img src="${p.imagen}" alt="${p.marca}" width="100">
                    <h4>${p.marca}</h4>
                    <p>Talle: ${p.talle}</p>
                    <p class="precio">Precio: $${p.enOferta ? `${p.precioFinal} <small>(${p.descuentoPorcentaje}% OFF)</small>` : p.precioOriginal}</p>
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
            alert("Agregado con éxito");
        });

        contenedor.appendChild(div);
    });
}

function filtrar() {
    let filtrados = productos;

    // Normaliza el talle para asegurar la busqueda
    const normalize = str => str.replace(/[\/\s-]/g, '').toLowerCase();

    const query = inputBusqueda ? inputBusqueda.value.toLowerCase() : "";
    if (query) {
        filtrados = filtrados.filter(p =>
            p.marca.toLowerCase().includes(query) ||
            p.descripcion.toLowerCase().includes(query)
        );
    }
    const categoriasSeleccionadas = Array.from(document.querySelectorAll('#tipoProductoFiltro input:checked')).map(i => i.value);
    if (categoriasSeleccionadas.length > 0) {
        filtrados = filtrados.filter(p => categoriasSeleccionadas.includes(p.categoria));
    }
    const marcasSeleccionadas = Array.from(document.querySelectorAll('#marcasFiltros input:checked')).map(i => i.value.replace('marca', '').toLowerCase());
    if (marcasSeleccionadas.length > 0) {
        filtrados = filtrados.filter(p => marcasSeleccionadas.some(m => p.marca.toLowerCase().includes(m)));
    }
    const tallesCheck = Array.from(document.querySelectorAll('#tallesFiltros input:checked')).map(i => normalize(i.value.replace('talle', '')));
    if (tallesCheck.length > 0 || talleSeleccionado) {
        filtrados = filtrados.filter(p => {
            const talleP = normalize(p.talle);
            const coincideCheck = tallesCheck.some(tc => talleP === tc || talleP.includes(tc));
            const coincideBoton = talleSeleccionado ? talleP === normalize(talleSeleccionado) : false;
            return coincideCheck || coincideBoton;
        });
    }
    if (rangePrecio) {
        filtrados = filtrados.filter(p => (p.enOferta ? p.precioFinal : p.precioOriginal) <= parseInt(rangePrecio.value));
        if (precioLabel) precioLabel.textContent = `$0 - $${rangePrecio.value}`;
    }
    const checkDescuento = document.querySelector('#descuentosFiltro input:checked');
    if (checkDescuento) {
        filtrados = filtrados.filter(p => p.enOferta);
    }
    const checkStock = document.querySelector('#stockFiltro input:checked');
    if (checkStock) {
        filtrados = filtrados.filter(p => p.cantidad > 0);
    }

    mostrarGaleria(filtrados);
}

// Eventos de los filtros
checkboxes.forEach(chk => chk.addEventListener('change', filtrar));

if (rangePrecio) {
    rangePrecio.addEventListener('input', filtrar);
}

if (btnBuscar) {
    btnBuscar.addEventListener('click', (e) => {
        e.preventDefault();
        filtrar();
    });
}

if (inputBusqueda) {
    inputBusqueda.addEventListener('input', filtrar);
}

botonesTalle.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (talleSeleccionado === btn.textContent) {
            talleSeleccionado = null;
            btn.classList.remove('selected');
        } else {
            botonesTalle.forEach(b => b.classList.remove('selected'));
            talleSeleccionado = btn.textContent;
            btn.classList.add('selected');
        }
        filtrar();
    });
});

// Carga inicial
mostrarGaleria(productos);
