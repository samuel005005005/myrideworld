import { Inject, Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import type { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { OfertasViajeActivasRegistry } from './ofertas-viaje-activas.registry.js';
import { RechazarViajeUseCase } from '../casos-uso/rechazar-viaje.use-case.js';

/** Si un conductor no responde a tiempo, se retira su oferta (otros siguen). */
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
    this.cancelar(viajeId, conductorId);
    const clave =
      MENSAJES.EXCEPCIONES.CONFIGURACION.CLAVE_TIMEOUT_OFERTA_CONDUCTOR_SEGUNDOS;
    const segundos = Number(
      await this.configRepo.obtenerValor(clave, '30'),
    );
    const ms = Math.max(5, Number.isFinite(segundos) ? segundos : 30) * 1000;
    const key = this._clave(viajeId, conductorId);
    const handle = setTimeout(() => {
      void this.expirar(viajeId, conductorId);
    }, ms);
    this.timers.set(key, handle);
  }

  cancelar(viajeId: string, conductorId?: string): void {
    if (conductorId) {
      const key = this._clave(viajeId, conductorId);
      const handle = this.timers.get(key);
      if (handle) {
        clearTimeout(handle);
      }
      this.timers.delete(key);
      return;
    }
    this.cancelarViaje(viajeId);
  }

  cancelarViaje(viajeId: string): void {
    const prefijo = `${viajeId}::`;
    for (const key of [...this.timers.keys()]) {
      if (key.startsWith(prefijo)) {
        const handle = this.timers.get(key);
        if (handle) {
          clearTimeout(handle);
        }
        this.timers.delete(key);
      }
    }
  }

  private async expirar(viajeId: string, conductorId: string): Promise<void> {
    this.timers.delete(this._clave(viajeId, conductorId));
    if (!this.ofertas.tieneOferta(viajeId, conductorId)) {
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
        `No se pudo retirar oferta expirada ${viajeId}/${conductorId}: ${String(error)}`,
      );
    }
  }

  private _clave(viajeId: string, conductorId: string): string {
    return `${viajeId}::${conductorId}`;
  }
}
