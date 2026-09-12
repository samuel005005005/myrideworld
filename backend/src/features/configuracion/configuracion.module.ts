import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionOrmEntity } from './infraestructura/persistencia/entidades/configuracion.orm-entity.js';
import { ConfiguracionRepositoryImpl } from './infraestructura/persistencia/repositorios/configuracion.repository.impl.js';
import { CONFIGURACION_REPOSITORY } from './dominio/repositorios/configuracion.repository.js';
import { ListarConfiguracionesUseCase } from './aplicacion/casos-uso/listar-configuraciones.use-case.js';
import { ListarConfiguracionesPublicasUseCase } from './aplicacion/casos-uso/listar-configuraciones-publicas.use-case.js';
import { ActualizarConfiguracionUseCase } from './aplicacion/casos-uso/actualizar-configuracion.use-case.js';
import { ConfiguracionController } from './presentacion/controladores/configuracion.controller.js';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ConfiguracionOrmEntity])],
  controllers: [ConfiguracionController],
  providers: [
    {
      provide: CONFIGURACION_REPOSITORY,
      useClass: ConfiguracionRepositoryImpl,
    },
    ListarConfiguracionesUseCase,
    ListarConfiguracionesPublicasUseCase,
    ActualizarConfiguracionUseCase,
  ],
  exports: [CONFIGURACION_REPOSITORY],
})
export class ConfiguracionModule {}
