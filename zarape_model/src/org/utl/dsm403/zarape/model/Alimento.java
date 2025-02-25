package org.utl.dsm403.zarape.model;

public class Alimento {
    private int idAlimento;
    private Producto producto;

    public Alimento() {
    }

    public Alimento(int idAlimento, Producto producto) {
        this.idAlimento = idAlimento;
        this.producto = producto;
    }

    public int getIdAlimento() {
        return idAlimento;
    }

    public void setIdAlimento(int idAlimento) {
        this.idAlimento = idAlimento;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    @Override
    public String toString() {
        return "Alimento{" + "idAlimento=" + idAlimento + ", producto=" + producto + '}';
    }
}