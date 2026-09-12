import { Inject, Injectable } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { Conductor } from '../../../conductores/dominio/entidades/conductor.entity.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { ViajeConConductor } from '../dto/viaje-con-conductor.js';

@Injectable()
export class ObtenerViajePorIdUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
  ) {}

  async ejecutar(
    viajeId: string,
    actorId: string,
    rol: Roles,
  ): Promise<ViajeConConductor> {
    const viaje = await this.viajeRepository.obtenerPorId(viajeId);
    if (!viaje) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
    }

    const autorizado =
      rol === Roles.ADMIN ||
      viaje.pasajeroId === actorId ||
      viaje.conductorId === actorId;

    if (!autorizado) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.VIAJES.CONSULTA_NO_AUTORIZADA,
        403,
      );
    }

    let conductor: Conductor | null = null;
    if (viaje.conductorId) {
      conductor = await this.conductorRepository.obtenerPorId(viaje.conductorId);
    }

    return new ViajeConConductor(viaje, conductor);
  }
}
