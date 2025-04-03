let listCliente = [];
let listEstados = [];
let listCiudades = [];

let idPersona = null;
let idUsuario = null;
let validacionesInicializadas = false;

export function inicializarValidaciones() {
    if (validacionesInicializadas) return;
    
    console.log("Inicializando validaciones para cliente...");

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
            /^(?=[^@]*@[^@]*$)[a-zA-Z@]{5,30}$/,
            5,
            30,
            document.getElementById("error-usuario"),
            "El nombre de usuario debe tener entre 5 y 30 caracteres, contener exactamente un @ y solo puede contener letras."
        );
    });

    document.getElementById("contrasenia")?.addEventListener("input", function () {
        if (this.value.trim()) { // Solo validar si hay contenido
            validarCampo(
                this,
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$_-])[A-Za-z\d@#$_-]{8,15}$/,
                8,
                15,
                document.getElementById("error-contrasenia"),
                "La contraseña debe tener entre 8 y 15 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial (@, #, $, -, _)."
            );
        } else {
            document.getElementById("error-contrasenia").innerHTML = ''; 
        }
    });

    document.getElementById("btn-guardar")?.addEventListener("click", function (event) {
        const tieneErrores = document.querySelectorAll(`
            #error-nombre div, 
            #error-apellidos div, 
            #error-telefono div, 
            #error-usuario div,
            #error-contrasenia div
        `).length > 0;

        if (tieneErrores) {
            event.preventDefault();
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

export function mostrarFormulario() {
    const formularioContenedor = document.getElementById("formulario-contenedor");
    const btnAgregar = document.getElementById("btn-agregar");
    
    if (formularioContenedor && btnAgregar) {
        btnAgregar.classList.add("d-none");
        formularioContenedor.classList.remove("d-none");
        
        if (!idPersona) {
            document.querySelectorAll('#form-agregar input[placeholder]').forEach(input => {
                const originalPlaceholder = input.getAttribute('data-original-placeholder');
                if (originalPlaceholder) {
                    input.placeholder = originalPlaceholder;
                }
            });
        }
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

export function agregarCliente() {
    const username = localStorage.getItem("nombreUsuario");
    if (!username) {
        alert("No se encontró información de usuario");
        return;
    }

    // 1. Validar campos vacíos
    const camposRequeridos = ["nombre", "apellidos", "telefono", "ciudades", "estados", "usuario"];
    const camposVacios = camposRequeridos.some(id => {
        const element = document.getElementById(id);
        return !element?.value.trim();
    });
    
    if (camposVacios) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    // 2. Validar errores en los campos
    const tieneErrores = document.querySelectorAll(`
        #error-nombre div, 
        #error-apellidos div, 
        #error-telefono div, 
        #error-usuario div,
        #error-contrasenia div
    `).length > 0;

    if (tieneErrores) {
        alert("Corrige los errores en el formulario antes de guardar.");
        return;
    }

    // 3. Validación especial para la contraseña
    const contraseniaInput = document.getElementById("contrasenia");
    if ((!idPersona && !contraseniaInput.value.trim()) || 
        (contraseniaInput.value.trim() && document.getElementById("error-contrasenia").innerHTML)) {
        alert("La contraseña es obligatoria para nuevos clientes y debe cumplir con los requisitos si se modifica.");
        return;
    }

    // 4. Validación adicional para el @ en usuario
    const usuario = document.getElementById("usuario").value.trim();
    const countAt = usuario.split('@').length - 1;
    if (countAt !== 1) {
        alert("El nombre de usuario debe contener exactamente un símbolo @");
        return;
    }

    // Si pasa todas las validaciones, proceder con el envío
    let cliente = {
        idCliente: idPersona ? listCliente.find(c => c.persona.idPersona === idPersona)?.idCliente : -1,
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
            nombre: usuario,
            contrasenia: contraseniaInput.value.trim() 
                ? contraseniaInput.value 
                : contraseniaInput.dataset.originalPassword || ""
        }
    };

    let datos_servidor = { datosCliente: JSON.stringify(cliente) };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "username": username
        },
        body: parametro
    };

    fetch('http://localhost:8080/Zarape/api/cliente/agregarCliente', registro)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(json => {
            console.log(json);
            return fetch('http://localhost:8080/Zarape/api/cliente/getAllCliente', {
                headers: { "username": username }
            });
        })
        .then(response => response.json())
        .then(registro => {
            listCliente = registro;
            mostrarInactivos();
            limpiar();
            cancelarFormulario();
        })
        .catch(error => {
            console.error("Error al guardar el cliente:", error);
            alert("Ocurrió un error al guardar el cliente");
        });
}

export function eliminarCliente() {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este cliente?");
    if (!confirmacion) {
        return;
    }

    const username = localStorage.getItem("nombreUsuario");
    
    const clienteAEliminar = listCliente.find(cli => cli.persona.idPersona === idPersona);
    
    if (!clienteAEliminar) {
        alert("No se encontró el cliente a eliminar");
        return;
    }

    let datos_servidor = { idCliente: clienteAEliminar.idCliente };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "username": username
        },
        body: parametro
    };

    fetch('http://localhost:8080/Zarape/api/cliente/eliminarCliente', registro)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(json => {
            console.log(json);
            fetch('http://localhost:8080/Zarape/api/cliente/getAllCliente', {
                headers: { "username": username }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la solicitud');
                    }
                    return response.json();
                })
                .then(registro => {
                    listCliente = registro;
                    mostrarInactivos();
                })
                .catch(error => console.error("Error al obtener la lista de clientes:", error));
        })
        .catch(error => console.error("Error al eliminar el cliente:", error));

    limpiar();
    cancelarFormulario();
}

export function selectRegistro(indice) {
    if (indice < 0 || indice >= listCliente.length) {
        console.error("Índice fuera de rango");
        return;
    }

    const cliente = listCliente[indice];
    
    document.getElementById("nombre").value = cliente.persona.nombre;
    document.getElementById("apellidos").value = cliente.persona.apellidos;
    document.getElementById("telefono").value = cliente.persona.telefono;
    document.getElementById("estados").value = cliente.persona.ciudad.estado.idEstado;
    document.getElementById("usuario").value = cliente.usuario.nombre;
    document.getElementById("contrasenia").value = "";
    document.getElementById("contrasenia").placeholder = "Dejar vacío para mantener la actual";
    document.getElementById("contrasenia").dataset.originalPassword = cliente.usuario.contrasenia;
    
    idPersona = cliente.persona.idPersona;
    idUsuario = cliente.usuario.idUsuario;
    
    loadCiudades();
    setTimeout(() => {
        document.getElementById("ciudades").value = cliente.persona.ciudad.idCiudad;
    }, 100);
    
    mostrarFormulario();
}

export function limpiar() {
    const campos = ["nombre", "apellidos", "telefono", "usuario", "contrasenia"];
    campos.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = "";
            // Restaurar placeholder original
            const originalPlaceholder = element.getAttribute('data-original-placeholder');
            if (originalPlaceholder) {
                element.placeholder = originalPlaceholder;
            }
            if (id === "contrasenia") {
                delete element.dataset.originalPassword;
            }
        }
    });

    const estados = document.getElementById("estados");
    const ciudades = document.getElementById("ciudades");
    if (estados) estados.value = "";
    if (ciudades) {
        ciudades.innerHTML = '<option value="">Seleccione una ciudad</option>';
        ciudades.value = "";
    }

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

function validarCampo(input, regex, minLength, maxLength, errorDiv, mensajeError) {
    if (!input || !errorDiv) return false; 

    const valor = input.value.trim();
    errorDiv.innerHTML = '';

    let valido = true;
    
    if (!valor) {
        valido = false;
    } else if (valor.length < minLength || valor.length > maxLength) {
        valido = false;
    } else if (regex && !regex.test(valor)) {
        valido = false;
    }

    if (!valido) {
        const errorItem = document.createElement("div");
        errorItem.style.color = "red";
        errorItem.innerHTML = mensajeError;
        errorDiv.appendChild(errorItem);
    }

    return valido; // Retorna true si el campo es válido
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