var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifaOrmEntity } from './infraestructura/persistencia/entidades/tarifa.orm-entity.js';
import { TarifaRepositoryImpl } from './infraestructura/persistencia/repositorios/tarifa.repository.impl.js';
import { TARIFA_REPOSITORY } from './dominio/repositorios/tarifa.repository.js';
import { EstimarTarifaUseCase } from './aplicacion/casos-uso/estimar-tarifa.use-case.js';
let TarifasModule = class TarifasModule {
};
TarifasModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([TarifaOrmEntity])],
        providers: [
            {
                provide: TARIFA_REPOSITORY,
                useClass: TarifaRepositoryImpl,
            },
            EstimarTarifaUseCase,
        ],
        exports: [TARIFA_REPOSITORY, EstimarTarifaUseCase],
    })
], TarifasModule);
export { TarifasModule };
//# sourceMappingURL=tarifas.module.js.map