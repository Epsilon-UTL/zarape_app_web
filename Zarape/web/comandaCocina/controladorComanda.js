class ComandaService {
    // Obtener todas las comandas en orden FIFO
    async getComandasFIFO() {
        try {
            const response = await fetch('http://localhost:8080/Zarape/api/comanda/getAllFIFO');
            const data = await response.json();
            
            // Procesar datos para incluir color según estatus
            return data.map(comanda => ({
                ...comanda,
                colorEstatus: this.getColorByStatus(comanda.estatus)
            }));
        } catch (error) {
            console.error('Error al obtener comandas:', error);
            return [];
        }
    }
    
    // Cambiar estatus de una comanda
    async changeStatus(idComanda, estatus) {
        try {
            const formData = new FormData();
            formData.append('idComanda', idComanda);
            formData.append('estatus', estatus);
            
            const response = await fetch('http://localhost:8080/Zarape/api/comanda/changeStatus', {
                method: 'POST',
                body: formData
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error al cambiar estatus:', error);
            return { error: error.message };
        }
    }
    
    // Obtener detalles de un ticket
    async getDetails(idTicket) {
        try {
            const response = await fetch(`http://localhost:8080/Zarape/api/comanda/getDetails?idTicket=${idTicket}`);
            return await response.json();
        } catch (error) {
            console.error('Error al obtener detalles:', error);
            return [];
        }
    }
    
    // Mapear estatus a colores
    getColorByStatus(status) {
        const statusMap = {
            1: 'brown',    // En proceso
            2: 'green',    // Terminado
            3: 'blue',     // Entregado
            4: 'darkgray'  // Cancelado
        };
        return statusMap[status] || 'black';
    }
    
    // Mapear estatus a texto
    getTextByStatus(status) {
        const statusMap = {
            1: 'En proceso',
            2: 'Terminado',
            3: 'Entregado',
            4: 'Cancelado'
        };
        return statusMap[status] || 'Desconocido';
    }
}

// Ejemplo de uso en el frontend
const comandaService = new ComandaService();

// Obtener y mostrar comandas
async function loadComandas() {
    const comandas = await comandaService.getComandasFIFO();
    const comandasContainer = document.getElementById('comandas-container');
    
    comandasContainer.innerHTML = '';
    
    comandas.forEach(async (comanda) => {
        const comandaElement = document.createElement('div');
        comandaElement.className = 'comanda-card';
        comandaElement.style.borderLeft = `5px solid ${comanda.colorEstatus}`;
        
        // Mostrar información básica
        comandaElement.innerHTML = `
            <h3>Comanda #${comanda.idComanda}</h3>
            <p>Fecha: ${comanda.ticket.fecha}</p>
            <p>Estatus: <span style="color:${comanda.colorEstatus}">
                ${comandaService.getTextByStatus(comanda.estatus)}
            </span></p>
            <button onclick="showDetails(${comanda.ticket.idTicket})">Ver detalles</button>
            ${comanda.estatus === 1 ? `<button onclick="updateStatus(${comanda.idComanda}, 2)">Marcar como Terminado</button>` : ''}
        `;
        
        comandasContainer.appendChild(comandaElement);
    });
}

// Mostrar detalles
async function showDetails(idTicket) {
    const detalles = await comandaService.getDetails(idTicket);
    // Implementar lógica para mostrar detalles en modal o sección aparte
    console.log('Detalles:', detalles);
}

// Actualizar estatus
async function updateStatus(idComanda, estatus) {
    const result = await comandaService.changeStatus(idComanda, estatus);
    if (!result.error) {
        loadComandas(); // Recargar la lista
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', loadComandas);