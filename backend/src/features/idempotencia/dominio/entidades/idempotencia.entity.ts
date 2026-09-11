export enum EstadoIdempotencia {
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADO = 'COMPLETADO',
  ERROR = 'ERROR'
}

export interface IdempotenciaProps {
  id?: string;
  llave: string;
  url: string;
  cuerpoPeticionHash?: string;
  respuesta?: any;
  codigoEstado?: number;
  estado?: EstadoIdempotencia;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export class Idempotencia {
  private readonly _id: string;
  private readonly _llave: string;
  private readonly _url: string;
  private _cuerpoPeticionHash?: string;
  private _respuesta?: any;
  private _codigoEstado?: number;
  private _estado: EstadoIdempotencia;
  private readonly _fechaCreacion: Date;
  private _fechaActualizacion: Date;

  private constructor(props: IdempotenciaProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._llave = props.llave;
    this._url = props.url;
    this._cuerpoPeticionHash = props.cuerpoPeticionHash;
    this._respuesta = props.respuesta;
    this._codigoEstado = props.codigoEstado;
    this._estado = props.estado ?? EstadoIdempotencia.EN_PROGRESO;
    this._fechaCreacion = props.fechaCreacion ?? new Date();
    this._fechaActualizacion = props.fechaActualizacion ?? new Date();

    this.validar();
  }

  static iniciar(llave: string, url: string, cuerpoPeticionHash?: string): Idempotencia {
    return new Idempotencia({
      llave,
      url,
      cuerpoPeticionHash,
      estado: EstadoIdempotencia.EN_PROGRESO,
    });
  }

  static reconstruir(props: IdempotenciaProps): Idempotencia {
    return new Idempotencia(props);
  }

  get id(): string { return this._id; }
  get llave(): string { return this._llave; }
  get url(): string { return this._url; }
  get cuerpoPeticionHash(): string | undefined { return this._cuerpoPeticionHash; }
  get respuesta(): any { return this._respuesta; }
  get codigoEstado(): number | undefined { return this._codigoEstado; }
  get estado(): EstadoIdempotencia { return this._estado; }
  get fechaCreacion(): Date { return this._fechaCreacion; }
  get fechaActualizacion(): Date { return this._fechaActualizacion; }

  completar(codigoEstado: number, respuesta: any): void {
    this._estado = EstadoIdempotencia.COMPLETADO;
    this._codigoEstado = codigoEstado;
    this._respuesta = respuesta;
    this._fechaActualizacion = new Date();
  }

  fallar(codigoEstado: number, respuestaError: any): void {
    this._estado = EstadoIdempotencia.ERROR;
    this._codigoEstado = codigoEstado;
    this._respuesta = respuestaError;
    this._fechaActualizacion = new Date();
  }

  private validar(): void {
    if (!this._llave?.trim()) {
      throw new Error('La llave de idempotencia es requerida.');
    }
  }
}
