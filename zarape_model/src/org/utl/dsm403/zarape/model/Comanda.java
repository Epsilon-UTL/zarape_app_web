/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm403.zarape.model;

/**
 *
 * @author rodri
 */
public class Comanda {
    private int idComanda;
    private Ticket ticket;
    private int estatus;

    public Comanda() {
    }

    public Comanda(int idComanda, Ticket ticket, int estatus) {
        this.idComanda = idComanda;
        this.ticket = ticket;
        this.estatus = estatus;
    }

    public int getIdComanda() {
        return idComanda;
    }

    public void setIdComanda(int idComanda) {
        this.idComanda = idComanda;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public int getEstatus() {
        return estatus;
    }

    public void setEstatus(int estatus) {
        this.estatus = estatus;
    }

    @Override
    public String toString() {
        return "Comanda{" + "idComanda=" + idComanda + ", ticket=" + ticket + ", estatus=" + estatus + '}';
    }
    
}
