import { DetalleEjecucionProcesoProps } from './detalle-ejecucion.props.js';
import { EstadosEjecucion } from '../../../../compartidos/constantes/estados-ejecucion.enum.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const E = MENSAJES.EXCEPCIONES.PROCESOS_BATCH;

export class DetalleEjecucionProceso {
  private readonly _id: string;
  private readonly _ejecucionProcesoId: string;
  private readonly _entidadId: string | null;
  private _estado: EstadosEjecucion;
  private readonly _fechaRegistro: Date;
  private readonly _jsonGenerado: Record<string, any> | null;
  private _jsonRespuesta: Record<string, any> | null;
  private _traceback: string | null;
  private readonly _valorClave: string;

  private constructor(props: DetalleEjecucionProcesoProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._ejecucionProcesoId = props.ejecucionProcesoId;
    this._entidadId = props.entidadId ?? null;
    this._estado = props.estado ?? EstadosEjecucion.PENDIENTE;
    this._fechaRegistro = props.fechaRegistro ?? new Date();
    this._jsonGenerado = props.jsonGenerado ?? null;
    this._jsonRespuesta = props.jsonRespuesta ?? null;
    this._traceback = props.traceback ?? null;
    this._valorClave = props.valorClave;

    this.validar();
  }

  static registrar(props: DetalleEjecucionProcesoProps): DetalleEjecucionProceso {
    return new DetalleEjecucionProceso(props);
  }

  static reconstituir(props: DetalleEjecucionProcesoProps): DetalleEjecucionProceso {
    return new DetalleEjecucionProceso(props);
  }

  get id(): string { return this._id; }
  get ejecucionProcesoId(): string { return this._ejecucionProcesoId; }
  get entidadId(): string | null { return this._entidadId; }
  get estado(): EstadosEjecucion { return this._estado; }
  get fechaRegistro(): Date { return this._fechaRegistro; }
  get jsonGenerado(): Record<string, any> | null { return this._jsonGenerado; }
  get jsonRespuesta(): Record<string, any> | null { return this._jsonRespuesta; }
  get traceback(): string | null { return this._traceback; }
  get valorClave(): string { return this._valorClave; }

  marcarEnProceso(): void {
    this._estado = EstadosEjecucion.EN_PROCESO;
  }

  marcarExitoso(respuesta?: Record<string, any>): void {
    this._estado = EstadosEjecucion.EXITOSO;
    if (respuesta) this._jsonRespuesta = respuesta;
  }

  marcarError(errorMsg: string, stackTrace?: string): void {
    this._estado = EstadosEjecucion.ERROR;
    this._jsonRespuesta = { error: errorMsg };
    if (stackTrace) this._traceback = stackTrace;
  }

  private validar(): void {
    if (!this._ejecucionProcesoId) throw new DomainException(E.EJECUCION_ID_OBLIGATORIO);
    if (!this._valorClave) throw new DomainException(E.VALOR_CLAVE_OBLIGATORIO);
  }
}
