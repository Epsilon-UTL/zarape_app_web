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
import org.utl.dsm403.zarape.control.ControllerBebida;
import org.utl.dsm403.zarape.model.Bebida;

@Path("bebida")
public class RESTBebida {
    private static final String ERROR_UNAUTHORIZED = "{\"error\":\"Acceso no autorizado\"}";
    private static final String ERROR_INTERNAL_SERVER = "{\"error\":\"Error interno del servidor. Intente mas tarde.\"}";
    private static final String ERROR_INVALID_DATA = "{\"error\":\"Formato de datos no valido\"}";

    private final ControllerBebida controllerBebida = new ControllerBebida();
     @Path("getAllBebida")
    @Produces(MediaType. APPLICATION_JSON)
    @GET
    public Response getAllBebida(@HeaderParam("username") String username) throws SQLException{
            if (username == null || !controllerBebida.validarToken(username)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(ERROR_UNAUTHORIZED).build();
        }
    
    {
        String out = null;
        
        List<Bebida> bebida = null; 
        ControllerBebida b = new ControllerBebida();
        
        try {
            bebida = b.getAll();
            out = new Gson().toJson(bebida);
        } catch (Exception e) {
            out= """
                 {"Error":"Ocurrio un error. Intenta mas tarde."}
                 """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
}

    @Path("agregarBebida")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response actualizar(@HeaderParam("username") String username,
            @FormParam("datosBebida") @DefaultValue("") String bebida ) throws SQLException{
        if (username == null || !controllerBebida.validarToken(username)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(ERROR_UNAUTHORIZED).build();
        }
        
        String out = "";
        Bebida b= null;
        ControllerBebida ctrl = null;
        Gson gson = new Gson();
        try {
            b = gson.fromJson(bebida, Bebida.class);
            ctrl = new ControllerBebida();
            if(b.getIdBebida()< 1) {
                b.setIdBebida(ctrl.add(b).getIdBebida());
            } else {
                b = ctrl.update(b);
                
            }
            out = gson.toJson(b);
        } catch(JsonSyntaxException jpe) {
            out="""
                {"error":"Formato de datos no valido"}
                """;
            jpe.printStackTrace();
        } catch(Exception ex) {
            out="""
                {"error":"Error interno del servidor. Intente mas tarde."}
                """;
            ex.printStackTrace();
        }
        return Response.status(Response.Status.OK).entity(out).build();
        
    }
    
    @Path("eliminarBebida")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response eliminar(@HeaderParam("username") String username,
            @FormParam("idProducto") @DefaultValue("0") int idBebida ) throws SQLException {
        if (username == null || !controllerBebida.validarToken(username)) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(ERROR_UNAUTHORIZED).build();
        }
        
        String out = null;
        ControllerBebida ctrl = null;
        try {
            ctrl = new ControllerBebida();
            ctrl.delete(idBebida);
            out="""
                {"resultado":"Bebida %d eliminado"}
                """;
            out=String.format(out, idBebida);
        } catch(JsonParseException jpe) {
            out="""
                {"error":"Formato de datos no valido"}
                """;
            jpe.printStackTrace();
        } catch(Exception ex) {
            String mensajeError = ex.getMessage();
            out="""
                {"error":"Error interno del servidor. Intente mas tarde."}
                """;
            ex.printStackTrace();
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    @Path("getAllBd")
    @Produces(MediaType. APPLICATION_JSON)
    @GET
    public Response getAll(@HeaderParam("username") String username) throws SQLException{
    
    {
        String out = null;
        
        List<Bebida> bebida = null; 
        ControllerBebida b = new ControllerBebida();
        
        try {
            bebida = b.getAll();
            out = new Gson().toJson(bebida);
        } catch (Exception e) {
            out= """
                 {"Error":"Ocurrio un error. Intenta mas tarde."}
                 """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
        }
    }
}