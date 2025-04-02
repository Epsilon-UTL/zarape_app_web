/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm403.zarape.control;

import org.utl.dsm403.zarape.db.ConexionMySQL;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.sql.PreparedStatement;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.apache.commons.codec.digest.DigestUtils;
import org.utl.dsm403.zarape.model.Usuario;

/**
 *
 * @author rodri
 */
public class ControllerUsuario {
    
public String checkUsers(String nombre) throws SQLException {
    String sql = "SELECT * FROM usuario WHERE nombre = ?";
    ConexionMySQL connMySQL = new ConexionMySQL();
    Connection conn = connMySQL.open();
    PreparedStatement pstmt = conn.prepareStatement(sql);
    pstmt.setString(1, nombre);  
    ResultSet rs = pstmt.executeQuery();
    
    String name = null;
    String tok = null;
    String tokenizer = null;

    Date myDate = new Date();
    String fecha = new SimpleDateFormat("yyyy.MM.dd.HH:mm:ss").format(myDate);
    String sql2 = "";

    if (!rs.next()) {
        throw new SQLException("Usuario no encontrado.");
    }

    name = rs.getString("nombre");
    tok = rs.getString("lastToken");  
    tok = tok != null ? tok.trim() : "";  

    if (!tok.isEmpty()) {
        tokenizer = tok;
        sql2 = "UPDATE usuario SET dateLastToken = ? WHERE nombre = ?";
        
        PreparedStatement ps = conn.prepareStatement(sql2);
        ps.setString(1, fecha);
        ps.setString(2, name);
        ps.executeUpdate();
    } else {
        String token = "ZARAPE" + "." + name + "." + fecha;
        tokenizer = DigestUtils.md5Hex(token);
        sql2 = "UPDATE usuario SET lastToken = ?, dateLastToken = ? WHERE nombre = ?";
        
        PreparedStatement ps = conn.prepareStatement(sql2);
        ps.setString(1, tokenizer);
        ps.setString(2, fecha);
        ps.setString(3, name);
        ps.executeUpdate();

    }

    return tokenizer;
}

    public String logout(String nombre) throws SQLException {
        String sql = "UPDATE usuario SET lastToken = NULL WHERE nombre = ?";
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();

        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setString(1, nombre);

        int filasModificadas = pstmt.executeUpdate();

        if (filasModificadas == 0) {
            throw new SQLException("Usuario no encontrado o ya cerrado sesión.");
        }

        return "Inicio de sesion cerrado con exito";
    }
    
    public List<Usuario> getAll() throws SQLException
    {
        List<Usuario> usuario = new ArrayList<>();
            String sql = """
                SELECT nombre, contrasenia FROM usuario;
                         """;
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        Connection conn = connMySQL.open();
        
        PreparedStatement pstmt = conn.prepareStatement(sql);
        
        ResultSet rs = pstmt.executeQuery();
        
        while (rs.next()) {            
            usuario.add(fill(rs));
        }
        rs.close();
        pstmt.close();
        connMySQL.close();
        return usuario;
    }
    
    private Usuario fill(ResultSet rs) throws SQLException {
        Usuario usuario = new Usuario();

        usuario.setNombre(rs.getString("nombre"));
        usuario.setContrasenia(rs.getString("contrasenia"));

        return usuario;
    }

    public String login(String nombreUsuario, String contraseniaHash) throws ClassNotFoundException, SQLException {
        String querySELECT = "SELECT idUsuario, nombre, activo FROM usuario WHERE nombre = ? AND contrasenia = ? AND activo = 1;";

        ConexionMySQL objConMySQL = new ConexionMySQL();
        try (Connection conn = objConMySQL.open()) {
            PreparedStatement pstmt = conn.prepareStatement(querySELECT);
            pstmt.setString(1, nombreUsuario);
            pstmt.setString(2, contraseniaHash);  // Compara con la contraseña ya encriptada
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                int idUsuario = rs.getInt("idUsuario");
                String nombre = rs.getString("nombre");

                return String.format("{\"success\":true, \"idUsuario\":%d,\"nombre\":\"%s\"}", idUsuario, nombre);
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
            return "{\"success\":false, \"error\":\"Error en la base de datos\"}";
        }
        return "{\"success\":false, \"error\":\"Usuario o contraseña incorrectos\"}";
    }
    
    

}
