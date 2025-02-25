package org.utl.dsm403.zarape.model;

public class Categoria {
    private int idCategoria;
    private String descripcion;
    private String tipo;
    private int activo;

    public Categoria() {
    }

    public Categoria(int idCategoria, String descripcion, String tipo, int activo) {
        this.idCategoria = idCategoria;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.activo = activo;
    }

    public int getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(int idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public int getActivo() {
        return activo;
    }

    public void setActivo(int activo) {
        this.activo = activo;
    }

    @Override
    public String toString() {
        return "Categoria{" + "idCategoria=" + idCategoria + ", descripcion=" + descripcion + ", tipo=" + tipo + ", activo=" + activo + '}';
    }
}