import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoBalanceOrmEntity } from './infraestructura/persistencia/entidades/pago-balance.orm-entity.js';
import { PagoBalanceRepositoryImpl } from './infraestructura/persistencia/repositorios/pago-balance.repository.impl.js';
import { PAGO_BALANCE_REPOSITORY } from './dominio/repositorios/pago-balance.repository.js';
import { GenerarPagoUseCase } from './aplicacion/casos-uso/generar-pago.use-case.js';
import { ListarMisBalancesUseCase } from './aplicacion/casos-uso/listar-mis-balances.use-case.js';
import { ObtenerPagoPorViajeUseCase } from './aplicacion/casos-uso/obtener-pago-por-viaje.use-case.js';
import { ListarPagosAdminUseCase } from './aplicacion/casos-uso/listar-pagos-admin.use-case.js';
import { ObtenerLiquidacionUseCase } from './aplicacion/casos-uso/obtener-liquidacion.use-case.js';
import { PagosBalancesController } from './presentacion/controladores/pagos-balances.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([PagoBalanceOrmEntity])],
  controllers: [PagosBalancesController],
  providers: [
    {
      provide: PAGO_BALANCE_REPOSITORY,
      useClass: PagoBalanceRepositoryImpl,
    },
    GenerarPagoUseCase,
    ListarMisBalancesUseCase,
    ObtenerPagoPorViajeUseCase,
    ListarPagosAdminUseCase,
    ObtenerLiquidacionUseCase,
  ],
  exports: [PAGO_BALANCE_REPOSITORY, GenerarPagoUseCase],
})
export class PagosBalancesModule {}
