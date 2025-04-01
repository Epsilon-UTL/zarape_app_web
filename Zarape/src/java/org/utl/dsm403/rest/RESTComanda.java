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
import java.util.Map;
import org.utl.dsm403.zarape.control.ControllerComanda;
import org.utl.dsm403.zarape.model.Comanda;
import org.utl.dsm403.zarape.model.DetalleTicket;
/**
 *
 * @author rodri
 */
@Path("comanda")
public class RESTComanda {
    
    @Path("getAll")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll() {
        String out = null;
        Gson gson = new Gson();
        ControllerComanda cc = new ControllerComanda();
        
        try {
            List<Comanda> comandas = cc.getAll();
            out = gson.toJson(comandas);
            return Response.ok(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"" + e.toString() + "\"}";
            return Response.status(Response.Status.BAD_REQUEST).entity(out).build();
        }
    }
    
    @Path("getAllFIFO")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllFIFO() {
        String out = null;
        Gson gson = new Gson();
        ControllerComanda cc = new ControllerComanda();
        
        try {
            List<Comanda> comandas = cc.getAllFIFO();
            out = gson.toJson(comandas);
            return Response.ok(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"" + e.toString() + "\"}";
            return Response.status(Response.Status.BAD_REQUEST).entity(out).build();
        }
    }
    
    @Path("changeStatus")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response changeStatus(
            @FormParam("idComanda") @DefaultValue("0") int idComanda,
            @FormParam("estatus") @DefaultValue("0") int estatus) {
        
        String out = null;
        Gson gson = new Gson();
        ControllerComanda cc = new ControllerComanda();
        
        try {
            cc.changeStatus(idComanda, estatus);
            out = "{\"result\":\"Estatus actualizado correctamente\"}";
            return Response.ok(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"" + e.toString() + "\"}";
            return Response.status(Response.Status.BAD_REQUEST).entity(out).build();
        }
    }
    
    @Path("getDetails")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDetails(@QueryParam("idTicket") int idTicket) {
        String out = null;
        Gson gson = new Gson();
        ControllerComanda cc = new ControllerComanda();

        try {
            if (idTicket <= 0) {
                out = "{\"error\":\"ID de ticket inválido\"}";
                return Response.status(Response.Status.BAD_REQUEST).entity(out).build();
            }

            List<Map<String, Object>> detalles = cc.getDetails(idTicket);
            out = gson.toJson(detalles);
            return Response.ok(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"" + e.toString() + "\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }
}