package org.utl.dsm403.zarape.control;

import java.sql.Connection;
import org.utl.dsm403.zarape.db.ConexionMySQL;
import org.utl.dsm403.zarape.model.Estado;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.sql.PreparedStatement;


public class ControllerEstado {
    public boolean probarConexion(){
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        Connection conn = connMySQL.open();
        if (conn !=null) {
            return true;
        }else {
            return false;
        }
    }
    
    private Estado fill (ResultSet rs) throws SQLException{
        Estado state = new Estado();
        state.setIdEstado(rs.getInt("idEstado"));
        state.setNombre(rs.getString("nombre"));
        return state;
    }
    
    public List<Estado> getAll() throws SQLException{
        List<Estado> estados = new ArrayList<Estado>();
        String sql = "SELECT * FROM v_estado;";
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        Connection conn = connMySQL.open();
        
        PreparedStatement pstmt = conn.prepareStatement(sql);
        
        ResultSet rs = pstmt.executeQuery();
        
        while(rs.next()){
            estados.add(fill(rs));
        }
        rs.close();
        pstmt.close();
        connMySQL.close();
        return estados;
    }
}