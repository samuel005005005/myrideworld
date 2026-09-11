import { ViajeProps } from './viaje.props.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';

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

  asignarConductor(conductorId: string): void {
    if (this._estado !== EstadosViaje.SOLICITADO && this._estado !== EstadosViaje.BUSCANDO) {
      throw new Error('El viaje no está disponible para asignación.');
    }
    this._conductorId = conductorId;
    this._estado = EstadosViaje.ASIGNADO;
  }

  marcarLlegada(): void {
    if (this._estado !== EstadosViaje.ASIGNADO && this._estado !== EstadosViaje.EN_CAMINO) {
      throw new Error('El viaje debe estar asignado o en camino para marcar llegada.');
    }
    this._estado = EstadosViaje.LLEGO;
  }

  iniciarViaje(): void {
    if (this._estado !== EstadosViaje.EN_CAMINO && this._estado !== EstadosViaje.LLEGO && this._estado !== EstadosViaje.ASIGNADO) {
      throw new Error('El conductor debe estar asignado, en camino o haber llegado para iniciar el viaje.');
    }
    this._estado = EstadosViaje.EN_CURSO;
    this._fechaInicio = new Date();
  }

  completarViaje(): void {
    if (this._estado !== EstadosViaje.EN_CURSO) {
      throw new Error('El viaje debe estar en curso para ser completado.');
    }
    this._estado = EstadosViaje.COMPLETADO;
    this._fechaFin = new Date();
  }

  cancelar(actor: Roles, motivo?: string): void {
    if (this._estado === EstadosViaje.COMPLETADO || this._estado === EstadosViaje.CANCELADO) {
      throw new Error('El viaje no puede ser cancelado en su estado actual.');
    }
    this._estado = EstadosViaje.CANCELADO;
    this._canceladoPor = actor;
    this._motivoCancelacion = motivo ?? null;
    this._fechaFin = new Date();
  }

  private validar(): void {
    if (!this._pasajeroId) throw new Error('El ID del pasajero es obligatorio.');
    if (this._tarifaEstimada < 0) throw new Error('La tarifa no puede ser negativa.');
  }
}
