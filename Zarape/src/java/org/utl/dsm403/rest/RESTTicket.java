package org.utl.dsm403.rest;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;
import org.utl.dsm403.zarape.control.ControllerTicket;
import org.utl.dsm403.zarape.model.DetalleTicket;
import org.utl.dsm403.zarape.model.Ticket;
import com.google.gson.reflect.TypeToken;

@Path("ticket") 
public class RESTTicket {

    private ControllerTicket ticketService = new ControllerTicket();
    private Gson gson = new Gson();

    @POST 
    @Path("agregarTicket") 
    @Produces(MediaType.APPLICATION_JSON)
    public Response agregarTicket(@FormParam("datosTicket") String Ticket) {
        try {
            JsonObject request = gson.fromJson(Ticket, JsonObject.class);

            int idCliente = request.get("idCliente").getAsInt();
            int idSucursal = request.get("idSucursal").getAsInt();
            JsonArray detallesJson = request.getAsJsonArray("detalles");

            if (idCliente <= 0 || idSucursal <= 0 || detallesJson == null || detallesJson.size() == 0) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"message\": \"Datos de entrada inválidos\"}")
                        .build();
            }

            List<DetalleTicket> detalles = gson.fromJson(detallesJson, new TypeToken<List<DetalleTicket>>() {}.getType());

            Ticket ticket = new Ticket();
            ticket.setIdCliente(idCliente);
            ticket.setIdSucursal(idSucursal);

            Ticket resultado = ticketService.insertarTicket(ticket, detalles);

            return Response.ok(gson.toJson(resultado)).build();
        } catch (SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"message\": \"Error en la base de datos: " + e.getMessage() + "\"}")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"message\": \"Error al procesar la solicitud: " + e.getMessage() + "\"}")
                    .build();
        }
    }
}
