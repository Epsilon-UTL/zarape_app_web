let listCliente = [];
let listEstados = [];
let listCiudades = [];

let idPersona = null;
let idUsuario = null;
let validacionesInicializadas = false;

const API_BASE_URL = 'http://localhost:8080/Zarape/api';
const ENDPOINTS = {
    ciudades: '/ciudad/getAllCiudades',
    estados: '/datos/getAllEstados',
    clientes: '/cliente/getAllCliente',
    agregarCliente: '/cliente/agregarCliente',
    eliminarCliente: '/cliente/eliminarCliente'
};

async function fetchData(endpoint) {
    try {
        const username = localStorage.getItem("nombreUsuario");
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "GET",
            headers: {
                "username": username
            }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return null;
    }
}

// Cargar datos iniciales
export async function loadInitialData() {
    try {
        showLoader();
        const [ciudades, estados, clientes] = await Promise.all([
            fetchData(ENDPOINTS.ciudades),
            fetchData(ENDPOINTS.estados),
            fetchData(ENDPOINTS.clientes)
        ]);
        
        if (ciudades) {
            listCiudades = ciudades;
        }

        if (estados) {
            listEstados = estados;
            loadEstados();
        }

        if (clientes) {
            listCliente = clientes;
            mostrarInactivos();
        }
        
        setupRealTimeValidation();
    } catch (error) {
        console.error("Error loading initial data:", error);
    } finally {
        hideLoader();
    }
}

export function setupRealTimeValidation() {
    if (validacionesInicializadas) return;
    
    const form = document.getElementById('form-agregar');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        
        if (input.type !== 'password' && input.type !== 'hidden' && input.tagName !== 'SELECT') {
            input.addEventListener('input', validateField);
        }
    });
    
    validacionesInicializadas = true;
}

function validateField(e) {
    const field = e.target;
    const errorElementId = `${field.id}-error`;
    let errorElement = document.getElementById(errorElementId);
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = errorElementId;
        errorElement.className = 'text-danger small mt-1';
        field.parentNode.appendChild(errorElement);
    }
    
    let isValid = true;
    let errorMessage = '';
    
    switch(field.id) {
        case 'nombre':
        case 'apellidos':
            isValid = /^[a-zA-ZÁ-ÿ\s]{1,45}$/.test(field.value);
            errorMessage = isValid ? '' : 'Solo letras y espacios, máximo 45 caracteres';
            break;
            
        case 'telefono':
            isValid = /^\d{10}$/.test(field.value);
            errorMessage = isValid ? '' : 'Debe contener exactamente 10 dígitos';
            break;
            
        case 'usuario':
            isValid = /^[a-zA-Z@]{5,30}$/.test(field.value) && (field.value.split('@').length - 1) === 1;
            errorMessage = isValid ? '' : 'Debe tener 5-30 caracteres con exactamente un @';
            break;
            
        case 'contrasenia':
            if (field.value.trim()) {
                isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$_-])[A-Za-z\d@#$_-]{8,15}$/.test(field.value);
                errorMessage = isValid ? '' : '8-15 caracteres con mayúscula, minúscula, número y especial (@#$_-)';
            }
            break;
            
        case 'estados':
        case 'ciudades':
            isValid = field.value !== '';
            errorMessage = isValid ? '' : 'Este campo es requerido';
            // Añadir clases para selects también
            if (field.value && !isValid) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
            } else if (field.value && isValid) {
                field.classList.add('is-valid');
                field.classList.remove('is-invalid');
            } else {
                field.classList.remove('is-valid', 'is-invalid');
            }
            break;
    }
    
    if (field.type !== 'hidden' && field.tagName !== 'SELECT') {
        if (field.value && !isValid) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
        } else if (field.value && isValid) {
            field.classList.add('is-valid');
            field.classList.remove('is-invalid');
        } else {
            field.classList.remove('is-valid', 'is-invalid');
        }
    }
    
    errorElement.textContent = errorMessage;
    
    return isValid;
}

function validateForm() {
    const form = document.getElementById('form-agregar');
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input, select');
    let isValid = true;
    
    inputs.forEach(input => {
        const event = new Event('blur');
        input.dispatchEvent(event);
        
        if (!input.checkValidity() && input.type !== 'hidden' && input.id !== 'contrasenia') {
            isValid = false;
        }
    });
    
    return isValid;
}

export function loadCiudades() {
    const estadoId = document.getElementById("estados").value;
    const ciudadesSelect = document.getElementById("ciudades");
    
    // Limpiar select
    ciudadesSelect.innerHTML = '<option value="">Seleccione una ciudad</option>';
    
    // Filtrar y agregar ciudades
    listCiudades
        .filter(ciudad => ciudad.estado.idEstado == estadoId)
        .forEach(ciudad => {
            const option = document.createElement("option");
            option.value = ciudad.idCiudad;
            option.textContent = ciudad.nombre;
            ciudadesSelect.appendChild(option);
        });
}

// Cargar estados en el select
export function loadEstados() {
    const estadosSelect = document.getElementById("estados");
    estadosSelect.innerHTML = '<option value="">Seleccione un estado</option>'; // Limpiar primero
    
    listEstados.forEach(estado => {
        const option = document.createElement("option");
        option.value = estado.idEstado;
        option.textContent = estado.nombre;
        estadosSelect.appendChild(option);
    });
}

// Mostrar/ocultar formulario
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
        
        setupRealTimeValidation();
    }
}

export function cancelarFormulario() {
    limpiar();
    document.getElementById("formulario-contenedor").classList.add("d-none");
    document.getElementById("btn-agregar").classList.remove("d-none");
}

// Limpiar formulario
function limpiar() {
    const form = document.getElementById("form-agregar");
    if (form) form.reset();
    
    document.querySelectorAll('#form-agregar input[placeholder]').forEach(input => {
        const originalPlaceholder = input.getAttribute('data-original-placeholder');
        if (originalPlaceholder) {
            input.placeholder = originalPlaceholder;
        }
    });
    
    idPersona = null;
    idUsuario = null;
    
    document.querySelectorAll('[id$="-error"]').forEach(el => el.textContent = '');
    
    document.querySelectorAll('#form-agregar input, #form-agregar select').forEach(el => {
        el.classList.remove('is-invalid', 'is-valid');
    });
}

// Mostrar clientes activos/inactivos
export function mostrarInactivos() {
    const mostrarActivos = document.getElementById("activos").checked;
    const tableBody = document.getElementById("renglones");
    const btnAgregar = document.getElementById("btn-agregar");
    const btnEliminar = document.getElementById("btn-eliminar");

    // Configurar visibilidad de botones
    btnAgregar?.classList.toggle("d-none", !mostrarActivos);
    btnEliminar?.classList.toggle("d-none", !mostrarActivos);

    // Generar filas de la tabla
    tableBody.innerHTML = listCliente
        .filter(registro => mostrarActivos ? registro.activo === 1 : registro.activo === 0)
        .map((registro, index) => `
            <tr onclick="controladorGra1.selectRegistro(${index})">
                <td>${registro.persona.nombre}</td>
                <td>${registro.persona.apellidos}</td>
                <td>${registro.persona.telefono}</td>
                <td>${registro.persona.ciudad.nombre}</td>
                <td>${registro.persona.ciudad.estado.nombre}</td>
                <td>${registro.usuario.nombre}</td>
                <td>**********</td>
            </tr>
        `).join('');
}

export function selectRegistro(index) {
    if (index < 0 || index >= listCliente.length) {
        console.error("Índice fuera de rango");
        return;
    }

    const cliente = listCliente[index];
    
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

export async function agregarCliente() {
    const username = localStorage.getItem("nombreUsuario");
    if (!username) {
        alert("No se encontró información de usuario");
        return false;
    }

    // 1. Validar el formulario completo
    if (!validateForm()) {
        alert('Por favor complete correctamente todos los campos requeridos.');
        return false;
    }

    const contraseniaInput = document.getElementById("contrasenia");
    if (!idPersona && !contraseniaInput.value.trim()) {
        alert("La contraseña es obligatoria para nuevos clientes");
        return false;
    }

    const usuario = document.getElementById("usuario").value.trim();
    const countAt = usuario.split('@').length - 1;
    if (countAt !== 1) {
        alert("El nombre de usuario debe contener exactamente un símbolo @");
        return false;
    }

    const erroresVisibles = document.querySelectorAll('.is-invalid').length > 0;
    if (erroresVisibles) {
        alert("Corrija los campos marcados en rojo antes de continuar");
        return false;
    }

    if (contraseniaInput.value.trim() && !validateField({target: contraseniaInput})) {
        alert("La contraseña no cumple con los requisitos");
        return false;
    }

    const clienteData = {
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

    try {
        showLoader();
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.agregarCliente}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "username": username
            },
            body: new URLSearchParams({ datosCliente: JSON.stringify(clienteData) })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al agregar cliente");
        }

        const json = await response.json();
        console.log("Success:", json);
        
        // Actualizar lista
        const updatedList = await fetchData(ENDPOINTS.clientes);
        if (updatedList) {
            listCliente = updatedList;
            mostrarInactivos();
        }
        
        return true;
    } catch (error) {
        console.error("Error:", error);
        alert(`Error al guardar el cliente: ${error.message}`);
        return false;
    } finally {
        hideLoader();
        cancelarFormulario();
    }
}

// Eliminar cliente
export async function eliminarCliente() {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este cliente?");
    if (!confirmacion) return;

    const username = localStorage.getItem("nombreUsuario");
    const clienteAEliminar = listCliente.find(cli => cli.persona.idPersona === idPersona);
    
    if (!clienteAEliminar) {
        alert("No se encontró el cliente a eliminar");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.eliminarCliente}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "username": username
            },
            body: new URLSearchParams({ idCliente: clienteAEliminar.idCliente })
        });

        if (!response.ok) throw new Error("Error al eliminar cliente");

        const json = await response.json();
        console.log("Success:", json);
        
        // Actualizar lista
        const updatedList = await fetchData(ENDPOINTS.clientes);
        if (updatedList) {
            listCliente = updatedList;
            mostrarInactivos();
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error al eliminar el cliente");
    } finally {
        cancelarFormulario();
    }
}

// Cerrar sesión
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

// Inicializar cuando se carga el módulo
document.addEventListener('DOMContentLoaded', () => {
    loadInitialData();
});