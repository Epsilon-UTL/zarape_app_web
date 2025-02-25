/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm403.zarape.control;
import static java.lang.StrictMath.log;
import org.utl.dsm403.zarape.db.ConexionMySQL;
import org.utl.dsm403.zarape.model.Empleado;
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.sql.ResultSet; 
import java.util.ArrayList;
import java.util.List;
import java.sql.PreparedStatement;
import org.utl.dsm403.zarape.model.Ciudad;
import org.utl.dsm403.zarape.model.Cliente;
import org.utl.dsm403.zarape.model.Estado;
import org.utl.dsm403.zarape.model.Persona;
import org.utl.dsm403.zarape.model.Usuario;
/**
 *
 * @author rodri
 */
public class ControllerCliente {
    
public boolean validarToken(String nombreUsuario) throws SQLException {
    String sql = "SELECT 1 FROM usuario WHERE nombre = ? AND lastToken IS NOT NULL"; 
    ConexionMySQL objConMySQL = new ConexionMySQL();

    try (Connection conn = objConMySQL.open()) {
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setString(1, nombreUsuario);
        ResultSet rs = pstmt.executeQuery();
        return rs.next(); 
    } catch (SQLException ex) {
        ex.printStackTrace();
        return false;
    }
}
    
    public Cliente add(Cliente c) throws SQLException {
        String sql = "CALL insertarCliente(?, ?, ?, ?, ?, ?, ?, ?, ?);";

        int v_idPersona, v_idUsuario, v_idCliente;

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();

        CallableStatement csmt = conn.prepareCall(sql);

        csmt.setString(1, c.getPersona().getNombre());
        csmt.setString(2, c.getPersona().getApellidos());
        csmt.setString(3, c.getPersona().getTelefono());
        csmt.setInt(4, c.getPersona().getCiudad().getidCiudad());
        csmt.setString(5, c.getUsuario().getNombre());
        csmt.setString(6, c.getUsuario().getContrasenia());

        csmt.registerOutParameter(7, Types.INTEGER);
        csmt.registerOutParameter(8, Types.INTEGER);
        csmt.registerOutParameter(9, Types.INTEGER);

        csmt.execute();

        v_idPersona = csmt.getInt(7);
        v_idUsuario = csmt.getInt(8);
        v_idCliente = csmt.getInt(9);
        
        c.setIdCliente(v_idCliente);
        csmt.close();
        connMySQL.close();

        return c;
    }

    public Cliente update(Cliente c) throws SQLException{
        String sql = "CALL actualizarCliente(?,?,?,?,?,?,?,?,?);";
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        
        CallableStatement csmt = conn.prepareCall(sql);
        csmt.setString(1, c.getPersona().getNombre());
        csmt.setString(2, c.getPersona().getApellidos());
        csmt.setString(3, c.getPersona().getTelefono());
        csmt.setInt(4, c.getPersona().getCiudad().getidCiudad());
        csmt.setString(5, c.getUsuario().getNombre());
        csmt.setString(6, c.getUsuario().getContrasenia());
        csmt.setInt(7, c.getPersona().getIdPersona());
        csmt.setInt(8, c.getUsuario().getIdUsuario());
        csmt.setInt(9, c.getIdCliente());
        
        csmt.executeUpdate();
        
        csmt.close();
        connMySQL.close();
        
        return c;
    }
    
    public String delete (int idCliente) throws SQLException{
        
        String sql = "CALL eliminarCliente(?);";
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        
        CallableStatement csmt = conn.prepareCall(sql);
        csmt.setInt(1, idCliente);
        csmt.executeQuery();
        
        csmt.close();
        connMySQL.close();
        
        return "Se elimino el empleado" + idCliente;
    }
    
    public List<Cliente> getAll() throws SQLException
    {
        List<Cliente> cliente = new ArrayList<>();
        String sql = """
                SELECT cl.idCliente, cl.activo estatus, 
                p.idPersona, p.nombre, p.apellidos, p.telefono, 
                c.nombre ciudad, c.idCiudad, 
                es.nombre estado, es.idEstado,
                u.nombre username, u.contrasenia contrasenia, u.idUsuario, u.activo
                FROM cliente cl
                INNER JOIN persona p ON p.idPersona = cl.idPersona
                INNER JOIN usuario u ON u.idUsuario = cl.idUsuario
                INNER JOIN ciudad c ON c.idCiudad = p.idCiudad
                INNER JOIN estado es ON es.idEstado = c.idEstado;
                """;
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        
        while (rs.next()) {            
            cliente.add(fill(rs));
        }
        
        rs.close();
        pstmt.close();
        connMySQL.close();
        return cliente;
    }
    
    private Cliente fill (ResultSet rs) throws SQLException
    {
        Cliente cliente = new Cliente();
        Persona persona = new Persona();
        Ciudad ciudad = new Ciudad();
        Estado estado = new Estado();
        Usuario usuario = new Usuario();
        
        persona.setIdPersona(rs.getInt("idPersona"));
        persona.setNombre(rs.getString("nombre")); 
        persona.setApellidos(rs.getString("apellidos"));
        persona.setTelefono(rs.getString("telefono"));
        
        ciudad.setidCiudad(rs.getInt("idCiudad"));
        ciudad.setNombre(rs.getString("ciudad"));
        
        estado.setIdEstado(rs.getInt("idEstado"));
        estado.setNombre(rs.getString("estado"));
        
        ciudad.setEstado(estado); 
        persona.setCiudad(ciudad); 

        cliente.setIdCliente(rs.getInt("idCliente"));
        cliente.setActivo(rs.getInt("estatus"));
        
        cliente.setPersona(persona);

        usuario.setNombre(rs.getString("username"));
        usuario.setContrasenia(rs.getString("contrasenia"));
        usuario.setActivo(rs.getInt("activo"));
        usuario.setIdUsuario(rs.getInt("idUsuario"));
        
        cliente.setUsuario(usuario);
        
        return cliente;
    }
}
