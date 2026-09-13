import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifaOrmEntity } from './infraestructura/persistencia/entidades/tarifa.orm-entity.js';
import { ZonaTarifaOrmEntity } from './infraestructura/persistencia/entidades/zona-tarifa.orm-entity.js';
import { TarifaRepositoryImpl } from './infraestructura/persistencia/repositorios/tarifa.repository.impl.js';
import { ZonaTarifaRepositoryImpl } from './infraestructura/persistencia/repositorios/zona-tarifa.repository.impl.js';
import { TARIFA_REPOSITORY } from './dominio/repositorios/tarifa.repository.js';
import { ZONA_TARIFA_REPOSITORY } from './dominio/repositorios/zona-tarifa.repository.js';
import { EstimarTarifaUseCase } from './aplicacion/casos-uso/estimar-tarifa.use-case.js';
import { CrearTarifaUseCase } from './aplicacion/casos-uso/crear-tarifa.use-case.js';
import { ListarTarifasUseCase } from './aplicacion/casos-uso/listar-tarifas.use-case.js';
import { ActualizarTarifaUseCase } from './aplicacion/casos-uso/actualizar-tarifa.use-case.js';
import { ListarZonasTarifaUseCase } from './aplicacion/casos-uso/listar-zonas-tarifa.use-case.js';
import { CrearZonaTarifaUseCase } from './aplicacion/casos-uso/crear-zona-tarifa.use-case.js';
import { TarifasController } from './presentacion/controladores/tarifas.controller.js';
import { ConfiguracionModule } from '../configuracion/configuracion.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([TarifaOrmEntity, ZonaTarifaOrmEntity]),
    ConfiguracionModule,
  ],
  controllers: [TarifasController],
  providers: [
    {
      provide: TARIFA_REPOSITORY,
      useClass: TarifaRepositoryImpl,
    },
    {
      provide: ZONA_TARIFA_REPOSITORY,
      useClass: ZonaTarifaRepositoryImpl,
    },
    EstimarTarifaUseCase,
    CrearTarifaUseCase,
    ListarTarifasUseCase,
    ActualizarTarifaUseCase,
    ListarZonasTarifaUseCase,
    CrearZonaTarifaUseCase,
  ],
  exports: [TARIFA_REPOSITORY, ZONA_TARIFA_REPOSITORY, EstimarTarifaUseCase],
})
export class TarifasModule {}
