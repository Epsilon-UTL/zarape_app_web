/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm403.zarape.control;

import org.utl.dsm403.zarape.model.Comanda;
import java.util.ArrayList;
import java.util.List;
import org.utl.dsm403.zarape.db.ConexionMySQL;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;
import org.utl.dsm403.zarape.model.DetalleTicket;
import org.utl.dsm403.zarape.model.Producto;
import org.utl.dsm403.zarape.model.Ticket;

/**
 *
 * @author rodri
 */
public class ControllerComanda {
     public List<Comanda> getAll() throws Exception {
        String query = "SELECT * FROM comanda";
        List<Comanda> comandas = new ArrayList<>();
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        
        PreparedStatement pstmt = conn.prepareStatement(query);
        ResultSet rs = pstmt.executeQuery();
        
        while (rs.next()) {
            Comanda c = new Comanda();
            c.setIdComanda(rs.getInt("idComanda"));
            
            Ticket t = new Ticket();
            t.setIdTicket(rs.getInt("idTicket"));
            c.setTicket(t);
            
            c.setEstatus(rs.getInt("estatus"));
            comandas.add(c);
        }
        
        rs.close();
        pstmt.close();
        connMySQL.close();        
        return comandas;
    }
    
    public List<Comanda> getAllFIFO() throws Exception {
        String query = "SELECT c.*, t.fecha FROM comanda c "
                     + "JOIN ticket t ON c.idTicket = t.idTicket "
                     + "ORDER BY t.fecha ASC";
        
        List<Comanda> comandas = new ArrayList<>();
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(query);
        ResultSet rs = pstmt.executeQuery();
        
        while (rs.next()) {
            Comanda c = new Comanda();
            c.setIdComanda(rs.getInt("idComanda"));
            
            Ticket t = new Ticket();
            t.setIdTicket(rs.getInt("idTicket"));
            t.setFecha(rs.getString("fecha"));
            c.setTicket(t);
            
            c.setEstatus(rs.getInt("estatus"));
            comandas.add(c);
        }
        
        rs.close();
        pstmt.close();
        connMySQL.close();        
        return comandas;
    }
    
    public void changeStatus(int idComanda, int estatus) throws Exception {
        String query = "UPDATE comanda SET estatus = ? WHERE idComanda = ?";
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(query);
        pstmt.setInt(1, estatus);
        pstmt.setInt(2, idComanda);
        pstmt.executeUpdate();
        
        pstmt.close();
        connMySQL.close();        
    }
    
    public List<Map<String, Object>> getDetails(int idTicket) throws Exception {
    String query = "SELECT dt.cantidad, dt.precio, dt.idCombo, dt.idProducto, " +
                   "p.nombre as nombreProducto, p.descripcion as descripcionProducto " +
                   "FROM detalle_ticket dt " +
                   "LEFT JOIN producto p ON dt.idProducto = p.idProducto " +
                   "WHERE dt.idTicket = ?";
    
    List<Map<String, Object>> detalles = new ArrayList<>();
    
    ConexionMySQL connMySQL = new ConexionMySQL();
    Connection conn = connMySQL.open();    
    PreparedStatement pstmt = conn.prepareStatement(query);
    pstmt.setInt(1, idTicket);
    ResultSet rs = pstmt.executeQuery();
    
    while (rs.next()) {
        Map<String, Object> detalle = new HashMap<>();
        detalle.put("cantidad", rs.getInt("cantidad"));
        detalle.put("precio", rs.getDouble("precio"));
        detalle.put("idCombo", rs.getInt("idCombo"));
        detalle.put("idProducto", rs.getInt("idProducto"));
        detalle.put("nombreProducto", rs.getString("nombreProducto"));
        detalle.put("descripcionProducto", rs.getString("descripcionProducto"));
        
        detalles.add(detalle);
    }
    
    rs.close();
    pstmt.close();
    connMySQL.close();            
    return detalles;
}
}