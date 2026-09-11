import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionOrmEntity } from './infraestructura/persistencia/entidades/configuracion.orm-entity.js';
import { ConfiguracionRepositoryImpl } from './infraestructura/persistencia/repositorios/configuracion.repository.impl.js';
import { CONFIGURACION_REPOSITORY } from './dominio/repositorios/configuracion.repository.js';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ConfiguracionOrmEntity])],
  providers: [
    {
      provide: CONFIGURACION_REPOSITORY,
      useClass: ConfiguracionRepositoryImpl,
    },
  ],
  exports: [CONFIGURACION_REPOSITORY],
})
export class ConfiguracionModule {}
