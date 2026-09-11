export class Configuracion {
    _id;
    _clave;
    _valor;
    _descripcion;
    _actualizadoEn;
    constructor(props) {
        this._id = props.id ?? crypto.randomUUID();
        this._clave = props.clave;
        this._valor = props.valor;
        this._descripcion = props.descripcion ?? '';
        this._actualizadoEn = props.actualizadoEn ?? new Date();
        this.validar();
    }
    static crear(props) {
        return new Configuracion(props);
    }
    get id() { return this._id; }
    get clave() { return this._clave; }
    get valor() { return this._valor; }
    get descripcion() { return this._descripcion; }
    get actualizadoEn() { return this._actualizadoEn; }
    actualizarValor(nuevoValor) {
        if (!nuevoValor)
            throw new Error('El valor no puede estar vacío.');
        this._valor = nuevoValor;
        this._actualizadoEn = new Date();
    }
    validar() {
        if (!this._clave)
            throw new Error('La clave es obligatoria.');
        if (!this._valor)
            throw new Error('El valor es obligatorio.');
    }
}
//# sourceMappingURL=configuracion.entity.js.map