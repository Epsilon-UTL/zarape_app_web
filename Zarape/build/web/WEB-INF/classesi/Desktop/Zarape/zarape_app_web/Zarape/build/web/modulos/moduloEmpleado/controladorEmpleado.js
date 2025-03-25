let listEmpleado = [];
let listEstados = [];
let listCiudades = [];
let listSucursales = [];

let idPersona = null;
let idUsuario = null;
let validacionesInicializadas = false;

// Función para cerrar sesión
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

// Función para inicializar todas las validaciones
export function inicializarValidaciones() {
    if (validacionesInicializadas) return;
    
    console.log("Inicializando validaciones para empleado...");

    // Validación del nombre
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

    // Validación de los apellidos
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

    // Validación del teléfono
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

    // Validación del usuario
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

    // Validación de la contraseña
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

    // Validar formulario antes de enviar
    document.getElementById("btn-agregar")?.addEventListener("click", function (event) {
        const errores = document.querySelectorAll("#error-nombre div, #error-apellidos div, #error-telefono div, #error-usuario div, #error-contrasenia div");
        if (errores.length > 0) {
            event.preventDefault();
            alert("Hay errores en el formulario. Corrígelos antes de continuar.");
        }
    });

    validacionesInicializadas = true;
}

// Función para cargar las ciudades basadas en el estado seleccionado
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

// Cargar ciudades desde el servidor
fetch('http://localhost:8080/Zarape/api/ciudad/getAllCiudades')
    .then(response => response.ok ? response.json() : Promise.reject('Error en la solicitud'))
    .then(city => {
        listCiudades = city;
        loadCiudades();
    })
    .catch(error => console.error("Error al cargar las ciudades:", error));

// Función para cargar los estados
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

// Cargar estados desde el servidor
fetch('http://localhost:8080/Zarape/api/datos/getAllEstados')
    .then(response => response.ok ? response.json() : Promise.reject('Error en la solicitud'))
    .then(datos => {
        listEstados = datos;
        loadEstados();
    })
    .catch(error => console.error("Error al cargar los estados:", error));

// Función para cargar las sucursales
export function SelectSucursales() {
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

// Cargar sucursales desde el servidor
fetch('http://localhost:8080/Zarape/api/sucursales/getAllSucursales')
    .then(response => response.ok ? response.json() : Promise.reject('Error en la solicitud'))
    .then(datos => {
        listSucursales = datos;
        SelectSucursales();
    })
    .catch(error => console.error("Error al cargar las sucursales:", error));

// Función para mostrar/ocultar el formulario
export function mostrarFormulario() {
    const formularioContenedor = document.getElementById("formulario-contenedor");
    const btnGuardar = document.getElementById("btn-agregar");
    
    if (formularioContenedor && btnGuardar) {
        btnGuardar.classList.add("d-none");
        formularioContenedor.classList.remove("d-none");
    }
}

// Función para cancelar el formulario
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

// Función para cargar los empleados
export function loadEmpleado() {
    fetch('http://localhost:8080/Zarape/api/empleado/getAllEmpleados')
        .then(response => response.ok ? response.json() : Promise.reject('Error en la solicitud'))
        .then(registro => {
            listEmpleado = registro;
            mostrarInactivos();
        })
        .catch(error => console.error("Error al cargar los empleados:", error));
}

// Función para agregar un empleado
export function agregarEmpleado() {
    const errores = document.querySelectorAll("#error-nombre div, #error-apellidos div, #error-telefono div, #error-usuario div, #error-contrasenia div");
    if (errores.length > 0) {
        alert("Hay errores en el formulario. Corrígelos antes de continuar.");
        return;
    }

    const empleado = {
        idEmpleado: -1,
        activo: 1,
        sucursal: {
            idSucursal: parseInt(document.getElementById("sucursales").value),
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
                idCiudad: parseInt(document.getElementById("ciudades").value),
                nombre: "",
                estado: {
                    idEstado: parseInt(document.getElementById("estados").value),
                    nombre: ""
                }
            }
        },
        persona: {
            idPersona: idPersona || -1,
            nombre: document.getElementById("nombre").value,
            apellidos: document.getElementById("apellidos").value,
            telefono: document.getElementById("telefono").value,
            ciudad: {
                idCiudad: document.getElementById("ciudades").value,
                nombre: "",
                estado: {
                    idEstado: document.getElementById("estados").value,
                    nombre: ""
                }
            }
        },
        usuario: {
            idUsuario: idUsuario || -1,
            activo: 1,
            nombre: document.getElementById("usuario").value,
            contrasenia: document.getElementById("contrasenia").value
        }
    };

    const parametro = new URLSearchParams({ datosEmpleado: JSON.stringify(empleado) });

    fetch('http://localhost:8080/Zarape/api/empleado/agregar', {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    })
        .then(response => response.ok ? response.json() : Promise.reject('Error al agregar'))
        .then(() => loadEmpleado())
        .catch(error => console.error("Error al agregar el empleado:", error))
        .finally(() => {
            limpiar();
            cancelarFormulario();
        });
}

// Función para eliminar un empleado
export function eliminarEmpleado() {
    if (!idPersona) {
        alert("No hay ningún empleado seleccionado para eliminar");
        return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar este empleado?")) return;

    const empleadoAEliminar = listEmpleado.find(emp => emp.persona.idPersona === idPersona);
    if (!empleadoAEliminar) {
        alert("No se encontró el empleado a eliminar");
        return;
    }

    const parametro = new URLSearchParams({ idEmpleado: empleadoAEliminar.idEmpleado });

    fetch('http://localhost:8080/Zarape/api/empleado/eliminar', {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    })
        .then(response => response.ok ? response.json() : Promise.reject('Error al eliminar'))
        .then(() => loadEmpleado())
        .catch(error => console.error("Error al eliminar el empleado:", error))
        .finally(() => {
            limpiar();
            cancelarFormulario();
        });
}

// Función para seleccionar un registro
export function selectRegistro(indice) {
    if (indice < 0 || indice >= listEmpleado.length) return;

    const empleado = listEmpleado[indice];
    document.getElementById("nombre").value = empleado.persona.nombre;
    document.getElementById("apellidos").value = empleado.persona.apellidos;
    document.getElementById("telefono").value = empleado.persona.telefono;
    document.getElementById("estados").value = empleado.persona.ciudad.estado.idEstado;
    document.getElementById("usuario").value = empleado.usuario.nombre;
    document.getElementById("contrasenia").value = empleado.usuario.contrasenia;
    document.getElementById("sucursales").value = empleado.sucursal.idSucursal;
    
    idPersona = empleado.persona.idPersona;
    idUsuario = empleado.usuario.idUsuario;
    
    mostrarFormulario();
    loadCiudades();
    
    setTimeout(() => {
        document.getElementById("ciudades").value = empleado.persona.ciudad.idCiudad;
    }, 100);
}

// Función para limpiar el formulario
export function limpiar() {
    ["nombre", "apellidos", "telefono", "estados", "ciudades", "usuario", "contrasenia", "sucursales"].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = "";
    });
    idPersona = null;
    idUsuario = null;
}

// Función para limpiar mensajes de error
export function limpiarMensajesError() {
    document.querySelectorAll('[id^="error-"]').forEach(error => error.innerHTML = '');
}

// Función para mostrar empleados activos/inactivos
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

// Función genérica para validar campos
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