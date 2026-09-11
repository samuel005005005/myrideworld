import { Inject, Injectable } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { SolicitarViajeDto } from '../dto/solicitar-viaje.dto.js';
import { EstimarTarifaUseCase } from '../../../tarifas/aplicacion/casos-uso/estimar-tarifa.use-case.js';
import { ViajesGateway } from '../../presentacion/gateways/viajes.gateway.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { calcularDistanciaKm } from '../../../../compartidos/utilidades/geo.util.js';

@Injectable()
export class SolicitarViajeUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
    private readonly estimarTarifa: EstimarTarifaUseCase,
    private readonly viajesGateway: ViajesGateway,
  ) {}

  async ejecutar(dto: SolicitarViajeDto): Promise<Viaje> {
    const tarifa = await this.estimarTarifa.ejecutar({
      origenLat: dto.origenLat,
      origenLng: dto.origenLng,
      destinoLat: dto.destinoLat,
      destinoLng: dto.destinoLng,
    });

    const viaje = Viaje.solicitar({
      pasajeroId: dto.pasajeroId,
      origenLat: dto.origenLat,
      origenLng: dto.origenLng,
      destinoLat: dto.destinoLat,
      destinoLng: dto.destinoLng,
      tarifaEstimada: tarifa.precio,
    });

    const guardado = await this.viajeRepository.guardar(viaje);

    // Buscar conductor más cercano disponible
    const conductores = await this.conductorRepository.obtenerDisponibles();
    
    let conductorSugerido = null;
    let minimaDistancia = Infinity;

    for (const c of conductores) {
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
      // Emitir notificación SÓLO al conductor más cercano
      this.viajesGateway.notificarNuevoViaje(guardado.id, conductorSugerido.id);
    } else {
      // Opcional: Manejar caso donde no hay conductores
    }

    return guardado;
  }
}
