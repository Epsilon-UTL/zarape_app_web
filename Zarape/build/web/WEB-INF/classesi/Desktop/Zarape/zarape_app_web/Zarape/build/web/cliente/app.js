let servidor = window.location.hostname === 'localhost'
        ? 'http://localhost:8082/zarapeWeb/api/'
        : 'http://192.168.1.8:8082/zarapeWeb/api/';
let apiAlimentos = 'alimento/getAllAlimento';
let apiBebidas = 'bebida/getAllBebida';
let apiTicket = 'ticket/agregarTicket';
let apiComanda = 'comanda/agregarComanda';

document.addEventListener("DOMContentLoaded", () => {
    // Obtener alimentos
    fetch(servidor + apiAlimentos)
            .then(response => response.json())
            .then(datos => {
                const container = document.getElementById('productos-container');
                datosArticulos = datos;
                console.log(datosArticulos);
                datos.forEach(item => {
                    agregarProductoAlContenedor(item.producto, container);
                });
            })
            .catch(error => console.error('Error al obtener los datos de alimentos:', error));

    // Obtener bebidas
    fetch(servidor + apiBebidas)
            .then(response => response.json())
            .then(datos => {
                datosBebidas = datos;
                console.log(datosBebidas);
                const container = document.getElementById('bebidas-container');
                datos.forEach(item => {
                    agregarProductoAlContenedor(item.producto, container);
                });
            })
            .catch(error => console.error('Error al obtener los datos de bebidas:', error));
});

let datosArticulos = [];
let datosBebidas = [];
let longPressTimer;
let currentProducto = null;

function startLongPress(event, producto) {
    event.preventDefault();
    longPressTimer = setTimeout(() => {
        currentProducto = producto;
        mostrarModalProducto(producto);
    }, 500);
}

function clearLongPress() {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
    }
}

function mostrarModalProducto(productoId) {
    console.log(productoId);
    let producto = datosArticulos.find(a => a.producto.idProducto == productoId)?.producto;

    if (!producto) {
        producto = datosBebidas.find(b => b.producto.idProducto == productoId)?.producto;
    }

    const modalImagen = document.getElementById('modalImagen');
    const modalNombre = document.getElementById('modalNombre');
    const modalDescripcion = document.getElementById('modalDescripcion');
    const modalPrecio = document.getElementById('modalPrecio');
    const modalNombreModal = document.getElementById('productoModalLabel');

    if (!producto) {
        console.error('Producto no encontrado');
        return;
    }

    let imagenSrc = producto.foto;
    if (!imagenSrc.startsWith('data:image')) {
        imagenSrc = `data:image/jpeg;base64,${producto.foto}`;
    }

    modalImagen.src = imagenSrc;
    modalNombre.textContent = producto.nombre;
    modalNombreModal.textContent = producto.nombre;
    modalDescripcion.textContent = producto.descripcion;
    if (producto && producto.precio !== undefined) {
        modalPrecio.innerHTML = `<strong>Precio: </strong>$${producto.precio}`;
    } else {
        modalPrecio.innerHTML = `<strong>Precio no disponible</strong>`;
    }

    // Limpiar y mostrar categoría del producto
    const modalCategoria = document.createElement('p');
    modalCategoria.innerHTML = `<strong>Categoría: </strong>${producto.categoria.descripcion}`;
    modalDescripcion.innerHTML = ''; // Limpiar descripción antes de agregar
    modalDescripcion.appendChild(modalCategoria);

    console.log(producto);

    const modal = new bootstrap.Modal(document.getElementById('productoModal'));
    modal.show();
}

const IVA = 0.16;
let pedidos = [];

function agregarPedido(producto) {
    let pedidoExistente = pedidos.find(p => p.idProducto === producto.idProducto);

    if (pedidoExistente) {
        pedidoExistente.cantidad += 1;
    } else {
        pedidos.push({...producto, cantidad: 1});
    }

    actualizarComanda();
    actualizarCantidadEnTarjeta(producto.idProducto);
}

function actualizarCantidadEnTarjeta(idProducto) {
    let pedido = pedidos.find(p => p.idProducto === idProducto);
    let cantidadSpan = document.getElementById(`cantidad-${idProducto}`);

    if (cantidadSpan) {
        if (pedido && pedido.cantidad > 0) {
            cantidadSpan.textContent = `Cantidad actual: ${pedido.cantidad}`;
            cantidadSpan.style.display = "inline"; // Mostrar etiqueta
        } else {
            cantidadSpan.style.display = "none"; // Ocultar etiqueta si la cantidad es 0
        }
    }
}


function actualizarComanda() {
    const pedidosLista = document.getElementById('pedidos-lista');
    const subtotalElem = document.getElementById('subtotal');
    const ivaElem = document.getElementById('iva');
    const totalElem = document.getElementById('total');

    pedidosLista.innerHTML = ''; // Limpia la lista antes de actualizar
    let subtotal = 0;

    pedidos.forEach(pedido => {
        let importe = pedido.precio * pedido.cantidad;
        subtotal += importe;

        const listItem = document.createElement('li');
        listItem.className = 'nav-item text-white p-2 border-bottom';
        listItem.dataset.idProducto = pedido.idProducto;

        listItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <button class="btn btn-sm btn-outline-light me-2" onclick="modificarCantidad(${pedido.idProducto}, -1)">-</button>
                <span class="cantidad">${pedido.cantidad}</span>
                <button class="btn btn-sm btn-outline-light ms-2" onclick="modificarCantidad(${pedido.idProducto}, 1)">+</button>
            </div>
            <div class="fw-bold">${pedido.nombre}</div>
            <div class="text-muted">Precio: $${pedido.precio.toFixed(2)}</div>
            <div class="text-end fw-bold">Importe: $${importe.toFixed(2)}</div>
        `;

        pedidosLista.appendChild(listItem);
    });

    let iva = subtotal * IVA;
    let total = subtotal + iva;

    subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
    ivaElem.textContent = `$${iva.toFixed(2)}`;
    totalElem.textContent = `$${total.toFixed(2)}`;
}

function modificarCantidad(idProducto, cambio) {
    let pedido = pedidos.find(p => p.idProducto === idProducto);
    if (!pedido)
        return;

    pedido.cantidad += cambio;
    if (pedido.cantidad <= 0) {
        pedidos = pedidos.filter(p => p.idProducto !== idProducto);
    }

    actualizarComanda();
    actualizarCantidadEnTarjeta(idProducto);
}

function agregarProductoAlContenedor(producto, container) {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-3';

    let imagenSrc = producto.foto;
    if (!imagenSrc.startsWith('data:image')) {
        imagenSrc = `data:image/jpeg;base64,${producto.foto}`;
    }

    card.innerHTML = `
        <div class="card producto-card" 
             onclick='agregarPedido(${JSON.stringify(producto)})'
             ontouchstart="startLongPress(event, '${producto.nombre}')"
             ontouchend="clearLongPress()"
             onmousedown="startLongPress(event, '${producto.idProducto}')"
             onmouseup="clearLongPress()"
             onmouseleave="clearLongPress()">
             
            <img src="${imagenSrc}" class="card-img-top" alt="${producto.nombre}" 
                 onerror="this.src='imagenes/tacos.png';">
            
            <div class="card-body">
                <!-- Etiqueta de cantidad con ID único -->
                <span id="cantidad-${producto.idProducto}" class="badge bg-success mb-2" style="display: none;">
                    Cantidad actual: 0
                </span>

                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">${producto.descripcion}</p>
                <p class="card-text"><strong>Precio: </strong>$${producto.precio}</p>
            </div>
        </div>
    `;
    container.appendChild(card);
}


function guardarPedido() {
    if (pedidos.length === 0) {
        alert("No hay pedidos para guardar.");
        return;
    }
    alert("Pedido guardado correctamente");
    cancelarPedido();
}

function cancelarPedido() {
    pedidos = [];
    actualizarComanda();
    window.location.reload();
}

document.getElementById('pagoTipo').addEventListener('change', function () {
    const tipoPago = this.value;

    // Ocultar todos los campos primero
    document.getElementById('tarjetaInfo').style.display = 'none';
    document.getElementById('paypalInfo').style.display = 'none';

    // Mostrar los campos según el tipo de pago seleccionado
    if (tipoPago === 'tarjeta') {
        document.getElementById('tarjetaInfo').style.display = 'block';
    } else if (tipoPago === 'paypal') {
        document.getElementById('paypalInfo').style.display = 'block';
    }
});

function mostrarModalPago() {
    const resumenLista = document.getElementById('resumenLista');
    const resumenSubtotal = document.getElementById('resumenSubtotal');
    const resumenIva = document.getElementById('resumenIva');
    const resumenTotal = document.getElementById('resumenTotal');

    // Limpiar la lista antes de actualizar
    resumenLista.innerHTML = '';

    let subtotal = 0;

    // Agregar cada pedido al resumen
    pedidos.forEach(pedido => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <span>${pedido.nombre} x ${pedido.cantidad}</span>
                <span>$${(pedido.precio * pedido.cantidad).toFixed(2)}</span>
            </div>
        `;
        resumenLista.appendChild(listItem);

        subtotal += pedido.precio * pedido.cantidad;
    });

    // Calcular IVA y total
    const iva = subtotal * IVA;
    const total = subtotal + iva;

    // Actualizar los totales en el resumen
    resumenSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    resumenIva.textContent = `$${iva.toFixed(2)}`;
    resumenTotal.textContent = `$${total.toFixed(2)}`;

    // Mostrar el modal de pago
    const pagoModal = new bootstrap.Modal(document.getElementById('pagoModal'));
    document.getElementById('pagoMensaje').innerText = '';
    pagoModal.show();
}

function realizarPago() {
    const tipoPago = document.getElementById('pagoTipo').value;
    let mensaje = "";
    const pagoModal = new bootstrap.Modal(document.getElementById('pagoModal'));

    if (tipoPago === "tarjeta") {
        const numeroTarjeta = document.getElementById('tarjetaNumero').value;
        if (!numeroTarjeta) {
            mensaje = "Por favor, ingresa un número de tarjeta válido.";
        } else {
            mensaje = `Pago realizado con tarjeta terminada en ${numeroTarjeta.slice(-4)}. ¡Pago exitoso!`;
            const modal = bootstrap.Modal.getInstance(document.getElementById('pagoModal'));
            modal.hide();

            setTimeout(() => {
                window.location.reload();
            }, 2000);
            cancelarPedido();

        }
    } else if (tipoPago === "paypal") {
        const correoPaypal = document.getElementById('paypalCorreo').value;
        if (!correoPaypal) {
            mensaje = "Por favor, ingresa un correo de PayPal válido.";
        } else {
            mensaje = `Pago realizado con PayPal. ¡Pago exitoso!`;
            const modal = bootstrap.Modal.getInstance(document.getElementById('pagoModal'));
            modal.hide();

            setTimeout(() => {
                window.location.reload();
            }, 2000);
            cancelarPedido();
        }
    } else if (tipoPago === "efectivo") {
        mensaje = "Pago realizado en efectivo. ¡Pago exitoso!";
        const modal = bootstrap.Modal.getInstance(document.getElementById('pagoModal'));
        modal.hide();

        setTimeout(() => {
            window.location.reload();
        }, 2000);
        cancelarPedido();
    } else {
        mensaje = "Por favor, selecciona un método de pago.";
    }

    document.getElementById('pagoMensaje').innerText = mensaje;
}