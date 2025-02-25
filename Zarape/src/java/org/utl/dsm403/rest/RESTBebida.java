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
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;
import org.utl.dsm403.zarape.control.ControllerBebida;
import org.utl.dsm403.zarape.model.Bebida;
/**
 *
 * @author rodri
 */
@Path("bebida")
public class RESTBebida {
     @Path("getAllBebida")
    @Produces(MediaType. APPLICATION_JSON)
    @GET
    public Response getAllBebida() throws SQLException
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
    
    @Path("agregarBebida")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response actualizar(@FormParam("datosBebida") @DefaultValue("") String bebida ) {
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
    public Response eliminar(@FormParam("idProducto") @DefaultValue("0") int idBebida ) throws SQLException {
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
    
}
