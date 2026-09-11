import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
export class Viaje {
    _id;
    _pasajeroId;
    _conductorId;
    _origenLat;
    _origenLng;
    _destinoLat;
    _destinoLng;
    _estado;
    _tarifaEstimada;
    _metodoPago;
    _canceladoPor;
    _motivoCancelacion;
    _fechaSolicitud;
    _fechaInicio;
    _fechaFin;
    _conductoresRechazados;
    constructor(props) {
        this._id = props.id ?? crypto.randomUUID();
        this._pasajeroId = props.pasajeroId;
        this._conductorId = props.conductorId ?? null;
        this._origenLat = props.origenLat;
        this._origenLng = props.origenLng;
        this._destinoLat = props.destinoLat;
        this._destinoLng = props.destinoLng;
        this._estado = props.estado ?? EstadosViaje.SOLICITADO;
        this._tarifaEstimada = props.tarifaEstimada;
        this._metodoPago = props.metodoPago ?? null;
        this._canceladoPor = props.canceladoPor ?? null;
        this._motivoCancelacion = props.motivoCancelacion ?? null;
        this._fechaSolicitud = props.fechaSolicitud ?? new Date();
        this._fechaInicio = props.fechaInicio ?? null;
        this._fechaFin = props.fechaFin ?? null;
        this._conductoresRechazados = props.conductoresRechazados ?? [];
        this.validar();
    }
    static solicitar(props) {
        return new Viaje(props);
    }
    get id() { return this._id; }
    get pasajeroId() { return this._pasajeroId; }
    get conductorId() { return this._conductorId; }
    get origenLat() { return this._origenLat; }
    get origenLng() { return this._origenLng; }
    get destinoLat() { return this._destinoLat; }
    get destinoLng() { return this._destinoLng; }
    get estado() { return this._estado; }
    get tarifaEstimada() { return this._tarifaEstimada; }
    get metodoPago() { return this._metodoPago; }
    get canceladoPor() { return this._canceladoPor; }
    get motivoCancelacion() { return this._motivoCancelacion; }
    get fechaSolicitud() { return this._fechaSolicitud; }
    get fechaInicio() { return this._fechaInicio; }
    get fechaFin() { return this._fechaFin; }
    get conductoresRechazados() { return this._conductoresRechazados; }
    asignarConductor(conductorId) {
        if (this._estado !== EstadosViaje.SOLICITADO && this._estado !== EstadosViaje.BUSCANDO) {
            throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_DISPONIBLE_ASIGNACION);
        }
        this._conductorId = conductorId;
        this._estado = EstadosViaje.ASIGNADO;
    }
    marcarLlegada() {
        if (this._estado !== EstadosViaje.ASIGNADO && this._estado !== EstadosViaje.EN_CAMINO) {
            throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.SOLO_ASIGNADO_CAMINO_LLEGADA);
        }
        this._estado = EstadosViaje.LLEGO;
    }
    iniciarViaje() {
        if (this._estado !== EstadosViaje.EN_CAMINO && this._estado !== EstadosViaje.LLEGO && this._estado !== EstadosViaje.ASIGNADO) {
            throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.SOLO_INICIO_VALIDO);
        }
        this._estado = EstadosViaje.EN_CURSO;
        this._fechaInicio = new Date();
    }
    completarViaje() {
        if (this._estado !== EstadosViaje.EN_CURSO) {
            throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.SOLO_CURSO_COMPLETAR);
        }
        this._estado = EstadosViaje.COMPLETADO;
        this._fechaFin = new Date();
    }
    cancelar(actor, motivo) {
        if (this._estado === EstadosViaje.COMPLETADO || this._estado === EstadosViaje.CANCELADO) {
            throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_CANCELABLE);
        }
        this._estado = EstadosViaje.CANCELADO;
        this._canceladoPor = actor;
        this._motivoCancelacion = motivo ?? null;
        this._fechaFin = new Date();
    }
    rechazar(conductorId) {
        if (this._estado !== EstadosViaje.SOLICITADO) {
            throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.SOLO_RECHAZABLE_SOLICITADO);
        }
        if (!this._conductoresRechazados.includes(conductorId)) {
            this._conductoresRechazados.push(conductorId);
        }
    }
    calcularTarifaEstimada() {
        if (!this._pasajeroId)
            throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.PASAJERO_ID_OBLIGATORIO);
        if (this._tarifaEstimada < 0)
            throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.TARIFA_NEGATIVA);
    }
    validar() {
        if (!this._pasajeroId)
            throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.PASAJERO_ID_OBLIGATORIO);
        if (this._tarifaEstimada < 0)
            throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.TARIFA_NEGATIVA);
    }
}
//# sourceMappingURL=viaje.entity.js.map