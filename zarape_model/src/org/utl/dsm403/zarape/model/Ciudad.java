package org.utl.dsm403.zarape.model;

public class Ciudad {
    private int idCiudad; 
    private String nombre;
    private Estado estado;
    
    public Ciudad (int idCiudad, String nombre, Estado estado){
        this.idCiudad = idCiudad;
        this.nombre = nombre;
        this.estado = estado;
    }
    
    public Ciudad(){
        
    }

    public int getidCiudad() {
        return idCiudad;
    }

    public void setidCiudad(int idCiudad) {
        this.idCiudad = idCiudad;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "Ciudad{" + "idCiudad=" + idCiudad + ", nombre=" + nombre + ", estado=" + estado + '}';
    } 
}