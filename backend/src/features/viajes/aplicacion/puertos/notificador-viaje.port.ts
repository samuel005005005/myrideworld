import type { ViajeDisponibleNotificacion } from './viaje-disponible-notificacion.js';
import type { ViajeAceptadoNotificacion } from './viaje-aceptado-notificacion.js';
import type { ViajeCompletadoNotificacion } from './viaje-completado-notificacion.js';

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
    conductorId?: string | null,
  ): void;
  notificarViajeIniciado(viajeId: string): void;
  notificarViajeCompletado(notificacion: ViajeCompletadoNotificacion): void;
}

export const NOTIFICADOR_VIAJE = Symbol('INotificadorViaje');
