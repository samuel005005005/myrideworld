import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConductorOrmEntity } from './infraestructura/persistencia/entidades/conductor.orm-entity.js';
import { ConductorRepositoryImpl } from './infraestructura/persistencia/repositorios/conductor.repository.impl.js';
import { CONDUCTOR_REPOSITORY } from './dominio/repositorios/conductor.repository.js';

import { CrearConductorUseCase } from './aplicacion/casos-uso/crear-conductor.use-case.js';
import { ConductoresController } from './presentacion/controladores/conductores.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ConductorOrmEntity])],
  controllers: [ConductoresController],
  providers: [
    {
      provide: CONDUCTOR_REPOSITORY,
      useClass: ConductorRepositoryImpl,
    },
    CrearConductorUseCase,
  ],
  exports: [CONDUCTOR_REPOSITORY, CrearConductorUseCase],
})
export class ConductoresModule {}
