package org.utl.dsm403.zarape.model;

public class Empleado {
    private int idEmpleado,activo;
    private Sucursal sucursal;
    private Persona persona;
    private Usuario usuario;

    public Empleado() {
    }

    public Empleado(int idEmpleado, int activo, Sucursal sucursal, Persona persona, Usuario usuario) {
        this.idEmpleado = idEmpleado;
        this.activo = activo;
        this.sucursal = sucursal;
        this.persona = persona;
        this.usuario = usuario;
    }

    public int getIdEmpleado() {
        return idEmpleado;
    }

    public void setIdEmpleado(int idEmpleado) {
        this.idEmpleado = idEmpleado;
    }

    public int getActivo() {
        return activo;
    }

    public void setActivo(int activo) {
        this.activo = activo;
    }

    public Sucursal getSucursal() {
        return sucursal;
    }

    public void setSucursal(Sucursal sucursal) {
        this.sucursal = sucursal;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    @Override
    public String toString() {
        return "Empleado{" + "idEmpleado=" + idEmpleado + ", activo=" + activo + ", sucursal=" + sucursal + ", persona=" + persona + ", usuario=" + usuario + '}';
    }
}