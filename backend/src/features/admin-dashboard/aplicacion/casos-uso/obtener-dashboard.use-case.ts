import { Inject, Injectable } from '@nestjs/common';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import type { IViajeRepository } from '../../../viajes/dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../../viajes/dominio/repositorios/viaje.repository.js';
import { EstadosDisponibilidadConductor } from '../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';

export interface DashboardOperativo {
  conductoresConectados: number;
  conductoresOcupados: number;
  viajesActivos: number;
  viajesCompletadosHoy: number;
}

@Injectable()
export class ObtenerDashboardUseCase {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepo: IConductorRepository,
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepo: IViajeRepository,
  ) {}

  async ejecutar(): Promise<DashboardOperativo> {
    const inicioHoy = new Date();
    inicioHoy.setHours(0, 0, 0, 0);

    const [
      conductoresConectados,
      conductoresOcupados,
      viajesActivos,
      viajesCompletadosHoy,
    ] = await Promise.all([
      this.conductorRepo.contarPorDisponibilidad(
        EstadosDisponibilidadConductor.CONECTADO,
      ),
      this.conductorRepo.contarPorDisponibilidad(
        EstadosDisponibilidadConductor.OCUPADO,
      ),
      this.viajeRepo.contarPorEstados([
        EstadosViaje.SOLICITADO,
        EstadosViaje.BUSCANDO,
        EstadosViaje.ASIGNADO,
        EstadosViaje.EN_CAMINO,
        EstadosViaje.LLEGO,
        EstadosViaje.EN_CURSO,
      ]),
      this.viajeRepo.contarCompletadosDesde(inicioHoy),
    ]);

    return {
      conductoresConectados,
      conductoresOcupados,
      viajesActivos,
      viajesCompletadosHoy,
    };
  }
}
