package org.utl.dsm403.zarape.control;

import org.utl.dsm403.zarape.db.ConexionMySQL;
import org.utl.dsm403.zarape.model.Comanda;
import org.utl.dsm403.zarape.model.DetalleTicket;
import org.utl.dsm403.zarape.model.Ticket;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;
/**
 *
 * @author rodri
 */
public class ControllerTicket {

    public Comanda registrarTicket(Ticket ticket, List<DetalleTicket> detalles) throws SQLException {
    // Validación inicial
    if (ticket == null || detalles == null || detalles.isEmpty()) {
        throw new IllegalArgumentException("Ticket y detalles son requeridos");
    }

    String sql = "{call registrarTicket(?, ?, ?, ?, ?)}";
    Gson gson = new Gson();
    JsonArray jsonDetalles = new JsonArray();
    
    // Convertir detalles a JSON
    for (DetalleTicket detalle : detalles) {
        if (detalle.getIdProducto() <= 0 || detalle.getCantidad() <= 0) {
            throw new IllegalArgumentException("Datos de producto inválidos");
        }
        
        JsonObject detalleJson = new JsonObject();
        detalleJson.addProperty("idProducto", detalle.getIdProducto());
        detalleJson.addProperty("cantidad", detalle.getCantidad());
        jsonDetalles.add(detalleJson);
    }
    
    try (Connection conn = new ConexionMySQL().open();
         CallableStatement cstmt = conn.prepareCall(sql)) {
        
        // Parámetros de entrada
        cstmt.setInt(1, ticket.getIdCliente());
        cstmt.setInt(2, ticket.getIdSucursal());
        cstmt.setString(3, gson.toJson(jsonDetalles));
        
        // Parámetros de salida
        cstmt.registerOutParameter(4, Types.INTEGER);
        cstmt.registerOutParameter(5, Types.INTEGER);
        
        cstmt.executeUpdate();
        
        // Obtener IDs generados
        Comanda comanda = new Comanda();
        comanda.setIdComanda(cstmt.getInt(5));
        comanda.setEstatus(1);
        
        ticket.setIdTicket(cstmt.getInt(4));
        comanda.setTicket(ticket);
        
        return comanda;
        }
    }
}