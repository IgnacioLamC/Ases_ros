document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor-productos-galeria');
    const linksFiltro = document.querySelectorAll('#navegacion a, .menu-lateral a');
    const productos = JSON.parse(localStorage.getItem('productosAses')) || [];

    function mostrarGaleria(lista) {
        contenedor.innerHTML = '';
        if (lista.length === 0) {
            contenedor.innerHTML = "<p>No se encontraron productos en esta categoría.</p>";
            return;
        }

        lista.forEach(p => {
            if(p.cantidad <= 0) return; // No mostrar si no hay stock

            const div = document.createElement('div');
            div.className = 'gorra'; // Mantenemos tu clase para el diseño
            div.innerHTML = `
                <div class="card">
                    <img src="${p.imagen}" alt="${p.marca}" width="100">
                    <h4>${p.marca}</h4>
                    <p>Talle: ${p.talle}</p>
                    <p class="precio">Precio: $${p.enOferta ? p.precioFinal : p.precioOriginal}</p>
                    <button class="carrito">Agregar al carrito</button>
                </div>
            `;
            contenedor.appendChild(div);
        });
    }

    // Carga inicial (todo)
    mostrarGaleria(productos);

    // Lógica de Filtros
    linksFiltro.forEach(link => {
        link.addEventListener('click', (e) => {
            const textoFiltro = e.target.textContent.toLowerCase();
            
            if (textoFiltro === 'ases ros' || textoFiltro === 'inicio') {
                mostrarGaleria(productos);
            } else {
                e.preventDefault();
                const filtrados = productos.filter(p => 
                    p.categoria.toLowerCase() === textoFiltro || 
                    p.marca.toLowerCase() === textoFiltro
                );
                mostrarGaleria(filtrados);
            }
        });
    });
});