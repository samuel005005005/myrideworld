import { Inject, Injectable, Logger } from '@nestjs/common';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import type { ViajeDisponibleNotificacion } from '../puertos/viaje-disponible-notificacion.js';
import type { ViajeAceptadoNotificacion } from '../puertos/viaje-aceptado-notificacion.js';
import type { IPushConductor } from '../puertos/push-conductor.port.js';
import { PUSH_CONDUCTOR } from '../puertos/push-conductor.port.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';
import { OfertasViajeActivasRegistry } from '../servicios/ofertas-viaje-activas.registry.js';
import { ProgramadorTimeoutOfertaService } from '../servicios/programador-timeout-oferta.service.js';

/**
 * Socket (app abierta) + FCM (app en background/cerrada).
 */
@Injectable()
export class NotificadorViajeCompuesto implements INotificadorViaje {
  private readonly logger = new Logger(NotificadorViajeCompuesto.name);

  constructor(
    private readonly gateway: ViajesGateway,
    @Inject(PUSH_CONDUCTOR)
    private readonly push: IPushConductor,
    private readonly ofertas: OfertasViajeActivasRegistry,
    private readonly programadorTimeout: ProgramadorTimeoutOfertaService,
  ) {}

  notificarNuevoViaje(
    conductorId: string,
    viaje: ViajeDisponibleNotificacion,
  ): void {
    const anterior = this.ofertas.conductorDe(viaje.id);
    if (anterior && anterior !== conductorId) {
      this.gateway.cancelarOfertaViaje(anterior, viaje.id);
      void this.push.cancelarOfertaViaje(anterior, viaje.id);
    }

    this.ofertas.registrar(viaje.id, conductorId);
    this.gateway.notificarNuevoViaje(conductorId, viaje);
    void this.push.enviarOfertaViaje(conductorId, viaje).catch((error) => {
      this.logger.warn(`Push oferta falló: ${String(error)}`);
    });
    void this.programadorTimeout.programar(viaje.id, conductorId);
  }

  notificarViajeAceptado(notificacion: ViajeAceptadoNotificacion): void {
    this.programadorTimeout.cancelar(notificacion.viajeId);
    this.ofertas.liberar(notificacion.viajeId);
    this.gateway.notificarViajeAceptado(notificacion);
  }

  notificarConductorLlego(viajeId: string): void {
    this.gateway.notificarConductorLlego(viajeId);
  }

  notificarViajeCancelado(
    viajeId: string,
    actor: string,
    motivo: string | undefined,
  ): void {
    this.programadorTimeout.cancelar(viajeId);
    const ofertado = this.ofertas.liberar(viajeId);
    if (ofertado) {
      this.gateway.cancelarOfertaViaje(ofertado, viajeId);
      void this.push.cancelarOfertaViaje(ofertado, viajeId);
    }
    this.gateway.notificarViajeCancelado(viajeId, actor, motivo);
  }

  notificarViajeIniciado(viajeId: string): void {
    this.gateway.notificarViajeIniciado(viajeId);
  }

  notificarViajeCompletado(viajeId: string, tarifaEstimada: number): void {
    this.gateway.notificarViajeCompletado(viajeId, tarifaEstimada);
  }
}
