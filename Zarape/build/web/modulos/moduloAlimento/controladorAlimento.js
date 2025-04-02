// Variables globales
let listAlimento = [];
let listCategoriaAlimento = [];
let idproducto = null;

// Objeto global para las funciones
window.controladorGra1 = window.controladorGra1 || {};

// Función para mostrar alerta de éxito
function mostrarAlertaExito(mensaje) {
    alert(`✅ Éxito: ${mensaje}`);
}

// Función para mostrar alerta de error
function mostrarAlertaError(mensaje) {
    alert(`❌ Error: ${mensaje}`);
}

// Función para mostrar confirmación
function mostrarConfirmacion(mensaje) {
    return confirm(`⚠️ ${mensaje}\n¿Desea continuar?`);
}

// Función para validar nombre (solo letras, espacios y acentos)
function validarNombre(nombre) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
    return regex.test(nombre);
}

// Función para validar descripción
function validarDescripcion(descripcion) {
    return descripcion.length <= 200; // Máximo 200 caracteres
}

// Función para validar precio
function validarPrecio(precio) {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(precio) && parseFloat(precio) > 0;
}

// Función para marcar campo como inválido
function marcarInvalido(elemento, mensaje) {
    elemento.classList.add('is-invalid');
    const feedback = elemento.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = mensaje;
    }
}

// Función para marcar campo como válido
function marcarValido(elemento) {
    elemento.classList.remove('is-invalid');
    elemento.classList.add('is-valid');
}

// Función para limpiar validaciones
function limpiarValidaciones() {
    document.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
        el.classList.remove('is-invalid', 'is-valid');
    });
}

// Función para cargar categorías
export function loadCategoriaAlm() {
    let v_categoria = document.getElementById("categoriaAlm");
    v_categoria.innerHTML = '<option value="" selected disabled>Seleccione una categoría</option>';
    listCategoriaAlimento.forEach(categoria => {
        let v_option = document.createElement("option");
        v_option.value = categoria.idCategoria;
        v_option.text = categoria.descripcion;
        v_categoria.appendChild(v_option);
    });
}

// Event listeners para validación en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    const nombreInput = document.getElementById("nombre");
    const descripcionInput = document.getElementById("descripcion");
    const precioInput = document.getElementById("precio");
    const categoriaInput = document.getElementById("categoriaAlm");
    const fotoInput = document.getElementById("foto");

    if (nombreInput) {
        nombreInput.addEventListener('input', function() {
            if (!validarNombre(this.value)) {
                marcarInvalido(this, 'El nombre debe tener entre 2 y 50 caracteres (solo letras y espacios)');
            } else {
                marcarValido(this);
            }
        });
    }

    if (descripcionInput) {
        descripcionInput.addEventListener('input', function() {
            if (!validarDescripcion(this.value)) {
                marcarInvalido(this, 'La descripción no debe exceder los 200 caracteres');
            } else {
                marcarValido(this);
            }
        });
    }

    if (precioInput) {
        precioInput.addEventListener('input', function() {
            if (!validarPrecio(this.value)) {
                marcarInvalido(this, 'Ingrese un precio válido (ej. 25.99) mayor a 0');
            } else {
                marcarValido(this);
            }
        });
    }

    if (categoriaInput) {
        categoriaInput.addEventListener('change', function() {
            if (!this.value) {
                marcarInvalido(this, 'Seleccione una categoría');
            } else {
                marcarValido(this);
            }
        });
    }

    if (fotoInput) {
        fotoInput.addEventListener('change', function() {
            const imgFeedback = document.getElementById("foto-feedback");
            if (!this.files || !this.files[0]) {
                if (imgFeedback) imgFeedback.textContent = 'Seleccione una imagen';
            } else {
                if (imgFeedback) imgFeedback.textContent = '';
            }
        });
    }
});

// Cargar categorías al inicio
fetch('http://localhost:8080/Zarape/api/categoria/getAllCategoriaAlimentos')
    .then(response => response.json())
    .then(datos => {
        listCategoriaAlimento = datos;
        loadCategoriaAlm();
    })
    .catch(error => {
        console.error("Error al cargar categorías:", error);
        mostrarAlertaError("No se pudieron cargar las categorías de alimentos");
    });

// Funciones de formulario
export function mostrarFormulario() {
    const formularioContenedor = document.getElementById("formulario-contenedor");
    const btnAgregar = document.getElementById("btn-agregar");
    btnAgregar.classList.add("d-none");
    formularioContenedor.classList.remove("d-none");
    
    const btnEliminar = document.getElementById("btn-eliminar");
    btnEliminar.classList.toggle("d-none", !idproducto);
    
    limpiarValidaciones();
}

export function cancelarFormulario() {
    const formularioContenedor = document.getElementById("formulario-contenedor");
    const btnAgregar = document.getElementById("btn-agregar");
    btnAgregar.classList.remove("d-none");
    formularioContenedor.classList.add("d-none");
    limpiar();
}

// Cargar alimentos
export function loadAlimento() {
    mostrarInactivos();
}

fetch('http://localhost:8080/Zarape/api/alimento/getAllAlimento')
    .then(response => response.json())
    .then(registro => {
        listAlimento = registro;
        loadAlimento();
    })
    .catch(error => {
        console.error("Error al cargar alimentos:", error);
        mostrarAlertaError("No se pudo cargar la lista de alimentos");
    });

// Función para cargar fotografía - VERSIÓN MEJORADA
export function cargarFotografia() {
    const inputFile = document.getElementById("foto");
    const imgFoto = document.getElementById("imgFoto");
    const txtaFoto = document.getElementById("txtaFotoNuevaAlimento");
    const imgFeedback = document.getElementById("foto-feedback");
    
    if (!inputFile.files || !inputFile.files[0]) {
        if (imgFeedback) imgFeedback.textContent = 'Por favor seleccione una imagen';
        return;
    }

    const file = inputFile.files[0];
    
    // Validar tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
        if (imgFeedback) imgFeedback.textContent = 'El archivo debe ser una imagen (JPEG, PNG, GIF, WEBP)';
        return;
    }

    // Validar tamaño (ejemplo: máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
        if (imgFeedback) imgFeedback.textContent = 'La imagen no debe superar los 2MB';
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Mostrar vista previa
        imgFoto.src = e.target.result;
        
        // Guardar base64 para enviar al servidor
        const base64String = e.target.result.split(',')[1];
        txtaFoto.value = base64String;
        
        if (imgFeedback) imgFeedback.textContent = '';
    };
    
    reader.onerror = function() {
        if (imgFeedback) imgFeedback.textContent = 'Error al leer el archivo de imagen';
        imgFoto.src = "";
        txtaFoto.value = "";
    };
    
    reader.readAsDataURL(file);
}

// Función para validar formulario completo
function validarFormulario() {
    let valido = true;
    const nombre = document.getElementById("nombre");
    const precio = document.getElementById("precio");
    const categoria = document.getElementById("categoriaAlm");
    const descripcion = document.getElementById("descripcion");
    const foto = document.getElementById("txtaFotoNuevaAlimento");

    // Validar nombre
    if (!nombre.value.trim()) {
        marcarInvalido(nombre, 'El campo Nombre es obligatorio');
        valido = false;
    } else if (!validarNombre(nombre.value)) {
        marcarInvalido(nombre, 'El nombre debe tener entre 2 y 50 caracteres (solo letras y espacios)');
        valido = false;
    }

    // Validar precio
    if (!precio.value.trim()) {
        marcarInvalido(precio, 'El campo Precio es obligatorio');
        valido = false;
    } else if (!validarPrecio(precio.value)) {
        marcarInvalido(precio, 'Ingrese un precio válido (ej. 25.99) mayor a 0');
        valido = false;
    }

    // Validar categoría
    if (!categoria.value) {
        marcarInvalido(categoria, 'Debe seleccionar una categoría');
        valido = false;
    }

    // Validar descripción
    if (descripcion.value && !validarDescripcion(descripcion.value)) {
        marcarInvalido(descripcion, 'La descripción no debe exceder los 200 caracteres');
        valido = false;
    }

    // Validar foto (solo si es nuevo producto)
    if (!idproducto && !foto.value) {
        const fotoFeedback = document.getElementById("foto-feedback");
        if (fotoFeedback) fotoFeedback.textContent = 'Debe seleccionar una imagen para el producto';
        valido = false;
    }

    return valido;
}

// Función para agregar/actualizar alimento con validaciones
export function agregarAlimento() {
    // Validar formulario antes de continuar
    if (!validarFormulario()) {
        mostrarAlertaError("Por favor complete correctamente todos los campos requeridos");
        return;
    }

    let v_nombre = document.getElementById("nombre").value.trim();
    let v_precio = document.getElementById("precio").value.trim();
    let v_categoria = document.getElementById("categoriaAlm").value;
    let v_idAlimento = document.getElementById("idAlimento").value || -1;
    let v_idProducto = idproducto || -1;
    let v_descripcion = document.getElementById("descripcion").value.trim();
    let v_foto = document.getElementById("txtaFotoNuevaAlimento").value || 
                (document.getElementById("imgFoto").src.includes("base64") ? 
                 document.getElementById("imgFoto").src.split(",")[1] : "");

    // Confirmación antes de guardar
    const accion = v_idProducto !== -1 ? "actualizar" : "agregar";
    if (!mostrarConfirmacion(`¿Desea ${accion} este alimento?`)) {
        return;
    }

    let alimento = {
        "idAlimento": v_idAlimento,
        "producto": {
            "idProducto": v_idProducto !== -1 ? v_idProducto : null,
            "nombre": v_nombre,
            "descripcion": v_descripcion,
            "foto": v_foto,
            "precio": parseFloat(v_precio),
            "categoria": {
                "idCategoria": v_categoria,
                "nombre": "",
                "activo": 0},
            "activo": 1}
    };

    let endpoint = v_idProducto !== -1 ? 
        'http://localhost:8080/Zarape/api/alimento/actualizarAlimento' : 
        'http://localhost:8080/Zarape/api/alimento/agregarAlimento';

    let datos_servidor = { datosAlimento: JSON.stringify(alimento) };
    let parametro = new URLSearchParams(datos_servidor);

    fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(json => {
        return fetch('http://localhost:8080/Zarape/api/alimento/getAllAlimento');
    })
    .then(response => response.json())
    .then(registrosActualizados => {
        listAlimento = registrosActualizados;
        mostrarInactivos();
        mostrarAlertaExito(v_idProducto !== -1 ? 'Alimento actualizado correctamente' : 'Alimento agregado correctamente');
    })
    .catch(error => {
        console.error("Error:", error);
        mostrarAlertaError(`No se pudo ${accion} el alimento: ${error.message}`);
    })
    .finally(() => {
        limpiar();
        cancelarFormulario();
    });
}

// Función para eliminar alimento
export function eliminarAlimento() {
    if (!idproducto) {
        mostrarAlertaError("Debe seleccionar un alimento primero");
        return;
    }

    if (mostrarConfirmacion("¿Está seguro que desea eliminar este alimento permanentemente?")) {
        let datos_servidor = { idProducto: idproducto };
        let parametro = new URLSearchParams(datos_servidor);

        fetch('http://localhost:8080/Zarape/api/alimento/eliminarAlimento', {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: parametro
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            try {
                return JSON.parse(text);
            } catch {
                return { success: true };
            }
        })
        .then(() => {
            return fetch('http://localhost:8080/Zarape/api/alimento/getAllAlimento');
        })
        .then(response => response.json())
        .then(registrosActualizados => {
            listAlimento = registrosActualizados;
            mostrarInactivos();
            mostrarAlertaExito("Alimento eliminado correctamente");
        })
        .catch(error => {
            console.error("Error al eliminar:", error);
            mostrarAlertaError("No se pudo eliminar el alimento: " + error.message);
        })
        .finally(() => {
            limpiar();
            cancelarFormulario();
        });
    }
};

// Función para seleccionar registro - VERSIÓN MEJORADA
export function selectRegistro(indice) { 
    if (indice < 0 || indice >= listAlimento.length) {
        mostrarAlertaError("Registro no válido seleccionado");
        return;
    }

    const alimento = listAlimento[indice];
    document.getElementById("idAlimento").value = alimento.idAlimento;
    document.getElementById("nombre").value = alimento.producto.nombre;
    document.getElementById("precio").value = alimento.producto.precio;
    document.getElementById("descripcion").value = alimento.producto.descripcion;
    document.getElementById("categoriaAlm").value = alimento.producto.categoria.idCategoria;
    
    // Manejo de la imagen
    const imgFoto = document.getElementById("imgFoto");
    const txtaFoto = document.getElementById("txtaFotoNuevaAlimento");
    const inputFile = document.getElementById("foto");
    
    if (alimento.producto.foto) {
        // Si ya tenemos base64, mostrarlo directamente
        imgFoto.src = `data:image/png;base64,${alimento.producto.foto}`;
        txtaFoto.value = alimento.producto.foto;
    } else {
        imgFoto.src = "";
        txtaFoto.value = "";
    }
    
    // Limpiar el input file
    inputFile.value = "";
    
    idproducto = alimento.producto.idProducto;
    mostrarFormulario();
}

// Función para mostrar inactivos/activos - VERSIÓN MEJORADA
export function mostrarInactivos() {
    const btnAgregar = document.getElementById("btn-agregar");
    const btnEliminar = document.getElementById("btn-eliminar");
    let mostrarActivos = document.getElementById("activos").checked;
    let table = document.getElementById("renglones");
    table.innerHTML = "";
    
    listAlimento.forEach((registro, indice) => {
        if ((mostrarActivos && registro.producto.activo === 1) || 
            (!mostrarActivos && registro.producto.activo === 0)) {
            
            const row = document.createElement("tr");
            row.onclick = () => selectRegistro(indice);
            
            // Manejo seguro de la imagen
            let imagenSrc = '';
            if (registro.producto.foto) {
                imagenSrc = `data:image/png;base64,${registro.producto.foto}`;
            }
            
            row.innerHTML = `
                <td>${registro.producto.nombre}</td>
                <td>${registro.producto.descripcion}</td>
                <td>$${parseFloat(registro.producto.precio).toFixed(2)}</td>
                <td>${registro.producto.categoria.descripcion}</td>
                <td><img src="${imagenSrc}" alt="Imagen del alimento" width="50" 
                     onerror="this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='"></td>
            `;
            
            table.appendChild(row);
        }
    });
    
    btnAgregar.classList.toggle("d-none", !mostrarActivos);
    btnEliminar.classList.toggle("d-none", !mostrarActivos);
}

// Función para limpiar formulario - VERSIÓN MEJORADA
export function limpiar() {
    document.getElementById("idAlimento").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = '';
    document.getElementById("descripcion").value = '';
    document.getElementById("categoriaAlm").value = null;
    document.getElementById("txtaFotoNuevaAlimento").value = ''; 
    document.getElementById("imgFoto").src = '';
    document.getElementById("foto").value = '';
    idproducto = null;
    
    limpiarValidaciones();
}

// Función de toggle para dropdown
function toggleDropdown() {
    limpiar();
    document.getElementById("myDropdown").classList.toggle("show");
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