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
import java.util.List;
import org.utl.dsm403.zarape.control.ControllerTicket;
import org.utl.dsm403.zarape.model.DetalleTicket;
import com.google.gson.reflect.TypeToken;

@Path("ticket") 
public class RESTTicket {

    private ControllerTicket ticketService = new ControllerTicket();
    private Gson gson = new Gson();

    @POST 
    @Path("agregarTicket") 
    @Produces(MediaType.APPLICATION_JSON)
    public Response agregarTicket(
        @FormParam("datosTicket") String jsonData 
    ) {
        try {
            JsonObject request = gson.fromJson(jsonData, JsonObject.class);

            int idCliente = request.get("idCliente").getAsInt();
            int idSucursal = request.get("idSucursal").getAsInt();
            JsonArray detallesJson = request.getAsJsonArray("detalles");

            if (idCliente <= 0 || idSucursal <= 0 || detallesJson == null || detallesJson.size() == 0) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"message\": \"Datos de entrada inválidos\"}")
                        .build();
            }

            List<DetalleTicket> detalles = gson.fromJson(detallesJson, new TypeToken<List<DetalleTicket>>() {}.getType());

            int result = ticketService.insertarTicket(idCliente, idSucursal, detalles);

            return Response.ok("{\"resultado\": " + result + "}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"message\": \"Error al procesar la solicitud: " + e.getMessage() + "\"}")
                    .build();
        }
    }
}