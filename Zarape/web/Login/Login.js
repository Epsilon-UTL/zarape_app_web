/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

let usuarios = [];


function probarSeleccion() {
    for(let i = 0; i < usuarios.length; i++) {
        if(usuarios[i].activo == 1) {
            console.log(usuarios[i]);
        }
    }
}

export function loginToken() {
    const usuario = document.getElementById("usuario").value;
    localStorage.setItem('nombreUsuario', usuario);

    const url = new URL('http://localhost:8080/Zarape/api/login/cheecky');
    url.search = new URLSearchParams({ 'nombre': usuario });

    fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
            localStorage.setItem('token', data); 
            console.log(localStorage.getItem('token',data));
    })
    .catch(error => {
        console.error("Error al obtener los datos:", error);
    });

    console.log(localStorage.getItem('nombreUsuario'));
}

export function verificarToken() {
    const user = localStorage.getItem('nombreUsuario');
    const token = localStorage.getItem('token');

    if (token) {
        alert(`Bienvenido de nuevo ${user}`);
        loadInicio();
    }
}

export function login() { 
        const contrasena = document.getElementById("contraseña").value;
        const usuario = document.getElementById("usuario").value;
        
        let data = new URLSearchParams();
        data.append('u', usuario);
        data.append('c', contrasena); 

        let registro = {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: data.toString()
        };

        fetch('http://localhost:8080/Zarape/api/login/acceso', registro)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                if (!json.success) {
                    throw new Error(json.error || "Credenciales inválidas");
                }
                alert("Inicio de sesión exitoso");
                loginToken(); 
                loadInicio();
            })
            .catch(error => {
                console.error("Error en el inicio de sesión:", error);
                alert(error.message);
            });
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
            loadLogin();
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

fetch('http://localhost:8080/Zarape/api/login/getAllUsuarios')
    .then(response=>response.json())
    .then(
    registro=>{
        usuarios=registro;
        probarSeleccion();
        console.log(usuarios);
    });


    