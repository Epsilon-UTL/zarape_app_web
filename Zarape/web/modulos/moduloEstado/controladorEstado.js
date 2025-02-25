let listEstados =[];

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