let listCliente = [];
let listEstados = [];
let listCiudades = [];

let idPersona = null;
let idUsuario = null;
let validacionesInicializadas = false;

// Función para inicializar todas las validaciones
export function inicializarValidaciones() {
    if (validacionesInicializadas) return;
    
    console.log("Inicializando validaciones para cliente...");

    // Validación del nombre
    document.getElementById("nombre")?.addEventListener("input", function () {
        validarCampo(
            this,
            /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
            1,
            45,
            document.getElementById("error-nombre"),
            "El nombre debe contener solo letras, sin acentos, y un espacio entre palabras."
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
    document.getElementById("btn-guardar")?.addEventListener("click", function (event) {
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

// Escuchar cambios en el select de estados
document.getElementById("estados")?.addEventListener('change', loadCiudades);

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

// Función para cargar los clientes
export function loadCliente() {
    const username = localStorage.getItem("nombreUsuario");
    if (!username) return;

    fetch("http://localhost:8080/Zarape/api/cliente/getAllCliente", {
        method: "GET",
        headers: { "username": username, "Content-Type": "application/json" }
    })
        .then(response => response.ok ? response.json() : Promise.reject('Error en la solicitud'))
        .then(registro => {
            listCliente = registro;
            mostrarInactivos();
        })
        .catch(error => console.error("Error al cargar los clientes:", error));
}

// Función para agregar un cliente
export function agregarCliente() {
    const username = localStorage.getItem("nombreUsuario");
    if (!username) return;

    const errores = document.querySelectorAll("#error-nombre div, #error-apellidos div, #error-telefono div, #error-usuario div, #error-contrasenia div");
    if (errores.length > 0) {
        alert("Hay errores en el formulario. Corrígelos antes de continuar.");
        return;
    }

    const cliente = {
        idCliente: -1,
        activo: 1,
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

    const parametro = new URLSearchParams({ datosCliente: JSON.stringify(cliente) });

    fetch('http://localhost:8080/Zarape/api/cliente/agregarCliente', {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "username": username
        },
        body: parametro
    })
        .then(response => response.ok ? response.json() : Promise.reject('Error al agregar'))
        .then(() => loadCliente())
        .catch(error => console.error("Error al agregar el cliente:", error))
        .finally(() => {
            limpiar();
            cancelarFormulario();
        });
}

// Función para eliminar un cliente
export function eliminarCliente() {
    if (!idPersona) {
        alert("No hay ningún cliente seleccionado para eliminar");
        return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar este cliente?")) return;

    const username = localStorage.getItem("nombreUsuario");
    if (!username) return;

    const clienteAEliminar = listCliente.find(cli => cli.persona.idPersona === idPersona);
    if (!clienteAEliminar) {
        alert("No se encontró el cliente a eliminar");
        return;
    }

    const parametro = new URLSearchParams({ idCliente: clienteAEliminar.idCliente });

    fetch('http://localhost:8080/Zarape/api/cliente/eliminarCliente', {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "username": username
        },
        body: parametro
    })
        .then(response => response.ok ? response.json() : Promise.reject('Error al eliminar'))
        .then(() => loadCliente())
        .catch(error => console.error("Error al eliminar el cliente:", error))
        .finally(() => {
            limpiar();
            cancelarFormulario();
        });
}

// Función para seleccionar un registro
export function selectRegistro(indice) {
    if (indice < 0 || indice >= listCliente.length) return;

    const cliente = listCliente[indice];
    document.getElementById("nombre").value = cliente.persona.nombre;
    document.getElementById("apellidos").value = cliente.persona.apellidos;
    document.getElementById("telefono").value = cliente.persona.telefono;
    document.getElementById("estados").value = cliente.persona.ciudad.estado.idEstado;
    document.getElementById("usuario").value = cliente.usuario.nombre;
    document.getElementById("contrasenia").value = cliente.usuario.contrasenia;
    
    idPersona = cliente.persona.idPersona;
    idUsuario = cliente.usuario.idUsuario;
    
    mostrarFormulario();
    loadCiudades();
    
    setTimeout(() => {
        document.getElementById("ciudades").value = cliente.persona.ciudad.idCiudad;
    }, 100);
}

// Función para limpiar el formulario
export function limpiar() {
    ["nombre", "apellidos", "telefono", "estados", "ciudades", "usuario", "contrasenia"].forEach(id => {
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

// Función para mostrar clientes activos/inactivos
export function mostrarInactivos() {
    const mostrarActivos = document.getElementById("activos")?.checked;
    const table = document.getElementById("renglones");
    if (!table) return;

    let renglon = listCliente
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