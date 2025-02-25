/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm403.rest;

import com.google.gson.Gson;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.utl.dsm403.zarape.control.ControllerEstado;
import org.utl.dsm403.zarape.model.Estado;

/**
 *
 * @author Sandro
 */

@Path("datos")
public class RESTDatos {
    @Path("getAllEstados")
    @Produces(MediaType. APPLICATION_JSON)
    @GET
    public Response getAllEstados() {
        String out = null;
        List<Estado> estados = null;
        ControllerEstado ce = new ControllerEstado();
        
        try {
            estados = ce.getAll();
            // Se utiliza la interfaz Gson para convertir la estructura en un array de JSON's
            out = new Gson().toJson(estados);
        } catch (Exception e) {
            out="""
                {"error":"Ocurrio un error. Intente más tarde"}
                """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
}
