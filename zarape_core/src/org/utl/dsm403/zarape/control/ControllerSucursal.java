package org.utl.dsm403.zarape.control;

import java.util.ArrayList;
import java.util.List;
import org.utl.dsm403.zarape.db.ConexionMySQL;
import org.utl.dsm403.zarape.model.Sucursal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Types;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import org.utl.dsm403.zarape.model.Ciudad;
import org.utl.dsm403.zarape.model.Estado;

public class ControllerSucursal {
    
    public List<Sucursal> getAll() throws SQLException{
        List <Sucursal> sucursal = new ArrayList<>();
        String sql = "SELECT su.idSucursal,su.nombre,su.latitud,su.longitud,su.urlWeb,su.horarios,su.calle,su.numCalle,su.colonia,su.foto,c.idCiudad,c.nombre ciudad,su.activo, e.idEstado, e.nombre estado FROM sucursal su INNER JOIN ciudad c ON su.idCiudad = c.idCiudad INNER JOIN estado e ON c.idEstado = e.idEstado; ";
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        Connection conn = connMySQL.open();
        
        PreparedStatement pstmt = conn.prepareStatement(sql);
        
        ResultSet rs = pstmt.executeQuery();
        
        while(rs.next()){
            sucursal.add(fill(rs));
        }
        
        rs.close();
        pstmt.close();
        connMySQL.close();
        return sucursal;
    }

    private Sucursal fill(ResultSet rs) throws SQLException {
        Sucursal sucursal = new Sucursal();
        Estado estado = new Estado();
        Ciudad ciudad = new Ciudad();
        sucursal.setIdSucursal(rs.getInt("idSucursal"));
        sucursal.setNombre(rs.getString("nombre"));
        sucursal.setLatitud(rs.getString("latitud"));
        sucursal.setLongitud(rs.getString("longitud"));
        sucursal.setFoto(rs.getString("foto"));
        sucursal.setUrlWeb(rs.getString("urlWeb"));
        sucursal.setHorario(rs.getString("horarios"));
        sucursal.setCalle(rs.getString("calle"));
        sucursal.setNumCalle(rs.getString("numCalle"));
        sucursal.setColonia(rs.getString("colonia"));
        
        ciudad.setidCiudad(rs.getInt("idCiudad"));
        ciudad.setNombre(rs.getString("ciudad"));
        
        estado.setIdEstado(rs.getInt("idEstado"));
        estado.setNombre(rs.getString("estado"));
        
        ciudad.setEstado(estado);
        sucursal.setActivo(rs.getInt("activo"));
        sucursal.setCiudad(ciudad);
        return sucursal;
    }
    
public Sucursal add(Sucursal s) throws SQLException{
        String sql = "{CALL insertarSucursal(?,?,?,?,?,?,?,?,?,?,?"
                                        +",?)}"; // valores de salida (nos los dara mysql pq son autoincrement)
        
        int v_idSucursal; //almacenan los valores de retorno
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        Connection conn  = connMySQL.open();
        
        CallableStatement cstmt = conn.prepareCall(sql);
        
        cstmt.setString(1, s.getNombre());
        cstmt.setString(2, s.getLatitud());
        cstmt.setString(3, s.getLongitud());
        cstmt.setString(4, s.getFoto());
        cstmt.setString(5, s.getUrlWeb());
        cstmt.setString(6, s.getHorario());
        cstmt.setString(7, s.getCalle());
        cstmt.setString(8, s.getNumCalle());
        cstmt.setString(9, s.getColonia());
        cstmt.setInt(10, s.getCiudad().getidCiudad());
        cstmt.setInt(11, s.getActivo());

        cstmt.registerOutParameter(12, Types.INTEGER);
        
        cstmt.executeUpdate();
        v_idSucursal = cstmt.getInt(12);
        
        s.setIdSucursal(v_idSucursal);
        cstmt.close();
        connMySQL.close();
        return s;
        
    }
    
    public Sucursal update(Sucursal s) throws SQLException{
        String sql = "{CALL ActualizarSucursal(?,?,?,?,?,?,?,?,?,?,?,?)}"; // valores de entrada
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        Connection conn  = connMySQL.open();
        
        CallableStatement cstmt = conn.prepareCall(sql);
        
        cstmt.setInt(1, s.getIdSucursal());
        cstmt.setString(2, s.getNombre());
        cstmt.setString(3, s.getLatitud());
        cstmt.setString(4, s.getLongitud());
        cstmt.setString(5, s.getFoto());
        cstmt.setString(6, s.getUrlWeb());
        cstmt.setString(7, s.getHorario());
        cstmt.setString(8, s.getCalle());
        cstmt.setString(9, s.getNumCalle());
        cstmt.setString(10, s.getColonia());
        cstmt.setInt(11, s.getActivo());
        cstmt.setInt(12, s.getCiudad().getidCiudad());

        cstmt.executeUpdate();
        cstmt.close();
        connMySQL.close();
        return s;
        
    }
    
    public String delete(int idSucursal) throws SQLException {
        String sql = "{CALL desactivarSucursal(?)}";
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        Connection conn  = connMySQL.open();
        
        CallableStatement cstmt = conn.prepareCall(sql);
        
        cstmt.setInt(1, idSucursal);
        
        cstmt.executeUpdate();
        cstmt.close();
        connMySQL.close();
        
        return "Se elimino el empleado con ID: "+idSucursal;
    }

public String activar(int idSucursal) throws SQLException {
        String sql = "{CALL activarSucursal(?)}";
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        Connection conn  = connMySQL.open();
        
        CallableStatement cstmt = conn.prepareCall(sql);
        
        cstmt.setInt(1, idSucursal);
        
        cstmt.executeUpdate();
        cstmt.close();
        connMySQL.close();
        
        return "Se elimino el empleado con ID: "+idSucursal;
    }


}