package org.utl.dsm403.zarape.control;

import java.sql.Connection;
import org.utl.dsm403.zarape.db.ConexionMySQL;
import org.utl.dsm403.zarape.model.Ciudad;
import org.utl.dsm403.zarape.model.Estado;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.sql.PreparedStatement;
import org.utl.dsm403.zarape.control.ControllerEstado;

public class ControllerCiudad {
    
    public List<Ciudad> getAll() throws SQLException{
        List<Ciudad> ciudades = new ArrayList<>();
        String sql = "SELECT * FROM v_ciudad;";
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        Connection conn = connMySQL.open();
        
        PreparedStatement pstmt = conn.prepareStatement(sql);
        
        ResultSet rs = pstmt.executeQuery();
        
        while(rs.next()){
            ciudades.add(fill(rs));
            
        }
        rs.close();
        pstmt.close();
        connMySQL.close();
        return ciudades;
    }
    
    private Ciudad fill (ResultSet rs) throws SQLException{
        Estado estado = new Estado();
        Ciudad ciudad = new Ciudad();
        
        ciudad.setidCiudad(rs.getInt("idCiudad"));
        ciudad.setNombre(rs.getString("nombre"));
        ciudad.setEstado(locateEstado(rs.getInt("idEstado")));
        return ciudad;
    }
    
    private Estado locateEstado(int idStates) throws SQLException{
        ControllerEstado controllerstate = new ControllerEstado();
        List<Estado> estados = controllerstate.getAll();
        for (int i = 0; i < estados.size(); i++) {
                if (estados.get(i).getIdEstado()== idStates) {
                    return estados.get(i);
                }
    }
        return null;   
    }
}