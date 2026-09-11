import { EstadosPasajero } from '../../../../compartidos/constantes/estados-pasajero.enum.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
export class Pasajero {
    _id;
    _nombreCompleto;
    _email;
    _telefono;
    _passwordHash;
    _fechaRegistro;
    _estado;
    constructor(props) {
        this._id = props.id ?? crypto.randomUUID();
        this._nombreCompleto = props.nombreCompleto;
        this._email = props.email;
        this._telefono = props.telefono;
        this._passwordHash = props.passwordHash;
        this._fechaRegistro = props.fechaRegistro ?? new Date();
        this._estado = props.estado ?? EstadosPasajero.ACTIVO;
        this.validar();
    }
    static crear(props) {
        return new Pasajero(props);
    }
    get id() { return this._id; }
    get nombreCompleto() { return this._nombreCompleto; }
    get email() { return this._email; }
    get estado() { return this._estado; }
    get telefono() { return this._telefono; }
    get passwordHash() { return this._passwordHash; }
    get fechaRegistro() { return this._fechaRegistro; }
    actualizarPerfil(datos) {
        if (datos.nombreCompleto)
            this._nombreCompleto = datos.nombreCompleto;
        if (datos.telefono)
            this._telefono = datos.telefono;
        this.validar();
    }
    validar() {
        if (!this._nombreCompleto?.trim()) {
            throw new DomainException(MENSAJES.EXCEPCIONES.COMUNES.NOMBRE_OBLIGATORIO);
        }
        if (!this._email?.includes('@')) {
            throw new DomainException(MENSAJES.EXCEPCIONES.COMUNES.EMAIL_INVALIDO);
        }
    }
}
//# sourceMappingURL=pasajero.entity.js.map