package org.utl.dsm403.zarape.view;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.glassfish.jersey.internal.guava.Ticker;
import org.utl.dsm403.zarape.control.ControllerAlimento;
import org.utl.dsm403.zarape.control.ControllerBebida;
import org.utl.dsm403.zarape.control.ControllerCliente;
import org.utl.dsm403.zarape.control.ControllerComanda;
import org.utl.dsm403.zarape.control.ControllerEmpleado;
import org.utl.dsm403.zarape.model.Ciudad;
import org.utl.dsm403.zarape.model.Empleado;
import org.utl.dsm403.zarape.model.Estado;
import org.utl.dsm403.zarape.model.Persona;
import org.utl.dsm403.zarape.model.Sucursal;
import org.utl.dsm403.zarape.model.Usuario;
import org.utl.dsm403.zarape.control.ControllerSucursal;
import org.utl.dsm403.zarape.control.ControllerTicket;
import org.utl.dsm403.zarape.control.ControllerUsuario;
import org.utl.dsm403.zarape.model.Alimento;
import org.utl.dsm403.zarape.model.Bebida;
import org.utl.dsm403.zarape.model.Categoria;
import org.utl.dsm403.zarape.model.Cliente;
import org.utl.dsm403.zarape.model.Comanda;
import org.utl.dsm403.zarape.model.DetalleTicket;
import org.utl.dsm403.zarape.model.Producto;
import org.utl.dsm403.zarape.model.Ticket;

public class main {
    public static void main(String[] args) throws SQLException {
//        probarActualizarEmpleado();
//        probarEliminar();
//        mostrar();
//        add();
//        eliminarBebida();
//        addCliente();
//        probarActualizarCliente();
//        probarEliminarCliente();
//        addAlimento();
//        actualizarAlimento();
//        eliminarAlimento();
//        addBebida();
//        actualizarBebida();
//        eliminarBebida();
//          mostrarUsuarios();
//        insertarTicketTest();
        insertarComanda();
    }
    
//    private static void add() throws SQLException
//    {
//        ControllerEmpleado ctrlempleado = new ControllerEmpleado();
//        Empleado emp = new Empleado();
//        Persona persona = new Persona(0, "Angelito", "En el cielo", "000000", 
//                new Ciudad(350,"",new Estado(11,"")));
//        Sucursal sucursal = new Sucursal(1, 0, "", "", "", "", "", "", "", "", "", new Ciudad(350, "", new Estado()));
//        Usuario user = new Usuario(0, 0, "", "");
//        emp.setPersona(persona);
//        emp.setSucursal(sucursal);
//        emp.setUsuario(user);
//        System.out.println(ctrlempleado.add(emp));
//    }
    
//    private static void probarActualizarEmpleado() throws SQLException
//    {
//        ControllerEmpleado ctrEmp = new ControllerEmpleado();
//        Empleado emp = new Empleado();
//        Persona per = new Persona(15,"Cassandra",
//                "De las rosas y claveles","0000",
//                new Ciudad(1003,"", new Estado(19,"")));
//        Sucursal suc = new Sucursal(1, 0, "", "", "", "", "", "", "", "", "", new Ciudad(350,"", new Estado()));
//        Usuario us = new Usuario(3, 0, "casca", "sandra");
//        emp.setIdEmpleado(3);
//        emp.setPersona(per);
//        emp.setUsuario(us);
//        emp.setSucursal(suc);
//        System.out.println(emp);
////        ctrEmp.add(emp);
//        ctrEmp.update(emp);
//    }
    
    private static void probarEliminar() throws SQLException
    {
        ControllerEmpleado ctrEmp = new ControllerEmpleado();
        Empleado emp = new Empleado();
        ctrEmp.delete(2);
    }
    
public static void mostrar() {
    ControllerEmpleado ctrlempleado = new ControllerEmpleado();
    List<Empleado> registros = null;
    
    try {
        // Obtener todos los registros de empleados
        registros = ctrlempleado.getAll();
        
        // Imprimir el encabezado de la tabla
        System.out.println("NOMBRE\t\t\tAPELLIDOS\t\tTELEFONO\t\tSUCURSAL\t\tCIUDAD\t\tESTADO\t\tUSUARIO\t\tCONTRASENIA");
        System.out.println("-------------------------------------------------------------------------------------------------------------");

        // Iterar sobre los registros y mostrar los datos
        for (Empleado t : registros) {
            // Obtener los datos individuales de cada empleado
            String nombre = t.getPersona().getNombre();
            String apellidos = t.getPersona().getApellidos();
            String telefono = t.getPersona().getTelefono();
            String sucursal = t.getSucursal().getNombre();
            String ciudad = t.getPersona().getCiudad().getNombre();
            String estado = t.getPersona().getCiudad().getEstado().getNombre();
            String usuario = t.getUsuario().getNombre();
            String contrasenia = t.getUsuario().getContrasenia();
            
            // Crear un string con los datos formateados
            String empleadoInfo = String.format("%s\t\t%s\t\t%s\t\t%s\t\t%s\t\t%s\t\t%s\t\t%s", 
                nombre, 
                apellidos, 
                telefono, 
                sucursal, 
                ciudad, 
                estado, 
                usuario, 
                contrasenia);

            // Imprimir el string formateado
            System.out.println(empleadoInfo);
        }
    } catch (Exception e) {
        System.out.println("Hay un error en la conexión con la base de datos: " + e);
    }
    
}

    public static void mostrarSucursales() throws SQLException{
        ControllerSucursal sucursal = new ControllerSucursal();
        List<Sucursal> sucursales = sucursal.getAll();
        for(Sucursal s : sucursales)
            System.out.println(sucursales);
    }
    
    
    public static void mostrarUsuarios() throws SQLException{
        ControllerUsuario usuario = new ControllerUsuario();
        List<Usuario> usuarios = usuario.getAll();
        for(Usuario s : usuarios)
            System.out.println(usuarios);
    }
    
//       private static void addCliente() throws SQLException
//    {
//        ControllerCliente ctrlcliente = new ControllerCliente();
//        Cliente cliente = new Cliente();
//        Persona persona = new Persona(0, "Angelito", "En el cielo", "000000", 
//                new Ciudad(350,"",new Estado(11,"")));
//        Usuario user = new Usuario(0, 0, "", "");
//        cliente.setPersona(persona);
//        cliente.setUsuario(user);
//        System.out.println(ctrlcliente.add(cliente));
//    }
       
//    private static void probarActualizarCliente() throws SQLException
//    {
//        ControllerCliente ctrClient = new ControllerCliente();
//        Cliente client = new Cliente();
//        Persona per = new Persona(4,"El pepe",
//                "De las rosas y claveles","0000",
//                new Ciudad(1003,"", new Estado(19,"")));
//        Usuario us = new Usuario(4, 1, "El", "Pepe");
//        client.setIdCliente(2);
//        client.setPersona(per);
//        client.setUsuario(us);
//        System.out.println(client);
//        ctrClient.update(client);
//    }
    
    private static void probarEliminarCliente() throws SQLException
    {
        ControllerCliente ctrClien = new ControllerCliente();
        Cliente cliente = new Cliente();
        ctrClien.delete(2);
    }
    
    private static void addAlimento() throws SQLException
    {
        ControllerAlimento ctrlalimento = new ControllerAlimento();
        Alimento alimento = new Alimento();
        Producto producto = new Producto(0, "Torta de birria", "Torta de pan integral con birria de chivo", "foto de la torta", 35, 
                new Categoria(3, "Torta", "A", 0), 0);
        alimento.setProducto(producto);
        System.out.println(ctrlalimento.add(alimento));
    }
    
    private static void actualizarAlimento() throws SQLException
    {
        ControllerAlimento ctrlalimento = new ControllerAlimento();
        Alimento alimento = new Alimento();
        Producto producto = new Producto(3, "Torta de birria", "Torta de pan integral con birria de chivo", "foto de la torta", 45, 
                new Categoria(3, "Torta", "A", 0), 0);
        alimento.setProducto(producto);
        System.out.println(ctrlalimento.update(alimento));
    }
    
    private static void eliminarAlimento() throws SQLException
    {
        ControllerAlimento ctralimento = new ControllerAlimento();
        ctralimento.delete(10);
    }
    
    
    private static void addBebida() throws SQLException
    {
        ControllerBebida ctrlbebida = new ControllerBebida();
        Bebida bebida = new Bebida();
        Producto producto = new Producto(0, "Paloma", "Combinación de tequila con squirt", "foto de paloma", 90, 
                new Categoria(6, "Refrescos", "B", 0), 0);
        bebida.setProducto(producto);
        System.out.println(ctrlbebida.add(bebida));
    }
    
    private static void actualizarBebida() throws SQLException
    {
        ControllerBebida ctrlbebida = new ControllerBebida();
        Bebida bebida = new Bebida();
        Producto producto = new Producto(6, "Paloma Actualizada", "Combinación de tequila con squirt actualizada", "foto de paloma", 80, 
                new Categoria(6, "Refrescos", "B", 0), 0);
        bebida.setProducto(producto);
        System.out.println(ctrlbebida.update(bebida));
    }
    
    private static void eliminarBebida() throws SQLException
    {
        ControllerBebida ctrbebida = new ControllerBebida();
        System.out.println(ctrbebida.delete(107));
    }

    private static void insertarTicketTest() throws SQLException {
        // Crear una instancia del ControllerTicket
        ControllerTicket ticketDAO = new ControllerTicket();

        // Crear lista de detalles
        List<DetalleTicket> detalles = new ArrayList<>();
        detalles.add(new DetalleTicket(2, 0.0, null, 101)); // cantidad = 2, idProducto = 101
        detalles.add(new DetalleTicket(1, 0.0, null, 102)); // cantidad = 1, idProducto = 102

        // Llamar al método insertarTicket
        int resultado = ticketDAO.insertarTicket(30, 2, detalles);

        // Mostrar el resultado
        System.out.println("Resultado de la inserción del ticket: " + resultado);
    }
    
    private static void insertarComanda() throws SQLException{
        ControllerComanda ctrlcomanda = new ControllerComanda();
        Comanda comande = new Comanda();
        Ticket ticket = new Ticket(1, "", "", "", 0, 0, 0);
        comande.setTicket(ticket);
        ctrlcomanda.addComanda(comande);
    }
}