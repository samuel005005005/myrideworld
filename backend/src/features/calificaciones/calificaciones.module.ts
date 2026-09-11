import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalificacionOrmEntity } from './infraestructura/persistencia/entidades/calificacion.orm-entity.js';
import { CalificacionRepositoryImpl } from './infraestructura/persistencia/repositorios/calificacion.repository.impl.js';
import { CALIFICACION_REPOSITORY } from './dominio/repositorios/calificacion.repository.js';
import { CalificarConductorUseCase } from './aplicacion/casos-uso/calificar-conductor.use-case.js';
import { CalificacionesController } from './presentacion/controladores/calificaciones.controller.js';
import { ViajesModule } from '../viajes/viajes.module.js';

@Module({
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
export class CalificacionesModule {}
