import { ZonaTarifaProps } from './zona-tarifa.props.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

export class ZonaTarifa {
  private readonly _id: string;
  private _nombre: string;
  private _activa: boolean;
  private readonly _fechaRegistro: Date;

  private constructor(props: ZonaTarifaProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._nombre = props.nombre.trim();
    this._activa = props.activa ?? true;
    this._fechaRegistro = props.fechaRegistro ?? new Date();
    this.validar();
  }

  static crear(props: ZonaTarifaProps): ZonaTarifa {
    return new ZonaTarifa(props);
  }

  get id(): string {
    return this._id;
  }
  get nombre(): string {
    return this._nombre;
  }
  get activa(): boolean {
    return this._activa;
  }
  get fechaRegistro(): Date {
    return this._fechaRegistro;
  }

  renombrar(nombre: string): void {
    this._nombre = nombre.trim();
    this.validar();
  }

  activar(): void {
    this._activa = true;
  }

  desactivar(): void {
    this._activa = false;
  }

  private validar(): void {
    if (!this._nombre) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.TARIFAS.ORIGEN_DESTINO_OBLIGATORIOS,
      );
    }
  }
}
