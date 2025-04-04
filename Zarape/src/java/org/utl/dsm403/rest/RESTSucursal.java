package org.utl.dsm403.rest;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
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
import org.utl.dsm403.zarape.control.ControllerEmpleado;
import org.utl.dsm403.zarape.control.ControllerSucursal;
import org.utl.dsm403.zarape.model.Sucursal;

@Path("sucursales")
public class RESTSucursal {    
    private static final String ERROR_UNAUTHORIZED = "{\"error\":\"Acceso no autorizado\"}";
    private static final String ERROR_INTERNAL_SERVER = "{\"error\":\"Error interno del servidor. Intente mas tarde.\"}";
    private static final String ERROR_INVALID_DATA = "{\"error\":\"Formato de datos no valido\"}";

    
    @Path("getAllSucursales")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAllSucursales(@HeaderParam("username") String username) throws SQLException
    {
        if (username == null || !new ControllerEmpleado().validarToken(username)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(ERROR_UNAUTHORIZED).build();
        }
        
        String out = null;

        List<Sucursal> sucursales = null;
        ControllerSucursal ce = new ControllerSucursal();

        try {
            sucursales = ce.getAll();
            out = new Gson().toJson(sucursales);
        } catch (Exception e) {
            out = """
                  ["error":"Ocurrio un error. Intente más tarde"]
                  """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("agregar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response agregar(@FormParam("datosSucursal") @DefaultValue("") String sucursal) throws SQLException
    {
        String out = null;
        Sucursal s = null;
        ControllerSucursal ctrl = null;
        Gson gson = new Gson();

        try {
            s = gson.fromJson(sucursal, Sucursal.class);
            ctrl = new ControllerSucursal();
            if (s.getIdSucursal() < 1) {
                s.setIdSucursal(ctrl.add(s).getIdSucursal());
            } else {
                s = ctrl.update(s);
            }
            out = gson.toJson(s);
        } catch (JsonParseException jpe) {
            out = """
                  {"error":"Formato de datos no valido."}
                  """;
            jpe.printStackTrace();
        }catch (Exception ex) {
            out = """
                  {"error": "Error en %s",
                   "mensaje": "No se pudo completar la solicitud. Intente más tarde."}
                  """.formatted(ex.getMessage());
        }

        return Response.status(Response.Status.OK).entity(out).build();

    }

    @Path("eliminar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response eliminar(@FormParam("idSucursal") @DefaultValue("0") int idSucursal) throws SQLException
    {
        String out = null;

        ControllerSucursal ctrl = null;

        try {
            ctrl = new ControllerSucursal();
            ctrl.delete(idSucursal);

            out = """
                  {"resultado":"Sucursal %d eliminado."}
                  """;
            out = String.format(out, idSucursal);
        } catch (JsonParseException jpe) {
            out = """
                  {"error":"Formato de datos no valido."}
                  """;
            jpe.printStackTrace();
        } catch (Exception ex) {
            out = """
                  {"error":"Error interno del servidor. Intente mas tarde, PERSONA."}
                  """;
            ex.printStackTrace();
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("activar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response activar(@FormParam("idSucursal") @DefaultValue("1") int idSucursal) {
        String out = null;

        ControllerSucursal ctrl = null;

        try {
            ctrl = new ControllerSucursal();
            ctrl.activar(idSucursal);

            out = """
                  {"resultado":"Empleado %d activado."}
                  """;
            out = String.format(out, idSucursal);
        } catch (JsonParseException jpe) {
            out = """
                  {"error":"Formato de datos no valido."}
                  """;
            jpe.printStackTrace();
        } catch (Exception ex) {
            out = """
                  {"error":"Error interno del servidor. Intente mas tarde, PERSONA."}
                  """;
            ex.printStackTrace();
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
}
