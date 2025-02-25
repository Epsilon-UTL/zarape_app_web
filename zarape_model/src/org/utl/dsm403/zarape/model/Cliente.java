package org.utl.dsm403.zarape.model;

public class Cliente {
    private int idCliente, activo; 
    private Usuario usuario;
    private Persona persona;

    public Cliente() {
    }

    public Cliente(int idCliente, int activo, Usuario usuario, Persona persona) {
        this.idCliente = idCliente;
        this.activo = activo;
        this.usuario = usuario;
        this.persona = persona;
    }

    public int getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(int idCliente) {
        this.idCliente = idCliente;
    }

    public int getActivo() {
        return activo;
    }

    public void setActivo(int activo) {
        this.activo = activo;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    @Override
    public String toString() {
        return "Cliente{" + "idCliente=" + idCliente + ", activo=" + activo + ", usuario=" + usuario + ", persona=" + persona + '}';
    }
}