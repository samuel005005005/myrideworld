import { CalificacionProps } from './calificacion.props.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';

export class Calificacion {
  private readonly _id: string;
  private _viajeId: string;
  private _pasajeroId: string;
  private _conductorId: string;
  private _puntuacion: number;
  private _comentario: string | null;
  private readonly _fecha: Date;

  private constructor(props: CalificacionProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._viajeId = props.viajeId;
    this._pasajeroId = props.pasajeroId;
    this._conductorId = props.conductorId;
    this._puntuacion = props.puntuacion;
    this._comentario = props.comentario ?? null;
    this._fecha = props.fecha ?? new Date();

    this.validar();
  }

  static crear(props: CalificacionProps): Calificacion {
    return new Calificacion(props);
  }

  get id(): string { return this._id; }
  get viajeId(): string { return this._viajeId; }
  get pasajeroId(): string { return this._pasajeroId; }
  get conductorId(): string { return this._conductorId; }
  get puntuacion(): number { return this._puntuacion; }
  get comentario(): string | null { return this._comentario; }
  get fecha(): Date { return this._fecha; }

  private validar(): void {
    if (this._puntuacion < 1 || this._puntuacion > 5) {
      throw new DomainException(MENSAJES.EXCEPCIONES.CALIFICACIONES.RANGO_PUNTUACION);
    }
  }
}
