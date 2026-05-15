// Referencias a los elementos del DOM
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const formAses = document.getElementById('form-ases');
const selectCategoria = document.getElementById('categoria');
const selectTalle = document.getElementById('talle');
const checkDescuento = document.getElementById('check-descuento');
const precioOfertaInput = document.getElementById('precio-oferta');
const listaCards = document.getElementById('lista-cards');

// Lógica del Menú Hamburguesa
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Configuración de talles por categoría
const opcionesTalles = {
    ropa: ['S', 'M', 'L', 'XL', 'XXL'],
    zapatillas: ['39', '40', '41', '42', '43', '44', '45'],
    accesorios: ['S/M', 'M/L', 'L/XL', 'Talle Único']
};

// Logica creación id
let idUsable
if(localStorage.getItem("idUsable")){
    idUsable = parseInt(localStorage.getItem("idUsable")) || 0
} else{
    localStorage.setItem("idUsable", "0")
    idUsable = 0;
}


// Cambio de talles dinámico
selectCategoria.addEventListener('change', () => {
    const categoria = selectCategoria.value;
    selectTalle.innerHTML = '<option value="">Seleccione Talle</option>';

    if (categoria && opcionesTalles[categoria]) {
        selectTalle.disabled = false;
        opcionesTalles[categoria].forEach(t => {
            const option = document.createElement('option');
            option.value = t;
            option.textContent = t;
            selectTalle.appendChild(option);
        });
    } else {
        selectTalle.disabled = true;
    }
});

// Lógica de Descuento
checkDescuento.addEventListener('change', () => {
    precioOfertaInput.disabled = !checkDescuento.checked;
    if (!checkDescuento.checked) precioOfertaInput.value = '';
});

// Mostrar Productos Guardados
function mostrarProductos() {
    const productos = JSON.parse(localStorage.getItem('productosAses')) || [];
    listaCards.innerHTML = '';

    productos.forEach((prod) => {
        const li = document.createElement('li');
        li.className = "card";

        // Lógica para el precio
        let precioHTML = '';
        if (prod.enOferta) {
            precioHTML = `
                <p class="precios">
                    <span class="precio-tachado">$${prod.precioOriginal}</span> 
                    <span class="precio-oferta">$${Number(prod.precioOriginal) * (100-Number(prod.descuento))/100}</span>
                </p>`;
        } else {
            precioHTML = `<p class="precio-normal">$${prod.precioOriginal}</p>`;
        }

        li.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.marca}">
            <h4>${prod.marca}</h4>
            <p><strong>Stock:</strong> ${prod.cantidad}</p>
            <p class="desc-card">${prod.descripcion}</p>
            ${precioHTML}
            <p>Talle: ${prod.talle}</p>
            <button onclick="eliminarProducto(${prod.id})" class="btn-eliminar">ELIMINAR</button>
        `;
        listaCards.appendChild(li);
    });
}
// Eliminar Producto
window.eliminarProducto = function (id) {
    let productos = JSON.parse(localStorage.getItem('productosAses')) || [];
    productos = productos.filter(p => p.id !== id);
    localStorage.setItem('productosAses', JSON.stringify(productos));
    mostrarProductos();
};

// Cargar Producto
formAses.addEventListener('submit', (e) => {
    e.preventDefault();

    const nuevaPrenda = {
        id: idUsable,
        categoria: selectCategoria.value,
        marca: document.getElementById('marca').value,
        talle: selectTalle.value,
        precioOriginal: document.getElementById('precio').value,
        enOferta: checkDescuento.checked,
        descuento: checkDescuento.checked ? precioOfertaInput.value : document.getElementById('precio').value,
        imagen: document.getElementById('imagen').value,
        descripcion: document.getElementById('descripcion').value,
        cantidad: document.getElementById('cantidad').value
    };

    idUsable++;
    localStorage.setItem("idUsable", idUsable);

    const productosGuardados = JSON.parse(localStorage.getItem('productosAses')) || [];
    productosGuardados.push(nuevaPrenda);
    localStorage.setItem('productosAses', JSON.stringify(productosGuardados));

    formAses.reset();
    selectTalle.disabled = true;
    precioOfertaInput.disabled = true;
    mostrarProductos();
});

// Ejecutar al cargar la página
mostrarProductos();