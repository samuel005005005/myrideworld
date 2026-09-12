import type { ViajeDisponibleNotificacion } from './viaje-disponible-notificacion.js';
import type { ViajeAceptadoNotificacion } from './viaje-aceptado-notificacion.js';

export interface INotificadorViaje {
  notificarNuevoViaje(
    conductorId: string,
    viaje: ViajeDisponibleNotificacion,
  ): void;
  notificarViajeAceptado(notificacion: ViajeAceptadoNotificacion): void;
  notificarConductorLlego(viajeId: string): void;
  notificarViajeCancelado(
    viajeId: string,
    actor: string,
    motivo: string | undefined,
  ): void;
  notificarViajeIniciado(viajeId: string): void;
  notificarViajeCompletado(viajeId: string, tarifaEstimada: number): void;
}

export const NOTIFICADOR_VIAJE = Symbol('INotificadorViaje');
