var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoBalanceOrmEntity } from './infraestructura/persistencia/entidades/pago-balance.orm-entity.js';
import { PagoBalanceRepositoryImpl } from './infraestructura/persistencia/repositorios/pago-balance.repository.impl.js';
import { PAGO_BALANCE_REPOSITORY } from './dominio/repositorios/pago-balance.repository.js';
import { GenerarPagoUseCase } from './aplicacion/casos-uso/generar-pago.use-case.js';
let PagosBalancesModule = class PagosBalancesModule {
};
PagosBalancesModule = __decorate([
    Module({
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
], PagosBalancesModule);
export { PagosBalancesModule };
//# sourceMappingURL=pagos-balances.module.js.map