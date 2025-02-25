package org.utl.dsm403.zarape.control;

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
import org.utl.dsm403.zarape.model.Estado;
import org.utl.dsm403.zarape.model.Persona;
import org.utl.dsm403.zarape.model.Sucursal;
import org.utl.dsm403.zarape.model.Usuario;


public class ControllerEmpleado {

    public Empleado add(Empleado e) throws SQLException {
        String sql = "CALL insertarEmpleado( ?,?,?,?,?,?,?,"
                + "?,?,?);";
        int v_idPersona, v_idUsuario, v_idEmpleado;

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();

        CallableStatement csmt = conn.prepareCall(sql);
        csmt.setString(1, e.getPersona().getNombre());
        csmt.setString(2, e.getPersona().getApellidos());
        csmt.setString(3, e.getPersona().getTelefono());
        csmt.setInt(4, e.getPersona().getCiudad().getidCiudad());
        csmt.setString(5, e.getUsuario().getNombre());
        csmt.setString(6, e.getUsuario().getContrasenia());
        csmt.setInt(7, e.getSucursal().getIdSucursal());

        csmt.registerOutParameter(8, Types.INTEGER);
        csmt.registerOutParameter(9, Types.INTEGER);
        csmt.registerOutParameter(10, Types.INTEGER);

        csmt.executeUpdate();

        v_idPersona = csmt.getInt(8);
        v_idEmpleado = csmt.getInt(10);
        v_idUsuario = csmt.getInt(9);

        e.setIdEmpleado(v_idEmpleado);
        csmt.close();
        connMySQL.close();

        return e;
    }
    
        public Empleado update(Empleado e) throws SQLException {
        String sql = "{CALL actualizarEmpleado(?,?,?,?,?,?,?,?,?,?)};";
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();

        CallableStatement csmt = conn.prepareCall(sql);
        csmt.setString(1, e.getPersona().getNombre());
        csmt.setString(2, e.getPersona().getApellidos());
        csmt.setString(3, e.getPersona().getTelefono());
        csmt.setInt(4, e.getPersona().getCiudad().getidCiudad());
        csmt.setString(5, e.getUsuario().getNombre());
        csmt.setString(6, e.getUsuario().getContrasenia());
        csmt.setInt(7, e.getSucursal().getIdSucursal());
        csmt.setInt(8, e.getPersona().getIdPersona());
        csmt.setInt(9, e.getUsuario().getIdUsuario());
        csmt.setInt(10, e.getIdEmpleado());

        csmt.executeUpdate();

        csmt.close();
        connMySQL.close();

        return e;
    }
        
    public String delete(int idEmpleado) throws SQLException{
        
        String sql = "CALL eliminarEmpleado(?);";
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        
        CallableStatement csmt = conn.prepareCall(sql);
        csmt.setInt(1, idEmpleado);
        csmt.executeQuery();
        
        csmt.close();
        connMySQL.close();
        
        return "Se elimino el empleado " + idEmpleado;
    }
    
    public List<Empleado> getAll() throws SQLException
    {
        List<Empleado> empleado = new ArrayList<>();
            String sql = """
                SELECT 
                e.idEmpleado, e.activo estatus, 
                p.idPersona, p.nombre, p.apellidos, p.telefono, 
                c.nombre ciudad, c.idCiudad, 
                es.nombre estado, es.idEstado,
                s.nombre sucursal, s.idsucursal,
                u.nombre username, u.contrasenia contrasenia, u.idUsuario, u.activo
                FROM empleado e
                INNER JOIN persona p ON p.idPersona = e.idPersona
                INNER JOIN sucursal s ON e.idSucursal = s.idSucursal
                INNER JOIN usuario u ON u.idUsuario = e.idUsuario
                INNER JOIN ciudad c ON c.idCiudad = p.idCiudad
                INNER JOIN estado es ON es.idEstado = c.idEstado;
                """;
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        Connection conn = connMySQL.open();
        
        PreparedStatement pstmt = conn.prepareStatement(sql);
        
        ResultSet rs = pstmt.executeQuery();
        
        while (rs.next()) {            
            empleado.add(fill(rs));
        }
        rs.close();
        pstmt.close();
        connMySQL.close();
        return empleado;
    }
    
    private Empleado fill(ResultSet rs) throws SQLException {
        Empleado empleado = new Empleado();
        Persona persona = new Persona();
        Ciudad ciudad = new Ciudad();
        Estado estado = new Estado();
        Usuario usuario = new Usuario();
        Sucursal sucursal = new Sucursal();
        
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

        empleado.setIdEmpleado(rs.getInt("idEmpleado"));
        empleado.setActivo(rs.getInt("estatus"));
        
        empleado.setPersona(persona);

        usuario.setNombre(rs.getString("username"));
        usuario.setContrasenia(rs.getString("contrasenia"));
        usuario.setActivo(rs.getInt("activo"));
        usuario.setIdUsuario(rs.getInt("idUsuario"));
        
        empleado.setUsuario(usuario);

        sucursal.setIdSucursal(rs.getInt("idSucursal"));
        sucursal.setNombre(rs.getString("sucursal"));
        
        empleado.setSucursal(sucursal);

        return empleado;
    }
}