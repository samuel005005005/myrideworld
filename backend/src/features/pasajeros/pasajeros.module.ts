import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasajeroOrmEntity } from './infraestructura/persistencia/entidades/pasajero.orm-entity.js';
import { PasajeroRepositoryImpl } from './infraestructura/persistencia/repositorios/pasajero.repository.impl.js';
import { PASAJERO_REPOSITORY } from './dominio/repositorios/pasajero.repository.js';

import { CrearPasajeroUseCase } from './aplicacion/casos-uso/crear-pasajero.use-case.js';
import { ObtenerPasajeroUseCase } from './aplicacion/casos-uso/obtener-pasajero.use-case.js';
import { ActualizarPasajeroUseCase } from './aplicacion/casos-uso/actualizar-pasajero.use-case.js';
import { PasajerosController } from './presentacion/controladores/pasajeros.controller.js';
import { SeguridadModule } from '../../compartidos/seguridad/seguridad.module.js';

@Module({
  imports: [SeguridadModule, TypeOrmModule.forFeature([PasajeroOrmEntity])],
  controllers: [PasajerosController],
  providers: [
    {
      provide: PASAJERO_REPOSITORY,
      useClass: PasajeroRepositoryImpl,
    },
    CrearPasajeroUseCase,
    ObtenerPasajeroUseCase,
    ActualizarPasajeroUseCase,
  ],
  exports: [PASAJERO_REPOSITORY, CrearPasajeroUseCase, ObtenerPasajeroUseCase, ActualizarPasajeroUseCase],
})
export class PasajerosModule {}
