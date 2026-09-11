import { Inject, Injectable } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { AceptarViajeDto } from '../dto/aceptar-viaje.dto.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class AceptarViajeUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    private readonly viajesGateway: ViajesGateway,
  ) { }

  async ejecutar(viajeId: string, dto: AceptarViajeDto): Promise<Viaje> {
    const viaje = await this.viajeRepository.obtenerPorId(viajeId);

    if (!viaje) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
    }

    // TODO: En un escenario completo se validaría aquí en IConductorRepository si el conductor existe y está disponible

    // Cambiamos el estado del viaje
    viaje.asignarConductor(dto.conductorId);

    const guardado = await this.viajeRepository.guardar(viaje);

    // Emitir notificación por WebSockets a la sala del viaje
    this.viajesGateway.notificarViajeAceptado(guardado.id, dto.conductorId);

    return guardado;
  }
}
