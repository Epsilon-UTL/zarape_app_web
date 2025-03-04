/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm403.zarape.model;

/**
 *
 * @author rodri
 */
public class DetalleTicket {
    private int cantidad;
    private double precio;
    private Integer idCombo;
    private Integer idProducto;
    private Ticket ticket;

    public DetalleTicket() {
    }

    public DetalleTicket(int cantidad, double precio, Integer idCombo, Integer idProducto, Ticket ticket) {
        this.cantidad = cantidad;
        this.precio = precio;
        this.idCombo = idCombo;
        this.idProducto = idProducto;
        this.ticket = ticket;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public Integer getIdCombo() {
        return idCombo;
    }

    public void setIdCombo(Integer idCombo) {
        this.idCombo = idCombo;
    }

    public Integer getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    @Override
    public String toString() {
        return "DetalleTicket{" + "cantidad=" + cantidad + ", precio=" + precio + ", idCombo=" + idCombo + ", idProducto=" + idProducto + ", ticket=" + ticket + '}';
    }

}
