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