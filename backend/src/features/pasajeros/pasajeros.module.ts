import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasajeroOrmEntity } from './infraestructura/persistencia/entidades/pasajero.orm-entity.js';
import { PasajeroRepositoryImpl } from './infraestructura/persistencia/repositorios/pasajero.repository.impl.js';
import { PASAJERO_REPOSITORY } from './dominio/repositorios/pasajero.repository.js';

import { CrearPasajeroUseCase } from './aplicacion/casos-uso/crear-pasajero.use-case.js';
import { PasajerosController } from './presentacion/controladores/pasajeros.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([PasajeroOrmEntity])],
  controllers: [PasajerosController],
  providers: [
    {
      provide: PASAJERO_REPOSITORY,
      useClass: PasajeroRepositoryImpl,
    },
    CrearPasajeroUseCase,
  ],
  exports: [PASAJERO_REPOSITORY, CrearPasajeroUseCase],
})
export class PasajerosModule {}
