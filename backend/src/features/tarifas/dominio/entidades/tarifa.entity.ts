import { TarifaProps } from './tarifa.props.js';
import { EstadosTarifa } from '../../../../compartidos/constantes/estados-tarifa.enum.js';

export class Tarifa {
  private readonly _id: string;
  private _origen: string;
  private _destino: string;
  private _precio: number;
  private _estado: EstadosTarifa;

  private constructor(props: TarifaProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._origen = props.origen;
    this._destino = props.destino;
    this._precio = props.precio;
    this._estado = props.estado ?? EstadosTarifa.ACTIVO;

    this.validar();
  }

  static crear(props: TarifaProps): Tarifa {
    return new Tarifa(props);
  }

  get id(): string { return this._id; }
  get origen(): string { return this._origen; }
  get destino(): string { return this._destino; }
  get precio(): number { return this._precio; }
  get estado(): EstadosTarifa { return this._estado; }

  private validar(): void {
    if (this._precio <= 0) throw new Error('El precio debe ser mayor a cero.');
    if (!this._origen || !this._destino) throw new Error('Origen y destino son obligatorios.');
  }
}
