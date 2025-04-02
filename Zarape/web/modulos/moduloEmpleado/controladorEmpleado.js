let listEmpleado = [];
let listEstados = [];
let listCiudades = [];
let listSucursales = [];

let idPersona = null;
let idUsuario = null;
let validacionesInicializadas = false;

export function inicializarValidaciones() {
    if (validacionesInicializadas) return;
    
    console.log("Inicializando validaciones para empleado...");

    document.getElementById("nombre")?.addEventListener("input", function () {
        validarCampo(
            this,
            /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
            1,
            45,
            document.getElementById("error-nombre"),
            "El nombre debe contener solo letras, sin acentos, y un espacio entre palabra."
        );
    });

    document.getElementById("apellidos")?.addEventListener("input", function () {
        validarCampo(
            this,
            /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
            1,
            45,
            document.getElementById("error-apellidos"),
            "Los apellidos deben contener solo letras, sin acentos, y un espacio entre palabras."
        );
    });

    document.getElementById("telefono")?.addEventListener("input", function () {
        validarCampo(
            this,
            /^\d{10}$/,
            10,
            10,
            document.getElementById("error-telefono"),
            "El teléfono debe contener exactamente 10 dígitos numéricos sin espacios."
        );
    });

    document.getElementById("usuario")?.addEventListener("input", function () {
        validarCampo(
            this,
            /^[a-zA-Z@]{5,30}$/,
            5,
            30,
            document.getElementById("error-usuario"),
            "El nombre de usuario debe tener entre 5 y 30 caracteres y solo puede contener letras y el símbolo @."
        );
    });

    document.getElementById("contrasenia")?.addEventListener("input", function () {
        validarCampo(
            this,
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$_-])[A-Za-z\d@#$_-]{8,15}$/,
            8,
            15,
            document.getElementById("error-contrasenia"),
            "La contraseña debe tener entre 8 y 15 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial (@, #, $, -, _)."
        );
    });

    document.getElementById("btn-guardar")?.addEventListener("click", function (event) {
        const tieneErrores = document.querySelectorAll("#error-nombre div, #error-apellidos div, #error-telefono div, #error-usuario div, #error-contrasenia div").length > 0;

        if (tieneErrores) {
            event.preventDefault();
            alert("Completa todos los campos correctamente antes de guardar");
        }
    });
    
    validacionesInicializadas = true;
}

export function loadCiudades() {
    const v_edo = document.getElementById("estados")?.value;
    const v_ciudades = document.getElementById("ciudades");
    
    if (!v_edo || !v_ciudades) return;

    v_ciudades.innerHTML = '';

    const ciudadesFiltradas = listCiudades.filter(ciudad => ciudad.estado.idEstado == v_edo);
    ciudadesFiltradas.forEach(ciudad => {
        const option = document.createElement("option");
        option.value = ciudad.idCiudad;
        option.text = ciudad.nombre;
        v_ciudades.appendChild(option);
    });
}

fetch('http://localhost:8080/Zarape/api/ciudad/getAllCiudades')
    .then(response => response.ok ? response.json() : Promise.reject('Error en la solicitud'))
    .then(city => {
        listCiudades = city;
        loadCiudades();
    })
    .catch(error => console.error("Error al cargar las ciudades:", error));

document.getElementById("estados")?.addEventListener('change', loadCiudades);

export function loadEstados() {
    const v_estados = document.getElementById("estados");
    if (!v_estados) return;
    
    v_estados.innerHTML = '';
    listEstados.forEach(estado => {
        const option = document.createElement("option");
        option.value = estado.idEstado;
        option.text = estado.nombre;
        v_estados.appendChild(option);
    });
}

fetch('http://localhost:8080/Zarape/api/datos/getAllEstados')
    .then(response => response.ok ? response.json() : Promise.reject('Error en la solicitud'))
    .then(datos => {
        listEstados = datos;
        loadEstados();
    })
    .catch(error => console.error("Error al cargar los estados:", error));

export function loadSucursales() {
    const v_sucursales = document.getElementById("sucursales");
    if (!v_sucursales) return;
    
    v_sucursales.innerHTML = '';
    listSucursales.forEach(sucursal => {
        const option = document.createElement("option");
        option.value = sucursal.idSucursal;
        option.text = sucursal.nombre;
        v_sucursales.appendChild(option);
    });
}

fetch('http://localhost:8080/Zarape/api/sucursales/getAllSucursales', {
    method: 'GET',
    headers: {
        "username": localStorage.getItem("nombreUsuario")   
    }
})
.then(response => response.ok ? response.json() : Promise.reject('Error en la solicitud'))
.then(datos => {
    listSucursales = datos;
    loadSucursales();
})
.catch(error => console.error("Error al cargar las sucursales:", error));

export function mostrarFormulario() {
    const formularioContenedor = document.getElementById("formulario-contenedor");
    const btnGuardar = document.getElementById("btn-agregar");
    
    if (formularioContenedor && btnGuardar) {
        btnGuardar.classList.add("d-none");
        formularioContenedor.classList.remove("d-none");
    }
}

export function cancelarFormulario() {
    const formularioContenedor = document.getElementById("formulario-contenedor");
    const btnGuardar = document.getElementById("btn-agregar");
    
    if (formularioContenedor && btnGuardar) {
        btnGuardar.classList.remove("d-none");
        formularioContenedor.classList.add("d-none");
    }
    
    limpiar();
    limpiarMensajesError();
    validacionesInicializadas = false;
}

export function loadEmpleado() {
    const username = localStorage.getItem("nombreUsuario");
    if (!username) return;

    fetch("http://localhost:8080/Zarape/api/empleado/getAllEmpleados", {
        method: "GET",
        headers: { "username": username, "Content-Type": "application/json" }
    })
        .then(response => response.ok ? response.json() : Promise.reject('Error en la solicitud'))
        .then(registro => {
            listEmpleado = registro;
            mostrarInactivos();
        })
        .catch(error => console.error("Error al cargar los empleados:", error));
}

export function agregarEmpleado() {
    const username = localStorage.getItem("nombreUsuario");

    const camposRequeridos = ["nombre", "apellidos", "telefono", "ciudades", "estados", "usuario", "contrasenia", "sucursales"];
    const camposVacios = camposRequeridos.some(id => !document.getElementById(id).value.trim());

    if (camposVacios) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const errores = document.querySelectorAll("#error-nombre div, #error-apellidos div, #error-telefono div, #error-usuario div, #error-contrasenia div");
    if (errores.length > 0) {
        return; 
    }

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
        idEmpleado: -1, 
        activo: 1,
        sucursal: {
            idSucursal: v_sucursal,
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
                idCiudad: v_ciudad,
                nombre: "",
                estado: {
                    idEstado: v_estado,
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
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "username": username
        },
        body: parametro
    };

    fetch('http://localhost:8080/Zarape/api/empleado/agregar', registro)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(json => {
            console.log(json);
            fetch('http://localhost:8080/Zarape/api/empleado/getAllEmpleados', {
                headers: { "username": username }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la solicitud');
                    }
                    return response.json();
                })
                .then(registro => {
                    listEmpleado = registro;
                    loadEmpleado();
                })
                .catch(error => console.error("Error al obtener empleados:", error));
        })
        .catch(error => console.error("Error al agregar el empleado:", error));

    limpiar();
    cancelarFormulario();
}

export function eliminarEmpleado() {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este empleado?");
    if (!confirmacion) {
        return;
    }

    const username = localStorage.getItem("nombreUsuario");
    
    const empleadoAEliminar = listEmpleado.find(emp => emp.persona.idPersona === idPersona);
    
    if (!empleadoAEliminar) {
        alert("No se encontró el empleado a eliminar");
        return;
    }

    let datos_servidor = { idEmpleado: empleadoAEliminar.idEmpleado };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "username": username
        },
        body: parametro
    };

    fetch('http://localhost:8080/Zarape/api/empleado/eliminar', registro)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(json => {
            console.log(json);
            fetch('http://localhost:8080/Zarape/api/empleado/getAllEmpleados', {
                headers: { "username": username }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la solicitud');
                    }
                    return response.json();
                })
                .then(registro => {
                    listEmpleado = registro;
                    mostrarInactivos();
                })
                .catch(error => console.error("Error al obtener la lista de empleados:", error));
        })
        .catch(error => console.error("Error al eliminar el empleado:", error));

    limpiar();
    cancelarFormulario();
}

export function selectRegistro(indice) {
    if (indice < 0 || indice >= listEmpleado.length) {
        console.error("Índice fuera de rango");
        return;
    }

    const empleado = listEmpleado[indice];
    document.getElementById("nombre").value = empleado.persona.nombre;
    document.getElementById("apellidos").value = empleado.persona.apellidos;
    document.getElementById("telefono").value = empleado.persona.telefono;
    document.getElementById("estados").value = empleado.persona.ciudad.estado.idEstado;
    document.getElementById("ciudades").value = empleado.persona.ciudad.idCiudad;
    document.getElementById("usuario").value = empleado.usuario.nombre;
    document.getElementById("contrasenia").value = empleado.usuario.contrasenia;
    document.getElementById("sucursales").value = empleado.sucursal.idSucursal;
    
    idPersona = empleado.persona.idPersona;
    idUsuario = empleado.usuario.idUsuario;
    mostrarFormulario();

    // Asegurar que las ciudades se carguen correctamente
    loadCiudades();
    setTimeout(() => {
        document.getElementById("ciudades").value = empleado.persona.ciudad.idCiudad;
    }, 10);
}

export function limpiar() {
    const campos = ["nombre", "apellidos", "telefono", "estados", "ciudades", "usuario", "contrasenia", "sucursales"];
    campos.forEach(id => {
        document.getElementById(id).value = "";
    });
    idPersona = null;
    idUsuario = null;
}

export function limpiarMensajesError() {
    document.querySelectorAll('[id^="error-"]').forEach(error => error.innerHTML = '');
}

export function mostrarInactivos() {
    const mostrarActivos = document.getElementById("activos")?.checked;
    const table = document.getElementById("renglones");
    if (!table) return;

    let renglon = listEmpleado
        .filter(registro => mostrarActivos ? registro.activo === 1 : registro.activo === 0)
        .map((registro, index) => `
            <tr onclick='controladorGra1.selectRegistro(${index});'>
                <td>${registro.persona.nombre}</td>
                <td>${registro.persona.apellidos}</td>
                <td>${registro.persona.telefono}</td>
                <td>${registro.persona.ciudad.nombre}</td>
                <td>${registro.persona.ciudad.estado.nombre}</td>
                <td>${registro.usuario.nombre}</td>
                <td>**********</td>
                <td>${registro.sucursal.nombre}</td>
            </tr>
        `).join('');

    table.innerHTML = renglon;
    
    const btnGuardar = document.getElementById("btn-agregar");
    const btnEliminar = document.getElementById("btn-eliminar");
    if (btnGuardar) btnGuardar.classList.toggle("d-none", !mostrarActivos);
    if (btnEliminar) btnEliminar.classList.toggle("d-none", !mostrarActivos);
}

function validarCampo(input, regex, minLength, maxLength, errorDiv, mensajeError) {
    if (!input || !errorDiv) return;

    const valor = input.value.trim();
    errorDiv.innerHTML = '';

    if (!valor || valor.length < minLength || valor.length > maxLength || !regex.test(valor)) {
        const errorItem = document.createElement("div");
        errorItem.style.color = "red";
        errorItem.innerHTML = mensajeError;
        errorDiv.appendChild(errorItem);
    }
}

export function cerrarSesion() {
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    if (!nombreUsuario) return;

    const url = new URL('http://localhost:8080/Zarape/api/login/cerrarsesion');
    url.search = new URLSearchParams({ 'nombre': nombreUsuario });

    fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.ok ? response.json() : Promise.reject('Error al cerrar sesión'))
        .finally(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('nombreUsuario');
            alert("Cerrando sesión");
            loadLogin();
        })
        .catch(error => console.error('Error:', error));
}