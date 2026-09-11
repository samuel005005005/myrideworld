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
        this._estado = props.estado ?? 'Activo';
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
    validar() {
        if (!this._nombreCompleto?.trim()) {
            throw new Error('El nombre es obligatorio.');
        }
        if (!this._email?.includes('@')) {
            throw new Error('El email no es válido.');
        }
    }
}
//# sourceMappingURL=pasajero.entity.js.map