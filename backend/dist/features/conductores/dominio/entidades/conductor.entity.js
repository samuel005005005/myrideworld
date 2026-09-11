import { EstadosConductor, EstadosDisponibilidadConductor } from '../../../../compartidos/constantes/estados-conductor.enum.js';
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
    get estadoAprobacion() { return this._estadoAprobacion; }
    get estadoDisponibilidad() { return this._estadoDisponibilidad; }
    get ultimaUbicacionLat() { return this._ultimaUbicacionLat; }
    get ultimaUbicacionLng() { return this._ultimaUbicacionLng; }
    aprobar() {
        this._estadoAprobacion = EstadosConductor.APROBADO;
    }
    validar() {
        if (!this._nombreCompleto?.trim())
            throw new Error('El nombre es obligatorio.');
        if (!this._email?.includes('@'))
            throw new Error('El email no es válido.');
        if (!this._vehiculoPlaca?.trim())
            throw new Error('La placa del vehículo es obligatoria.');
    }
}
//# sourceMappingURL=conductor.entity.js.map