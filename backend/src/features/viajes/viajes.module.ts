import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViajeOrmEntity } from './infraestructura/persistencia/entidades/viaje.orm-entity.js';
import { ViajeRepositoryImpl } from './infraestructura/persistencia/repositorios/viaje.repository.impl.js';
import { VIAJE_REPOSITORY } from './dominio/repositorios/viaje.repository.js';

import { SolicitarViajeUseCase } from './aplicacion/casos-uso/solicitar-viaje.use-case.js';
import { AceptarViajeUseCase } from './aplicacion/casos-uso/aceptar-viaje.use-case.js';
import { MarcarLlegadaUseCase } from './aplicacion/casos-uso/marcar-llegada.use-case.js';
import { IniciarViajeUseCase } from './aplicacion/casos-uso/iniciar-viaje.use-case.js';
import { BitacoraModule } from '../bitacora/bitacora.module.js';
import { CompletarViajeUseCase } from './aplicacion/casos-uso/completar-viaje.use-case.js';
import { CancelarViajeUseCase } from './aplicacion/casos-uso/cancelar-viaje.use-case.js';
import { ListarViajesUseCase } from './aplicacion/casos-uso/listar-viajes.use-case.js';
import { RechazarViajeUseCase } from './aplicacion/casos-uso/rechazar-viaje.use-case.js';
import { ObtenerViajeActivoUseCase } from './aplicacion/casos-uso/obtener-viaje-activo.use-case.js';
import { ObtenerViajePorIdUseCase } from './aplicacion/casos-uso/obtener-viaje-por-id.use-case.js';
import { OfertarViajesPendientesConductorUseCase } from './aplicacion/casos-uso/ofertar-viajes-pendientes-conductor.use-case.js';
import { ViajesController } from './presentacion/controladores/viajes.controller.js';
import { TarifasModule } from '../tarifas/tarifas.module.js';
import { PagosBalancesModule } from '../pagos-balances/pagos-balances.module.js';
import { ViajesGateway } from './presentacion/gateways/viajes.gateway.js';
import { NOTIFICADOR_VIAJE } from './aplicacion/puertos/notificador-viaje.port.js';
import { PUSH_CONDUCTOR } from './aplicacion/puertos/push-conductor.port.js';
import { FirebasePushConductorAdapter } from './infraestructura/push/firebase-push-conductor.adapter.js';
import { NotificadorViajeCompuesto } from './aplicacion/servicios/notificador-viaje.compuesto.js';
import { OfertasViajeActivasRegistry } from './aplicacion/servicios/ofertas-viaje-activas.registry.js';
import { ProgramadorTimeoutOfertaService } from './aplicacion/servicios/programador-timeout-oferta.service.js';
import { ConductoresModule } from '../conductores/conductores.module.js';
import { PasajerosModule } from '../pasajeros/pasajeros.module.js';
import { AsignadorConductorService } from './aplicacion/servicios/asignador-conductor.service.js';
import { ValidadorProximidadViajeService } from './aplicacion/servicios/validador-proximidad-viaje.service.js';
import { JwtAuthModule } from '../../compartidos/seguridad/jwt-auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ViajeOrmEntity]),
    TarifasModule,
    PagosBalancesModule,
    forwardRef(() => ConductoresModule),
    PasajerosModule,
    BitacoraModule,
    JwtAuthModule,
  ],
  controllers: [ViajesController],
  providers: [
    {
      provide: VIAJE_REPOSITORY,
      useClass: ViajeRepositoryImpl,
    },
    AsignadorConductorService,
    ValidadorProximidadViajeService,
    OfertasViajeActivasRegistry,
    ProgramadorTimeoutOfertaService,
    SolicitarViajeUseCase,
    AceptarViajeUseCase,
    MarcarLlegadaUseCase,
    IniciarViajeUseCase,
    CompletarViajeUseCase,
    CancelarViajeUseCase,
    ListarViajesUseCase,
    RechazarViajeUseCase,
    ObtenerViajeActivoUseCase,
    ObtenerViajePorIdUseCase,
    OfertarViajesPendientesConductorUseCase,
    ViajesGateway,
    FirebasePushConductorAdapter,
    {
      provide: PUSH_CONDUCTOR,
      useExisting: FirebasePushConductorAdapter,
    },
    NotificadorViajeCompuesto,
    {
      provide: NOTIFICADOR_VIAJE,
      useExisting: NotificadorViajeCompuesto,
    },
  ],
  exports: [
    VIAJE_REPOSITORY,
    SolicitarViajeUseCase,
    AceptarViajeUseCase,
    MarcarLlegadaUseCase,
    IniciarViajeUseCase,
    CompletarViajeUseCase,
    CancelarViajeUseCase,
    OfertarViajesPendientesConductorUseCase,
    ViajesGateway,
    NOTIFICADOR_VIAJE,
  ],
})
export class ViajesModule {}
