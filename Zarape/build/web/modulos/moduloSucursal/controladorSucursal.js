let listSucursales = [];
let listCiudades = [];
let listEstados =[];

export function loadCiudades() {
    let v_edo = document.getElementById("estados").value;
    let v_ciudades = document.getElementById("Ciudades");
    
    while (v_ciudades.options.length >= 1) {
        v_ciudades.remove(v_ciudades.options.length - 1);
    }
    
    listCiudades.forEach(ciudad => {
        if (ciudad.estado.idEstado == v_edo) {
            let option = document.createElement("option");
            option.value = ciudad.idCiudad;
            option.text = ciudad.nombre;
            v_ciudades.appendChild(option);
        }
    });
}

fetch('http://localhost:8080/Zarape/api/ciudad/getAllCiudades')
    .then(response => response.json())
    .then(city => {
        console.log(city);
        listCiudades = city;
        loadCiudades();
    });
    
export function loadEstados() {
    let v_estados = document.getElementById("estados");
    listEstados.forEach(
            estado=>{
                let v_option = document.createElement("option");
                v_option.value = estado.idEstado;
                v_option.text = estado.nombre;
                v_estados.appendChild(v_option);
            }
            );
}

fetch('http://localhost:8080/Zarape/api/datos/getAllEstados')
        .then(response=> response.json())
        .then(
            datos=>{
                console.log(datos);
                listEstados=datos;
                loadEstados();
            }
        );

export function mostrarFormulario() {
    const formularioContenedor = document.getElementById("formulario-contenedor");
    formularioContenedor.classList.remove("d-none"); // Muestra el formulario
}

export function cancelarFormulario() {
    const formularioContenedor = document.getElementById("formulario-contenedor");
    formularioContenedor.classList.add("d-none"); // Oculta el formulario
}
export function loadSucursales(){
    controladorGra1.mostrarInactivos();
    }
    
    fetch('http://localhost:8080/Zarape/api/sucursales/getAllSucursales')
        .then(response=>response.json())
        .then(
        registro=>{
            console.log(registro);
            listSucursales=registro;
            loadSucursales();
        });
        
export function mostrarInactivos() {
    const btnGuardar = document.getElementById("btn-agregar");
    const btnEliminar = document.getElementById("btn-eliminar");
    let mostrarActivos = document.getElementById("activos").checked;
    let table = document.getElementById("renglones");
    let renglon = "";

    listSucursales.forEach((registro, index) => {
        if (mostrarActivos && registro.activo === 1) {
            renglon += `
                <tr onclick='controladorGra1.selectRegistro(${index});'>
                    <td>${registro.nombre}</td>
                    <td>${registro.latitud}</td>
                    <td>${registro.longitud}</td>
                    <td><img src="data:image/png;base64,${registro.foto || ''}" alt="Foto Sucursal" width="50"></td>
                    <td>${registro.urlWeb}</td>
                    <td>${registro.horario}</td>
                    <td>${registro.calle}</td>
                    <td>${registro.numCalle}</td>
                    <td>${registro.colonia}</td>
                    <td>${registro.Ciudad.nombre}</td>
                </tr>
            `;
            btnGuardar.classList.remove("d-none");
            btnEliminar.classList.remove("d-none");
        } else if (!mostrarActivos && registro.activo === 0) {
            renglon += `
                <tr onclick='controladorGra1.selectRegistro(${index});'>
                    <td>${registro.nombre}</td>
                    <td>${registro.latitud}</td>
                    <td>${registro.longitud}</td>
                    <td><img src="data:image/png;base64,${registro.foto || ''}" alt="Foto Sucursal" width="50"></td>
                    <td>${registro.urlWeb}</td>
                    <td>${registro.horario}</td>
                    <td>${registro.calle}</td>
                    <td>${registro.numCalle}</td>
                    <td>${registro.colonia}</td>
                    <td>${registro.Ciudad.nombre}</td>
                </tr>
            `;
            btnGuardar.classList.add("d-none");
            btnEliminar.classList.add("d-none");
        }
    });

    table.innerHTML = renglon;
}


function limpiar() {
    document.getElementById("idSucursal").value = null;
    document.getElementById("nombre").value = "";
    document.getElementById("latitud").value = "";
    document.getElementById("longitud").value = "";
    document.getElementById("foto").value = "";
    document.getElementById("urlWeb").value = "";
    document.getElementById("horarios").value = "";
    document.getElementById("calle").value = "";
    document.getElementById("numCalle").value = "";
    document.getElementById("colonia").value = "";
    document.getElementById("Ciudades").value = "";
}

export function selectRegistro(indice) { 
    document.getElementById("idSucursal").value = listSucursales[indice].idSucursal;
    document.getElementById("nombre").value = listSucursales[indice].nombre;
    document.getElementById("latitud").value = listSucursales[indice].latitud;
    document.getElementById("longitud").value = listSucursales[indice].longitud;
    document.getElementById("foto").value = listSucursales[indice].foto;
    document.getElementById("urlWeb").value = listSucursales[indice].urlWeb;
    document.getElementById("horarios").value = listSucursales[indice].horario;
    document.getElementById("calle").value = listSucursales[indice].calle;
    document.getElementById("numCalle").value = listSucursales[indice].numCalle;
    document.getElementById("colonia").value = listSucursales[indice].colonia;
    document.getElementById("Ciudades").value = listSucursales[indice].Ciudad.idCiudad;
    
    mostrarFormulario();
    
    document.getElementById("estados").value = listSucursales[indice].Ciudad.estado.idEstado;
    mostrarFormulario();
    setTimeout(() => {
        let ciudadSelect = document.getElementById("Ciudades");
        ciudadSelect.value = listSucursales[indice].Ciudad.idCiudad;
    }, 10);
    loadCiudades();
}

function toggleDropdown() {
    limpiar();
    document.getElementById("myDropdown").classList.toggle("show");
}

function ocultarElementos() {
    if (window.innerWidth <= 384) {
        document.getElementById("barraLateral").classList.toggle("show");
    }
}

window.addEventListener('resize', ocultarElementos);

fetch('http://localhost:8080/Zarape/api/sucursales/getAllSucursales')
    .then(response => response.json())
    .then(datos => {
        console.log(datos);
        listSucursales = datos;
        loadSucursales();
    });

export function agregarSucursal() {
    let v_idSucursal = document.getElementById("idSucursal").value || -1;
    let v_nombre = document.getElementById("nombre").value;
    let v_latitud = document.getElementById("latitud").value;
    let v_longitud = document.getElementById("longitud").value;
    let v_foto = document.getElementById("foto").value; 
    let v_urlWeb = document.getElementById("urlWeb").value;
    let v_horario = document.getElementById("horarios").value;
    let v_calle = document.getElementById("calle").value;
    let v_numCalle = document.getElementById("numCalle").value;
    let v_colonia = document.getElementById("colonia").value;
    let v_ciudad = document.getElementById("Ciudades").value;
    let sucursal = {
        idSucursal: v_idSucursal,
        nombre: v_nombre,
        latitud: v_latitud,
        longitud: v_longitud,
        foto: v_foto,
        urlWeb: v_urlWeb,
        horario: v_horario,
        calle: v_calle,
        numCalle: v_numCalle,
        colonia: v_colonia,
        activo: 1,
        Ciudad: {
            idCiudad: v_ciudad,
            nombre: ""
        }
    };

    let datos_servidor = { datosSucursal: JSON.stringify(sucursal) };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };
    fetch('http://localhost:8080/Zarape/api/sucursales/agregar', registro)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            fetch('http://localhost:8080/Zarape/api/sucursales/getAllSucursales')
            .then(response => response.json())
            .then(
                registro => {
                    listSucursales = registro;
                    loadSucursales();
                }
            );
    })
        .catch(error => console.error("Error al agregar el Sucursal:", error));
        limpiar();
        cancelarFormulario();
}

export function eliminarSucursal()
{
    let v_idSucursal = document.getElementById("idSucursal").value;
    let datos_servidor = { idSucursal: v_idSucursal };
    let parametro = new URLSearchParams(datos_servidor);
        let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };
    fetch('http://localhost:8080/Zarape/api/sucursales/eliminar', registro)
        .then(response => response.json())
        .then(json => {
            console.log(json);
    fetch('http://localhost:8080/Zarape/api/sucursales/getAllSucursales')
                .then(response => response.json())
                .then(registro => {
                    listSucursales = registro;
                    mostrarInactivos();
                })
                .catch(error => console.error("Error al obtener la lista de sucursales:", error));
    })
        .catch(error => console.error("Error al eliminar el sucursal:", error));
        limpiar();
        cancelarFormulario();
        mostrarInactivos();
}