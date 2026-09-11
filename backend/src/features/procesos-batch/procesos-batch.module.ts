import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EjecucionProcesoOrmEntity } from './infraestructura/persistencia/entidades/ejecucion-proceso.orm-entity.js';
import { DetalleEjecucionOrmEntity } from './infraestructura/persistencia/entidades/detalle-ejecucion.orm-entity.js';
import { EJECUCION_PROCESO_REPOSITORY } from './dominio/repositorios/ejecucion-proceso.repository.js';
import { EjecucionProcesoRepositoryImpl } from './infraestructura/persistencia/repositorios/ejecucion-proceso.repository.impl.js';
import { TimeoutViajesUseCase } from './aplicacion/casos-uso/timeout-viajes.use-case.js';
import { ProcesosBatchController } from './presentacion/controladores/procesos-batch.controller.js';
import { ViajesModule } from '../viajes/viajes.module.js';
import { ConfiguracionModule } from '../configuracion/configuracion.module.js';
import { BitacoraModule } from '../bitacora/bitacora.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EjecucionProcesoOrmEntity,
      DetalleEjecucionOrmEntity,
    ]),
    ViajesModule,
    ConfiguracionModule,
    BitacoraModule,
  ],
  controllers: [ProcesosBatchController],
  providers: [
    {
      provide: EJECUCION_PROCESO_REPOSITORY,
      useClass: EjecucionProcesoRepositoryImpl,
    },
    TimeoutViajesUseCase,
  ],
  exports: [TimeoutViajesUseCase],
})
export class ProcesosBatchModule {}
