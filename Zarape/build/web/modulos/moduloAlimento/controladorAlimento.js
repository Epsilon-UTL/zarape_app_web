/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */
let listAlimento = [];
let listCategoriaAlimento = [];

export function loadCategoriaAlm() {
    let v_categoria = document.getElementById("categoriaAlm");
    listCategoriaAlimento.forEach(
            categoria=>{
                let v_option = document.createElement("option");
                v_option.value = categoria.idCategoria;
                v_option.text = categoria.descripcion;
                v_categoria.appendChild(v_option);
            }
            );
}

fetch('http://localhost:8080/Zarape/api/categoria/getAllCategoriaAlimentos')
        .then(response=> response.json())
        .then(
            datos=>{
                console.log(datos);
                listCategoriaAlimento=datos;
                loadCategoriaAlm();
            }
        );


export function mostrarFormulario() {
    const formularioContenedor = document.getElementById("formulario-contenedor");
    const btnGuardar = document.getElementById("btn-agregar");
    btnGuardar.classList.add("d-none");
    formularioContenedor.classList.remove("d-none"); // Muestra el formulario
}

export function cancelarFormulario() {
    const formularioContenedor = document.getElementById("formulario-contenedor");
    const btnGuardar = document.getElementById("btn-agregar");
    btnGuardar.classList.remove("d-none");
    formularioContenedor.classList.add("d-none"); // Oculta el formulario
    limpiar();
}

    export function loadAlimento(){
        controladorGra1.mostrarInactivos();
    }
    
    fetch('http://localhost:8080/Zarape/api/alimento/getAllAlimento')
        .then(response=>response.json())
        .then(
        registro=>{
            console.log(registro);
            listAlimento=registro;
            loadAlimento();
        });

    export function agregarAlimento() {
    let v_idAlimento = document.getElementById("idAlimento").value || -1;
    let v_idProducto = idproducto || -1;
    let v_nombre = document.getElementById("nombre").value;
    let v_precio = document.getElementById("precio").value;
    let v_descripcion = document.getElementById("descripcion").value;
    let v_categoria = document.getElementById("categoriaAlm").value;
    let v_foto = document.getElementById("foto").value;
    let alimento = {
        "idAlimento": v_idAlimento,
        "producto": {
            "idProducto": v_idProducto,
            "nombre": v_nombre,
            "descripcion": v_descripcion,
            "foto": v_foto,
            "precio": v_precio,
            "categoria": {
                "idCategoria": v_categoria,
                "nombre": "",
                "activo": 0},
            "activo": 0}
    };

    let datos_servidor = { datosAlimento: JSON.stringify(alimento) };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };
    fetch('http://localhost:8080/Zarape/api/alimento/agregarAlimento', registro)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            fetch('http://localhost:8080/Zarape/api/alimento/getAllAlimento')
            .then(response => response.json())
            .then(
                registro => {
                    listAlimento = registro;
                    loadAlimento();
                }
            );
    })
        .catch(error => console.error("Error al agregar el alimento:", error));
        limpiar();
        cancelarFormulario();
}


export function eliminarAlimento() {
    let v_idProducto = idproducto;
    let datos_servidor = { idProducto: v_idProducto };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };

    fetch('http://localhost:8080/Zarape/api/alimento/eliminarAlimento', registro)
        .then(response => response.json())
        .then(json => {
            console.log(json);

            fetch('http://localhost:8080/Zarape/api/alimento/getAllAlimento')
                .then(response => response.json())
                .then(registro => {
                    listAlimento = registro; // Actualiza la lista en memoria
                    mostrarInactivos(); // Refresca la tabla con los datos actualizados
                })
                .catch(error => console.error("Error al obtener la lista de alimentos:", error));
        })
        .catch(error => console.error("Error al eliminar el alimento:", error));

    limpiar(); // Limpia los campos del formulario
    cancelarFormulario(); // Oculta el formulario
}



let idproducto = null;
export function selectRegistro(indice) { 
    document.getElementById("idAlimento").value = listAlimento[indice].idAlimento;
    document.getElementById("nombre").value = listAlimento[indice].producto.nombre;
    document.getElementById("precio").value = listAlimento[indice].producto.precio;
    document.getElementById("descripcion").value = listAlimento[indice].producto.descripcion;
    document.getElementById("categoriaAlm").value = listAlimento[indice].producto.categoria.idCategoria;
    document.getElementById("foto").value = listAlimento[indice].producto.foto;
    idproducto = listAlimento[indice].producto.idProducto;
    console.log(idproducto);
    mostrarFormulario();
}

function cargarFotografia() {
    let inputFile = document.getElementById("inputFileFotoAlimento");
    if (inputFile.files && inputFile.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let fotoB64 = e.target.result.split(",")[1];
            document.getElementById("imgFoto").src = e.target.result;
            document.getElementById("txtaFotoNuevaAlimento").value = fotoB64;
        };
        reader.readAsDataURL(inputFile.files[0]);
    }
}

 export function limpiar() {
    document.getElementById("idAlimento").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = '';
    document.getElementById("descripcion").value ='';
    document.getElementById("categoriaAlm").value = null;
}

export function mostrarInactivos() {
    const btnGuardar = document.getElementById("btn-agregar");
    const btnEliminar = document.getElementById("btn-eliminar");
    let mostrarActivos = document.getElementById("activos").checked;
    let table = document.getElementById("renglones");
    let renglon = "";
    listAlimento.forEach(registro=>{
        if (mostrarActivos && registro.producto.activo === 1) {
            renglon += `
    <tr onclick="controladorGra1.selectRegistro(${listAlimento.indexOf(registro)});">
        <td>${registro.producto.nombre}</td>
        <td>${registro.producto.descripcion}</td>
        <td>${registro.producto.precio}</td>
        <td>${registro.producto.categoria.descripcion}</td>
        <td><img src="data:image/png;base64,${registro.producto.foto || ''}" alt="Foto Alimento" width="50"></td>
    </tr>`;
            btnGuardar.classList.remove("d-none");
            btnEliminar.classList.remove("d-none");
        } else if(!mostrarActivos && registro.producto.activo === 0) {
            renglon += `
    <tr onclick="controladorGra1.selectRegistro(${listAlimento.indexOf(registro)});">
        <td>${registro.producto.nombre}</td>
        <td>${registro.producto.descripcion}</td>
        <td>${registro.producto.precio}</td>
        <td>${registro.producto.categoria.descripcion}</td>
        <td><img src="data:image/png;base64,${registro.producto.foto || ''}" alt="Foto Alimento" width="50"></td>
    </tr>`;
            btnGuardar.classList.add("d-none");
            btnEliminar.classList.add("d-none");
        }
        });
        table.innerHTML=renglon;
}

function toggleDropdown() {
    limpiar();
    document.getElementById("myDropdown").classList.toggle("show");
}
