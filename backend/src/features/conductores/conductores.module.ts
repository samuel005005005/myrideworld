import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConductorOrmEntity } from './infraestructura/persistencia/entidades/conductor.orm-entity.js';
import { ConductorRepositoryImpl } from './infraestructura/persistencia/repositorios/conductor.repository.impl.js';
import { CONDUCTOR_REPOSITORY } from './dominio/repositorios/conductor.repository.js';

import { CrearConductorUseCase } from './aplicacion/casos-uso/crear-conductor.use-case.js';
import { ConductoresController } from './presentacion/controladores/conductores.controller.js';
import { AprobarConductorUseCase } from './aplicacion/casos-uso/aprobar-conductor.use-case.js';
import { RechazarConductorUseCase } from './aplicacion/casos-uso/rechazar-conductor.use-case.js';
import { SuspenderConductorUseCase } from './aplicacion/casos-uso/suspender-conductor.use-case.js';
import { ReactivarConductorUseCase } from './aplicacion/casos-uso/reactivar-conductor.use-case.js';
import { ListarConductoresUseCase } from './aplicacion/casos-uso/listar-conductores.use-case.js';
import { SubirDocumentosUseCase } from './aplicacion/casos-uso/subir-documentos.use-case.js';
import { ObtenerConductorUseCase } from './aplicacion/casos-uso/obtener-conductor.use-case.js';
import { ActualizarConductorUseCase } from './aplicacion/casos-uso/actualizar-conductor.use-case.js';
import { ActualizarDisponibilidadUseCase } from './aplicacion/casos-uso/actualizar-disponibilidad.use-case.js';
import { RegistrarTokenPushUseCase } from './aplicacion/casos-uso/registrar-token-push.use-case.js';
import { ActualizarUbicacionConductorUseCase } from './aplicacion/casos-uso/actualizar-ubicacion-conductor.use-case.js';
import { ListarConductoresCercanosUseCase } from './aplicacion/casos-uso/listar-conductores-cercanos.use-case.js';
import { FlotaConductoresActivosRegistry } from './aplicacion/servicios/flota-conductores-activos.registry.js';
import { SeguridadModule } from '../../compartidos/seguridad/seguridad.module.js';

@Module({
  imports: [
    SeguridadModule,
    TypeOrmModule.forFeature([ConductorOrmEntity]),
  ],
  controllers: [ConductoresController],
  providers: [
    {
      provide: CONDUCTOR_REPOSITORY,
      useClass: ConductorRepositoryImpl,
    },
    CrearConductorUseCase,
    AprobarConductorUseCase,
    RechazarConductorUseCase,
    SuspenderConductorUseCase,
    ReactivarConductorUseCase,
    ListarConductoresUseCase,
    SubirDocumentosUseCase,
    ObtenerConductorUseCase,
    ActualizarConductorUseCase,
    ActualizarDisponibilidadUseCase,
    RegistrarTokenPushUseCase,
    ActualizarUbicacionConductorUseCase,
    ListarConductoresCercanosUseCase,
    FlotaConductoresActivosRegistry,
  ],
  exports: [
    CONDUCTOR_REPOSITORY,
    CrearConductorUseCase,
    SubirDocumentosUseCase,
    ObtenerConductorUseCase,
    ActualizarConductorUseCase,
    ActualizarDisponibilidadUseCase,
    FlotaConductoresActivosRegistry,
  ],
})
export class ConductoresModule {}
