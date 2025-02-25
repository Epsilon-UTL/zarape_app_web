package org.utl.dsm403.zarape.model;

public class Sucursal {
    private int idSucursal, activo;
   private String nombre, latitud, longitud, foto, urlWeb, horario, calle, numCalle, colonia;
   private Ciudad Ciudad;

    public Sucursal(int idSucursal, int activo, String nombre, String latitud, String longitud, String foto, String urlWeb, String horario, String calle, String numCalle, String colonia, Ciudad Ciudad) {
        this.idSucursal = idSucursal;
        this.activo = activo;
        this.nombre = nombre;
        this.latitud = latitud;
        this.longitud = longitud;
        this.foto = foto;
        this.urlWeb = urlWeb;
        this.horario = horario;
        this.calle = calle;
        this.numCalle = numCalle;
        this.colonia = colonia;
        this.Ciudad = Ciudad;
    }

    public Sucursal() {
    }

    public int getIdSucursal() {
        return idSucursal;
    }

    public void setIdSucursal(int idSucursal) {
        this.idSucursal = idSucursal;
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

    public String getLatitud() {
        return latitud;
    }

    public void setLatitud(String latitud) {
        this.latitud = latitud;
    }

    public String getLongitud() {
        return longitud;
    }

    public void setLongitud(String longitud) {
        this.longitud = longitud;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public String getUrlWeb() {
        return urlWeb;
    }

    public void setUrlWeb(String urlWeb) {
        this.urlWeb = urlWeb;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public String getCalle() {
        return calle;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public String getNumCalle() {
        return numCalle;
    }

    public void setNumCalle(String numCalle) {
        this.numCalle = numCalle;
    }

    public String getColonia() {
        return colonia;
    }

    public void setColonia(String colonia) {
        this.colonia = colonia;
    }

    public Ciudad getCiudad() {
        return Ciudad;
    }

    public void setCiudad(Ciudad Ciudad) {
        this.Ciudad = Ciudad;
    }

    @Override
    public String toString() {
        return "Sucursal{" + "idSucursal=" + idSucursal + ", activo=" + activo + ", nombre=" + nombre + ", latitud=" + latitud + ", longitud=" + longitud + ", foto=" + foto + ", urlWeb=" + urlWeb + ", horario=" + horario + ", calle=" + calle + ", numCalle=" + numCalle + ", colonia=" + colonia + ", Ciudad=" + Ciudad + '}';
    }

}