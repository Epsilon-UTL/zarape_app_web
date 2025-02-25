package org.utl.dsm403.rest;


import com.google.gson.Gson;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.utl.dsm403.zarape.control.ControllerCategoria;
import org.utl.dsm403.zarape.model.Categoria;

/**
 *
 * @author Sandro
 */

@Path("categoria")
public class RESTCategoria {
    @Path("getAllCategoriaBebidas")
    @Produces(MediaType. APPLICATION_JSON)
    @GET
    public Response getAllCategoriaBebidas() {
        String out = null;
        List<Categoria> categoria = null;
        ControllerCategoria ca = new ControllerCategoria();
        
        try {
            categoria = ca.getAllBebidas();
            out = new Gson().toJson(categoria);
        } catch (Exception e) {
            out="""
                {"error":"Ocurrio un error. Intente más tarde"}
                """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    @Path("getAllCategoriaAlimentos")
    @Produces(MediaType. APPLICATION_JSON)
    @GET
    public Response getAllCategoriaAlimentos() {
        String out = null;
        List<Categoria> categoria = null;
        ControllerCategoria ca = new ControllerCategoria();
        
        try {
            categoria = ca.getAllAlimentos();
            // Se utiliza la interfaz Gson para convertir la estructura en un array de JSON's
            out = new Gson().toJson(categoria);
        } catch (Exception e) {
            out="""
                {"error":"Ocurrio un error. Intente más tarde"}
                """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
 
}
