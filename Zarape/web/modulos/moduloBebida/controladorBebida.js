let listBebida = [];
let listCategoriaBebida = [];
let idproducto = null;

// Función para cargar las categorías de bebidas
export function loadCategoriaBd() {
    let v_categoria = document.getElementById("categoria");
    v_categoria.innerHTML = ""; // Limpiar opciones existentes
    
    listCategoriaBebida.forEach(categoria => {
        let v_option = document.createElement("option");
        v_option.value = categoria.idCategoria;
        v_option.text = categoria.descripcion;
        v_categoria.appendChild(v_option);
    });
}

// Cargar categorías al iniciar
fetch('http://localhost:8080/Zarape/api/categoria/getAllCategoriaBebidas')
    .then(response => response.json())
    .then(datos => {
        console.log(datos);
        listCategoriaBebida = datos;
        loadCategoriaBd();
    })
    .catch(error => console.error("Error al cargar categorías:", error));

// Función para mostrar/ocultar el formulario
export function mostrarFormulario() {
    const formularioContenedor = document.getElementById("formulario-contenedor");
    const btnGuardar = document.getElementById("btn-agregar");
    btnGuardar.classList.add("d-none");
    formularioContenedor.classList.remove("d-none");
}

export function cancelarFormulario() {
    const formularioContenedor = document.getElementById("formulario-contenedor");
    const btnGuardar = document.getElementById("btn-agregar");
    btnGuardar.classList.remove("d-none");
    formularioContenedor.classList.add("d-none");
    limpiar();
}

// Función para cargar las bebidas
export function loadBebida() {
    const username = localStorage.getItem("nombreUsuario");
    fetch('http://localhost:8080/Zarape/api/bebida/getAllBebida', {
        method: "GET",
        headers: {
            "username": username,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(registro => {
        console.log(registro);
        listBebida = registro;
        mostrarInactivos();
    })
    .catch(error => console.error("Error al cargar bebidas:", error));
}

// Función para agregar una nueva bebida
export function agregarBebida() {
    let v_idBebida = document.getElementById("idBebida").value || -1;
    let v_idProducto = idproducto || -1;
    let v_nombre = document.getElementById("nombre").value;
    let v_precio = document.getElementById("precio").value;
    let v_descripcion = document.getElementById("descripcion").value;
    let v_categoria = document.getElementById("categoria").value;
    let v_foto = document.getElementById("txtaFotoNuevaBebida").value; // Base64 sin prefijo

    if (!v_nombre || !v_precio || !v_descripcion || !v_categoria) {
        alert("Por favor complete todos los campos obligatorios");
        return;
    }

    let bebida = {
        "idBebida": v_idBebida,
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
            if (json.message === "success") {
                alert("Bebida guardada exitosamente");
                return fetch('http://localhost:8080/Zarape/api/bebida/getAllBebida');
            } else {
                throw new Error(json.message || "Bebida guardada exitosamente");
            }
        })
        .then(response => response.json())
        .then(registro => {
            listBebida = registro;
            loadBebida();
            cancelarFormulario();
        })
        .catch(error => {
            console.error("Error:", error);
            alert(error.message);
        });
}

// Función para seleccionar un registro de la tabla
export function selectRegistro(indice) { 
    if (indice >= 0 && indice < listBebida.length) {
        let bebida = listBebida[indice];
        document.getElementById("idBebida").value = bebida.idBebida;
        document.getElementById("nombre").value = bebida.producto.nombre;
        document.getElementById("precio").value = bebida.producto.precio;
        document.getElementById("descripcion").value = bebida.producto.descripcion;
        document.getElementById("categoria").value = bebida.producto.categoria.idCategoria;
        document.getElementById("txtaFotoNuevaBebida").value = bebida.producto.foto;
        
        let imgFoto = document.getElementById("imgFoto");
        if (bebida.producto.foto) {
            imgFoto.src = `data:image/jpeg;base64,${bebida.producto.foto}`;
            imgFoto.style.display = "block";
        } else {
            imgFoto.src = "";
            imgFoto.style.display = "none";
        }
        
        idproducto = bebida.producto.idProducto;
        mostrarFormulario();
    }
}

// Función para eliminar una bebida
export function eliminarBebida() {
    if (!idproducto) {
        alert("No hay bebida seleccionada para eliminar");
        return;
    }

    if (!confirm("¿Está seguro que desea eliminar esta bebida?")) {
        return;
    }

    let datos_servidor = { idProducto: idproducto };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "username": localStorage.getItem("nombreUsuario")
        },
        body: parametro
    };

    fetch('http://localhost:8080/Zarape/api/bebida/eliminarBebida', registro)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            if (json.message === "success") {
                alert("Bebida eliminada exitosamente");
                loadBebida();
                cancelarFormulario();
            } else {
                throw new Error(json.message || "Bebida eliminada exitosamente");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert(error.message);
        });
}

// Función para manejar la carga de fotos
export function cargarFotografia() {
    let inputFile = document.getElementById("foto");
    let imgFoto = document.getElementById("imgFoto");
    let txtaFoto = document.getElementById("txtaFotoNuevaBebida");

    if (inputFile.files && inputFile.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let fotoB64 = e.target.result.split(",")[1]; // Obtiene solo el base64 sin prefijo
            imgFoto.src = e.target.result;
            imgFoto.style.display = "block";
            txtaFoto.value = fotoB64;
        };
        reader.readAsDataURL(inputFile.files[0]);
    }
}

// Función para limpiar el formulario
export function limpiar() {
    document.getElementById("idBebida").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("txtaFotoNuevaBebida").value = "";
    document.getElementById("foto").value = "";
    let imgFoto = document.getElementById("imgFoto");
    imgFoto.src = "";
    imgFoto.style.display = "none";
    idproducto = null;
}

// Función para mostrar bebidas activas/inactivas
export function mostrarInactivos() {
    const btnGuardar = document.getElementById("btn-agregar");
    const btnEliminar = document.getElementById("btn-eliminar");
    let mostrarActivos = document.getElementById("activos").checked;
    let table = document.getElementById("renglones");
    let renglon = "";

    listBebida.forEach((registro, indice) => {
        if ((mostrarActivos && registro.producto.activo === 1) || 
            (!mostrarActivos && registro.producto.activo === 0)) {
            
            renglon += `
                <tr onclick="controladorGra1.selectRegistro(${indice});">
                    <td>${registro.producto.nombre}</td>
                    <td>${registro.producto.descripcion}</td>
                    <td>${registro.producto.precio}</td>
                    <td>${registro.producto.categoria.descripcion}</td>
                    <td><img src="${registro.producto.foto ? 'data:image/jpeg;base64,' + registro.producto.foto : ''}" 
                             alt="Foto Bebida" width="50" 
                             onerror="this.style.display='none'"></td>
                </tr>`;
        }
    });

    table.innerHTML = renglon;
    btnGuardar.classList.remove("d-none");
    btnEliminar.classList[mostrarActivos ? "remove" : "add"]("d-none");
}

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    loadCategoriaBd();
    loadBebida();
});
