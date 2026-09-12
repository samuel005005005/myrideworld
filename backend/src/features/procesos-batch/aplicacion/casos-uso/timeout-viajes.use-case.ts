import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IViajeRepository } from '../../../viajes/dominio/repositorios/viaje.repository.js';
import { VIAJE_REPOSITORY } from '../../../viajes/dominio/repositorios/viaje.repository.js';
import type { IEjecucionProcesoRepository } from '../../dominio/repositorios/ejecucion-proceso.repository.js';
import { EJECUCION_PROCESO_REPOSITORY } from '../../dominio/repositorios/ejecucion-proceso.repository.js';
import type { IConfiguracionRepository } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../../configuracion/dominio/repositorios/configuracion.repository.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { EjecucionProceso } from '../../dominio/entidades/ejecucion-proceso.entity.js';
import { DetalleEjecucionProceso } from '../../dominio/entidades/detalle-ejecucion.entity.js';
import type { INotificadorViaje } from '../../../viajes/aplicacion/puertos/notificador-viaje.port.js';
import { NOTIFICADOR_VIAJE } from '../../../viajes/aplicacion/puertos/notificador-viaje.port.js';
import { RegistrarBitacoraUseCase } from '../../../bitacora/aplicacion/casos-uso/registrar-bitacora.use-case.js';
import { TiposBitacora } from '../../../../compartidos/constantes/tipos-bitacora.enum.js';
import { ServiciosSistema } from '../../../../compartidos/constantes/servicios-sistema.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class TimeoutViajesUseCase {
  private readonly logger = new Logger(TimeoutViajesUseCase.name);

  constructor(
    @Inject(VIAJE_REPOSITORY) private readonly viajeRepo: IViajeRepository,
    @Inject(EJECUCION_PROCESO_REPOSITORY) private readonly ejecucionRepo: IEjecucionProcesoRepository,
    @Inject(CONFIGURACION_REPOSITORY) private readonly configRepo: IConfiguracionRepository,
    @Inject(NOTIFICADOR_VIAJE)
    private readonly notificadorViaje: INotificadorViaje,
    private readonly registrarBitacora: RegistrarBitacoraUseCase,
  ) {}

  async ejecutar(): Promise<void> {
    const minutosTimeout = Number(await this.configRepo.obtenerValor('TIMEOUT_VIAJE_MINUTOS', '5'));
    const viajesVencidos = await this.viajeRepo.obtenerViajesVencidos(minutosTimeout);

    if (viajesVencidos.length === 0) {
      this.logger.log('No hay viajes vencidos para procesar.');
      return;
    }

    // 1. CREAR Ejecucion Padre (EP)
    const ejecucion = EjecucionProceso.iniciar(
      'TIMEOUT_VIAJES_SOLICITADOS',
      viajesVencidos.length,
      'SISTEMA_BATCH'
    );
    const ejecucionGuardada = await this.ejecucionRepo.guardarEjecucion(ejecucion);

    for (const viaje of viajesVencidos) {
      // 2a. INSERTAR Detalle (PE)
      let detalle = DetalleEjecucionProceso.registrar({
        ejecucionProcesoId: ejecucionGuardada.id,
        entidadId: viaje.id,
        valorClave: `VIAJE-${viaje.id}`,
        jsonGenerado: { viajeId: viaje.id, pasajeroId: viaje.pasajeroId },
      });
      detalle = await this.ejecucionRepo.guardarDetalle(detalle);

      try {
        // 2b. ACTUALIZAR Detalle a (EP)
        detalle.marcarEnProceso();
        detalle = await this.ejecucionRepo.guardarDetalle(detalle);

        // 2c. Ejecutar Operación
        viaje.cancelar(Roles.SISTEMA, 'Tiempo de espera agotado');
        await this.viajeRepo.guardar(viaje);

        // 2d. Notificar por WS
        this.notificadorViaje.notificarViajeCancelado(viaje.id, 'SISTEMA', MENSAJES.EXCEPCIONES.VIAJES.TIMEOUT_AGOTADO);

        // Registro en Bitácora individual
        await this.registrarBitacora.ejecutar({
          tipoEvento: TiposBitacora.INFO,
          servicioSistema: ServiciosSistema.VIAJES,
          detalle: `Viaje ${viaje.id} cancelado automáticamente por timeout (${minutosTimeout}m)`,
          usuario: 'SISTEMA_BATCH',
          entidadId: viaje.id,
          accion: 'TIMEOUT_VIAJE',
        });

        // 2e. Éxito -> ACTUALIZAR Detalle a OK
        detalle.marcarExitoso({ cancelado: true, motivo: 'Tiempo de espera agotado' });
        await this.ejecucionRepo.guardarDetalle(detalle);
        
        ejecucion.registrarExito();
      } catch (error: any) {
        // 2f. Error -> ACTUALIZAR Detalle a ER
        detalle.marcarError(error.message, error.stack);
        await this.ejecucionRepo.guardarDetalle(detalle);
        
        ejecucion.registrarError();
        
        // Bitácora de Error
        await this.registrarBitacora.ejecutar({
          tipoEvento: TiposBitacora.ERROR,
          servicioSistema: ServiciosSistema.VIAJES,
          detalle: `Error cancelando viaje ${viaje.id} por timeout: ${error.message}`,
          usuario: 'SISTEMA_BATCH',
          entidadId: viaje.id,
          accion: 'ERROR_TIMEOUT_VIAJE',
        });
      }
    }

    // 3. ACTUALIZAR Ejecución Padre (OK, OK_ER, ER)
    ejecucion.finalizar();
    await this.ejecucionRepo.guardarEjecucion(ejecucion);
    
    this.logger.log(`Proceso de Timeout finalizado. Estado: ${ejecucion.estado}`);
  }
}
