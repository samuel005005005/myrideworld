import { EstadosTarifa } from '../../../../compartidos/constantes/estados-tarifa.enum.js';
export class Tarifa {
    _id;
    _origen;
    _destino;
    _precio;
    _estado;
    constructor(props) {
        this._id = props.id ?? crypto.randomUUID();
        this._origen = props.origen;
        this._destino = props.destino;
        this._precio = props.precio;
        this._estado = props.estado ?? EstadosTarifa.ACTIVO;
        this.validar();
    }
    static crear(props) {
        return new Tarifa(props);
    }
    get id() { return this._id; }
    get origen() { return this._origen; }
    get destino() { return this._destino; }
    get precio() { return this._precio; }
    get estado() { return this._estado; }
    validar() {
        if (this._precio <= 0)
            throw new Error('El precio debe ser mayor a cero.');
        if (!this._origen || !this._destino)
            throw new Error('Origen y destino son obligatorios.');
    }
}
//# sourceMappingURL=tarifa.entity.js.map