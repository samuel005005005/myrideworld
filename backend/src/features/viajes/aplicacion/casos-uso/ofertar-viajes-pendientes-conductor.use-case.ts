import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import type { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import { NOTIFICADOR_VIAJE } from '../puertos/notificador-viaje.port.js';
import { OfertasViajeActivasRegistry } from '../servicios/ofertas-viaje-activas.registry.js';
import { FlotaConductoresActivosRegistry } from '../../../conductores/aplicacion/servicios/flota-conductores-activos.registry.js';
import { EstadosDisponibilidadConductor } from '../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { calcularDistanciaKm } from '../../../../compartidos/utilidades/geo.util.js';

const C = MENSAJES.EXCEPCIONES.CONFIGURACION;
const RADIO_KM_DEFAULT = 15;
const MAX_OFERTAS_CONDUCTOR_DEFAULT = 5;
const MAX_PARALELO_VIAJE_DEFAULT = 5;

const ESTADOS_CONDUCTOR_OCUPADO = new Set<string>([
  EstadosViaje.ASIGNADO,
  EstadosViaje.EN_CAMINO,
  EstadosViaje.LLEGO,
  EstadosViaje.EN_CURSO,
]);

/**
 * Cuando un conductor pasa a Conectado, ofrece viajes pendientes cercanos
 * respetando cupos por conductor y por viaje (escala multi-usuario).
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
    @Inject(CONFIGURACION_REPOSITORY)
    private readonly configRepo: IConfiguracionRepository,
    @Inject(NOTIFICADOR_VIAJE)
    private readonly notificadorViaje: INotificadorViaje,
    private readonly ofertas: OfertasViajeActivasRegistry,
    private readonly flotaActiva: FlotaConductoresActivosRegistry,
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
    if (!this.flotaActiva.estaActivoEnFlota(conductorId)) {
      this.flotaActiva.tocar(conductorId);
    }

    const propios = await this.viajeRepository.obtenerPorConductor(conductorId);
    const ocupado = propios.some((viaje) =>
      ESTADOS_CONDUCTOR_OCUPADO.has(viaje.estado),
    );
    if (ocupado) {
      return;
    }

    const radioKm = await this._leerNumero(
      C.CLAVE_RADIO_ASIGNACION_KM,
      RADIO_KM_DEFAULT,
    );
    const maxPorConductor = await this._leerNumero(
      C.CLAVE_MAX_CONDUCTORES_OFERTA_PARALELA,
      MAX_OFERTAS_CONDUCTOR_DEFAULT,
    );
    const maxParaleloViaje = maxPorConductor;

    const yaOfertados = new Set(this.ofertas.viajesIdsDeConductor(conductorId));
    const cupo = Math.max(0, Math.floor(maxPorConductor) - yaOfertados.size);
    if (cupo === 0) {
      return;
    }

    const pendientes =
      await this.viajeRepository.obtenerPendientesAsignacion();
    const candidatos: { id: string; distancia: number }[] = [];

    for (const viaje of pendientes) {
      if (this.ofertas.tieneOferta(viaje.id, conductorId)) {
        continue;
      }
      if (viaje.conductoresRechazados.includes(conductorId)) {
        continue;
      }
      if (this.ofertas.conductoresDe(viaje.id).length >= maxParaleloViaje) {
        continue;
      }

      const distancia = calcularDistanciaKm(
        viaje.origenLat,
        viaje.origenLng,
        conductor.ultimaUbicacionLat,
        conductor.ultimaUbicacionLng,
      );
      if (distancia > radioKm) {
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
      if (this.ofertas.tieneOferta(viaje.id, conductorId)) {
        continue;
      }
      if (this.ofertas.conductoresDe(viaje.id).length >= maxParaleloViaje) {
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

  private async _leerNumero(clave: string, fallback: number): Promise<number> {
    const raw = Number(
      await this.configRepo.obtenerValor(clave, String(fallback)),
    );
    return Number.isFinite(raw) && raw > 0 ? raw : fallback;
  }
}
