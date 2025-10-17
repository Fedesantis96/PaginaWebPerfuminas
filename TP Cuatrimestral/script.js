// -------------------- SLIDER FUNCIONAL --------------------
let indice = 0;

function moverSlider(direccion) {
    const imagenes = document.querySelector(".imagenes");
    const total = imagenes.children.length;
    const imagen = imagenes.children[0];
    const ancho = imagen.clientWidth + 20; // ancho de imagen + margen

    // Actualizar índice circular
    if (direccion === "izquierda") {
        indice = (indice - 1 + total) % total;
    } else if (direccion === "derecha") {
        indice = (indice + 1) % total;
    }

    // Mover el contenedor
    imagenes.style.transform = `translateX(-${indice * ancho}px)`;
}

// Eventos a las flechas
document.addEventListener("DOMContentLoaded", () => {
    const btnIzq = document.querySelector(".arrow.left");
    const btnDer = document.querySelector(".arrow.right");

    if (btnIzq && btnDer) {
        btnIzq.addEventListener("click", () => moverSlider("izquierda"));
        btnDer.addEventListener("click", () => moverSlider("derecha"));
    }
});

// -------------------- CARRITO BÁSICO --------------------
function agregarProducto(nombre) {
    const fragancia = document.getElementById("fragancia").value;
    const tamanoSelect = document.getElementById("tamano");
    const tamano = tamanoSelect.options[tamanoSelect.selectedIndex].text;
    const precio = parseFloat(tamanoSelect.options[tamanoSelect.selectedIndex].dataset.precio);

    const producto = { nombre, fragancia, tamano, precio };

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert(`${nombre} ${tamano} de ${fragancia} agregado al carrito por $${precio.toLocaleString("es-AR")}`);
}