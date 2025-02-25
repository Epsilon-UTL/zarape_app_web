package org.utl.dsm403.zarape.model;

public class Usuario {
    private int idUsuario,activo, rol;
    private String nombre,contrasenia, lastToken, dateLastToken;

    public Usuario() {
    }

    public Usuario(int idUsuario, int activo, int rol, String nombre, String contrasenia, String lastToken, String dateLastToken) {
        this.idUsuario = idUsuario;
        this.activo = activo;
        this.rol = rol;
        this.nombre = nombre;
        this.contrasenia = contrasenia;
        this.lastToken = lastToken;
        this.dateLastToken = dateLastToken;
    }

    
    
    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }

    public int getActivo() {
        return activo;
    }

    public void setActivo(int activo) {
        this.activo = activo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getContrasenia() {
        return contrasenia;
    }

    public void setContrasenia(String contrasenia) {
        this.contrasenia = contrasenia;
    }

    public int getRol() {
        return rol;
    }

    public void setRol(int rol) {
        this.rol = rol;
    }

    public String getLastToken() {
        return lastToken;
    }

    public void setLastToken(String lastToken) {
        this.lastToken = lastToken;
    }

    public String getDateLastToken() {
        return dateLastToken;
    }

    public void setDateLastToken(String dateLastToken) {
        this.dateLastToken = dateLastToken;
    }

    @Override
    public String toString() {
        return "Usuario{" + "idUsuario=" + idUsuario + ", activo=" + activo + ", rol=" + rol + ", nombre=" + nombre + ", contrasenia=" + contrasenia + ", lastToken=" + lastToken + ", dateLastToken=" + dateLastToken + '}';
    }

    
}