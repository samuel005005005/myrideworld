import { ConductorProps } from './conductor.props.js';

export class Conductor {
  private readonly _id: string;
  private _nombreCompleto: string;
  private _email: string;
  private _telefono: string;
  private _passwordHash: string;
  private _fotoUrl: string | null;
  private _vehiculoMarca: string;
  private _vehiculoModelo: string;
  private _vehiculoColor: string;
  private _vehiculoPlaca: string;
  private _estadoAprobacion: string;
  private _estadoDisponibilidad: string;
  private _ultimaUbicacionLat: number | null;
  private _ultimaUbicacionLng: number | null;

  private constructor(props: ConductorProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._nombreCompleto = props.nombreCompleto;
    this._email = props.email;
    this._telefono = props.telefono;
    this._passwordHash = props.passwordHash;
    this._fotoUrl = props.fotoUrl ?? null;
    this._vehiculoMarca = props.vehiculoMarca;
    this._vehiculoModelo = props.vehiculoModelo;
    this._vehiculoColor = props.vehiculoColor;
    this._vehiculoPlaca = props.vehiculoPlaca;
    this._estadoAprobacion = props.estadoAprobacion ?? 'Pendiente';
    this._estadoDisponibilidad = props.estadoDisponibilidad ?? 'Desconectado';
    this._ultimaUbicacionLat = props.ultimaUbicacionLat ?? null;
    this._ultimaUbicacionLng = props.ultimaUbicacionLng ?? null;

    this.validar();
  }

  static crear(props: ConductorProps): Conductor {
    return new Conductor(props);
  }

  get id(): string { return this._id; }
  get nombreCompleto(): string { return this._nombreCompleto; }
  get email(): string { return this._email; }
  get telefono(): string { return this._telefono; }
  get passwordHash(): string { return this._passwordHash; }
  get fotoUrl(): string | null { return this._fotoUrl; }
  get vehiculoMarca(): string { return this._vehiculoMarca; }
  get vehiculoModelo(): string { return this._vehiculoModelo; }
  get vehiculoColor(): string { return this._vehiculoColor; }
  get vehiculoPlaca(): string { return this._vehiculoPlaca; }
  get estadoAprobacion(): string { return this._estadoAprobacion; }
  get estadoDisponibilidad(): string { return this._estadoDisponibilidad; }
  get ultimaUbicacionLat(): number | null { return this._ultimaUbicacionLat; }
  get ultimaUbicacionLng(): number | null { return this._ultimaUbicacionLng; }

  aprobar(): void {
    this._estadoAprobacion = 'Aprobado';
  }

  private validar(): void {
    if (!this._nombreCompleto?.trim()) throw new Error('El nombre es obligatorio.');
    if (!this._email?.includes('@')) throw new Error('El email no es válido.');
    if (!this._vehiculoPlaca?.trim()) throw new Error('La placa del vehículo es obligatoria.');
  }
}
