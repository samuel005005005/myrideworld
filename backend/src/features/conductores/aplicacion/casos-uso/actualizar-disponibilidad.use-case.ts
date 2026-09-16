import { Inject, Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import type { IConductorRepository } from '../../dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../dominio/repositorios/conductor.repository.js';
import { Conductor } from '../../dominio/entidades/conductor.entity.js';
import { ActualizarDisponibilidadDto } from '../dto/actualizar-disponibilidad.dto.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { EstadosDisponibilidadConductor } from '../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js';
import { FlotaConductoresActivosRegistry } from '../servicios/flota-conductores-activos.registry.js';

@Injectable()
export class ActualizarDisponibilidadUseCase {
  private readonly logger = new Logger(ActualizarDisponibilidadUseCase.name);

  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
    private readonly moduleRef: ModuleRef,
    private readonly flotaActiva: FlotaConductoresActivosRegistry,
  ) {}

  async ejecutar(
    id: string,
    dto: ActualizarDisponibilidadDto,
  ): Promise<Conductor> {
    const conductor = await this.conductorRepository.obtenerPorId(id);
    if (!conductor) {
      throw new DomainException(MENSAJES.EXCEPCIONES.CONDUCTORES.NO_ENCONTRADO);
    }

    if (
      dto.estadoDisponibilidad === EstadosDisponibilidadConductor.CONECTADO &&
      typeof dto.lat === 'number' &&
      typeof dto.lng === 'number'
    ) {
      conductor.actualizarUbicacion(dto.lat, dto.lng);
    }

    conductor.actualizarDisponibilidad(dto.estadoDisponibilidad);
    const guardado = await this.conductorRepository.guardar(conductor);

    if (
      dto.estadoDisponibilidad === EstadosDisponibilidadConductor.CONECTADO
    ) {
      this.flotaActiva.tocar(guardado.id);
      await this._ofertarPendientesSiDisponible(guardado.id);
    } else {
      this.flotaActiva.salir(guardado.id);
    }

    return guardado;
  }

  /** Import dinámico: evita ciclo ESM ConductoresModule ↔ ViajesModule. */
  private async _ofertarPendientesSiDisponible(conductorId: string): Promise<void> {
    try {
      const { OfertarViajesPendientesConductorUseCase } = await import(
        '../../../viajes/aplicacion/casos-uso/ofertar-viajes-pendientes-conductor.use-case.js'
      );
      const ofertarPendientes = this.moduleRef.get(
        OfertarViajesPendientesConductorUseCase,
        { strict: false },
      );
      await ofertarPendientes.ejecutar(conductorId);
    } catch (error) {
      this.logger.warn(
        `No se pudo ofertar pendientes a ${conductorId}: ${String(error)}`,
      );
    }
  }
}
