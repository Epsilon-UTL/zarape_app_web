package org.utl.dsm403.zarape.control;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.util.List;
import java.sql.Types;
import org.utl.dsm403.zarape.db.ConexionMySQL;
import org.utl.dsm403.zarape.model.DetalleTicket;
import org.utl.dsm403.zarape.model.Ticket;

public class ControllerTicket {

    public Ticket insertarTicket(Ticket t, List<DetalleTicket> detalles) throws SQLException {
    String sql = "{CALL InsertarTicket(?, ?, ?, ?)}";

    int v_idTicket;
    
    ConexionMySQL connMySQL = new ConexionMySQL();
    Connection conn = connMySQL.open();
    
    CallableStatement csmt = conn.prepareCall(sql);

        JsonArray detallesArray = new JsonArray();
        
        for (DetalleTicket detalle : detalles) {
            if (detalle.getIdProducto() == null) {
                throw new IllegalArgumentException("Cada detalle debe tener un ID de producto.");
            }

            JsonObject obj = new JsonObject();
            obj.addProperty("idProducto", detalle.getIdProducto());
            obj.addProperty("cantidad", detalle.getCantidad());

            detallesArray.add(obj);
        }

        csmt.setInt(1, t.getIdCliente());  
        csmt.setInt(2, t.getIdSucursal());
        csmt.setString(3, detallesArray.toString());
        csmt.registerOutParameter(4, Types.INTEGER); 

        csmt.executeUpdate();

        v_idTicket = csmt.getInt(4);
        
        t.setIdTicket(v_idTicket);
        csmt.close();
        conn.close();
        
        return t;
    }
}