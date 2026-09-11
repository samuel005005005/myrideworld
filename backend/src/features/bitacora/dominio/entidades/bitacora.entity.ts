import { BitacoraProps } from './bitacora.props.js';
import { TiposBitacora } from '../../../../compartidos/constantes/tipos-bitacora.enum.js';
import { ServiciosSistema } from '../../../../compartidos/constantes/servicios-sistema.enum.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const E = MENSAJES.EXCEPCIONES.BITACORA;

export class Bitacora {
  private readonly _id: string;
  private readonly _tipoEvento: TiposBitacora;
  private readonly _servicioSistema: ServiciosSistema;
  private readonly _detalle: string;
  private readonly _criterioConsulta: Record<string, any> | null;
  private readonly _request: Record<string, any> | null;
  private readonly _response: Record<string, any> | null;
  private readonly _usuario: string;
  private readonly _fecha: Date;
  private readonly _ip: string | null;
  private readonly _entidadId: string | null;
  private readonly _accion: string;
  private readonly _duracionMs: number | null;

  private constructor(props: BitacoraProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._tipoEvento = props.tipoEvento;
    this._servicioSistema = props.servicioSistema;
    this._detalle = props.detalle;
    this._criterioConsulta = props.criterioConsulta ?? null;
    this._request = props.request ?? null;
    this._response = props.response ?? null;
    this._usuario = props.usuario;
    this._fecha = props.fecha ?? new Date();
    this._ip = props.ip ?? null;
    this._entidadId = props.entidadId ?? null;
    this._accion = props.accion;
    this._duracionMs = props.duracionMs ?? null;

    this.validar();
  }

  static registrar(props: BitacoraProps): Bitacora {
    return new Bitacora(props);
  }

  get id(): string { return this._id; }
  get tipoEvento(): TiposBitacora { return this._tipoEvento; }
  get servicioSistema(): ServiciosSistema { return this._servicioSistema; }
  get detalle(): string { return this._detalle; }
  get criterioConsulta(): Record<string, any> | null { return this._criterioConsulta; }
  get request(): Record<string, any> | null { return this._request; }
  get response(): Record<string, any> | null { return this._response; }
  get usuario(): string { return this._usuario; }
  get fecha(): Date { return this._fecha; }
  get ip(): string | null { return this._ip; }
  get entidadId(): string | null { return this._entidadId; }
  get accion(): string { return this._accion; }
  get duracionMs(): number | null { return this._duracionMs; }

  private validar(): void {
    if (!this._detalle?.trim()) throw new DomainException(E.DETALLE_OBLIGATORIO);
    if (!this._usuario?.trim()) throw new DomainException(E.USUARIO_OBLIGATORIO);
    if (!this._accion?.trim()) throw new DomainException(E.ACCION_OBLIGATORIA);
  }
}
