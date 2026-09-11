var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConductorOrmEntity } from './infraestructura/persistencia/entidades/conductor.orm-entity.js';
import { ConductorRepositoryImpl } from './infraestructura/persistencia/repositorios/conductor.repository.impl.js';
import { CONDUCTOR_REPOSITORY } from './dominio/repositorios/conductor.repository.js';
import { CrearConductorUseCase } from './aplicacion/casos-uso/crear-conductor.use-case.js';
import { ConductoresController } from './presentacion/controladores/conductores.controller.js';
import { AprobarConductorUseCase } from './aplicacion/casos-uso/aprobar-conductor.use-case.js';
import { ListarConductoresUseCase } from './aplicacion/casos-uso/listar-conductores.use-case.js';
let ConductoresModule = class ConductoresModule {
};
ConductoresModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([ConductorOrmEntity])],
        controllers: [ConductoresController],
        providers: [
            {
                provide: CONDUCTOR_REPOSITORY,
                useClass: ConductorRepositoryImpl,
            },
            CrearConductorUseCase,
            AprobarConductorUseCase,
            ListarConductoresUseCase,
        ],
        exports: [CONDUCTOR_REPOSITORY, CrearConductorUseCase],
    })
], ConductoresModule);
export { ConductoresModule };
//# sourceMappingURL=conductores.module.js.map