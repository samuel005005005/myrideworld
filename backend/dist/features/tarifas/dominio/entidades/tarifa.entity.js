import { EstadosTarifa } from '../../../../compartidos/constantes/estados-tarifa.enum.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
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
            throw new DomainException(MENSAJES.EXCEPCIONES.TARIFAS.PRECIO_MAYOR_CERO);
        if (!this._origen || !this._destino)
            throw new DomainException(MENSAJES.EXCEPCIONES.TARIFAS.ORIGEN_DESTINO_OBLIGATORIOS);
    }
}
//# sourceMappingURL=tarifa.entity.js.map