// Elementos del DOM
const contenedor = document.getElementById("contenedor-productos-galeria");
const checkboxes = document.querySelectorAll('#filtros input[type="checkbox"]');
const botonesTalle = document.querySelectorAll('.botonesTalleRopa');
const rangePrecio = document.querySelector('#precioFiltro input[type="range"]');
const precioLabel = document.querySelector('#precioFiltro h2');
const inputBusqueda = document.querySelector('input[name="buscador"]');
const btnBuscar = document.querySelector('.btnBuscar');

let talleSeleccionado = null;

// Inicialización de la base de datos si no existe
if (!localStorage.getItem('productosAses')) {
    const productosIniciales = [
        {
            id: 1, categoria: 'zapatillas', marca: 'Nike Air Jordan 1', talle: '42',
            precioOriginal: 150000, enOferta: true, descuentoPorcentaje: 20, precioFinal: 120000,
            esDestacado: true, imagen: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?q=80&w=300&auto=format&fit=crop',
            descripcion: 'Zapatillas Jordan icónicas.', cantidad: 10
        },
        {
            id: 2, categoria: 'zapatillas', marca: 'Adidas Forum Low', talle: '40',
            precioOriginal: 95000, enOferta: false, descuentoPorcentaje: 0, precioFinal: 95000,
            esDestacado: false, imagen: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=300&auto=format&fit=crop',
            descripcion: 'Estilo retro clásico.', cantidad: 5
        },
        {
            id: 3, categoria: 'ropa', marca: 'Remera Supreme Box Logo', talle: 'L',
            precioOriginal: 45000, enOferta: false, descuentoPorcentaje: 0, precioFinal: 45000,
            esDestacado: true, imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=300&auto=format&fit=crop',
            descripcion: 'Remera de algodón premium.', cantidad: 8
        },
        {
            id: 4, categoria: 'ropa', marca: 'Pantalón Cargo Nocta', talle: 'M',
            precioOriginal: 85000, enOferta: true, descuentoPorcentaje: 15, precioFinal: 72250,
            esDestacado: false, imagen: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=300&auto=format&fit=crop',
            descripcion: 'Pantalón técnico Nocta.', cantidad: 4
        },
        {
            id: 5, categoria: 'accesorios', marca: 'Gorra Jordan Pro', talle: 'Talle Único',
            precioOriginal: 25000, enOferta: false, descuentoPorcentaje: 0, precioFinal: 25000,
            esDestacado: false, imagen: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=300&auto=format&fit=crop',
            descripcion: 'Gorra ajustable.', cantidad: 15
        },
        {
            id: 6, categoria: 'accesorios', marca: 'Medias Nike Cushion', talle: 'M/L',
            precioOriginal: 12000, enOferta: true, descuentoPorcentaje: 10, precioFinal: 10800,
            esDestacado: true, imagen: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=300&auto=format&fit=crop',
            descripcion: 'Pack de medias deportivas.', cantidad: 20
        }
    ];
    localStorage.setItem('productosAses', JSON.stringify(productosIniciales));
}

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
