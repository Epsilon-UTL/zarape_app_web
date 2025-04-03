// Mapeo de estatus a texto
const statusText = {
    1: 'En proceso',
    2: 'Terminado',
    3: 'Entregado',
    4: 'Cancelado'
};

// Mapeo de estatus a iconos
const statusIcons = {
    1: 'fas fa-spinner fa-pulse',
    2: 'fas fa-check-circle',
    3: 'fas fa-truck',
    4: 'fas fa-times-circle'
};

// Mostrar mensaje de error
function showError(message) {
    alert('Error: ' + message);
}

// Mostrar mensaje de éxito
function showSuccess(message) {
    alert('Éxito: ' + message);
}

// Obtener comandas desde el backend
async function fetchComandas() {
    try {
        const response = await fetch('http://localhost:8080/Zarape/api/comanda/getAllFIFO');
        if (!response.ok) throw new Error('Error al cargar comandas');
        const data = await response.json();
        
        // Verificar estructura de datos
        console.log('Datos recibidos:', data);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error al obtener comandas:', error);
        showToast('Error al cargar comandas', 'error');
        return [];
    }
}

// Actualizar estatus en el backend
async function updateStatus(idComanda, newStatus) {
    try {
        const response = await fetch(`http://localhost:8080/Zarape/api/comanda/changeStatus?idComanda=${idComanda}&estatus=${newStatus}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        
        if (!response.ok) throw new Error('Error al actualizar estatus');
        return await response.json();
    } catch (error) {
        console.error('Error al actualizar estatus:', error);
        return { error: error.message };
    }
}

// Mostrar comandas en el HTML
async function displayComandas() {
    const container = document.getElementById('comandas-container');
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Cargando comandas...</p>
        </div>
    `;
    
    let comandas = await fetchComandas();
    
    // Filtrar comandas - excluir las canceladas (4) y entregadas (3)
    comandas = comandas.filter(comanda => comanda.estatus !== 3 && comanda.estatus !== 4);
    
    if (comandas.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-clipboard"></i>
                </div>
                <h3>No hay comandas para mostrar</h3>
                <p>Actualmente no hay comandas pendientes o en proceso.</p>
            </div>
        `;
        updateStatusCounters([]);
        return;
    }
    
    // Actualizar contadores
    updateStatusCounters(comandas);
    
    container.innerHTML = '';
    
    comandas.forEach(comanda => {
        // Verificar si el ticket existe
        const ticket = comanda.ticket || {};
        
        // Formatear fecha - manejar caso donde fecha no existe
        let fechaFormateada = 'Fecha no disponible';
        if (ticket.fecha) {
            try {
                const fecha = new Date(ticket.fecha);
                fechaFormateada = fecha.toLocaleString();
            } catch (e) {
                console.error('Error formateando fecha:', e);
            }
        }
        
        // Crear card
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-id', comanda.idComanda);
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Comanda #${comanda.idComanda}</h3>
                <div class="card-time">
                    <i class="far fa-clock"></i>
                    <span>${fechaFormateada}</span>
                </div>
            </div>
            
            <div class="card-content">
                <div class="card-details" id="details-${comanda.idComanda}">
                    <div class="loading-spinner" style="width: 30px; height: 30px; margin: 10px auto;"></div>
                </div>
            </div>
            
            <div class="card-footer">
                <div class="status-container">
                    <span class="status-label">Estado:</span>
                    <span class="status-badge status-${comanda.estatus}">
                        <i class="${statusIcons[comanda.estatus]}"></i>
                        ${statusText[comanda.estatus] || 'Desconocido'}
                    </span>
                </div>
                
                <select class="status-selector" onchange="handleStatusChange(this, ${comanda.idComanda})">
                    <option value="1" ${comanda.estatus === 1 ? 'selected' : ''}>En proceso</option>
                    <option value="2" ${comanda.estatus === 2 ? 'selected' : ''}>Terminado</option>
                    <option value="3" ${comanda.estatus === 3 ? 'selected' : ''}>Entregado</option>
                    <option value="4" ${comanda.estatus === 4 ? 'selected' : ''}>Cancelado</option>
                </select>
                
                <button class="save-btn" onclick="saveChanges(${comanda.idComanda})">
                    <i class="fas fa-save"></i>
                    Guardar Cambios
                </button>
            </div>
        `;
        
        container.appendChild(card);
        
        // Cargar detalles solo si tenemos idTicket
        if (ticket.idTicket) {
            loadDetails(ticket.idTicket, comanda.idComanda);
        } else {
            const detailsContainer = document.getElementById(`details-${comanda.idComanda}`);
            if (detailsContainer) {
                detailsContainer.innerHTML = '<p>No se pudo cargar detalles (ID de ticket no disponible)</p>';
            }
        }
    });
}

// Cargar detalles de un ticket
async function loadDetails(idTicket, idComanda) {
    const detailsContainer = document.getElementById(`details-${idComanda}`);
    if (!detailsContainer) return;
    
    try {
        const response = await fetch(`http://localhost:8080/Zarape/api/comanda/getDetails?idTicket=${idTicket}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const detalles = await response.json();
        
        if (!Array.isArray(detalles)) {
            throw new Error('Formato de respuesta inválido');
        }
        
        if (detalles.length === 0) {
            detailsContainer.innerHTML = '<p>No hay detalles disponibles</p>';
            return;
        }
        
        let html = `
            <div class="detail-title">
                <i class="fas fa-utensils"></i>
                <span>Detalles del Pedido</span>
            </div>
            <ul class="detail-list">
        `;
        
        detalles.forEach(detalle => {
            // Usar el nombre del producto si está disponible
            let productoDesc = detalle.nombreProducto || 
                            (detalle.idCombo ? `Combo ${detalle.idCombo}` : 
                            (detalle.idProducto ? `Producto ${detalle.idProducto}` : 'Ítem no identificado'));
            
            html += `
                <li class="detail-item">
                    <span class="item-name">${detalle.cantidad || 0} x ${productoDesc}</span>
                    <span class="item-price">$${(detalle.precio || 0).toFixed(2)}</span>
                </li>
            `;
        });
        
        html += `</ul>`;
        
        detailsContainer.innerHTML = html;
    } catch (error) {
        console.error('Error al cargar detalles:', error);
        detailsContainer.innerHTML = `
            <p style="color: var(--error-color);">
                <i class="fas fa-exclamation-triangle"></i>
                Error al cargar detalles: ${error.message}
            </p>
        `;
    }
}

// Manejar cambio de estatus (visual)
function handleStatusChange(select, idComanda) {
    const newStatus = parseInt(select.value);
    const card = document.querySelector(`.card[data-id="${idComanda}"]`);
    if (!card) return;
    
    const statusBadge = card.querySelector('.status-badge');
    if (statusBadge) {
        // Actualizar visualmente
        statusBadge.className = `status-badge status-${newStatus}`;
        statusBadge.innerHTML = `
            <i class="${statusIcons[newStatus]}"></i>
            ${statusText[newStatus] || 'Desconocido'}
        `;
    }
}

// Guardar cambios en el backend
async function saveChanges(idComanda) {
    const card = document.querySelector(`.card[data-id="${idComanda}"]`);
    if (!card) return;
    
    const select = card.querySelector('.status-selector');
    const saveBtn = card.querySelector('.save-btn');
    if (!select || !saveBtn) return;
    
    const newStatus = parseInt(select.value);
    
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Guardando...';
    
    try {
        const result = await updateStatus(idComanda, newStatus);
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        showToast('Estado actualizado correctamente');
        
        // Si el nuevo estado es Cancelado (4) o Entregado (3), quitar la comanda de la vista
        if (newStatus === 3 || newStatus === 4) {
            card.remove();
            
            // Volver a cargar los contadores
            const remainingComandas = Array.from(document.querySelectorAll('.card'))
                .map(card => {
                    return {
                        idComanda: parseInt(card.getAttribute('data-id')),
                        estatus: parseInt(card.querySelector('.status-selector').value)
                    };
                });
            
            updateStatusCounters(remainingComandas);
            
            // Si no quedan comandas, mostrar estado vacío
            if (remainingComandas.length === 0) {
                const container = document.getElementById('comandas-container');
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-clipboard"></i>
                        </div>
                        <h3>No hay comandas para mostrar</h3>
                        <p>Actualmente no hay comandas pendientes o en proceso.</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error al guardar:', error);
        showToast('Error al actualizar: ' + error.message, 'error');
        
        // Revertir visualmente
        const statusBadge = card.querySelector('.status-badge');
        if (statusBadge) {
            const currentStatus = select.getAttribute('data-current-status');
            if (currentStatus) {
                select.value = currentStatus;
                handleStatusChange(select, idComanda);
            }
        }
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
    }
}

// Función para actualizar los contadores de estado
function updateStatusCounters(comandas) {
    const counts = {
        1: 0, // En proceso
        2: 0, // Terminado
        3: 0, // Entregado
        4: 0  // Cancelado
    };
    
    comandas.forEach(comanda => {
        if (comanda.estatus in counts) {
            counts[comanda.estatus]++;
        }
    });
    
    document.getElementById('pending-count').querySelector('span').textContent = `${counts[1]} En proceso`;
    document.getElementById('completed-count').querySelector('span').textContent = `${counts[2]} Terminadas`;
}

// Mostrar notificación toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toast.className = `toast toast-${type}`;
    toastMessage.textContent = message;
    
    // Icono según el tipo
    const icon = toast.querySelector('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    
    // Mostrar toast
    toast.classList.add('show');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Función para refrescar los datos
async function refreshData() {
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Actualizando...';
    }
    
    await displayComandas();
    
    if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
    }
    showToast('Datos actualizados');
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando vista de comandas...');
    displayComandas();
    
    // Actualizar automáticamente cada 30 segundos
    setInterval(refreshData, 50000);
});