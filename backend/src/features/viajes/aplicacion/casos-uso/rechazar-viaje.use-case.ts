import { Inject, Injectable } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import { NOTIFICADOR_VIAJE } from '../puertos/notificador-viaje.port.js';
import { AsignadorConductorService } from '../servicios/asignador-conductor.service.js';
import { OfertasViajeActivasRegistry } from '../servicios/ofertas-viaje-activas.registry.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';

@Injectable()
export class RechazarViajeUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    @Inject(NOTIFICADOR_VIAJE)
    private readonly notificadorViaje: INotificadorViaje,
    private readonly asignadorConductor: AsignadorConductorService,
    private readonly ofertas: OfertasViajeActivasRegistry,
  ) {}

  async ejecutar(viajeId: string, conductorId: string): Promise<Viaje> {
    const viaje = await this.viajeRepository.obtenerPorId(viajeId);
    if (!viaje) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
    }

    const sigueBuscando = viaje.rechazar(conductorId);
    if (!sigueBuscando) {
      return viaje;
    }

    const guardado = await this.viajeRepository.guardar(viaje);
    this.notificadorViaje.retirarOfertaDeConductor(viajeId, conductorId);

    // Otros conductores siguen con la oferta sonando.
    if (this.ofertas.conductoresDe(viajeId).length > 0) {
      return guardado;
    }

    const siguientes = await this.asignadorConductor.buscarCercanos({
      origenLat: guardado.origenLat,
      origenLng: guardado.origenLng,
      excluidos: guardado.conductoresRechazados,
    });

    if (siguientes.length > 0) {
      const payload = {
        id: guardado.id,
        origenLat: guardado.origenLat,
        origenLng: guardado.origenLng,
        destinoLat: guardado.destinoLat,
        destinoLng: guardado.destinoLng,
        tarifaEstimada: Number(guardado.tarifaEstimada),
        origenDireccion: guardado.origenDireccion,
        destinoDireccion: guardado.destinoDireccion,
      };
      for (const conductor of siguientes) {
        this.notificadorViaje.notificarNuevoViaje(conductor.id, payload);
      }
    } else {
      guardado.cancelar(
        Roles.SISTEMA,
        MENSAJES.EXCEPCIONES.VIAJES.SIN_CONDUCTORES,
      );
      await this.viajeRepository.guardar(guardado);
      this.notificadorViaje.notificarViajeCancelado(
        guardado.id,
        'SISTEMA',
        MENSAJES.EXCEPCIONES.VIAJES.SIN_CONDUCTORES_ZONA,
      );
    }

    return guardado;
  }
}
