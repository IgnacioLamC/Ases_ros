const formAses = document.getElementById('form-ases');
const selectCategoria = document.getElementById('categoria');
const selectTalle = document.getElementById('talle');
const checkDescuento = document.getElementById('check-descuento');
const precioOfertaInput = document.getElementById('precio-oferta');
const listaCards = document.getElementById('lista-cards');

const opcionesTalles = {
    ropa: ['S', 'M', 'L', 'XL', 'XXL'],
    zapatillas: ['39', '40', '41', '42', '43', '44', '45'],
    accesorios: ['S/M', 'M/L', 'L/XL', 'Talle Único']
};

// --- LÓGICA DE STOCK RÁPIDO ---

window.modificarStock = function(id, cambio) {
    let productos = JSON.parse(localStorage.getItem('productosAses')) || [];
    const index = productos.findIndex(p => p.id === id);

    if (index !== -1) {
        let nuevaCant = parseInt(productos[index].cantidad) + cambio;

        // VALIDACIÓN: No permite menos de 0
        if (nuevaCant < 0) {
            alert("⚠️ No podés tener stock negativo.");
            return; // Corta la función acá, no guarda nada
        }

        productos[index].cantidad = nuevaCant;
        localStorage.setItem('productosAses', JSON.stringify(productos));
        mostrarProductos();
    }
};

// --- PREPARAR EDICIÓN ---
window.prepararEdicion = function(id) {
    const productos = JSON.parse(localStorage.getItem('productosAses')) || [];
    const prod = productos.find(p => p.id === id);
    if (prod) {
        document.getElementById('edit-id').value = prod.id;
        document.getElementById('categoria').value = prod.categoria;
        document.getElementById('marca').value = prod.marca;
        document.getElementById('precio').value = prod.precioOriginal;
        document.getElementById('imagen').value = prod.imagen;
        document.getElementById('descripcion').value = prod.descripcion;
        document.getElementById('cantidad').value = prod.cantidad;
        document.getElementById('check-descuento').checked = prod.enOferta;
        document.getElementById('check-destacado').checked = prod.esDestacado;
        
        precioOfertaInput.value = prod.enOferta ? prod.precioFinal : '';
        precioOfertaInput.disabled = !prod.enOferta;

        // Cargar talles
        selectTalle.disabled = false;
        selectTalle.innerHTML = opcionesTalles[prod.categoria].map(t => `<option value="${t}">${t}</option>`).join('');
        selectTalle.value = prod.talle;

        document.getElementById('btn-cargar').textContent = "ACTUALIZAR PRODUCTO";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// --- MOSTRAR PRODUCTOS ---
function mostrarProductos() {
    const productos = JSON.parse(localStorage.getItem('productosAses')) || [];
    listaCards.innerHTML = '';

    productos.forEach(p => {
        const li = document.createElement('li');
        li.className = 'card';

        // 1. Validamos si el stock es cero para aplicar la clase de alerta (el titileo rojo)
        const claseStock = p.cantidad == 0 ? 'stock-alerta' : '';

        // 2. Lógica para mostrar los precios: si está en oferta, mostramos el original tachado
        const precioHTML = p.enOferta 
            ? `<p class="precios"><span class="precio-tachado">$${p.precioOriginal}</span> <span class="precio-oferta">$${p.precioFinal}</span></p>`
            : `<p class="precio-normal">$${p.precioOriginal}</p>`;

        li.innerHTML = `
            <img src="${p.imagen}" alt="${p.marca}">
            <h4>${p.marca} ${p.esDestacado ? '<span class="estrella-destacado">⭐</span>' : ''}</h4>
            
            <div class="stock-control">
                <button onclick="modificarStock(${p.id}, -1)">-</button>
                <span class="${claseStock}">STOCK: ${p.cantidad}</span> <button onclick="modificarStock(${p.id}, 1)">+</button>
            </div>

            <p class="desc-card">${p.descripcion}</p>
            <p class="talle-info">Talle: ${p.talle}</p>
            
            ${precioHTML}

            <div class="card-actions">
                <button onclick="prepararEdicion(${p.id})" class="btn-edit">✎ EDITAR</button>
                <button onclick="eliminarProducto(${p.id})" class="btn-del">🗑️ BORRAR</button>
            </div>
        `;
        listaCards.appendChild(li);
    });
}

// --- SUBMIT (CREAR O EDITAR) ---
formAses.addEventListener('submit', (e) => {
    e.preventDefault();

    // --- ACÁ EMPIEZAN LAS VALIDACIONES PRO ---
    const precioBase = parseFloat(document.getElementById('precio').value);
    const precioOferta = parseFloat(precioOfertaInput.value);
    const stockInicial = parseInt(document.getElementById('cantidad').value);

    // 1. Validar precio mayor a 0
    if (precioBase <= 0) {
        alert("❌ El precio debe ser mayor a 0.");
        return;
    }

    // 2. Validar stock (no negativo)
    if (stockInicial < 0) {
        alert("❌ El stock no puede ser negativo.");
        return;
    }

    // 3. Validar lógica de oferta (solo si el check está marcado)
    if (checkDescuento.checked) {
        if (isNaN(precioOferta) || precioOferta <= 0) {
            alert("❌ Si aplicás descuento, el precio de oferta debe ser mayor a 0.");
            return;
        }
        if (precioOferta >= precioBase) {
            alert("❌ ¡Ojo! El precio de oferta debe ser menor al precio original.");
            return;
        }
    }
    // --- ACÁ TERMINAN LAS VALIDACIONES ---

    // Si llegó hasta acá, es porque los datos están bien, entonces guardamos:
    const idEdit = document.getElementById('edit-id').value;
    let productos = JSON.parse(localStorage.getItem('productosAses')) || [];

    const pData = {
        categoria: selectCategoria.value,
        marca: document.getElementById('marca').value,
        talle: selectTalle.value,
        precioOriginal: precioBase,
        enOferta: checkDescuento.checked,
        precioFinal: checkDescuento.checked ? precioOferta : precioBase,
        esDestacado: document.getElementById('check-destacado').checked,
        imagen: document.getElementById('imagen').value,
        descripcion: document.getElementById('descripcion').value,
        cantidad: stockInicial
    };

    if (idEdit) {
        const idx = productos.findIndex(p => p.id == idEdit);
        productos[idx] = { ...pData, id: parseInt(idEdit) };
        document.getElementById('edit-id').value = "";
        document.getElementById('btn-cargar').textContent = "CARGAR PRODUCTO";
    } else {
        productos.push({ ...pData, id: Date.now() });
    }

    localStorage.setItem('productosAses', JSON.stringify(productos));
    formAses.reset();
    
    // Feedback visual de que se guardó bien
    const msg = document.getElementById('mensaje-exito');
    if (msg) {
        msg.textContent = "✅ Producto guardado correctamente";
        setTimeout(() => msg.textContent = "", 3000);
    }

    mostrarProductos();
});

// Inicializar
selectCategoria.addEventListener('change', () => {
    const cat = selectCategoria.value;
    selectTalle.disabled = !cat;
    if(cat) selectTalle.innerHTML = opcionesTalles[cat].map(t => `<option value="${t}">${t}</option>`).join('');
});

checkDescuento.addEventListener('change', () => {
    precioOfertaInput.disabled = !checkDescuento.checked;
});

window.eliminarProducto = (id) => {
    let productos = JSON.parse(localStorage.getItem('productosAses')).filter(p => p.id !== id);
    localStorage.setItem('productosAses', JSON.stringify(productos));
    mostrarProductos();
};

mostrarProductos();