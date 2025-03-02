package org.utl.dsm403.zarape.control;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.util.List;
import org.utl.dsm403.zarape.db.ConexionMySQL;
import org.utl.dsm403.zarape.model.DetalleTicket;

public class ControllerTicket {

    public int insertarTicket(int idCliente, int idSucursal, List<DetalleTicket> detalles) throws SQLException {
        if (detalles == null || detalles.isEmpty()) {
            throw new IllegalArgumentException("La lista de detalles no puede estar vacía o ser nula.");
        }

        String sql = "{CALL InsertarTicket(?, ?, ?)}";
        int resultado = 0; // Variable para almacenar el resultado

        try (Connection conn = new ConexionMySQL().open();
             CallableStatement cstmt = conn.prepareCall(sql)) {

            // Convertir lista de detalles a JSON
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

            // Configurar parámetros
            cstmt.setInt(1, idCliente);
            cstmt.setInt(2, idSucursal);
            cstmt.setString(3, detallesArray.toString());

            // Ejecutar la consulta
            cstmt.execute();
            resultado = 1; // Éxito

        } catch (SQLException e) {
            throw new SQLException("Error al ejecutar el procedimiento almacenado: " + e.getMessage(), e);
        }

        return resultado;
    }

}
