import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
export class PagoBalance {
    _id;
    _viajeId;
    _conductorId;
    _montoBruto;
    _feeProcesamiento;
    _montoNeto;
    _metodo;
    _fecha;
    constructor(props) {
        this._id = props.id ?? crypto.randomUUID();
        this._viajeId = props.viajeId;
        this._conductorId = props.conductorId;
        this._montoBruto = props.montoBruto;
        this._feeProcesamiento = props.feeProcesamiento ?? 0;
        this._montoNeto = props.montoNeto;
        this._metodo = props.metodo;
        this._fecha = props.fecha ?? new Date();
        this.validar();
    }
    static crear(props) {
        return new PagoBalance(props);
    }
    get id() { return this._id; }
    get viajeId() { return this._viajeId; }
    get conductorId() { return this._conductorId; }
    get montoBruto() { return this._montoBruto; }
    get feeProcesamiento() { return this._feeProcesamiento; }
    get montoNeto() { return this._montoNeto; }
    get metodo() { return this._metodo; }
    get fecha() { return this._fecha; }
    validar() {
        if (!this._viajeId)
            throw new DomainException(MENSAJES.EXCEPCIONES.PAGOS_BALANCES.VIAJE_ID_OBLIGATORIO);
        if (!this._conductorId)
            throw new DomainException(MENSAJES.EXCEPCIONES.PAGOS_BALANCES.CONDUCTOR_ID_OBLIGATORIO);
        if (this._montoNeto < 0)
            throw new DomainException(MENSAJES.EXCEPCIONES.PAGOS_BALANCES.MONTO_NETO_NEGATIVO);
    }
}
//# sourceMappingURL=pago-balance.entity.js.map