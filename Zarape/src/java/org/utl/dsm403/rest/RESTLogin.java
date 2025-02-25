/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm403.rest;

import com.google.gson.Gson;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.sql.SQLException;
import org.apache.commons.codec.digest.DigestUtils;
import org.utl.dsm403.zarape.control.ControllerUsuario;
import org.utl.dsm403.zarape.model.Usuario;

/**
 *
 * @author rodri
 */
@Path("login")
public class RESTLogin {
    @Path("cheecky")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response checkingUser(@QueryParam("nombre")@DefaultValue("") String nombre){
        String out = null;
        String usuario = null; 
        ControllerUsuario cu = new ControllerUsuario();
        
        try{
            usuario = cu.checkUsers(nombre);
            out = new Gson().toJson(usuario);
        } catch (Exception e){
            out = """
                  {"Error": "Por favor, cese de toda actividad."}
                  """;
            System.out.println(e.getMessage());
        }
        
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("cerrarsesion")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response logout(@QueryParam("nombre") @DefaultValue("") String nombre) {
        String out;
        ControllerUsuario cu = new ControllerUsuario();
        
        try {
            String result = cu.logout(nombre);
            out = new Gson().toJson(result);
        } catch (Exception e) {
            out = """
                  {"Error": "Por favor, cese de toda actividad."}
                  """;
            System.out.println(e.getMessage());
        }
        
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("acceso")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(@FormParam("u") @DefaultValue("") String usuario,
                          @FormParam("c") @DefaultValue("") String contrasenia) {
        String out;
        try {
            ControllerUsuario cu = new ControllerUsuario();
            String contraseniaHash = DigestUtils.sha256Hex(contrasenia);
            out = cu.login(usuario, contraseniaHash);
        } catch (Exception e) {
            out = "{\"success\":false, \"error\":\"" + e.getLocalizedMessage() + "\"}";
        }
        return Response.ok(out).build();
    }

    
    @Path("getAllUsuarios")
    @Produces(MediaType. APPLICATION_JSON)
    @GET
    public Response getAllUsuarios() throws SQLException
    {
        String out = null;
        
        List<Usuario> usuario = null; 
        ControllerUsuario em = new ControllerUsuario();
        
        try {
            usuario = em.getAll();
            out = new Gson().toJson(usuario);
        } catch (Exception e) {
            out= """
                 {"Error":"Ocurrio un error. Intenta mas tarde."}
                 """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
}
