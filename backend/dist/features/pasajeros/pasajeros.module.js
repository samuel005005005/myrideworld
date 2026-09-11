var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasajeroOrmEntity } from './infraestructura/persistencia/entidades/pasajero.orm-entity.js';
import { PasajeroRepositoryImpl } from './infraestructura/persistencia/repositorios/pasajero.repository.impl.js';
import { PASAJERO_REPOSITORY } from './dominio/repositorios/pasajero.repository.js';
import { CrearPasajeroUseCase } from './aplicacion/casos-uso/crear-pasajero.use-case.js';
import { PasajerosController } from './presentacion/controladores/pasajeros.controller.js';
let PasajerosModule = class PasajerosModule {
};
PasajerosModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([PasajeroOrmEntity])],
        controllers: [PasajerosController],
        providers: [
            {
                provide: PASAJERO_REPOSITORY,
                useClass: PasajeroRepositoryImpl,
            },
            CrearPasajeroUseCase,
        ],
        exports: [PASAJERO_REPOSITORY, CrearPasajeroUseCase],
    })
], PasajerosModule);
export { PasajerosModule };
//# sourceMappingURL=pasajeros.module.js.map