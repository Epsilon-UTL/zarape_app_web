/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm403.zarape.model;

/**
 *
 * @author rodri
 */
public class Ticket {
    private int idTicket;
    private String ticket;
    private String fecha; 
    private String pagado;
    private int idCliente;
    private int idSucursal;
    private int estatus;

    public Ticket() {
    }

    public Ticket(int idTicket, String ticket, String fecha, String pagado, int idCliente, int idSucursal, int estatus) {
        this.idTicket = idTicket;
        this.ticket = ticket;
        this.fecha = fecha;
        this.pagado = pagado;
        this.idCliente = idCliente;
        this.idSucursal = idSucursal;
        this.estatus = estatus;
    }

    public int getIdTicket() {
        return idTicket;
    }

    public void setIdTicket(int idTicket) {
        this.idTicket = idTicket;
    }

    public String getTicket() {
        return ticket;
    }

    public void setTicket(String ticket) {
        this.ticket = ticket;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getPagado() {
        return pagado;
    }

    public void setPagado(String pagado) {
        this.pagado = pagado;
    }

    public int getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(int idCliente) {
        this.idCliente = idCliente;
    }

    public int getIdSucursal() {
        return idSucursal;
    }

    public void setIdSucursal(int idSucursal) {
        this.idSucursal = idSucursal;
    }

    public int getEstatus() {
        return estatus;
    }

    public void setEstatus(int estatus) {
        this.estatus = estatus;
    }

    @Override
    public String toString() {
        return "Ticket{" + "idTicket=" + idTicket + ", ticket=" + ticket + ", fecha=" + fecha + ", pagado=" + pagado + ", idCliente=" + idCliente + ", idSucursal=" + idSucursal + ", estatus=" + estatus + '}';
    }
    
}
