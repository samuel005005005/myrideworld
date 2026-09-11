import { EstadosConductor, EstadosDisponibilidadConductor } from '../../../../compartidos/constantes/estados-conductor.enum.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
export class Conductor {
    _id;
    _nombreCompleto;
    _email;
    _telefono;
    _passwordHash;
    _fotoUrl;
    _vehiculoMarca;
    _vehiculoModelo;
    _vehiculoColor;
    _vehiculoPlaca;
    _licenciaUrl;
    _seguroUrl;
    _estadoAprobacion;
    _estadoDisponibilidad;
    _ultimaUbicacionLat;
    _ultimaUbicacionLng;
    constructor(props) {
        this._id = props.id ?? crypto.randomUUID();
        this._nombreCompleto = props.nombreCompleto;
        this._email = props.email;
        this._telefono = props.telefono;
        this._passwordHash = props.passwordHash;
        this._fotoUrl = props.fotoUrl ?? null;
        this._vehiculoMarca = props.vehiculoMarca;
        this._vehiculoModelo = props.vehiculoModelo;
        this._vehiculoColor = props.vehiculoColor;
        this._vehiculoPlaca = props.vehiculoPlaca;
        this._licenciaUrl = props.licenciaUrl ?? null;
        this._seguroUrl = props.seguroUrl ?? null;
        this._estadoAprobacion = props.estadoAprobacion ?? EstadosConductor.PENDIENTE;
        this._estadoDisponibilidad = props.estadoDisponibilidad ?? EstadosDisponibilidadConductor.DESCONECTADO;
        this._ultimaUbicacionLat = props.ultimaUbicacionLat ?? null;
        this._ultimaUbicacionLng = props.ultimaUbicacionLng ?? null;
        this.validar();
    }
    static crear(props) {
        return new Conductor(props);
    }
    get id() { return this._id; }
    get nombreCompleto() { return this._nombreCompleto; }
    get email() { return this._email; }
    get telefono() { return this._telefono; }
    get passwordHash() { return this._passwordHash; }
    get fotoUrl() { return this._fotoUrl; }
    get vehiculoMarca() { return this._vehiculoMarca; }
    get vehiculoModelo() { return this._vehiculoModelo; }
    get vehiculoColor() { return this._vehiculoColor; }
    get vehiculoPlaca() { return this._vehiculoPlaca; }
    get licenciaUrl() { return this._licenciaUrl; }
    get seguroUrl() { return this._seguroUrl; }
    get estadoAprobacion() { return this._estadoAprobacion; }
    get estadoDisponibilidad() { return this._estadoDisponibilidad; }
    get ultimaUbicacionLat() { return this._ultimaUbicacionLat; }
    get ultimaUbicacionLng() { return this._ultimaUbicacionLng; }
    aprobar() {
        if (this._estadoAprobacion !== EstadosConductor.PENDIENTE) {
            throw new DomainException(MENSAJES.EXCEPCIONES.CONDUCTORES.SOLO_PENDIENTE_APROBAR);
        }
        this._estadoAprobacion = EstadosConductor.APROBADO;
        this._estadoDisponibilidad = EstadosDisponibilidadConductor.CONECTADO;
    }
    actualizarDocumentos(rutas) {
        if (rutas.fotoPerfil)
            this._fotoUrl = rutas.fotoPerfil;
        if (rutas.licencia)
            this._licenciaUrl = rutas.licencia;
        if (rutas.seguro)
            this._seguroUrl = rutas.seguro;
    }
    actualizarPerfil(datos) {
        if (datos.nombreCompleto)
            this._nombreCompleto = datos.nombreCompleto;
        if (datos.telefono)
            this._telefono = datos.telefono;
        if (datos.vehiculoMarca)
            this._vehiculoMarca = datos.vehiculoMarca;
        if (datos.vehiculoModelo)
            this._vehiculoModelo = datos.vehiculoModelo;
        if (datos.vehiculoColor)
            this._vehiculoColor = datos.vehiculoColor;
        if (datos.vehiculoPlaca)
            this._vehiculoPlaca = datos.vehiculoPlaca;
        this.validar();
    }
    validar() {
        if (!this._nombreCompleto?.trim())
            throw new DomainException(MENSAJES.EXCEPCIONES.COMUNES.NOMBRE_OBLIGATORIO);
        if (!this._email?.includes('@'))
            throw new DomainException(MENSAJES.EXCEPCIONES.COMUNES.EMAIL_INVALIDO);
        if (!this._vehiculoPlaca?.trim())
            throw new DomainException(MENSAJES.EXCEPCIONES.CONDUCTORES.PLACA_OBLIGATORIA);
    }
}
//# sourceMappingURL=conductor.entity.js.map