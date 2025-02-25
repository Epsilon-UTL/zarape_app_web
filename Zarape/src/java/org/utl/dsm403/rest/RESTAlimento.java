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
import org.utl.dsm403.zarape.control.ControllerAlimento;
import org.utl.dsm403.zarape.model.Alimento;
/**
 *
 * @author rodri
 */
@Path("alimento")
public class RESTAlimento {
    @Path("getAllAlimento")
    @Produces(MediaType. APPLICATION_JSON)
    @GET
    public Response getAllAlimento() throws SQLException
    {
        String out = null;
        
        List<Alimento> alimento = null; 
        ControllerAlimento ali = new ControllerAlimento();
        
        try {
            alimento = ali.getAll();
            out = new Gson().toJson(alimento);
        } catch (Exception e) {
            out= """
                 {"Error":"Ocurrio un error. Intenta mas tarde."}
                 """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    @Path("agregarAlimento")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response actualizar(@FormParam("datosAlimento") @DefaultValue("") String alimento ) {
        String out = "";
        Alimento a = null;
        ControllerAlimento ctrl = null;
        Gson gson = new Gson();
        try {
            a = gson.fromJson(alimento, Alimento.class);
            ctrl = new ControllerAlimento();
            if(a.getIdAlimento()< 1) {
                a.setIdAlimento(ctrl.add(a).getIdAlimento());
            } else {
                a = ctrl.update(a);
                
            }
            out = gson.toJson(a);
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
    
    @Path("eliminarAlimento")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response eliminar(@FormParam("idProducto") @DefaultValue("0") int idAlimento ) throws SQLException {
        String out = null;
        ControllerAlimento ctrl = null;
        try {
            ctrl = new ControllerAlimento();
            ctrl.delete(idAlimento);
            out="""
                {"resultado":"Alimento %d eliminado"}
                """;
            out=String.format(out, idAlimento);
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
