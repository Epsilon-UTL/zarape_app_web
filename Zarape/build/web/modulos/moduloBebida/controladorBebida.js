let listBebida = [];
let listCategoriaBebida =[];

export function loadCategoriaBd() {
    let v_categoria = document.getElementById("categoria");
    listCategoriaBebida.forEach(
            categoria=>{
                let v_option = document.createElement("option");
                v_option.value = categoria.idCategoria;
                v_option.text = categoria.descripcion;
                v_categoria.appendChild(v_option);
            }
            );
}

fetch('http://localhost:8080/Zarape/api/categoria/getAllCategoriaBebidas')
        .then(response=> response.json())
        .then(
            datos=>{
                console.log(datos);
                listCategoriaBebida=datos;
                    loadCategoriaBd();
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

export function loadBebida(){
    mostrarInactivos();
    }
    const username=localStorage.getItem("nombreUsuario");
    fetch('http://localhost:8080/Zarape/api/bebida/getAllBebida',{
        method:"GET",
        headers:{
            "username":username,
            "Content-Type":"application/json"
        }
    })
        .then(response=>response.json())
        .then(
        registro=>{
            console.log(registro);
            listBebida=registro;
            loadBebida();
        });

export function agregarBebida() {
    let v_idBebida = document.getElementById("idBebida").value;
    let v_idProducto = idproducto || -1;
    let v_nombre = document.getElementById("nombre").value;
    let v_precio = document.getElementById("precio").value;
    let v_descripcion = document.getElementById("descripcion").value;
    let v_foto = document.getElementById("foto").value;
    let v_categoria = document.getElementById("categoria").value;

    let bebida = {
        "idBebida": v_idBebida || -1,
        "producto": {
            "idProducto": v_idProducto,
            "nombre": v_nombre,
            "descripcion": v_descripcion,
            "foto": v_foto,
            "precio": v_precio,
            "categoria": {
                "idCategoria": v_categoria,
                "nombre": "",
                "tipo": "B",
                "activo": 0
            },
            "activo": 0
        }
    };

    let datos_servidor = { datosBebida: JSON.stringify(bebida) };
    let parametro = new URLSearchParams(datos_servidor);

    let username = localStorage.getItem("nombreUsuario");

    let registro = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "username": username
        },
        body: parametro
    };

    fetch('http://localhost:8080/Zarape/api/bebida/agregarBebida', registro)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            return fetch('http://localhost:8080/Zarape/api/bebida/getAllBebida');
        })
        .then(response => response.json())
        .then(registro => {
            listBebida = registro;
            loadBebida();
        })
        .catch(error => console.error("Error al agregar la bebida:", error));
}


let idproducto = null;
export function selectRegistro(indice) { 
    document.getElementById("idBebida").value = listB6666/ebida[indice].idBebida;
    document.getElementById("nombre").value = listBebida[indice].producto.nombre;
    document.getElementById("precio").value = listBebida[indice].producto.precio;
    document.getElementById("descripcion").value = listBebida[indice].producto.descripcion;
    document.getElementById("categoria").value = listBebida[indice].producto.categoria.idCategoria;
    document.getElementById("foto").value = listBebida[indice].producto.foto;
    idproducto = listBebida[indice].producto.idProducto;
    console.log(idproducto);
    mostrarFormulario();
}

function cargarFotografia() {
    let inputFile = document.getElementById("inputFileFotoBebida");
    if (inputFile.files && inputFile.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let fotoB64 = e.target.result.split(",")[1];
            document.getElementById("imgFoto").src = e.target.result;
            document.getElementById("txtaFotoNuevaBebida").value = fotoB64;
        };
        reader.readAsDataURL(inputFile.files[0]);
    }
}

export function eliminarBebida() {
    let v_idProducto = idproducto;  // Asegúrate de que idproducto está definido
    let datos_servidor = { idProducto: v_idProducto };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "username": localStorage.getItem("nombreUsuario") // Agregamos el username aquí
        },
        body: parametro
    };

    fetch('http://localhost:8080/Zarape/api/bebida/eliminarBebida', registro)
        .then(response => response.json())
        .then(json => {
            console.log(json);
        })
        .catch(error => console.error("Error al eliminar la bebida:", error));

    limpiar();
    cancelarFormulario();
    mostrarInactivos();
}

export function limpiar() {
    document.getElementById("idBebida").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = '';
    document.getElementById("descripcion").value ='';
    document.getElementById("categoria").value = null;
}

export function mostrarInactivos() {
    const btnGuardar = document.getElementById("btn-agregar");
    const btnEliminar = document.getElementById("btn-eliminar");
    let mostrarActivos = document.getElementById("activos").checked;
    let table = document.getElementById("renglones");
    let renglon = "";
    listBebida.forEach(registro=>{
        if (mostrarActivos && registro.producto.activo === 1) {
            renglon += `
        <tr onclick="controladorGra1.selectRegistro(${listBebida.indexOf(registro)});">
        <td>${registro.producto.nombre}</td>
        <td>${registro.producto.descripcion}</td>
        <td>${registro.producto.precio}</td>
        <td>${registro.producto.categoria.descripcion}</td>
        <td><img src="data:image/png;base64,${registro.producto.foto || ''}" alt="Foto Bebida" width="50"></td>
        </tr>`;
            btnGuardar.classList.remove("d-none");
            btnEliminar.classList.remove("d-none");
        } else if(!mostrarActivos && registro.producto.activo === 0) {
            renglon += `
        <tr onclick="controladorGra1.selectRegistro(${listBebida.indexOf(registro)});">
        <td>${registro.producto.nombre}</td>
        <td>${registro.producto.descripcion}</td>
        <td>${registro.producto.precio}</td>
        <td>${registro.producto.categoria.descripcion}</td>
        <td><img src="data:image/png;base64,${registro.producto.foto || ''}" alt="Foto Bebida" width="50"></td>
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