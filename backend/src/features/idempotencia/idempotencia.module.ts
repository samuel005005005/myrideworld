import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdempotenciaOrmEntity } from './infraestructura/persistencia/entidades/idempotencia.orm-entity.js';
import { IDEMPOTENCIA_REPOSITORY } from './dominio/repositorios/idempotencia.repository.js';
import { IdempotenciaRepositoryImpl } from './infraestructura/persistencia/repositorios/idempotencia.repository.impl.js';
import { IdempotenciaInterceptor } from './presentacion/interceptores/idempotencia.interceptor.js';

@Module({
  imports: [TypeOrmModule.forFeature([IdempotenciaOrmEntity])],
  providers: [
    {
      provide: IDEMPOTENCIA_REPOSITORY,
      useClass: IdempotenciaRepositoryImpl,
    },
    IdempotenciaInterceptor,
  ],
  exports: [IdempotenciaInterceptor],
})
export class IdempotenciaModule {}
