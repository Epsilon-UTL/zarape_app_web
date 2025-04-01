package org.utl.dsm403.rest;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSyntaxException;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;
import org.utl.dsm403.zarape.control.ControllerEmpleado;
import org.utl.dsm403.zarape.model.Empleado;



@Path("empleado")
public class RESTEmpleado {
    
    private static final String ERROR_UNAUTHORIZED = "{\"error\":\"Acceso no autorizado\"}";
    private static final String ERROR_INTERNAL_SERVER = "{\"error\":\"Error interno del servidor. Intente mas tarde.\"}";
    private static final String ERROR_INVALID_DATA = "{\"error\":\"Formato de datos no valido\"}";

    @Path("getAllEmpleados")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAllEmpleados(@HeaderParam("username") String username) throws SQLException {
        if (username == null || !new ControllerEmpleado().validarToken(username)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(ERROR_UNAUTHORIZED).build();
        }

        String out = null;
        List<Empleado> empleado = null; 
        ControllerEmpleado em = new ControllerEmpleado();
        
        try {
            empleado = em.getAll();
            out = new Gson().toJson(empleado);
        } catch (Exception e) {
            out = ERROR_INTERNAL_SERVER;
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    @Path("agregar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response agregar(@HeaderParam("username") String username,
                          @FormParam("datosEmpleado") @DefaultValue("") String empleado) throws SQLException {
        if (username == null || !new ControllerEmpleado().validarToken(username)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(ERROR_UNAUTHORIZED).build();
        }

        String out = "";
        Empleado e = null;
        ControllerEmpleado ctrl = null;
        Gson gson = new Gson();
        try {
            e = gson.fromJson(empleado, Empleado.class);
            ctrl = new ControllerEmpleado();
            if(e.getIdEmpleado() < 1) {
                e.setIdEmpleado(ctrl.add(e).getIdEmpleado());
            }else {
                e = ctrl.update(e);
            }
            out = gson.toJson(e);
        } catch(JsonSyntaxException jpe) {
            out = ERROR_INVALID_DATA;
            jpe.printStackTrace();
            return Response.status(Response.Status.BAD_REQUEST).entity(out).build();
        } catch(Exception ex) {
            out = ERROR_INTERNAL_SERVER;
            ex.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    @Path("actualizar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response actualizar(@HeaderParam("username") String username,
                             @FormParam("datosEmpleado") @DefaultValue("") String empleado) throws SQLException {
        if (username == null || !new ControllerEmpleado().validarToken(username)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(ERROR_UNAUTHORIZED).build();
        }

        String out = "";
        Empleado e = null;
        ControllerEmpleado ctrl = null;
        Gson gson = new Gson();
        try {
            e = gson.fromJson(empleado, Empleado.class);
            ctrl = new ControllerEmpleado();
            if(e.getIdEmpleado() < 1) {
                e.setIdEmpleado(ctrl.add(e).getIdEmpleado());
            } else {
                e = ctrl.update(e);
            }
            out = gson.toJson(e);
        } catch(JsonSyntaxException jpe) {
            out = ERROR_INVALID_DATA;
            jpe.printStackTrace();
            return Response.status(Response.Status.BAD_REQUEST).entity(out).build();
        } catch(Exception ex) {
            out = ERROR_INTERNAL_SERVER;
            ex.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    @Path("eliminar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response eliminar(@HeaderParam("username") String username,
                           @FormParam("idEmpleado") @DefaultValue("0") int idEmpleado) throws SQLException {
        if (username == null || !new ControllerEmpleado().validarToken(username)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(ERROR_UNAUTHORIZED).build();
        }

        String out = null;
        ControllerEmpleado ctrl = null;
        try {
            ctrl = new ControllerEmpleado();
            ctrl.delete(idEmpleado);
            out = String.format("{\"resultado\":\"Empleado %d eliminado\"}", idEmpleado);
        } catch(JsonParseException jpe) {
            out = ERROR_INVALID_DATA;
            jpe.printStackTrace();
            return Response.status(Response.Status.BAD_REQUEST).entity(out).build();
        } catch(Exception ex) {
            out = ERROR_INTERNAL_SERVER;
            ex.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
}