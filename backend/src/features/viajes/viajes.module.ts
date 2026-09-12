import { Module } from '@nestjs/common';
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
import { ViajesController } from './presentacion/controladores/viajes.controller.js';
import { TarifasModule } from '../tarifas/tarifas.module.js';
import { PagosBalancesModule } from '../pagos-balances/pagos-balances.module.js';
import { ViajesGateway } from './presentacion/gateways/viajes.gateway.js';
import { NOTIFICADOR_VIAJE } from './aplicacion/puertos/notificador-viaje.port.js';
import { ConductoresModule } from '../conductores/conductores.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ViajeOrmEntity]),
    TarifasModule,
    PagosBalancesModule,
    ConductoresModule,
    BitacoraModule,
    AuthModule,
  ],
  controllers: [ViajesController],
  providers: [
    {
      provide: VIAJE_REPOSITORY,
      useClass: ViajeRepositoryImpl,
    },
    SolicitarViajeUseCase,
    AceptarViajeUseCase,
    MarcarLlegadaUseCase,
    IniciarViajeUseCase,
    CompletarViajeUseCase,
    CancelarViajeUseCase,
    ListarViajesUseCase,
    RechazarViajeUseCase,
    ViajesGateway,
    {
      provide: NOTIFICADOR_VIAJE,
      useExisting: ViajesGateway,
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
    ViajesGateway,
    NOTIFICADOR_VIAJE,
  ],
})
export class ViajesModule { }
