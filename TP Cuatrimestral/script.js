/* ================= SLIDER CIRCULAR MEJORADO ================= */
document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".imagenes");
    if (slider) {
        const btnIzq = document.querySelector(".arrow.left");
        const btnDer = document.querySelector(".arrow.right");
        let imagenes = slider.querySelectorAll("img");
        const total = imagenes.length;

        // si no hay imágenes, salir
        if (total === 0) return;

        // clonamos para efecto circular
        const primera = imagenes[0];
        const ultima = imagenes[imagenes.length - 1];
        const clonPrimera = primera.cloneNode(true);
        const clonUltima = ultima.cloneNode(true);

        slider.insertBefore(clonUltima, primera);
        slider.appendChild(clonPrimera);

        // recalc imagenes después de clonar
        imagenes = slider.querySelectorAll("img");

        let indice = 1;
        let ancho = imagenes[0].clientWidth;
        let bloqueado = false;

        // posicion inicial
        slider.style.transform = `translateX(-${ancho * indice}px)`;

        function moverSlider(direccion) {
            if (bloqueado) return;
            bloqueado = true;
            indice += direccion === "derecha" ? 1 : -1;
            slider.style.transition = "transform 0.5s ease";
            slider.style.transform = `translateX(-${ancho * indice}px)`;
        }

        slider.addEventListener("transitionend", () => {
            if (indice === 0) {
                slider.style.transition = "none";
                indice = total;
                slider.style.transform = `translateX(-${ancho * indice}px)`;
            } else if (indice === total + 1) {
                slider.style.transition = "none";
                indice = 1;
                slider.style.transform = `translateX(-${ancho * indice}px)`;
            }
            // pequeño delay para reactivar botones
            setTimeout(() => (bloqueado = false), 20);
        });

        if (btnIzq) btnIzq.addEventListener("click", () => moverSlider("izquierda"));
        if (btnDer) btnDer.addEventListener("click", () => moverSlider("derecha"));

        window.addEventListener("resize", () => {
            // recalcular ancho si cambia la ventana
            ancho = imagenes[0].clientWidth;
            slider.style.transition = "none";
            slider.style.transform = `translateX(-${ancho * indice}px)`;
        });
    }
});

/* ================= TOAST (MENSAJES SUAVES) ================= */
function mostrarToast(mensaje) {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    // Forzar reflow y mostrar
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

/* ================= CARGAR / GESTIONAR CARRITO ================= */
function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contenedor = document.getElementById("carrito-items");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, index) => {
        const precioNum = Number(producto.precio) || 0;
        total += precioNum;
        const item = document.createElement("div");
        item.className = "carrito-item";
        item.innerHTML = `
      <p><strong>${producto.nombre}</strong> - ${producto.fragancia} (${producto.tamano})</p>
      <p>Precio: $${precioNum.toLocaleString("es-AR")}</p>
      <button onclick="eliminarProducto(${index})" class="btn-eliminar">Eliminar</button>
    `;
        contenedor.appendChild(item);
    });

    const totalElem = document.getElementById("total");
    if (totalElem) totalElem.textContent = `Total: $${total.toLocaleString("es-AR")}`;
    actualizarContadorCarrito();
}

function eliminarProducto(indice) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(indice, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
}

/* seguridad: el ?. evita error si no existe el elemento en la página */
document.getElementById("vaciar-carrito").addEventListener("click", () => {
    localStorage.removeItem("carrito");
    cargarCarrito();
    mostrarToast("Carrito vaciado 🗑️");
});

/* formulario de compra */
document.getElementById("form-compra").addEventListener("submit", function(e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;
    const observaciones = document.getElementById("observaciones").value;

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agregá productos antes de enviar el pedido.");
        return;
    }

    let resumen = `Pedido de ${nombre}:\nCorreo: ${correo}\nTel: ${telefono}\nDirección: ${direccion}\n\nProductos:\n`;
    carrito.forEach(p => {
        const precioNum = Number(p.precio) || 0;
        resumen += `- ${p.nombre} (${p.fragancia}, ${p.tamano}) - $${precioNum.toLocaleString("es-AR")}\n`;
    });
    const total = carrito.reduce((acc, p) => acc + (Number(p.precio) || 0), 0);
    resumen += `\nTotal: $${total.toLocaleString("es-AR")}\n\nObservaciones: ${observaciones}`;

    alert(resumen + "\n\n¡Gracias por tu compra!");
    localStorage.removeItem("carrito");
    cargarCarrito();
    this.reset();
    mostrarToast("Pedido enviado ✅");
});

/* ================ CONTADOR DE CARRITO ================= */
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contador = document.getElementById('cart-count');
    if (contador) contador.textContent = carrito.length;
}

/* ================ AGREGAR PRODUCTO (usá onclick) ================ */
/* ejemplo de uso en HTML: <button onclick="agregarProducto('Vela Aromática')">Agregar</button> */
function agregarProducto(nombre) {
    const fragancia = document.getElementById('fragancia').value || 'Sin fragancia';
    const tamanoSelect = document.getElementById('tamano');
    const tamano = tamanoSelect.options[tamanoSelect.selectedIndex].text || 'Único';
    const precio = parseFloat(tamanoSelect.selectedOptions[0].dataset.precio) || 0;

    const nuevoProducto = { nombre, fragancia, tamano, precio };
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(nuevoProducto);
    localStorage.setItem('carrito', JSON.stringify(carrito));

    mostrarToast(`${nombre} agregado al carrito 🛍️`);
    actualizarContadorCarrito();
    if (document.getElementById("carrito-items")) cargarCarrito();
}


/* ================ INICIALIZACIÓN (al cargar la página) ================ */
document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
    cargarCarrito();
});


/* ================ BOTÓN VOLVER ARRIBA ================= */
document.addEventListener("DOMContentLoaded", () => {
    const btnArriba = document.getElementById("btn-volver-arriba");
    if (!btnArriba) return;

    window.addEventListener("scroll", () => {
        btnArriba.style.display = window.scrollY > 300 ? "block" : "none";
    });

    btnArriba.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});


function mostrarToast(mensaje) {
    // Eliminar toasts anteriores para no superponer
    const anterior = document.querySelector(".toast");
    if (anterior) anterior.remove();

    // Crear el toast
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerHTML = `<span class="icon">🛍️</span> <span>${mensaje}</span>`;
    document.body.appendChild(toast);

    // Forzar reflow para activar transición
    requestAnimationFrame(() => toast.classList.add("show"));

    // Ocultar y eliminar después de 2.5 segundos
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}


function calcularTotal() {
    // Obtener las cantidades ingresadas
    const velaPeq = parseInt(document.getElementById("velaPeq").value) || 0;
    const velaGr = parseInt(document.getElementById("velaGr").value) || 0;
    const perf250 = parseInt(document.getElementById("perf250").value) || 0;
    const perf500 = parseInt(document.getElementById("perf500").value) || 0;
    const difCh = parseInt(document.getElementById("difCh").value) || 0;
    const difGr = parseInt(document.getElementById("difGr").value) || 0;
    const servBasico = parseInt(document.getElementById("servBasico").value) || 0;
    const servExtra = parseInt(document.getElementById("servExtra").value) || 0;
    const servCompleto = parseInt(document.getElementById("servCompleto").value) || 0;

    // Precios unitarios
    const precios = {
        velaPeq: 10000,
        velaGr: 20000,
        perf250: 8000,
        perf500: 16000,
        difCh: 5000,
        difGr: 10000,
        servBasico: 150000,
        servExtra: 350000,
        servCompleto: 650000
    };

    // Calcular total
    const total =
        velaPeq * precios.velaPeq +
        velaGr * precios.velaGr +
        perf250 * precios.perf250 +
        perf500 * precios.perf500 +
        difCh * precios.difCh +
        difGr * precios.difGr +
        servBasico * precios.servBasico +
        servExtra * precios.servExtra +
        servCompleto * precios.servCompleto;

    // Mostrar resultado formateado
    document.getElementById("resultado").textContent =
        `Total: $${total.toLocaleString("es-AR")}`;
}


function mostrarToast(mensaje) {
    const toast = document.createElement("div");
    toast.textContent = mensaje;
    toast.classList.add("toast");
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}