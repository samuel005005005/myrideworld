import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BitacoraOrmEntity } from './infraestructura/persistencia/entidades/bitacora.orm-entity.js';
import { BITACORA_REPOSITORY } from './dominio/repositorios/bitacora.repository.js';
import { BitacoraRepositoryImpl } from './infraestructura/persistencia/repositorios/bitacora.repository.impl.js';
import { RegistrarBitacoraUseCase } from './aplicacion/casos-uso/registrar-bitacora.use-case.js';

@Module({
  imports: [TypeOrmModule.forFeature([BitacoraOrmEntity])],
  providers: [
    {
      provide: BITACORA_REPOSITORY,
      useClass: BitacoraRepositoryImpl,
    },
    RegistrarBitacoraUseCase,
  ],
  exports: [RegistrarBitacoraUseCase], // Exportamos para que otros módulos (Viajes, etc) lo puedan usar
})
export class BitacoraModule {}
