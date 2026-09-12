import { TarifaProps } from './tarifa.props.js';
import { EstadosTarifa } from '../../../../compartidos/constantes/estados-tarifa.enum.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

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

  actualizar(datos: {
    origen?: string;
    destino?: string;
    precio?: number;
    estado?: EstadosTarifa;
  }): void {
    if (datos.origen !== undefined) this._origen = datos.origen;
    if (datos.destino !== undefined) this._destino = datos.destino;
    if (datos.precio !== undefined) this._precio = datos.precio;
    if (datos.estado !== undefined) this._estado = datos.estado;
    this.validar();
  }

  private validar(): void {
    if (this._precio <= 0) throw new DomainException(MENSAJES.EXCEPCIONES.TARIFAS.PRECIO_MAYOR_CERO);
    if (!this._origen || !this._destino) throw new DomainException(MENSAJES.EXCEPCIONES.TARIFAS.ORIGEN_DESTINO_OBLIGATORIOS);
  }
}
