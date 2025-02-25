/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm403.rest;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSyntaxException;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;
import org.utl.dsm403.zarape.control.ControllerCliente;
import org.utl.dsm403.zarape.model.Cliente;
/**
 *
 * @author rodri
 */
@Path("cliente")
public class RESTCliente {
    
    private static final String ERROR_UNAUTHORIZED = "{\"error\":\"Acceso no autorizado\"}";
    private static final String ERROR_INTERNAL_SERVER = "{\"error\":\"Error interno del servidor. Intente mas tarde.\"}";
    private static final String ERROR_INVALID_DATA = "{\"error\":\"Formato de datos no valido\"}";

    private final ControllerCliente controllerCliente = new ControllerCliente();

    @Path("getAllCliente")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAllCliente(@HeaderParam("username") String username) throws SQLException {
        if (username == null || !controllerCliente.validarToken(username)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(ERROR_UNAUTHORIZED).build();
        }

        String out;
        List<Cliente> cliente;

        try {
            cliente = controllerCliente.getAll();
            out = new Gson().toJson(cliente);
        } catch (SQLException e) {
            e.printStackTrace();
            out = ERROR_INTERNAL_SERVER; // Asigna el mensaje de error a 'out'
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            out = ERROR_INTERNAL_SERVER; // Asigna el mensaje de error a 'out'
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("agregarCliente")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response agregarCliente(@HeaderParam("username") String username,
                                 @FormParam("datosCliente") @DefaultValue("") String cliente) throws SQLException {
        if (username == null || !controllerCliente.validarToken(username)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(ERROR_UNAUTHORIZED).build();
        }

        String out;
        Cliente c;
        Gson gson = new Gson();

        try {
            c = gson.fromJson(cliente, Cliente.class);
            if (c.getIdCliente() < 1) {
                c.setIdCliente(controllerCliente.add(c).getIdCliente());
            } else {
                c = controllerCliente.update(c);
            }
            out = gson.toJson(c);
        } catch (JsonSyntaxException jpe) {
            jpe.printStackTrace();
            out = ERROR_INVALID_DATA;
            return Response.status(Response.Status.BAD_REQUEST).entity(out).build();
        } catch (SQLException ex) {
            ex.printStackTrace();
            out = ERROR_INTERNAL_SERVER;
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            out = ERROR_INTERNAL_SERVER;
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("eliminarCliente")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response eliminarCliente(@HeaderParam("username") String username,
                                 @FormParam("idCliente") @DefaultValue("0") int idCliente) throws SQLException {
        if (username == null || !controllerCliente.validarToken(username)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(ERROR_UNAUTHORIZED).build();
        }

        String out;

        try {
            controllerCliente.delete(idCliente);
            out = String.format("""
                    {"resultado":"Cliente %d eliminado"}
                    """, idCliente);
        } catch (JsonParseException jpe) {
            jpe.printStackTrace();
            out = ERROR_INVALID_DATA;
            return Response.status(Response.Status.BAD_REQUEST).entity(out).build();
        } catch (SQLException ex) {
            ex.printStackTrace();
            out = ERROR_INTERNAL_SERVER;
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            out = ERROR_INTERNAL_SERVER;
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
}
