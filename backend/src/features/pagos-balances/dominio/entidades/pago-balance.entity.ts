import { PagoBalanceProps } from './pago-balance.props.js';

export class PagoBalance {
  private readonly _id: string;
  private readonly _viajeId: string;
  private readonly _conductorId: string;
  private readonly _montoBruto: number;
  private readonly _feeProcesamiento: number;
  private readonly _montoNeto: number;
  private readonly _metodo: string;
  private readonly _fecha: Date;

  private constructor(props: PagoBalanceProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._viajeId = props.viajeId;
    this._conductorId = props.conductorId;
    this._montoBruto = props.montoBruto;
    this._feeProcesamiento = props.feeProcesamiento ?? 0;
    this._montoNeto = props.montoNeto;
    this._metodo = props.metodo;
    this._fecha = props.fecha ?? new Date();

    this.validar();
  }

  static crear(props: PagoBalanceProps): PagoBalance {
    return new PagoBalance(props);
  }

  get id(): string { return this._id; }
  get viajeId(): string { return this._viajeId; }
  get conductorId(): string { return this._conductorId; }
  get montoBruto(): number { return this._montoBruto; }
  get feeProcesamiento(): number { return this._feeProcesamiento; }
  get montoNeto(): number { return this._montoNeto; }
  get metodo(): string { return this._metodo; }
  get fecha(): Date { return this._fecha; }

  private validar(): void {
    if (!this._viajeId) throw new Error('El ID del viaje es obligatorio.');
    if (!this._conductorId) throw new Error('El ID del conductor es obligatorio.');
    if (this._montoNeto < 0) throw new Error('El monto neto no puede ser negativo.');
  }
}
