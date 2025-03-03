/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm403.rest;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import org.utl.dsm403.zarape.control.ControllerComanda;
import org.utl.dsm403.zarape.model.Comanda;

/**
 *
 * @author rodri
 */
@Path("comanda")
public class RESTComanda {

    @POST
    @Path("agregarComanda")
    @Produces(MediaType.APPLICATION_JSON)
    public Response agregar(@FormParam("datosComanda") @DefaultValue("") String datosComanda) {
        String out = "";
        Comanda c = null;
        ControllerComanda ctrl = null;
        Gson gson = new Gson();

        try {
            if (datosComanda == null || datosComanda.isEmpty()) {
                out = "{\"error\":\"Datos de la comanda no proporcionados\"}";
                return Response.status(Response.Status.BAD_REQUEST).entity(out).build();
            }

            c = gson.fromJson(datosComanda, Comanda.class);

            if (c == null) {
                throw new JsonSyntaxException("Formato de datos no válido");
            }

            ctrl = new ControllerComanda();
            c = ctrl.addComanda(c);

            out = gson.toJson(c);
            return Response.status(Response.Status.OK).entity(out).build();

        } catch (JsonSyntaxException jpe) {
            out = "{\"error\":\"Formato de datos no válido: " + jpe.getMessage() + "\"}";
            jpe.printStackTrace();
            return Response.status(Response.Status.BAD_REQUEST).entity(out).build();

        } catch (SQLException e) {
            out = "{\"error\":\"Error al agregar la comanda en la base de datos: " + e.getMessage() + "\"}";
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();

        } catch (Exception ex) {
            out = "{\"error\":\"Error interno del servidor. Intente más tarde. Detalles: " + ex.getMessage() + "\"}";
            ex.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }
}
