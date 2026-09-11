import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConductorOrmEntity } from './infraestructura/persistencia/entidades/conductor.orm-entity.js';
import { ConductorRepositoryImpl } from './infraestructura/persistencia/repositorios/conductor.repository.impl.js';
import { CONDUCTOR_REPOSITORY } from './dominio/repositorios/conductor.repository.js';

import { CrearConductorUseCase } from './aplicacion/casos-uso/crear-conductor.use-case.js';
import { ConductoresController } from './presentacion/controladores/conductores.controller.js';
import { AprobarConductorUseCase } from './aplicacion/casos-uso/aprobar-conductor.use-case.js';
import { ListarConductoresUseCase } from './aplicacion/casos-uso/listar-conductores.use-case.js';
import { SubirDocumentosUseCase } from './aplicacion/casos-uso/subir-documentos.use-case.js';
import { ObtenerConductorUseCase } from './aplicacion/casos-uso/obtener-conductor.use-case.js';
import { ActualizarConductorUseCase } from './aplicacion/casos-uso/actualizar-conductor.use-case.js';

@Module({
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
    SubirDocumentosUseCase,
    ObtenerConductorUseCase,
    ActualizarConductorUseCase,
  ],
  exports: [CONDUCTOR_REPOSITORY, CrearConductorUseCase, SubirDocumentosUseCase, ObtenerConductorUseCase, ActualizarConductorUseCase],
})
export class ConductoresModule {}
