import { EjecucionProcesoProps } from './ejecucion-proceso.props.js';
import { EstadosEjecucion } from '../../../../compartidos/constantes/estados-ejecucion.enum.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const E = MENSAJES.EXCEPCIONES.PROCESOS_BATCH;

export class EjecucionProceso {
  private readonly _id: string;
  private readonly _proceso: string;
  private _estado: EstadosEjecucion;
  private readonly _fechaInicio: Date;
  private _fechaFin: Date | null;
  private readonly _totalRegistros: number;
  private _registrosProcesados: number;
  private _registrosError: number;
  private _detalle: string | null;
  private readonly _usuario: string;

  private constructor(props: EjecucionProcesoProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._proceso = props.proceso;
    this._estado = props.estado ?? EstadosEjecucion.EN_PROCESO;
    this._fechaInicio = props.fechaInicio ?? new Date();
    this._fechaFin = props.fechaFin ?? null;
    this._totalRegistros = props.totalRegistros;
    this._registrosProcesados = props.registrosProcesados ?? 0;
    this._registrosError = props.registrosError ?? 0;
    this._detalle = props.detalle ?? null;
    this._usuario = props.usuario;

    this.validar();
  }

  static iniciar(proceso: string, totalRegistros: number, usuario: string): EjecucionProceso {
    return new EjecucionProceso({ proceso, totalRegistros, usuario });
  }

  static reconstituir(props: EjecucionProcesoProps): EjecucionProceso {
    return new EjecucionProceso(props);
  }

  get id(): string { return this._id; }
  get proceso(): string { return this._proceso; }
  get estado(): EstadosEjecucion { return this._estado; }
  get fechaInicio(): Date { return this._fechaInicio; }
  get fechaFin(): Date | null { return this._fechaFin; }
  get totalRegistros(): number { return this._totalRegistros; }
  get registrosProcesados(): number { return this._registrosProcesados; }
  get registrosError(): number { return this._registrosError; }
  get detalle(): string | null { return this._detalle; }
  get usuario(): string { return this._usuario; }

  registrarExito(): void {
    this._registrosProcesados++;
  }

  registrarError(): void {
    this._registrosError++;
  }

  finalizar(): void {
    this._fechaFin = new Date();
    if (this._registrosError === 0 && this._registrosProcesados === this._totalRegistros) {
      this._estado = EstadosEjecucion.EXITOSO;
      this._detalle = 'Proceso completado exitosamente';
    } else if (this._registrosError > 0 && this._registrosProcesados > 0) {
      this._estado = EstadosEjecucion.PARCIAL;
      this._detalle = `Procesados: ${this._registrosProcesados}, Errores: ${this._registrosError}`;
    } else {
      this._estado = EstadosEjecucion.ERROR;
      this._detalle = `Fallaron todos los registros (${this._registrosError})`;
    }
  }

  marcarComoErrorCritico(detalleError: string): void {
    this._estado = EstadosEjecucion.ERROR;
    this._fechaFin = new Date();
    this._detalle = detalleError;
  }

  private validar(): void {
    if (!this._proceso) throw new DomainException(E.PROCESO_OBLIGATORIO);
    if (this._totalRegistros < 0) throw new DomainException(E.TOTAL_REGISTROS_NEGATIVO);
  }
}
