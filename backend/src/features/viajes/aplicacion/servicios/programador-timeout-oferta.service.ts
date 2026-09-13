import { Inject, Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import type { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { OfertasViajeActivasRegistry } from './ofertas-viaje-activas.registry.js';
import { RechazarViajeUseCase } from '../casos-uso/rechazar-viaje.use-case.js';

/** BR-ASG-001: si no acepta/rechaza a tiempo, pasa al siguiente conductor. */
@Injectable()
export class ProgramadorTimeoutOfertaService {
  private readonly logger = new Logger(ProgramadorTimeoutOfertaService.name);
  private readonly timers = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly ofertas: OfertasViajeActivasRegistry,
    @Inject(CONFIGURACION_REPOSITORY)
    private readonly configRepo: IConfiguracionRepository,
  ) {}

  async programar(viajeId: string, conductorId: string): Promise<void> {
    this.cancelar(viajeId);
    const clave =
      MENSAJES.EXCEPCIONES.CONFIGURACION.CLAVE_TIMEOUT_OFERTA_CONDUCTOR_SEGUNDOS;
    const segundos = Number(
      await this.configRepo.obtenerValor(clave, '30'),
    );
    const ms = Math.max(5, Number.isFinite(segundos) ? segundos : 30) * 1000;
    const handle = setTimeout(() => {
      void this.expirar(viajeId, conductorId);
    }, ms);
    this.timers.set(viajeId, handle);
  }

  cancelar(viajeId: string): void {
    const handle = this.timers.get(viajeId);
    if (handle) {
      clearTimeout(handle);
      this.timers.delete(viajeId);
    }
  }

  private async expirar(viajeId: string, conductorId: string): Promise<void> {
    this.timers.delete(viajeId);
    if (this.ofertas.conductorDe(viajeId) !== conductorId) {
      return;
    }
    try {
      const rechazar = this.moduleRef.get(RechazarViajeUseCase, {
        strict: false,
      });
      await rechazar.ejecutar(viajeId, conductorId);
      this.logger.log(
        `Oferta expirada viaje=${viajeId} conductor=${conductorId}`,
      );
    } catch (error) {
      this.logger.warn(
        `No se pudo rotar oferta expirada ${viajeId}: ${String(error)}`,
      );
    }
  }
}
