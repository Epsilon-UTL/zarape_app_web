let listSucursales = [];
let listCiudades = [];
let listEstados = [];

// URLs base para las APIs
const API_BASE_URL = 'http://localhost:8080/Zarape/api';
const ENDPOINTS = {
    ciudades: '/ciudad/getAllCiudades',
    estados: '/datos/getAllEstados',
    sucursales: '/sucursales/getAllSucursales',
    agregarSucursal: '/sucursales/agregar',
    eliminarSucursal: '/sucursales/eliminar'
};

// Función genérica para hacer fetch requests
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
        const [ciudades, estados, sucursales] = await Promise.all([
            fetchData(ENDPOINTS.ciudades),
            fetchData(ENDPOINTS.estados),
            fetchData(ENDPOINTS.sucursales)
        ]);
        
        if (ciudades) {
            listCiudades = ciudades;
            loadCiudades();
        }

        if (estados) {
            listEstados = estados;
            loadEstados();
        }

        if (sucursales) {
            listSucursales = sucursales;
            mostrarInactivos();
        }
        
        cambioImagen();
    } catch (error) {
        console.error("Error loading initial data:", error);
    } finally {
        console.log("Finalizado");
        hideLoader();
    }
}

// Cargar ciudades basado en estado seleccionado
export function loadCiudades() {
    const estadoId = document.getElementById("estados").value;
    const ciudadesSelect = document.getElementById("Ciudades");
    
    // Limpiar select
    ciudadesSelect.innerHTML = '';
    
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
    estadosSelect.innerHTML = ''; // Limpiar primero
    
    listEstados.forEach(estado => {
        const option = document.createElement("option");
        option.value = estado.idEstado;
        option.textContent = estado.nombre;
        estadosSelect.appendChild(option);
    });
}

// Mostrar/ocultar formulario
export function mostrarFormulario() {
    document.getElementById("formulario-contenedor").classList.remove("d-none");
}

export function cancelarFormulario() {
    limpiar();
    document.getElementById("formulario-contenedor").classList.add("d-none");
}

// Limpiar formulario
function limpiar() {
    const form = document.getElementById("form-agregar");
    if (form) form.reset();
    document.getElementById("idSucursal").value = "";
}

// Mostrar sucursales activas/inactivas
export function mostrarInactivos() {
    const mostrarActivos = document.getElementById("activos").checked;
    const tableBody = document.getElementById("renglones");
    const btnAgregar = document.getElementById("btn-agregar");
    const btnEliminar = document.getElementById("btn-eliminar");

    // Configurar visibilidad de botones
    btnAgregar.classList.toggle("d-none", !mostrarActivos);
    btnEliminar.classList.toggle("d-none", !mostrarActivos);

    // Generar filas de la tabla
    tableBody.innerHTML = listSucursales
        .filter(registro => mostrarActivos ? registro.activo === 1 : registro.activo === 0)
        .map((registro, index) => `
            <tr ondblclick="controladorGra1.selectRegistro(${registro.idSucursal})">
                <td>${registro.nombre}</td>
                <td>${registro.latitud}</td>
                <td>${registro.longitud}</td>
                <td><img src="data:image/png;base64,${registro.foto || ''}" alt="Foto" width="50"></td>
                <td>${registro.urlWeb}</td>
                <td>${registro.horario}</td>
                <td>${registro.calle}</td>
                <td>${registro.numCalle}</td>
                <td>${registro.colonia}</td>
                <td>${registro.Ciudad.nombre}</td>
            </tr>
        `).join('');
}

export function selectRegistro(sucursald) {
    let sucursal = listSucursales.filter(elemento => elemento.idSucursal == sucursald);
    
    if (!sucursal) return;

    sucursal = sucursal[0];

    // Llenar formulario
    document.getElementById("idSucursal").value = sucursal.idSucursal;
    document.getElementById("nombre").value = sucursal.nombre;
    document.getElementById("latitud").value = sucursal.latitud;
    document.getElementById("longitud").value = sucursal.longitud;
    document.getElementById("urlWeb").value = sucursal.urlWeb;
    document.getElementById("horarios").value = sucursal.horario;
    document.getElementById("calle").value = sucursal.calle;
    document.getElementById("numCalle").value = sucursal.numCalle;
    document.getElementById("colonia").value = sucursal.colonia;
    
    // Manejar la imagen
    const inputFoto = document.getElementById("foto");
    if (sucursal.foto) {
        inputFoto.setAttribute('data-imagen', sucursal.foto);
        const previewDiv = document.getElementById('imagen-preview');
        const previewImg = document.getElementById('imagen-preview-img');
        previewImg.src = `data:image/png;base64,${sucursal.foto}`;
        previewDiv.style.display = 'block';
    } else {
        inputFoto.removeAttribute('data-imagen');
        document.getElementById('imagen-preview').style.display = 'none';
    }
    
    console.log(sucursal.colonia,sucursal.Ciudad);
    document.getElementById("estados").value = sucursal.Ciudad.estado.idEstado;
    loadCiudades();
    
    setTimeout(() => {
        document.getElementById("Ciudades").value = sucursal.Ciudad.idCiudad;
    }, 100);
    
    mostrarFormulario();
}

// Agregar nueva sucursal
export async function agregarSucursal() {
    const inputFoto = document.getElementById("foto");
    const fotoBase64 = inputFoto.getAttribute('data-imagen') || '';
    const username = localStorage.getItem("nombreUsuario");

    const formData = {
        idSucursal: parseInt(document.getElementById("idSucursal").value) || -1,
        nombre: document.getElementById("nombre").value,
        latitud: parseFloat(document.getElementById("latitud").value),
        longitud: parseFloat(document.getElementById("longitud").value),
        foto: fotoBase64, // Usamos el valor de data-imagen
        urlWeb: document.getElementById("urlWeb").value,
        horario: document.getElementById("horarios").value.replace(/\+/g, ' '),
        calle: document.getElementById("calle").value.replace(/\+/g, ' '),
        numCalle: document.getElementById("numCalle").value,
        colonia: document.getElementById("colonia").value,
        activo: 1,
        Ciudad: {
            idCiudad: parseFloat(document.getElementById("Ciudades").value)
        }
    };

    console.log(formData);

    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.agregarSucursal}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "username": username
            },
            body: new URLSearchParams({ datosSucursal: JSON.stringify(formData) })
        });

        if (!response.ok) throw new Error("Error al agregar sucursal");

        const json = await response.json();
        console.log("Success:", json);
        
        // Actualizar lista
        const updatedList = await fetchData(ENDPOINTS.sucursales);
        if (updatedList) {
            listSucursales = updatedList;
            mostrarInactivos();
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        cancelarFormulario();
    }
}

// Eliminar sucursal
export async function eliminarSucursal() {
    const idSucursal = document.getElementById("idSucursal").value;
    const username = localStorage.getItem("nombreUsuario");
    if (!idSucursal) return;

    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.eliminarSucursal}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded" ,
                "username": username
            },
            body: new URLSearchParams({ idSucursal })
        });

        if (!response.ok) throw new Error("Error al eliminar sucursal");

        const json = await response.json();
        console.log("Success:", json);
        
        // Actualizar lista
        const updatedList = await fetchData(ENDPOINTS.sucursales);
        if (updatedList) {
            listSucursales = updatedList;
            mostrarInactivos();
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        cancelarFormulario();
    }
}

// Manejar redimensionamiento de ventana
function handleResize() {
    const barraLateral = document.getElementById("barraLateral");
    if (barraLateral && window.innerWidth <= 384) {
        barraLateral.classList.toggle("show");
    }
}

function cambioImagen() {
    document.getElementById('foto').addEventListener('change', function (e) {
        const previewDiv = document.getElementById('imagen-preview');
        const previewImg = document.getElementById('imagen-preview-img');
        const inputFoto = document.getElementById('foto');

        if (this.files && this.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const base64Image = e.target.result.split(',')[1];
                previewImg.src = e.target.result;
                inputFoto.setAttribute('data-imagen', base64Image);
                previewDiv.style.display = 'block';
            }

            reader.readAsDataURL(this.files[0]);
        } else {
            previewDiv.style.display = 'none';
            inputFoto.removeAttribute('data-imagen');
        }
    });
}

