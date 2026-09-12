import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifaOrmEntity } from './infraestructura/persistencia/entidades/tarifa.orm-entity.js';
import { TarifaRepositoryImpl } from './infraestructura/persistencia/repositorios/tarifa.repository.impl.js';
import { TARIFA_REPOSITORY } from './dominio/repositorios/tarifa.repository.js';
import { EstimarTarifaUseCase } from './aplicacion/casos-uso/estimar-tarifa.use-case.js';
import { CrearTarifaUseCase } from './aplicacion/casos-uso/crear-tarifa.use-case.js';
import { ListarTarifasUseCase } from './aplicacion/casos-uso/listar-tarifas.use-case.js';
import { ActualizarTarifaUseCase } from './aplicacion/casos-uso/actualizar-tarifa.use-case.js';
import { TarifasController } from './presentacion/controladores/tarifas.controller.js';
import { ConfiguracionModule } from '../configuracion/configuracion.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([TarifaOrmEntity]),
    ConfiguracionModule,
  ],
  controllers: [TarifasController],
  providers: [
    {
      provide: TARIFA_REPOSITORY,
      useClass: TarifaRepositoryImpl,
    },
    EstimarTarifaUseCase,
    CrearTarifaUseCase,
    ListarTarifasUseCase,
    ActualizarTarifaUseCase,
  ],
  exports: [TARIFA_REPOSITORY, EstimarTarifaUseCase],
})
export class TarifasModule {}
