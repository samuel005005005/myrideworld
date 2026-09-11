import { ViajeProps } from './viaje.props.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

export class Viaje {
  private readonly _id: string;
  private _pasajeroId: string;
  private _conductorId: string | null;
  private _origenLat: number;
  private _origenLng: number;
  private _destinoLat: number;
  private _destinoLng: number;
  private _estado: EstadosViaje;
  private _tarifaEstimada: number;
  private _metodoPago: string | null;
  private _canceladoPor: Roles | null;
  private _motivoCancelacion: string | null;
  private readonly _fechaSolicitud: Date;
  private _fechaInicio: Date | null;
  private _fechaFin: Date | null;
  private _conductoresRechazados: string[];

  private constructor(props: ViajeProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._pasajeroId = props.pasajeroId;
    this._conductorId = props.conductorId ?? null;
    this._origenLat = props.origenLat;
    this._origenLng = props.origenLng;
    this._destinoLat = props.destinoLat;
    this._destinoLng = props.destinoLng;
    this._estado = props.estado ?? EstadosViaje.SOLICITADO;
    this._tarifaEstimada = props.tarifaEstimada;
    this._metodoPago = props.metodoPago ?? null;
    this._canceladoPor = props.canceladoPor ?? null;
    this._motivoCancelacion = props.motivoCancelacion ?? null;
    this._fechaSolicitud = props.fechaSolicitud ?? new Date();
    this._fechaInicio = props.fechaInicio ?? null;
    this._fechaFin = props.fechaFin ?? null;
    this._conductoresRechazados = props.conductoresRechazados ?? [];

    this.validar();
  }

  static solicitar(props: ViajeProps): Viaje {
    return new Viaje(props);
  }

  get id(): string { return this._id; }
  get pasajeroId(): string { return this._pasajeroId; }
  get conductorId(): string | null { return this._conductorId; }
  get origenLat(): number { return this._origenLat; }
  get origenLng(): number { return this._origenLng; }
  get destinoLat(): number { return this._destinoLat; }
  get destinoLng(): number { return this._destinoLng; }
  get estado(): EstadosViaje { return this._estado; }
  get tarifaEstimada(): number { return this._tarifaEstimada; }
  get metodoPago(): string | null { return this._metodoPago; }
  get canceladoPor(): Roles | null { return this._canceladoPor; }
  get motivoCancelacion(): string | null { return this._motivoCancelacion; }
  get fechaSolicitud(): Date { return this._fechaSolicitud; }
  get fechaInicio(): Date | null { return this._fechaInicio; }
  get fechaFin(): Date | null { return this._fechaFin; }
  get conductoresRechazados(): string[] { return this._conductoresRechazados; }

  asignarConductor(conductorId: string): void {
    if (this._estado !== EstadosViaje.SOLICITADO && this._estado !== EstadosViaje.BUSCANDO) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_DISPONIBLE_ASIGNACION);
    }
    this._conductorId = conductorId;
    this._estado = EstadosViaje.ASIGNADO;
  }

  marcarLlegada(): void {
    if (this._estado !== EstadosViaje.ASIGNADO && this._estado !== EstadosViaje.EN_CAMINO) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.SOLO_ASIGNADO_CAMINO_LLEGADA);
    }
    this._estado = EstadosViaje.LLEGO;
  }

  iniciarViaje(): void {
    if (this._estado !== EstadosViaje.EN_CAMINO && this._estado !== EstadosViaje.LLEGO && this._estado !== EstadosViaje.ASIGNADO) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.SOLO_INICIO_VALIDO);
    }
    this._estado = EstadosViaje.EN_CURSO;
    this._fechaInicio = new Date();
  }

  completarViaje(): void {
    if (this._estado !== EstadosViaje.EN_CURSO) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.SOLO_CURSO_COMPLETAR);
    }
    this._estado = EstadosViaje.COMPLETADO;
    this._fechaFin = new Date();
  }

  cancelar(actor: Roles, motivo?: string): void {
    if (this._estado === EstadosViaje.COMPLETADO || this._estado === EstadosViaje.CANCELADO) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_CANCELABLE);
    }
    this._estado = EstadosViaje.CANCELADO;
    this._canceladoPor = actor;
    this._motivoCancelacion = motivo ?? null;
    this._fechaFin = new Date();
  }

  rechazar(conductorId: string): void {
    if (this._estado !== EstadosViaje.SOLICITADO) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.SOLO_RECHAZABLE_SOLICITADO);
    }
    if (!this._conductoresRechazados.includes(conductorId)) {
      this._conductoresRechazados.push(conductorId);
    }
  }

  private calcularTarifaEstimada(): void {
    if (!this._pasajeroId) throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.PASAJERO_ID_OBLIGATORIO);
    if (this._tarifaEstimada < 0) throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.TARIFA_NEGATIVA);
  }

  private validar(): void {
    if (!this._pasajeroId) throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.PASAJERO_ID_OBLIGATORIO);
    if (this._tarifaEstimada < 0) throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.TARIFA_NEGATIVA);
  }
}
