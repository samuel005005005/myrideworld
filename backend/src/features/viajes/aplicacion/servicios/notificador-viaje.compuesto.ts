import { Inject, Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import type { ViajeDisponibleNotificacion } from '../puertos/viaje-disponible-notificacion.js';
import type { ViajeAceptadoNotificacion } from '../puertos/viaje-aceptado-notificacion.js';
import type { IPushConductor } from '../puertos/push-conductor.port.js';
import { PUSH_CONDUCTOR } from '../puertos/push-conductor.port.js';
import type { ViajeCompletadoNotificacion } from '../puertos/viaje-completado-notificacion.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';
import { OfertasViajeActivasRegistry } from '../servicios/ofertas-viaje-activas.registry.js';
import { ProgramadorTimeoutOfertaService } from '../servicios/programador-timeout-oferta.service.js';
import { RechazarViajeUseCase } from '../casos-uso/rechazar-viaje.use-case.js';

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
    private readonly moduleRef: ModuleRef,
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
    void this._liberarOtrasOfertasDelConductor(
      notificacion.conductorId,
      notificacion.viajeId,
    );
  }

  notificarConductorLlego(viajeId: string): void {
    this.gateway.notificarConductorLlego(viajeId);
  }

  notificarViajeCancelado(
    viajeId: string,
    actor: string,
    motivo: string | undefined,
    conductorId?: string | null,
  ): void {
    this.programadorTimeout.cancelar(viajeId);
    const ofertado = this.ofertas.liberar(viajeId);
    if (ofertado) {
      this.gateway.cancelarOfertaViaje(ofertado, viajeId);
      void this.push.cancelarOfertaViaje(ofertado, viajeId);
    }
    this.gateway.notificarViajeCancelado(
      viajeId,
      actor,
      motivo,
      conductorId ?? ofertado,
    );
  }

  notificarViajeIniciado(viajeId: string): void {
    this.gateway.notificarViajeIniciado(viajeId);
  }

  notificarViajeCompletado(notificacion: ViajeCompletadoNotificacion): void {
    this.gateway.notificarViajeCompletado(notificacion);
  }

  /** Al aceptar un viaje, el resto de ofertas del conductor rotan a otros. */
  private async _liberarOtrasOfertasDelConductor(
    conductorId: string,
    viajeAceptadoId: string,
  ): Promise<void> {
    const otros = this.ofertas
      .viajesIdsDeConductor(conductorId)
      .filter((id) => id !== viajeAceptadoId);
    if (otros.length === 0) {
      return;
    }
    try {
      const rechazar = this.moduleRef.get(RechazarViajeUseCase, {
        strict: false,
      });
      for (const viajeId of otros) {
        this.programadorTimeout.cancelar(viajeId);
        this.ofertas.liberar(viajeId);
        this.gateway.cancelarOfertaViaje(conductorId, viajeId);
        void this.push.cancelarOfertaViaje(conductorId, viajeId);
        await rechazar.ejecutar(viajeId, conductorId);
      }
    } catch (error) {
      this.logger.warn(
        `No se pudieron rotar otras ofertas de ${conductorId}: ${String(error)}`,
      );
    }
  }
}
