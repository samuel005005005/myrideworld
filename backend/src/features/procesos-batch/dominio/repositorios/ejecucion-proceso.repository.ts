import { EjecucionProceso } from '../entidades/ejecucion-proceso.entity.js';
import { DetalleEjecucionProceso } from '../entidades/detalle-ejecucion.entity.js';

export interface IEjecucionProcesoRepository {
  guardarEjecucion(ejecucion: EjecucionProceso): Promise<EjecucionProceso>;
  guardarDetalle(detalle: DetalleEjecucionProceso): Promise<DetalleEjecucionProceso>;
}

export const EJECUCION_PROCESO_REPOSITORY = Symbol('IEjecucionProcesoRepository');
