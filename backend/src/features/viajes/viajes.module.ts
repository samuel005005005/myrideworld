import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViajeOrmEntity } from './infraestructura/persistencia/entidades/viaje.orm-entity.js';
import { ViajeRepositoryImpl } from './infraestructura/persistencia/repositorios/viaje.repository.impl.js';
import { VIAJE_REPOSITORY } from './dominio/repositorios/viaje.repository.js';

import { SolicitarViajeUseCase } from './aplicacion/casos-uso/solicitar-viaje.use-case.js';
import { AceptarViajeUseCase } from './aplicacion/casos-uso/aceptar-viaje.use-case.js';
import { MarcarLlegadaUseCase } from './aplicacion/casos-uso/marcar-llegada.use-case.js';
import { IniciarViajeUseCase } from './aplicacion/casos-uso/iniciar-viaje.use-case.js';
import { CompletarViajeUseCase } from './aplicacion/casos-uso/completar-viaje.use-case.js';
import { CancelarViajeUseCase } from './aplicacion/casos-uso/cancelar-viaje.use-case.js';
import { ViajesController } from './presentacion/controladores/viajes.controller.js';
import { TarifasModule } from '../tarifas/tarifas.module.js';
import { PagosBalancesModule } from '../pagos-balances/pagos-balances.module.js';
import { ViajesGateway } from './presentacion/gateways/viajes.gateway.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ViajeOrmEntity]),
    TarifasModule,
    PagosBalancesModule,
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
    ViajesGateway,
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
  ],
})
export class ViajesModule {}
