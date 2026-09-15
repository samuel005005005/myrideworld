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

const ESTADOS_CONDUCTOR_OCUPADO = new Set<string>([
  EstadosViaje.ASIGNADO,
  EstadosViaje.EN_CAMINO,
  EstadosViaje.LLEGO,
  EstadosViaje.EN_CURSO,
]);

/**
 * Cuando un conductor pasa a Conectado, ofrece el viaje pendiente más cercano
 * que aún no tiene oferta activa (p. ej. solicitado sin conductores online).
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
    if (this.ofertas.tieneOfertaActivaPara(conductorId)) {
      return;
    }

    const propios = await this.viajeRepository.obtenerPorConductor(conductorId);
    const ocupado = propios.some((viaje) =>
      ESTADOS_CONDUCTOR_OCUPADO.has(viaje.estado),
    );
    if (ocupado) {
      return;
    }

    const pendientes =
      await this.viajeRepository.obtenerPendientesAsignacion();
    let mejorId: string | null = null;
    let minimaDistancia = Infinity;

    for (const viaje of pendientes) {
      if (this.ofertas.conductorDe(viaje.id)) {
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
      if (distancia < minimaDistancia) {
        minimaDistancia = distancia;
        mejorId = viaje.id;
      }
    }

    if (!mejorId) {
      return;
    }

    const viaje = await this.viajeRepository.obtenerPorId(mejorId);
    if (!viaje) {
      return;
    }
    if (
      viaje.estado !== EstadosViaje.SOLICITADO &&
      viaje.estado !== EstadosViaje.BUSCANDO
    ) {
      return;
    }
    if (this.ofertas.conductorDe(viaje.id)) {
      return;
    }

    viaje.iniciarBusqueda();
    const guardado = await this.viajeRepository.guardar(viaje);

    this.logger.log(
      `Conductor ${conductorId} online → oferta viaje ${guardado.id} ` +
        `(${minimaDistancia.toFixed(2)} km)`,
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
  }
}
