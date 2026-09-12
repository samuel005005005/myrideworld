import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministradorOrmEntity } from './infraestructura/persistencia/entidades/administrador.orm-entity.js';
import { AdministradorRepositoryImpl } from './infraestructura/persistencia/repositorios/administrador.repository.impl.js';
import { ADMINISTRADOR_REPOSITORY } from './dominio/repositorios/administrador.repository.js';
import { CrearAdministradorUseCase } from './aplicacion/casos-uso/crear-administrador.use-case.js';
import { ListarAdministradoresUseCase } from './aplicacion/casos-uso/listar-administradores.use-case.js';
import { ActualizarAdministradorUseCase } from './aplicacion/casos-uso/actualizar-administrador.use-case.js';
import { AdministradoresController } from './presentacion/controladores/administradores.controller.js';
import { SeguridadModule } from '../../compartidos/seguridad/seguridad.module.js';

@Module({
  imports: [SeguridadModule, TypeOrmModule.forFeature([AdministradorOrmEntity])],
  controllers: [AdministradoresController],
  providers: [
    {
      provide: ADMINISTRADOR_REPOSITORY,
      useClass: AdministradorRepositoryImpl,
    },
    CrearAdministradorUseCase,
    ListarAdministradoresUseCase,
    ActualizarAdministradorUseCase,
  ],
  exports: [
    ADMINISTRADOR_REPOSITORY,
    CrearAdministradorUseCase,
    ListarAdministradoresUseCase,
    ActualizarAdministradorUseCase,
  ],
})
export class AdministradoresModule {}
