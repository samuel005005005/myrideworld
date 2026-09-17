import { TiposViajeTarifa } from '../../../../compartidos/constantes/tipos-viaje-tarifa.enum.js';

export class EstimacionTarifaResultado {
  constructor(
    readonly precio: number,
    readonly distanciaKm: number,
    readonly tarifaId: string,
    readonly tipoViaje: TiposViajeTarifa,
  ) {}
}
