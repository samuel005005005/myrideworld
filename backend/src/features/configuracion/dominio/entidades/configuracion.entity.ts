import { ConfiguracionProps } from './configuracion.props.js';

export class Configuracion {
  private readonly _id: string;
  private readonly _clave: string;
  private _valor: string;
  private _descripcion: string;
  private _actualizadoEn: Date;

  private constructor(props: ConfiguracionProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._clave = props.clave;
    this._valor = props.valor;
    this._descripcion = props.descripcion ?? '';
    this._actualizadoEn = props.actualizadoEn ?? new Date();

    this.validar();
  }

  static crear(props: ConfiguracionProps): Configuracion {
    return new Configuracion(props);
  }

  get id(): string { return this._id; }
  get clave(): string { return this._clave; }
  get valor(): string { return this._valor; }
  get descripcion(): string { return this._descripcion; }
  get actualizadoEn(): Date { return this._actualizadoEn; }

  actualizarValor(nuevoValor: string): void {
    if (!nuevoValor) throw new Error('El valor no puede estar vacío.');
    this._valor = nuevoValor;
    this._actualizadoEn = new Date();
  }

  private validar(): void {
    if (!this._clave) throw new Error('La clave es obligatoria.');
    if (!this._valor) throw new Error('El valor es obligatorio.');
  }
}
