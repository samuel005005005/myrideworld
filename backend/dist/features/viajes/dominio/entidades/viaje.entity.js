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
    constructor(props) {
        this._id = props.id ?? crypto.randomUUID();
        this._pasajeroId = props.pasajeroId;
        this._conductorId = props.conductorId ?? null;
        this._origenLat = props.origenLat;
        this._origenLng = props.origenLng;
        this._destinoLat = props.destinoLat;
        this._destinoLng = props.destinoLng;
        this._estado = props.estado ?? 'Solicitado';
        this._tarifaEstimada = props.tarifaEstimada;
        this._metodoPago = props.metodoPago ?? null;
        this._canceladoPor = props.canceladoPor ?? null;
        this._motivoCancelacion = props.motivoCancelacion ?? null;
        this._fechaSolicitud = props.fechaSolicitud ?? new Date();
        this._fechaInicio = props.fechaInicio ?? null;
        this._fechaFin = props.fechaFin ?? null;
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
    asignarConductor(conductorId) {
        if (this._estado !== 'Solicitado' && this._estado !== 'Buscando') {
            throw new Error('El viaje no puede ser asignado en su estado actual.');
        }
        this._conductorId = conductorId;
        this._estado = 'Asignado';
    }
    marcarLlegada() {
        if (this._estado !== 'Asignado' && this._estado !== 'EnCamino') {
            throw new Error('El viaje debe estar asignado para poder marcar la llegada del conductor.');
        }
        this._estado = 'Llego';
    }
    iniciarViaje() {
        if (this._estado !== 'EnCamino' && this._estado !== 'Llego' && this._estado !== 'Asignado') {
            throw new Error('El viaje no puede ser iniciado.');
        }
        this._estado = 'EnCurso';
        this._fechaInicio = new Date();
    }
    completarViaje() {
        completarViaje();
        void {
            : ._estado !== 'EnCurso'
        };
        {
            throw new Error('El viaje debe estar en curso para ser completado.');
        }
        this._estado = 'Completado';
        this._fechaFin = new Date();
    }
    cancelar(actor, motivo) {
        if (this._estado === 'Completado' || this._estado === 'Cancelado') {
            throw new Error('El viaje no puede ser cancelado en su estado actual.');
        }
        this._estado = 'Cancelado';
        this._canceladoPor = actor;
        this._motivoCancelacion = motivo ?? null;
        this._fechaFin = new Date();
    }
    validar() {
        if (!this._pasajeroId)
            throw new Error('El ID del pasajero es obligatorio.');
        if (this._tarifaEstimada < 0)
            throw new Error('La tarifa no puede ser negativa.');
    }
}
//# sourceMappingURL=viaje.entity.js.map