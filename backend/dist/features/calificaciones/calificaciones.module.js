var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalificacionOrmEntity } from './infraestructura/persistencia/entidades/calificacion.orm-entity.js';
import { CalificacionRepositoryImpl } from './infraestructura/persistencia/repositorios/calificacion.repository.impl.js';
import { CALIFICACION_REPOSITORY } from './dominio/repositorios/calificacion.repository.js';
import { CalificarConductorUseCase } from './aplicacion/casos-uso/calificar-conductor.use-case.js';
import { CalificacionesController } from './presentacion/controladores/calificaciones.controller.js';
import { ViajesModule } from '../viajes/viajes.module.js';
let CalificacionesModule = class CalificacionesModule {
};
CalificacionesModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forFeature([CalificacionOrmEntity]),
            ViajesModule,
        ],
        controllers: [CalificacionesController],
        providers: [
            {
                provide: CALIFICACION_REPOSITORY,
                useClass: CalificacionRepositoryImpl,
            },
            CalificarConductorUseCase,
        ],
        exports: [
            CALIFICACION_REPOSITORY,
        ],
    })
], CalificacionesModule);
export { CalificacionesModule };
//# sourceMappingURL=calificaciones.module.js.map