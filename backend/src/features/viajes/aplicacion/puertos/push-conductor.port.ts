import type { ViajeDisponibleNotificacion } from './viaje-disponible-notificacion.js';

export interface IPushConductor {
  enviarOfertaViaje(
    conductorId: string,
    viaje: ViajeDisponibleNotificacion,
  ): Promise<void>;
  cancelarOfertaViaje(conductorId: string, viajeId: string): Promise<void>;
}

export const PUSH_CONDUCTOR = Symbol('IPushConductor');
