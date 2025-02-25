package org.utl.dsm403.zarape.model;

public class Estado {
    private int idEstado;
    private String nombre;
    
    public Estado(int idEstado, String nombre){
        this.idEstado = idEstado;
        this.nombre = nombre;
    }
    
    public Estado(){
        
    }

    public int getIdEstado() {
        return idEstado;
    }

    public void setIdEstado(int idEstado) {
        this.idEstado = idEstado;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    @Override
    public String toString() {
        return "Estado{" + "idEstado=" + idEstado + ", nombre=" + nombre + '}';
    }
}