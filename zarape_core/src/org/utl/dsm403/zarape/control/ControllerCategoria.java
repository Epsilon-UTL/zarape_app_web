package org.utl.dsm403.zarape.control;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.sql.PreparedStatement;
import org.utl.dsm403.zarape.db.ConexionMySQL;
import org.utl.dsm403.zarape.model.Categoria;
public class ControllerCategoria {
    public List<Categoria> getAllBebidas() throws SQLException{
        List<Categoria> categoria = new ArrayList<>();
        String sql = "SELECT ca.idCategoria, ca.descripcion, ca.tipo FROM v_categoria ca WHERE tipo = 'B';";
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        Connection conn = connMySQL.open();
        
        PreparedStatement pstmt = conn.prepareStatement(sql);
        
        ResultSet rs = pstmt.executeQuery();
        
        while(rs.next()){
            categoria.add(fill(rs));
            
        }
        rs.close();
        pstmt.close();
        connMySQL.close();
        return categoria;
    }
    
        public List<Categoria> getAllAlimentos() throws SQLException{
        List<Categoria> categoria = new ArrayList<>();
        String sql = "SELECT ca.idCategoria, ca.descripcion, ca.tipo FROM v_categoria ca WHERE tipo = 'A';";
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        Connection conn = connMySQL.open();
        
        PreparedStatement pstmt = conn.prepareStatement(sql);
        
        ResultSet rs = pstmt.executeQuery();
        
        while(rs.next()){
            categoria.add(fill(rs));
            
        }
        rs.close();
        pstmt.close();
        connMySQL.close();
        return categoria;
    }
    
    private Categoria fill (ResultSet rs) throws SQLException{
        Categoria categoria = new Categoria();
        
        categoria.setIdCategoria(rs.getInt("idCategoria"));
        categoria.setDescripcion(rs.getString("descripcion"));
        categoria.setTipo(rs.getString("tipo"));
        return categoria;
    }
}
