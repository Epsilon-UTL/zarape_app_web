/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

let listAlimento = [];
let listBebida = [];

let ticket = [];

function agregarProducto(producto) {
    let productoBase = producto.producto;

    const productoExistente = ticket.find(p => p.idProducto === productoBase.idProducto);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        ticket.push({
            idProducto: productoBase.idProducto,
            nombre: productoBase.nombre,
            precio: productoBase.precio,
            cantidad: 1
        });
    }
}

function calcularTotal() {
    let total = 0;
    ticket.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });
    return total;
}

function mostrarTicket() {
    ticket.forEach((producto, index) => {
        console.log(`${index + 1}. ${producto.nombre} - $${producto.precio} x ${producto.cantidad} = $${producto.precio * producto.cantidad}`);
    });
}


fetch('http://localhost:8080/Zarape/api/alimento/getAllAlimento')
    .then(response=>response.json())
    .then(
    registro=>{
        console.log(registro);
        listAlimento=registro;
    });


fetch('http://localhost:8080/Zarape/api/bebida/getAllBebida')
    .then(response=>response.json())
    .then(
    registro=>{
        console.log(registro);
        listBebida=registro;
    });


// Abrir el modal
document.getElementById('openModal').addEventListener('click', function() {
    document.getElementById('myModal').style.display = 'block';
    setTimeout(() => {
        document.getElementById('myModal').classList.add('open');
    }, 10);
});

// Cerrar el modal
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('myModal').classList.remove('open');
    setTimeout(() => {
        document.getElementById('myModal').style.display = 'none';
    }, 300);
});


