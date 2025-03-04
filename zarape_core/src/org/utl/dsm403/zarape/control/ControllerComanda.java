/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm403.zarape.control;

import org.utl.dsm403.zarape.model.Comanda;
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.sql.Types;
import org.utl.dsm403.zarape.db.ConexionMySQL;
/**
 *
 * @author rodri
 */
public class ControllerComanda {
    public Comanda addComanda(Comanda c) throws SQLException {
        String sql = "CALL InsertarComanda(?, ?);"; 

        int v_idComanda;

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();

        CallableStatement csmt = conn.prepareCall(sql);
        csmt.setInt(1, c.getTicket().getIdTicket());

        csmt.registerOutParameter(2, Types.INTEGER);

        csmt.executeUpdate();
        
        v_idComanda = csmt.getInt(2);
        c.setIdComanda(v_idComanda);

        csmt.close();
        connMySQL.close();

        return c;
    }
  
    public Comanda eliminarComanda(Comanda c) throws SQLException {
    String sql = "CALL EliminarComanda(?);";

    int v_idComanda;

    ConexionMySQL connMySQL = new ConexionMySQL();
    Connection conn = connMySQL.open();

    CallableStatement csmt = conn.prepareCall(sql);

    csmt.setInt(1, c.getTicket().getIdCliente());

    csmt.registerOutParameter(2, Types.INTEGER);

    csmt.executeUpdate();

    v_idComanda = csmt.getInt(2);

    c.setIdComanda(v_idComanda);

    csmt.close();
    connMySQL.close();

    return c;
    }
}
