import { ViajeProps } from './viaje.props.js';

export class Viaje {
  private readonly _id: string;
  private _pasajeroId: string;
  private _conductorId: string | null;
  private _origenLat: number;
  private _origenLng: number;
  private _destinoLat: number;
  private _destinoLng: number;
  private _estado: string;
  private _tarifaEstimada: number;
  private _metodoPago: string | null;
  private _canceladoPor: string | null;
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
    this._estado = props.estado ?? 'Solicitado';
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
  get estado(): string { return this._estado; }
  get tarifaEstimada(): number { return this._tarifaEstimada; }
  get metodoPago(): string | null { return this._metodoPago; }
  get canceladoPor(): string | null { return this._canceladoPor; }
  get motivoCancelacion(): string | null { return this._motivoCancelacion; }
  get fechaSolicitud(): Date { return this._fechaSolicitud; }
  get fechaInicio(): Date | null { return this._fechaInicio; }
  get fechaFin(): Date | null { return this._fechaFin; }

  asignarConductor(conductorId: string): void {
    if (this._estado !== 'Solicitado' && this._estado !== 'Buscando') {
      throw new Error('El viaje no puede ser asignado en su estado actual.');
    }
    this._conductorId = conductorId;
    this._estado = 'Asignado';
  }

  marcarLlegada(): void {
    if (this._estado !== 'Asignado' && this._estado !== 'EnCamino') {
      throw new Error('El viaje debe estar asignado para poder marcar la llegada del conductor.');
    }
    this._estado = 'Llego';
  }

  iniciarViaje(): void {
    if (this._estado !== 'EnCamino' && this._estado !== 'Llego' && this._estado !== 'Asignado') {
      throw new Error('El viaje no puede ser iniciado.');
    }
    this._estado = 'EnCurso';
    this._fechaInicio = new Date();
  }

  completarViaje(): void {
  completarViaje(): void {
    if (this._estado !== 'EnCurso') {
      throw new Error('El viaje debe estar en curso para ser completado.');
    }
    this._estado = 'Completado';
    this._fechaFin = new Date();
  }

  cancelar(actor: 'PASAJERO' | 'CONDUCTOR', motivo?: string): void {
    if (this._estado === 'Completado' || this._estado === 'Cancelado') {
      throw new Error('El viaje no puede ser cancelado en su estado actual.');
    }
    this._estado = 'Cancelado';
    this._canceladoPor = actor;
    this._motivoCancelacion = motivo ?? null;
    this._fechaFin = new Date();
  }

  private validar(): void {
    if (!this._pasajeroId) throw new Error('El ID del pasajero es obligatorio.');
    if (this._tarifaEstimada < 0) throw new Error('La tarifa no puede ser negativa.');
  }
}
