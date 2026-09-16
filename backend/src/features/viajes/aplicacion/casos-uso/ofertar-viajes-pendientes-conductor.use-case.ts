import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import { NOTIFICADOR_VIAJE } from '../puertos/notificador-viaje.port.js';
import { OfertasViajeActivasRegistry } from '../servicios/ofertas-viaje-activas.registry.js';
import { EstadosDisponibilidadConductor } from '../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import { calcularDistanciaKm } from '../../../../compartidos/utilidades/geo.util.js';

const RADIO_KM = 50;
const MAX_OFERTAS_SIMULTANEAS = 5;

const ESTADOS_CONDUCTOR_OCUPADO = new Set<string>([
  EstadosViaje.ASIGNADO,
  EstadosViaje.EN_CAMINO,
  EstadosViaje.LLEGO,
  EstadosViaje.EN_CURSO,
]);

/**
 * Cuando un conductor pasa a Conectado, ofrece los viajes pendientes cercanos
 * (varios a la vez) para que elija en la app.
 */
@Injectable()
export class OfertarViajesPendientesConductorUseCase {
  private readonly logger = new Logger(
    OfertarViajesPendientesConductorUseCase.name,
  );

  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
    @Inject(NOTIFICADOR_VIAJE)
    private readonly notificadorViaje: INotificadorViaje,
    private readonly ofertas: OfertasViajeActivasRegistry,
  ) {}

  async ejecutar(conductorId: string): Promise<void> {
    const conductor = await this.conductorRepository.obtenerPorId(conductorId);
    if (!conductor) {
      return;
    }
    if (
      conductor.estadoDisponibilidad !== EstadosDisponibilidadConductor.CONECTADO
    ) {
      return;
    }
    if (
      conductor.ultimaUbicacionLat === null ||
      conductor.ultimaUbicacionLng === null
    ) {
      return;
    }

    const propios = await this.viajeRepository.obtenerPorConductor(conductorId);
    const ocupado = propios.some((viaje) =>
      ESTADOS_CONDUCTOR_OCUPADO.has(viaje.estado),
    );
    if (ocupado) {
      return;
    }

    const yaOfertados = new Set(this.ofertas.viajesIdsDeConductor(conductorId));
    const cupo = Math.max(0, MAX_OFERTAS_SIMULTANEAS - yaOfertados.size);
    if (cupo === 0) {
      return;
    }

    const pendientes =
      await this.viajeRepository.obtenerPendientesAsignacion();
    const candidatos: { id: string; distancia: number }[] = [];

    for (const viaje of pendientes) {
      const ofertadoA = this.ofertas.conductorDe(viaje.id);
      if (ofertadoA && ofertadoA !== conductorId) {
        continue;
      }
      if (yaOfertados.has(viaje.id)) {
        continue;
      }
      if (viaje.conductoresRechazados.includes(conductorId)) {
        continue;
      }

      const distancia = calcularDistanciaKm(
        viaje.origenLat,
        viaje.origenLng,
        conductor.ultimaUbicacionLat,
        conductor.ultimaUbicacionLng,
      );
      if (distancia > RADIO_KM) {
        continue;
      }
      candidatos.push({ id: viaje.id, distancia });
    }

    candidatos.sort((a, b) => a.distancia - b.distancia);

    let ofertados = 0;
    for (const candidato of candidatos) {
      if (ofertados >= cupo) {
        break;
      }
      const viaje = await this.viajeRepository.obtenerPorId(candidato.id);
      if (!viaje) {
        continue;
      }
      if (
        viaje.estado !== EstadosViaje.SOLICITADO &&
        viaje.estado !== EstadosViaje.BUSCANDO
      ) {
        continue;
      }
      const ofertadoA = this.ofertas.conductorDe(viaje.id);
      if (ofertadoA && ofertadoA !== conductorId) {
        continue;
      }

      viaje.iniciarBusqueda();
      const guardado = await this.viajeRepository.guardar(viaje);

      this.logger.log(
        `Conductor ${conductorId} online → oferta viaje ${guardado.id} ` +
          `(${candidato.distancia.toFixed(2)} km)`,
      );

      this.notificadorViaje.notificarNuevoViaje(conductorId, {
        id: guardado.id,
        origenLat: guardado.origenLat,
        origenLng: guardado.origenLng,
        destinoLat: guardado.destinoLat,
        destinoLng: guardado.destinoLng,
        tarifaEstimada: Number(guardado.tarifaEstimada),
        origenDireccion: guardado.origenDireccion,
        destinoDireccion: guardado.destinoDireccion,
      });
      ofertados += 1;
    }
  }
}
