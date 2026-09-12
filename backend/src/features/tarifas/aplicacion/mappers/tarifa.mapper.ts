import { EstimacionTarifaResultado } from '../dto/estimacion-tarifa-resultado.js';
import { Tarifa } from '../../dominio/entidades/tarifa.entity.js';

export class TarifaMapper {
  static toEstimacionResponse(resultado: EstimacionTarifaResultado) {
    return {
      precio: resultado.precio,
      distanciaKm: Math.round(resultado.distanciaKm * 100) / 100,
      tarifaId: resultado.tarifaId,
    };
  }

  static toResponse(tarifa: Tarifa) {
    return {
      id: tarifa.id,
      origen: tarifa.origen,
      destino: tarifa.destino,
      precio: Number(tarifa.precio),
      estado: tarifa.estado,
    };
  }
}
