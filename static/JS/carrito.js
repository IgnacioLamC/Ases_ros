const compras = document.getElementById("compras");
let productos;
let carrito;

localStorage.setItem("carrito", JSON.stringify([{nombre: "Remera Jordan", descripcion: "ta fachera", marca: "Epstein", categoria:"Preservativos", talle:"XXXXXL", cantidad:6, precio: 12647821, descuento:0, img:""},
{nombre: "Negro Jordan", descripcion: "Labura mucho, come poco", marca: "Epstein", categoria:"Esclavo", talle:"Negro Whastapp", cantidad:67, precio: 0.123, descuento:100, img:""}]
))

if (localStorage.getItem("productos")){
    productos = localStorage.getItem("productos")
}else{
    productos = [];
}
if (localStorage.getItem("carrito")){
    carrito = JSON.parse(localStorage.getItem("carrito"))
}else{
    carrito = [1, 2, 3, 4, 5];
}


carrito.forEach(producto => {
    const li = document.createElement("li");
    li.innerHTML = `
                <div class="item-carrito">
                    <div><img src="../assets/images/ropa.jpg" alt="Ropa" width="150px"></div>
                    <div class="producto-info">
                        <h5>${producto.nombre}</h5>
                        <p>Descripción: ${producto.descripcion}</p>
                        <p>Talle: ${producto.talle}</p>
                        <p>Cantidad: <input type="number" min="1" step="1" value="${producto.cantidad}"></p>
                        <p>$${producto.precio}</p>
                    </div>
                    <div>
                        <button>Borrar</button>
                    </div>     
                </div>
            `
            console.log("va")
    compras.appendChild(li);
})
