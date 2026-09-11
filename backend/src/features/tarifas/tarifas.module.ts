import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifaOrmEntity } from './infraestructura/persistencia/entidades/tarifa.orm-entity.js';
import { TarifaRepositoryImpl } from './infraestructura/persistencia/repositorios/tarifa.repository.impl.js';
import { TARIFA_REPOSITORY } from './dominio/repositorios/tarifa.repository.js';
import { EstimarTarifaUseCase } from './aplicacion/casos-uso/estimar-tarifa.use-case.js';

@Module({
  imports: [TypeOrmModule.forFeature([TarifaOrmEntity])],
  providers: [
    {
      provide: TARIFA_REPOSITORY,
      useClass: TarifaRepositoryImpl,
    },
    EstimarTarifaUseCase,
  ],
  exports: [TARIFA_REPOSITORY, EstimarTarifaUseCase],
})
export class TarifasModule {}
