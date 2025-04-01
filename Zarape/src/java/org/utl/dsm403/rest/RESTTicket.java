package org.utl.dsm403.rest;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.utl.dsm403.zarape.control.ControllerTicket;
import org.utl.dsm403.zarape.model.Comanda;
import org.utl.dsm403.zarape.model.DetalleTicket;
import org.utl.dsm403.zarape.model.Ticket;
import com.google.gson.JsonObject;
import java.sql.SQLException;
import java.util.Arrays;
/**
 *
 * @author rodri
 */
@Path("ticket")
public class RESTTicket {
    
    @Path("registrar")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response registrar(@FormParam("datos") @DefaultValue("") String jsonDatos) {
        String out;
        Gson gson = new Gson();

        try {
            // Validar JSON no vacío
            if (jsonDatos == null || jsonDatos.trim().isEmpty()) {
                throw new IllegalArgumentException("Datos JSON requeridos");
            }

            JsonObject jsonObject = gson.fromJson(jsonDatos, JsonObject.class);

            // Validar estructura
            if (!jsonObject.has("ticket") || !jsonObject.has("detalles")) {
                throw new IllegalArgumentException("Estructura JSON inválida. Se requieren 'ticket' y 'detalles'");
            }

            // Parsear ticket
            Ticket ticket = gson.fromJson(jsonObject.get("ticket"), Ticket.class);

            // Parsear detalles
            DetalleTicket[] detallesArray = gson.fromJson(
                jsonObject.getAsJsonArray("detalles"), 
                DetalleTicket[].class
            );
            List<DetalleTicket> detalles = Arrays.asList(detallesArray);

            // Validar datos básicos
            if (ticket.getIdCliente() <= 0 || ticket.getIdSucursal() <= 0) {
                throw new IllegalArgumentException("ID de cliente y sucursal son requeridos");
            }

            // Procesar ticket
            ControllerTicket controller = new ControllerTicket();
            Comanda comanda = controller.registrarTicket(ticket, detalles);

            out = gson.toJson(comanda);

        } catch (JsonSyntaxException e) {
            out = "{\"error\":\"Error en formato JSON: " + e.getMessage() + "\"}";
        } catch (IllegalArgumentException e) {
            out = "{\"error\":\"Datos inválidos: " + e.getMessage() + "\"}";
        } catch (SQLException e) {
            out = "{\"error\":\"Error en base de datos: " + e.getMessage() + "\"}";
        } catch (Exception e) {
            out = "{\"error\":\"Error interno: " + e.getMessage() + "\"}";
        }

        return Response.status(out.contains("\"error\"") ? 
                           Response.Status.BAD_REQUEST : 
                           Response.Status.OK)
                      .entity(out).build();
    }
}