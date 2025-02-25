let listEmpleado = [];
let listEstados =[];
let listCiudades = [];
let listSucursales =[];

export function loadCiudades() {
    let v_edo = document.getElementById("estados").value;
    let v_ciudades = document.getElementById("ciudades");
    
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

document.getElementById("estados").addEventListener('change', function() {
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

export function SelectSucursales() {
    let v_sucursales = document.getElementById("sucursales");
    listSucursales.forEach(
            sucursal=>{
                let v_option = document.createElement("option");
                v_option.value = sucursal.idSucursal;
                v_option.text = sucursal.nombre;
                v_sucursales.appendChild(v_option);
            }
            );
}

fetch('http://localhost:8080/Zarape/api/sucursales/getAllSucursales')
        .then(response=> response.json())
        .then(
            datos=>{
                console.log(datos);
                listSucursales=datos;
                    SelectSucursales();
            }
        );

function toggleDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

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
    limpiarMensajesError();
}

export function loadEmpleado(){
    controladorGra1.mostrarInactivos();
    }
    
    fetch('http://localhost:8080/Zarape/api/empleado/getAllEmpleados')
        .then(response=>response.json())
        .then(
        registro=>{
            console.log(registro);
            listEmpleado=registro;
            loadEmpleado();
        });


 export function agregarEmpleado() {
    let v_id = document.getElementById("idEmpleado").value || -1;  
    let v_idPersona = idPersona || -1;
    let v_idUsuario = idUsuario || -1;
    let v_nombre = document.getElementById("nombre").value;
    let v_apellidos = document.getElementById("apellidos").value;
    let v_telefono = document.getElementById("telefono").value;
    let v_ciudad = document.getElementById("ciudades").value;
    let v_estado = document.getElementById("estados").value;
    let v_user = document.getElementById("usuario").value;
    let v_contrasenia = document.getElementById("contrasenia").value;
    let v_sucursal = document.getElementById("sucursales").value;

    let empleado = {
        idEmpleado: parseInt(v_id),
        activo: 1,  
        sucursal: {
            idSucursal: parseInt(v_sucursal),
            activo: 1,  
            nombre: "",  
            latitud: "",
            longitud: "",
            foto: "",
            urlWeb: "",
            horarios: "",
            calle: "",
            numCalle: "",
            colonia: "",
            ciudad: {
                idCiudad:parseInt(v_ciudad),
                nombre: "", 
                estado: {
                    idEstado: parseInt(v_estado),  
                    nombre: "" 
                }
            }
        },
        persona: {
            idPersona: v_idPersona,  
            nombre: v_nombre,
            apellidos: v_apellidos,
            telefono: v_telefono,
            ciudad: {
                idCiudad: v_ciudad,
                nombre: "",  
                estado: {
                    idEstado: v_estado,  
                    nombre: "" 
                }
            }
        },
        usuario: {
            idUsuario: v_idUsuario,  
            activo: 1,
            nombre: v_user,
            contrasenia: v_contrasenia
        }
    };

    let datos_servidor = { datosEmpleado: JSON.stringify(empleado) };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };
    fetch('http://localhost:8080/Zarape/api/empleado/agregar', registro)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            fetch('http://localhost:8080/Zarape/api/empleado/getAllEmpleados')
            .then(response => response.json())
            .then(
                registro => {
                    listEmpleado = registro;
                    loadEmpleado();
                }
            );
    })
        .catch(error => console.error("Error al agregar el empleado:", error));
        limpiar();
        cancelarFormulario();
        limpiarMensajesError();
}

export function eliminarEmpleado() {
    let v_id = document.getElementById("idEmpleado").value;
    let datos_servidor = { idEmpleado: v_id };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };

    fetch('http://localhost:8080/Zarape/api/empleado/eliminar', registro)
        .then(response => response.json())
        .then(json => {
            console.log(json);

            fetch('http://localhost:8080/Zarape/api/empleado/getAllEmpleados')
                .then(response => response.json())
                .then(registro => {
                    listEmpleado = registro;
                    mostrarInactivos();
                })
                .catch(error => console.error("Error al obtener la lista de empleados:", error));
        })
        .catch(error => console.error("Error al eliminar el empleado:", error));

    limpiar(); 
    cancelarFormulario(); 
    limpiarMensajesError();
}


let idPersona = null;
let idUsuario = null;
export function selectRegistro(indice) {
    document.getElementById("idEmpleado").value = listEmpleado[indice].idEmpleado;
    document.getElementById("nombre").value = listEmpleado[indice].persona.nombre;
    document.getElementById("apellidos").value = listEmpleado[indice].persona.apellidos;
    document.getElementById("telefono").value = listEmpleado[indice].persona.telefono;
    document.getElementById("estados").value = listEmpleado[indice].persona.ciudad.estado.idEstado;

    document.getElementById("ciudades").value = listEmpleado[indice].persona.ciudad.idCiudad;

    document.getElementById("usuario").value = listEmpleado[indice].usuario.nombre;
    document.getElementById("contrasenia").value = "";
    document.getElementById("sucursales").value = listEmpleado[indice].sucursal.idSucursal;

    idPersona = listEmpleado[indice].persona.idPersona;
    idUsuario = listEmpleado[indice].usuario.idUsuario;

    mostrarFormulario();

    loadCiudades();

    setTimeout(() => {
        let ciudadSelect = document.getElementById("ciudades");
        ciudadSelect.value = listEmpleado[indice].persona.ciudad.idCiudad;
    }, 10);
}

export function limpiar() {
    document.getElementById("idEmpleado").value = null;
    document.getElementById("nombre").value = "";
    document.getElementById("apellidos").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("estados").value = null;;
    document.getElementById("ciudades").value = null;
    document.getElementById("usuario").value = "";
    document.getElementById("contrasenia").value = "";
}

export function mostrarInactivos() {
    const btnGuardar = document.getElementById("btn-agregar");
    const btnEliminar = document.getElementById("btn-eliminar");
    let mostrarActivos = document.getElementById("activos").checked;
    let table = document.getElementById("renglones");
        let renglon = "";
        listEmpleado.forEach(registro=>{
            if (mostrarActivos && registro.activo === 1) {
                renglon+="<tr onclick='controladorGra1.selectRegistro("+listEmpleado.indexOf(registro)+");'><td>"+registro.persona.nombre+
                    "</td><td>"+registro.persona.apellidos+
                    "</td><td>"+registro.persona.telefono+
                    "</td><td>"+registro.persona.ciudad.nombre+
                    "</td><td>"+registro.persona.ciudad.estado.nombre+
                    "</td><td>"+registro.usuario.nombre+
                    "</td><td>"+"********"+
                    "</td><td>"+registro.sucursal.nombre+
                    "</td><tr>";
                btnGuardar.classList.remove("d-none");
                btnEliminar.classList.remove("d-none");
            } else if (!mostrarActivos && registro.activo === 0) {
                renglon+="<tr onclick='controladorGra1.selectRegistro("+listEmpleado.indexOf(registro)+");'><td>"+registro.persona.nombre+
                    "</td><td>"+registro.persona.apellidos+
                    "</td><td>"+registro.persona.telefono+
                    "</td><td>"+registro.persona.ciudad.nombre+
                    "</td><td>"+registro.persona.ciudad.estado.nombre+
                    "</td><td>"+registro.usuario.nombre+
                    "</td><td>"+"********"+
                    "</td><td>"+registro.sucursal.nombre+
                    "</td><tr>";
                btnGuardar.classList.add("d-none");
                btnEliminar.classList.add("d-none");
            }
        });
        table.innerHTML=renglon;
    
}

//Validaciones

function limpiarMensajesError() {
    const errores = document.querySelectorAll('[id^="error-"]');
    errores.forEach(error => error.innerHTML = '');
}

// Validación para el campo "nombre"
document.getElementById("nombre").addEventListener("input", function () {
    const nombre = this.value.trim();
    const regex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;  // Solo letras y un espacio entre palabras
    const errorDiv = document.getElementById("error-nombre");
    const errores = [];

    // Limpiar mensajes de error anteriores
    errorDiv.innerHTML = '';

    if (!nombre || nombre.length < 1 || nombre.length > 45 || !regex.test(nombre)) {
        errores.push("El nombre debe contener solo letras, sin acentos, un espacio entre palabras, y tener entre 1 y 45 caracteres.");
    }

    // Mostrar errores
    if (errores.length > 0) {
        errores.forEach(error => {
            const errorItem = document.createElement("div");
            errorItem.style.color = "red";
            errorItem.innerHTML = error;
            errorDiv.appendChild(errorItem);
        });
    }
});

// Validación para el campo "apellidos"
document.getElementById("apellidos").addEventListener("input", function () {
    const apellidos = this.value.trim();
    const regex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;  // Solo letras y espacios
    const errorDiv = document.getElementById("error-apellidos");
    const errores = [];

    // Limpiar mensajes de error anteriores
    errorDiv.innerHTML = '';

    if (!apellidos || apellidos.length < 1 || apellidos.length > 45 || !regex.test(apellidos)) {
        errores.push("Los apellidos debe contener solo letras, sin acentos, un espacio entre palabras, y tener entre 1 y 45 caracteres.");
    }

    // Mostrar errores
    if (errores.length > 0) {
        errores.forEach(error => {
            const errorItem = document.createElement("div");
            errorItem.style.color = "red";
            errorItem.innerHTML = error;
            errorDiv.appendChild(errorItem);
        });
    }
});

// Validación para el campo "telefono"
document.getElementById("telefono").addEventListener("input", function () {
    const telefono = this.value.trim();
    const regex = /^\d{10}$/;  // Solo números, exactamente 10 dígitos
    const errorDiv = document.getElementById("error-telefono");
    const errores = [];

    // Limpiar mensajes de error anteriores
    errorDiv.innerHTML = '';

    if (!telefono || !regex.test(telefono)) {
        errores.push("El teléfono debe contener exactamente 10 dígitos numéricos sin espacios.");
    }

    // Mostrar errores
    if (errores.length > 0) {
        errores.forEach(error => {
            const errorItem = document.createElement("div");
            errorItem.style.color = "red";
            errorItem.innerHTML = error;
            errorDiv.appendChild(errorItem);
        });
    }
});

// Validación para el campo "usuario"
document.getElementById("usuario").addEventListener("input", function () {
    const usuario = this.value.trim();
    const regex = /^[a-zA-Z0-9@]+$/; 
    const errorDiv = document.getElementById("error-usuario");
    const errores = [];

    // Limpiar mensajes de error anteriores
    errorDiv.innerHTML = '';

    if (!usuario || usuario.length < 5 || usuario.length > 30 || !regex.test(usuario)) {
        errores.push("El nombre de usuario debe tener entre 5 a 30 caracteres y solo puede contener letras, números y arroba.");
    }

    // Mostrar errores
    if (errores.length > 0) {
        errores.forEach(error => {
            const errorItem = document.createElement("div");
            errorItem.style.color = "red";
            errorItem.innerHTML = error;
            errorDiv.appendChild(errorItem);
        });
    }
});

// Validación para el campo "contrasenia"
document.getElementById("contrasenia").addEventListener("input", function () {
    const contrasenia = this.value.trim();
    const regex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/; // Solo letras, números y caracteres especiales permitidos
    const errorDiv = document.getElementById("error-contrasenia");
    const errores = [];

    // Limpiar mensajes de error anteriores
    errorDiv.innerHTML = '';

    // Validación de longitud y caracteres permitidos
    if (!contrasenia || contrasenia.length < 5 || contrasenia.length > 15 || !regex.test(contrasenia)) {
        errores.push("La contraseña debe tener de 5 a 15 caracteres y no contener espacios.");
    }

    // Mostrar errores
    if (errores.length > 0) {
        errores.forEach(error => {
            const errorItem = document.createElement("div");
            errorItem.style.color = "red";
            errorItem.innerHTML = error;
            errorDiv.appendChild(errorItem);
        });
    }
});


// Prevenir el envío del formulario si hay errores
document.getElementById("btn-agregar").addEventListener("click", function (event) {
    // Validación de todos los campos
    const nombreError = document.getElementById("error-nombre").innerHTML;
    const apellidosError = document.getElementById("error-apellidos").innerHTML;
    const telefonoError = document.getElementById("error-telefono").innerHTML;
    const usuarioError = document.getElementById("error-usuario").innerHTML;
    const contraseniaError = document.getElementById("error-contrasenia").innerHTML;

    // Si hay algún mensaje de error, prevenimos el envío del formulario
    if (nombreError || apellidosError || telefonoError || usuarioError || contraseniaError) {
        event.preventDefault();  // Evitar el envío
        alert("Hay errores en el formulario. Corrígelos antes de continuar.");
    }
});
