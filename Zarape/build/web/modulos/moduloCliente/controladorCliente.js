let listCliente = [];
let listEstados =[];
let listCiudades = [];

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
}

    export function loadCliente(){
        mostrarInactivos();
    }
    const username = localStorage.getItem("nombreUsuario");
    fetch("http://localhost:8080/Zarape/api/cliente/getAllCliente", {
        method: "GET",
        headers: {
            "username": username,
            "Content-Type": "application/json"
        }
    })
        .then(response=>response.json())
        .then(
        registro=>{
            console.log(registro);
            listCliente=registro;
            loadCliente();
        });
        
export function agregarCliente() {
    const username = localStorage.getItem("nombreUsuario");
    
    let v_idPersona = idPersona || -1;
    let v_idUsuario = idUsuario || -1;
    let v_id = document.getElementById("idCliente").value || -1;
    let v_nombre = document.getElementById("nombre").value;
    let v_apellidos = document.getElementById("apellidos").value;
    let v_telefono = document.getElementById("telefono").value;
    let v_ciudad = document.getElementById("ciudades").value;
    let v_estado = document.getElementById("estados").value;
    let v_user = document.getElementById("usuario").value;
    let v_contrasenia = document.getElementById("contrasenia").value;

    let cliente = {
        idCliente: v_id,
        activo: 1,  
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
        .then(response => response.json())
        .then(json => {
            console.log(json);
            fetch('http://localhost:8080/Zarape/api/cliente/getAllCliente', {
                headers: { "username": username }
            })
            .then(response => response.json())
            .then(registro => {
                listCliente = registro;
                loadCliente();
            })
            .catch(error => console.error("Error al obtener clientes:", error));
        })
        .catch(error => console.error("Error al agregar el cliente:", error));

    limpiar();
    cancelarFormulario();
}

export function eliminarCliente() {
    const username = localStorage.getItem("nombreUsuario");
    
    let v_idCliente = document.getElementById("idCliente").value; 
    let datos_servidor = { idCliente: v_idCliente };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "username": username
        },
        body: parametro
    };

    console.log(registro); 

    fetch('http://localhost:8080/Zarape/api/cliente/eliminarCliente', registro)
        .then(response => response.json())
        .then(json => {
            console.log(json); 

            fetch('http://localhost:8080/Zarape/api/cliente/getAllCliente', {
                headers: { "username": username } 
            })
            .then(response => response.json())
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


let idPersona = null;
let idUsuario = null;

export function selectRegistro(indice) { 
    document.getElementById("idCliente").value = listCliente[indice].idCliente;
    document.getElementById("nombre").value = listCliente[indice].persona.nombre;
    document.getElementById("apellidos").value = listCliente[indice].persona.apellidos;
    document.getElementById("telefono").value = listCliente[indice].persona.telefono;
    document.getElementById("estados").value = listCliente[indice].persona.ciudad.estado.idEstado;
    document.getElementById("ciudades").value = listCliente[indice].persona.ciudad.idCiudad;
    document.getElementById("usuario").value = listCliente[indice].usuario.nombre;
    document.getElementById("contrasenia").value = listCliente[indice].usuario.contrasenia;
    idPersona = listCliente[indice].persona.idPersona;
    idUsuario = listCliente[indice].usuario.idUsuario;
    controladorGra1.mostrarFormulario();
}

export function cerrarSesion() {
    try {
        const nombreUsuario = localStorage.getItem('nombreUsuario');
        console.log(nombreUsuario);
        if (!nombreUsuario) {
            console.error('No se encontró el nombre de usuario');
            return;
        }

        const url = new URL('http://localhost:8080/Zarape/api/login/cerrarsesion');
        url.search = new URLSearchParams({ 'nombre': nombreUsuario });

        fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al comunicarse con el servidor');
            }
            return response.json();
        })
        .then(result => {
            if (result.message) {
                console.log(result.message);
            } else if (result.error) {
                console.error(result.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('nombreUsuario');
            alert("Cerrando sesión");
            loadLogin();
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

export function limpiar() {
    document.getElementById("idCliente").value = null;
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
    listCliente.forEach(registro=>{
        if (mostrarActivos && registro.activo === 1) {
        renglon+="<tr onclick='controladorGra1.selectRegistro("+listCliente.indexOf(registro)+");'><td>"+registro.persona.nombre+
                "</td><td>"+registro.persona.apellidos+
                "</td><td>"+registro.persona.telefono+
                "</td><td>"+registro.persona.ciudad.nombre+
                "</td><td>"+registro.persona.ciudad.estado.nombre+
                "</td><td>"+registro.usuario.nombre+
                "</td><td>"+'**********'+
                "</td><tr>";
        btnGuardar.classList.remove("d-none");
        btnEliminar.classList.remove("d-none");
        }else if(!mostrarActivos && registro.activo === 0){
            renglon+="<tr onclick='controladorGra1.selectRegistro("+listCliente.indexOf(registro)+");'><td>"+registro.persona.nombre+
                "</td><td>"+registro.persona.apellidos+
                "</td><td>"+registro.persona.telefono+
                "</td><td>"+registro.persona.ciudad.nombre+
                "</td><td>"+registro.persona.ciudad.estado.nombre+
                "</td><td>"+registro.usuario.nombre+
                "</td><td>"+'**********'+
                "</td><tr>";
        btnGuardar.classList.add("d-none");
        btnEliminar.classList.add("d-none");
    }
    });
    table.innerHTML=renglon;
    
}

document.getElementById("nombre").addEventListener("input", function () {
    const nombre = this.value.trim();
    const regex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;  
    const errorDiv = document.getElementById("error-nombre");
    const errores = [];

    errorDiv.innerHTML = '';

    if (!nombre || nombre.length < 1 || nombre.length > 45 || !regex.test(nombre)) {
        errores.push("El nombre debe contener solo letras, sin acentos, un espacio entre palabras, y tener entre 1 y 45 caracteres.");
    }

    if (errores.length > 0) {
        errores.forEach(error => {
            const errorItem = document.createElement("div");
            errorItem.style.color = "red";
            errorItem.innerHTML = error;
            errorDiv.appendChild(errorItem);
        });
    }
});

document.getElementById("apellidos").addEventListener("input", function () {
    const apellidos = this.value.trim();
    const regex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/; 
    const errorDiv = document.getElementById("error-apellidos");
    const errores = [];

    errorDiv.innerHTML = '';

    if (!apellidos || apellidos.length < 1 || apellidos.length > 45 || !regex.test(apellidos)) {
        errores.push("Los apellidos debe contener solo letras, sin acentos, un espacio entre palabras, y tener entre 1 y 45 caracteres.");
    }

    if (errores.length > 0) {
        errores.forEach(error => {
            const errorItem = document.createElement("div");
            errorItem.style.color = "red";
            errorItem.innerHTML = error;
            errorDiv.appendChild(errorItem);
        });
    }
});

document.getElementById("telefono").addEventListener("input", function () {
    const telefono = this.value.trim();
    const regex = /^\d{10}$/;  
    const errorDiv = document.getElementById("error-telefono");
    const errores = [];

    errorDiv.innerHTML = '';

    if (!telefono || !regex.test(telefono)) {
        errores.push("El teléfono debe contener exactamente 10 dígitos numéricos sin espacios.");
    }

    if (errores.length > 0) {
        errores.forEach(error => {
            const errorItem = document.createElement("div");
            errorItem.style.color = "red";
            errorItem.innerHTML = error;
            errorDiv.appendChild(errorItem);
        });
    }
});

document.getElementById("usuario").addEventListener("input", function () {
    const usuario = this.value.trim();
    const regex = /^[a-zA-Z0-9@]+$/; 
    const errorDiv = document.getElementById("error-usuario");
    const errores = [];

    errorDiv.innerHTML = '';

    if (!usuario || usuario.length < 5 || usuario.length > 30 || !regex.test(usuario)) {
        errores.push("El nombre de usuario debe tener entre 5 a 30 caracteres y solo puede contener letras, números y arroba.");
    }

    if (errores.length > 0) {
        errores.forEach(error => {
            const errorItem = document.createElement("div");
            errorItem.style.color = "red";
            errorItem.innerHTML = error;
            errorDiv.appendChild(errorItem);
        });
    }
});

document.getElementById("contrasenia").addEventListener("input", function () {
    const contrasenia = this.value.trim();
    const regex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/; 
    const errorDiv = document.getElementById("error-contrasenia");
    const errores = [];

    errorDiv.innerHTML = '';

    if (!contrasenia || contrasenia.length < 5 || contrasenia.length > 15 || !regex.test(contrasenia)) {
        errores.push("La contraseña debe tener de 5 a 15 caracteres y no contener espacios.");
    }

    if (errores.length > 0) {
        errores.forEach(error => {
            const errorItem = document.createElement("div");
            errorItem.style.color = "red";
            errorItem.innerHTML = error;
            errorDiv.appendChild(errorItem);
        });
    }
});


document.getElementById("btn-agregar").addEventListener("click", function (event) {
    const nombreError = document.getElementById("error-nombre").innerHTML;
    const apellidosError = document.getElementById("error-apellidos").innerHTML;
    const telefonoError = document.getElementById("error-telefono").innerHTML;
    const usuarioError = document.getElementById("error-usuario").innerHTML;
    const contraseniaError = document.getElementById("error-contrasenia").innerHTML;

    if (nombreError || apellidosError || telefonoError || usuarioError || contraseniaError) {
        event.preventDefault();  // Evitar el envío
        alert("Hay errores en el formulario. Corrígelos antes de continuar.");
    }
});