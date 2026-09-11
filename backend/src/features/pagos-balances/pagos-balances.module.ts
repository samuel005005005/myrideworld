import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoBalanceOrmEntity } from './infraestructura/persistencia/entidades/pago-balance.orm-entity.js';
import { PagoBalanceRepositoryImpl } from './infraestructura/persistencia/repositorios/pago-balance.repository.impl.js';
import { PAGO_BALANCE_REPOSITORY } from './dominio/repositorios/pago-balance.repository.js';
import { GenerarPagoUseCase } from './aplicacion/casos-uso/generar-pago.use-case.js';

@Module({
  imports: [TypeOrmModule.forFeature([PagoBalanceOrmEntity])],
  providers: [
    {
      provide: PAGO_BALANCE_REPOSITORY,
      useClass: PagoBalanceRepositoryImpl,
    },
    GenerarPagoUseCase,
  ],
  exports: [PAGO_BALANCE_REPOSITORY, GenerarPagoUseCase],
})
export class PagosBalancesModule {}
