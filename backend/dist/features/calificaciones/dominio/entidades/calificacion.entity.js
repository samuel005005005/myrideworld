export class Calificacion {
    _id;
    _viajeId;
    _pasajeroId;
    _conductorId;
    _puntuacion;
    _comentario;
    _fecha;
    constructor(props) {
        this._id = props.id ?? crypto.randomUUID();
        this._viajeId = props.viajeId;
        this._pasajeroId = props.pasajeroId;
        this._conductorId = props.conductorId;
        this._puntuacion = props.puntuacion;
        this._comentario = props.comentario ?? null;
        this._fecha = props.fecha ?? new Date();
        this.validar();
    }
    static crear(props) {
        return new Calificacion(props);
    }
    get id() { return this._id; }
    get viajeId() { return this._viajeId; }
    get pasajeroId() { return this._pasajeroId; }
    get conductorId() { return this._conductorId; }
    get puntuacion() { return this._puntuacion; }
    get comentario() { return this._comentario; }
    get fecha() { return this._fecha; }
    validar() {
        if (this._puntuacion < 1 || this._puntuacion > 5) {
            throw new Error('La puntuación debe estar entre 1 y 5.');
        }
    }
}
//# sourceMappingURL=calificacion.entity.js.map