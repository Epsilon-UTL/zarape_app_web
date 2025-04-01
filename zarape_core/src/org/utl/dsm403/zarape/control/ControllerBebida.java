package org.utl.dsm403.zarape.control;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import org.utl.dsm403.zarape.db.ConexionMySQL;
import org.utl.dsm403.zarape.model.Bebida;
import org.utl.dsm403.zarape.model.Categoria;
import org.utl.dsm403.zarape.model.Producto;

public class ControllerBebida {
    public Bebida add(Bebida b) throws SQLException {
        String sql = "CALL insertarBebida(?,?,?,?,?,?,?);";

        int v_idProducto, v_idBebida;

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();

        CallableStatement csmt = conn.prepareCall(sql);

        csmt.setString(1, b.getProducto().getNombre());
        csmt.setString(2, b.getProducto().getDescripcion());
        csmt.setString(3, b.getProducto().getFoto());
        csmt.setDouble(4, b.getProducto().getPrecio());
        csmt.setInt(5, b.getProducto().getCategoria().getIdCategoria());

        csmt.registerOutParameter(6, Types.INTEGER); 
        csmt.registerOutParameter(7, Types.INTEGER);

        csmt.executeUpdate();

        v_idProducto = csmt.getInt(6);
        v_idBebida = csmt.getInt(7);

        b.getProducto().setIdProducto(v_idProducto);
        b.setIdBebida(v_idBebida);

        csmt.close();
        connMySQL.close();

        return b;
    }
    
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
    
        public Bebida update(Bebida b) throws SQLException {
        String sql = "{CALL actualizar_producto(?,?,?,?,?,?)};";
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();

        CallableStatement csmt = conn.prepareCall(sql);
        csmt.setInt(1, b.getProducto().getIdProducto());
        csmt.setString(2, b.getProducto().getNombre());
        csmt.setString(3, b.getProducto().getDescripcion());
        csmt.setString(4, b.getProducto().getFoto());
        csmt.setDouble(5, b.getProducto().getPrecio());
        csmt.setInt(6, b.getProducto().getCategoria().getIdCategoria());

        csmt.executeUpdate();

        csmt.close();
        connMySQL.close();

        return b;
    }
        
     public String delete(int idProducto) throws SQLException{
        
        String sql = "CALL desactivarProducto(?);";
        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        
        CallableStatement csmt = conn.prepareCall(sql);
        csmt.setInt(1, idProducto);
        csmt.executeQuery();
        
        csmt.close();
        connMySQL.close();
        
        return "Se elimino la bebida " + idProducto;
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
    
    public List<Bebida> getAll() throws SQLException
    {
        List<Bebida> bebida = new ArrayList<>();
            String sql = """
                    SELECT 
                    b.idBebida, 
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
                FROM bebida b
                INNER JOIN producto p ON b.idProducto = p.idProducto
                INNER JOIN categoria c ON p.idCategoria = c.idCategoria;
                """;
        
        ConexionMySQL connMySQL = new ConexionMySQL();
        
        Connection conn = connMySQL.open();
        
        PreparedStatement pstmt = conn.prepareStatement(sql);
        
        ResultSet rs = pstmt.executeQuery();
        
        while (rs.next()) {            
            bebida.add(fill(rs));
        }
        rs.close();
        pstmt.close();
        connMySQL.close();
        return bebida;
    }
    
    private Bebida fill(ResultSet rs) throws SQLException {
        Bebida bebida = new Bebida();
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
        
        bebida.setIdBebida(rs.getInt("idBebida"));
        bebida.setProducto(producto);

        return bebida;
    }
}