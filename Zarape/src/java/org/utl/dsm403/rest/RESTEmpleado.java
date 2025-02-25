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
import org.utl.dsm403.zarape.control.ControllerEmpleado;
import org.utl.dsm403.zarape.model.Empleado;


/**
 *
 * @author Sandro
 */
@Path("empleado")
public class RESTEmpleado {
    @Path("getAllEmpleados")
    @Produces(MediaType. APPLICATION_JSON)
    @GET
    public Response getAllEmpleados() throws SQLException
    {
        String out = null;
        
        List<Empleado> empleado = null; 
        ControllerEmpleado em = new ControllerEmpleado();
        
        try {
            empleado = em.getAll();
            out = new Gson().toJson(empleado);
        } catch (Exception e) {
            out= """
                 {"Error":"Ocurrio un error. Intenta mas tarde."}
                 """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    
    @Path("agregar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response agregar(@FormParam("datosEmpleado") @DefaultValue("") String empleado ) {
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
    
    @Path("actualizar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response actualizar(@FormParam("datosEmpleado") @DefaultValue("") String empleado ) {
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
    
    @Path("eliminar")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response eliminar(@FormParam("idEmpleado") @DefaultValue("0") int idEmpleado ) throws SQLException {
        String out = null;
        ControllerEmpleado ctrl = null;
        try {
            ctrl = new ControllerEmpleado();
            ctrl.delete(idEmpleado);
            out="""
                {"resultado":"Empleado %d eliminado"}
                """;
            out=String.format(out, idEmpleado);
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
