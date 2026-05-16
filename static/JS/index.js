document.addEventListener('DOMContentLoaded', () => {
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