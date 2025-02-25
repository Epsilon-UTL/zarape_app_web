/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm403.zarape.control;

import java.sql.CallableStatement;
import org.utl.dsm403.zarape.db.ConexionMySQL;
import org.utl.dsm403.zarape.model.Alimento;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import org.utl.dsm403.zarape.model.Categoria;
import org.utl.dsm403.zarape.model.Producto;

/**
 *
 * @author rodri
 */
public class ControllerAlimento {
    
    public Alimento add(Alimento a) throws SQLException
    {
        String sql = "CALL insertarAlimento(?,?,?,?,?,?,?);";
        
        int v_idProducto, v_idAlimento;
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        
        CallableStatement csmt = conn.prepareCall(sql);
        csmt.setString(1, a.getProducto().getNombre());
        csmt.setString(2, a.getProducto().getDescripcion());
        csmt.setString(3, a.getProducto().getFoto());
        csmt.setDouble(4, a.getProducto().getPrecio());
        csmt.setInt(5, a.getProducto().getCategoria().getIdCategoria());
        
        csmt.registerOutParameter(6, Types.INTEGER);
        csmt.registerOutParameter(7, Types.INTEGER);

        csmt.executeUpdate();
        
        v_idProducto = csmt.getInt(6);
        v_idAlimento = csmt.getInt(7);
        
        a.setIdAlimento(v_idAlimento);
        csmt.close();
        connMySQL.close();
        
        return a;
    }
    
        public Alimento update(Alimento a) throws SQLException {
        String sql = "{CALL actualizar_producto(?,?,?,?,?,?)};";
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();

        CallableStatement csmt = conn.prepareCall(sql);
        csmt.setInt(1, a.getProducto().getIdProducto());
        csmt.setString(2, a.getProducto().getNombre());
        csmt.setString(3, a.getProducto().getDescripcion());
        csmt.setString(4, a.getProducto().getFoto());
        csmt.setDouble(5, a.getProducto().getPrecio());
        csmt.setInt(6, a.getProducto().getCategoria().getIdCategoria());

        csmt.executeUpdate();

        csmt.close();
        connMySQL.close();

        return a;
    }
        
    public String delete(int idProducto) throws SQLException {
    String sql = "CALL desactivarProducto(?);";

    ConexionMySQL connMySQL = new ConexionMySQL();
    Connection conn = connMySQL.open();

    CallableStatement csmt = conn.prepareCall(sql);

    csmt.setInt(1, idProducto);

    csmt.executeUpdate();

    csmt.close();
    connMySQL.close();

    return "Se desactivó el producto con ID: " + idProducto;
}

     
    public String activation(int idProducto) throws SQLException{

    String sql = "CALL activarProducto(?);";
    ConexionMySQL connMySQL = new ConexionMySQL();
    Connection conn = connMySQL.open();

    CallableStatement csmt = conn.prepareCall(sql);
    csmt.setInt(1, idProducto);
    csmt.executeQuery();

    csmt.close();
    connMySQL.close();

    return "Se activo el alimento " + idProducto;
    }
    
    public List<Alimento> getAll() throws SQLException
    {
        List<Alimento> alimento = new ArrayList<>();
            String sql = """
                    SELECT 
                    a.idAlimento, 
                    p.idProducto, 
                    p.activo AS estatus,
                    p.nombre, 
                    p.descripcion AS descripcionProducto, 
                    p.foto, 
                    p.precio, 
                    c.idCategoria, 
                    c.descripcion, 
                    c.tipo, 
                    c.activo
                FROM alimento a
                INNER JOIN producto p ON a.idProducto = p.idProducto
                INNER JOIN categoria c ON p.idCategoria = c.idCategoria;
                """;
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        Connection conn = connMySQL.open();
        
        PreparedStatement pstmt = conn.prepareStatement(sql);
        
        ResultSet rs = pstmt.executeQuery();
        
        while (rs.next()) {            
            alimento.add(fill(rs));
        }
        rs.close();
        pstmt.close();
        connMySQL.close();
        return alimento;
    }
    
    private Alimento fill(ResultSet rs) throws SQLException {
        Alimento alimento = new Alimento();
        Producto producto = new Producto();
        Categoria categoria = new Categoria();
        
        categoria.setIdCategoria(rs.getInt("idCategoria"));
        categoria.setDescripcion(rs.getString("descripcion"));
        categoria.setTipo(rs.getString("tipo"));
        categoria.setActivo(rs.getInt("activo"));
        
        producto.setCategoria(categoria);
        
        producto.setIdProducto(rs.getInt("idProducto"));
        producto.setActivo(rs.getInt("estatus"));
        producto.setNombre(rs.getString("nombre"));
        producto.setDescripcion(rs.getString("descripcionProducto"));
        producto.setPrecio(rs.getDouble("precio"));
        producto.setFoto(rs.getString("foto"));
        
        alimento.setIdAlimento(rs.getInt("idAlimento"));
        alimento.setProducto(producto);

        return alimento;
    }

}
