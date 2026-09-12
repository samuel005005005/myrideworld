import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BitacoraOrmEntity } from './infraestructura/persistencia/entidades/bitacora.orm-entity.js';
import { BITACORA_REPOSITORY } from './dominio/repositorios/bitacora.repository.js';
import { BitacoraRepositoryImpl } from './infraestructura/persistencia/repositorios/bitacora.repository.impl.js';
import { RegistrarBitacoraUseCase } from './aplicacion/casos-uso/registrar-bitacora.use-case.js';
import { ListarBitacoraUseCase } from './aplicacion/casos-uso/listar-bitacora.use-case.js';
import { BitacoraController } from './presentacion/controladores/bitacora.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([BitacoraOrmEntity])],
  controllers: [BitacoraController],
  providers: [
    {
      provide: BITACORA_REPOSITORY,
      useClass: BitacoraRepositoryImpl,
    },
    RegistrarBitacoraUseCase,
    ListarBitacoraUseCase,
  ],
  exports: [RegistrarBitacoraUseCase, BITACORA_REPOSITORY],
})
export class BitacoraModule {}
