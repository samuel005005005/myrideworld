export class EstimacionTarifaResultado {
  constructor(
    readonly precio: number,
    readonly distanciaKm: number,
    readonly tarifaId: string,
  ) {}
}
