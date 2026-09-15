import { Inject, Injectable } from '@nestjs/common';
import type { IViajeRepository } from '../../dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import type { INotificadorViaje } from '../puertos/notificador-viaje.port.js';
import { NOTIFICADOR_VIAJE } from '../puertos/notificador-viaje.port.js';
import { GenerarPagoUseCase } from '../../../pagos-balances/aplicacion/casos-uso/generar-pago.use-case.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { RegistrarBitacoraUseCase } from '../../../bitacora/aplicacion/casos-uso/registrar-bitacora.use-case.js';
import { TiposBitacora } from '../../../../compartidos/constantes/tipos-bitacora.enum.js';
import { ServiciosSistema } from '../../../../compartidos/constantes/servicios-sistema.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { ValidadorProximidadViajeService } from '../servicios/validador-proximidad-viaje.service.js';
import { calcularDistanciaKm } from '../../../../compartidos/utilidades/geo.util.js';

@Injectable()
export class CompletarViajeUseCase {
  constructor(
    @Inject(VIAJE_REPOSITORY)
    private readonly viajeRepository: IViajeRepository,
    @Inject(NOTIFICADOR_VIAJE)
    private readonly notificadorViaje: INotificadorViaje,
    private readonly generarPagoUseCase: GenerarPagoUseCase,
    private readonly registrarBitacora: RegistrarBitacoraUseCase,
    private readonly validadorProximidad: ValidadorProximidadViajeService,
  ) {}

  async ejecutar(id: string, conductorId: string): Promise<Viaje> {
    const viaje = await this.viajeRepository.obtenerPorId(id);

    if (!viaje) {
      throw new DomainException(MENSAJES.EXCEPCIONES.VIAJES.NO_ENCONTRADO);
    }

    if (viaje.conductorId !== conductorId) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.VIAJES.ACCION_SOLO_CONDUCTOR_ASIGNADO,
        403,
      );
    }

    await this.validadorProximidad.asegurarCercaDe(
      conductorId,
      viaje.destinoLat,
      viaje.destinoLng,
      MENSAJES.EXCEPCIONES.CONFIGURACION.CLAVE_RADIO_PROXIMIDAD_DESTINO_M,
    );

    viaje.completarViaje();

    const guardado = await this.viajeRepository.guardar(viaje);

    if (viaje.conductorId) {
      await this.generarPagoUseCase.ejecutar({
        viajeId: viaje.id,
        conductorId: viaje.conductorId,
        montoTotal: viaje.tarifaEstimada,
      });
    }

    await this.registrarBitacora.ejecutar({
      tipoEvento: TiposBitacora.INFO,
      servicioSistema: ServiciosSistema.VIAJES,
      detalle: `${MENSAJES.EXCEPCIONES.VIAJES.COMPLETADO_EXITOSO}: ${viaje.id}`,
      usuario: `conductor-${viaje.conductorId}`,
      entidadId: viaje.id,
      accion: 'COMPLETAR_VIAJE',
      request: { viajeId: id },
    });

    const distanciaKm =
      Math.round(
        calcularDistanciaKm(
          guardado.origenLat,
          guardado.origenLng,
          guardado.destinoLat,
          guardado.destinoLng,
        ) * 100,
      ) / 100;

    const duracionMinutos = this._duracionMinutos(
      guardado.fechaInicio,
      guardado.fechaFin,
    );

    this.notificadorViaje.notificarViajeCompletado({
      viajeId: guardado.id,
      tarifaEstimada: Number(guardado.tarifaEstimada),
      distanciaKm,
      duracionMinutos,
    });

    return guardado;
  }

  private _duracionMinutos(
    inicio: Date | null,
    fin: Date | null,
  ): number {
    if (!inicio || !fin) {
      return 0;
    }
    const ms = fin.getTime() - inicio.getTime();
    if (ms <= 0) {
      return 0;
    }
    return Math.max(1, Math.round(ms / 60_000));
  }
}
