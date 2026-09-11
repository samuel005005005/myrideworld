import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';
import { calcularDistanciaKm } from '../../../../compartidos/utilidades/geo.util.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class RechazarViajeUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
    private readonly viajesGateway: ViajesGateway,
  ) {}

  async ejecutar(viajeId: string, conductorId: string): Promise<Viaje> {
    const viaje = await this.viajeRepository.obtenerPorId(viajeId);
    if (!viaje) {
      throw new NotFoundException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
    }

    // El dominio valida que el viaje esté en estado SOLICITADO
    viaje.rechazar(conductorId);
    
    const guardado = await this.viajeRepository.guardar(viaje);

    // Encontrar al siguiente conductor más cercano
    const conductores = await this.conductorRepository.obtenerDisponibles();
    
    let conductorSugerido = null;
    let minimaDistancia = Infinity;

    for (const c of conductores) {
      // Excluir a los que ya rechazaron (incluyendo al actual)
      if (guardado.conductoresRechazados.includes(c.id)) continue;
      if (c.ultimaUbicacionLat === null || c.ultimaUbicacionLng === null) continue;

      const distancia = calcularDistanciaKm(
        guardado.origenLat,
        guardado.origenLng,
        c.ultimaUbicacionLat,
        c.ultimaUbicacionLng
      );

      if (distancia < minimaDistancia) {
        minimaDistancia = distancia;
        conductorSugerido = c;
      }
    }

    if (conductorSugerido) {
      // Emitir al siguiente en la cascada
      this.viajesGateway.notificarNuevoViaje(guardado.id, conductorSugerido.id);
    } else {
      // No hay más conductores disponibles: Cancelar viaje automáticamente
      guardado.cancelar(Roles.SISTEMA, 'No hay conductores disponibles');
      await this.viajeRepository.guardar(guardado);
      this.viajesGateway.notificarViajeCancelado(guardado.id, 'SISTEMA', 'No hay conductores disponibles en tu zona');
    }

    return guardado;
  }
}
