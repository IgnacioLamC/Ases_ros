document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor-destacados-index');
    const productos = JSON.parse(localStorage.getItem('productosAses')) || [];

    // Solo mostramos los marcados como destacados y con stock
    const destacados = productos.filter(p => p.esDestacado && p.cantidad > 0);

    if (destacados.length === 0) {
        contenedor.innerHTML = "<p style='color:white;'>Próximamente nuevas bombas...</p>";
        return;
    }

    destacados.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="card">
                <img src="${p.imagen}" alt="${p.marca}" width="100">
                <h4>${p.marca}</h4>
                <p class="precio">Precio: $${p.enOferta ? p.precioFinal : p.precioOriginal}</p>
                <button class="btn-carrito">Agregar al carrito</button>
            </div>
        `;
        contenedor.appendChild(li);
    });
});