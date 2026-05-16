document.addEventListener('DOMContentLoaded', () => {
    const productos = JSON.parse(localStorage.getItem('productosAses')) || [];
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const listaDestacados = document.getElementById('lista-destacados');
    const listaOferta = document.getElementById('lista-oferta');
    const listaGeneral = document.getElementById('lista-general');

    function renderizarSeccion(items, contenedor, max = 3) {
        if (!contenedor) return;
        contenedor.innerHTML = '';
        
        const paraMostrar = items.filter(p => p.cantidad > 0).slice(0, max);

        if (paraMostrar.length === 0) {
            contenedor.innerHTML = "<p style='color:black;'>No hay productos disponibles en esta sección.</p>";
            return;
        }

        paraMostrar.forEach(p => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="card">
                    <img src="${p.imagen}" alt="${p.marca}" width="100">
                    <h4>${p.marca}</h4>
                    <p>Precio: $${p.enOferta ? `${p.precioFinal} <small>(${p.descuentoPorcentaje}% OFF)</small>` : p.precioOriginal}</p>
                    <button class="btn-carrito">Agregar al carrito</button>
                </div>
            `;

            const btn = li.querySelector('.btn-carrito');
            btn.addEventListener('click', () => {
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

            contenedor.appendChild(li);
        });
    }

    // Filtrar destacados y ofertas
    const destacados = productos.filter(p => p.esDestacado);
    const ofertas = productos.filter(p => p.enOferta);
    
    // 3 de cada categoría para la lista general
    const ropa = productos.filter(p => p.categoria === 'ropa').slice(0, 3);
    const zapatillas = productos.filter(p => p.categoria === 'zapatillas').slice(0, 3);
    const accesorios = productos.filter(p => p.categoria === 'accesorios').slice(0, 3);
    const listaCombinada = [...ropa, ...zapatillas, ...accesorios];

    renderizarSeccion(destacados, listaDestacados);
    renderizarSeccion(ofertas, listaOferta);
    renderizarSeccion(listaCombinada, listaGeneral, 9);
});