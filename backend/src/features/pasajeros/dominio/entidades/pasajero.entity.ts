import { PasajeroProps } from './pasajero.props.js';

export class Pasajero {
  private readonly _id: string;
  private _nombreCompleto: string;
  private _email: string;
  private _telefono: string;
  private _passwordHash: string;
  private readonly _fechaRegistro: Date;
  private _estado: string;

  private constructor(props: PasajeroProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._nombreCompleto = props.nombreCompleto;
    this._email = props.email;
    this._telefono = props.telefono;
    this._passwordHash = props.passwordHash;
    this._fechaRegistro = props.fechaRegistro ?? new Date();
    this._estado = props.estado ?? 'Activo';

    this.validar();
  }

  static crear(props: PasajeroProps): Pasajero {
    return new Pasajero(props);
  }

  get id(): string { return this._id; }
  get nombreCompleto(): string { return this._nombreCompleto; }
  get email(): string { return this._email; }
  get estado(): string { return this._estado; }
  get telefono(): string { return this._telefono; }
  get passwordHash(): string { return this._passwordHash; }
  get fechaRegistro(): Date { return this._fechaRegistro; }

  private validar(): void {
    if (!this._nombreCompleto?.trim()) {
      throw new Error('El nombre es obligatorio.');
    }
    if (!this._email?.includes('@')) {
      throw new Error('El email no es válido.');
    }
  }
}
