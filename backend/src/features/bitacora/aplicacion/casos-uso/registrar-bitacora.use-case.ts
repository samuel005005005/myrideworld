import { Injectable, Inject, Logger } from '@nestjs/common';
import { BITACORA_REPOSITORY } from '../../dominio/repositorios/bitacora.repository.js';
import type { IBitacoraRepository } from '../../dominio/repositorios/bitacora.repository.js';
import { RegistrarBitacoraDto } from '../dto/registrar-bitacora.dto.js';
import { Bitacora } from '../../dominio/entidades/bitacora.entity.js';

@Injectable()
export class RegistrarBitacoraUseCase {
  private readonly logger = new Logger(RegistrarBitacoraUseCase.name);

  constructor(
    @Inject(BITACORA_REPOSITORY)
    private readonly bitacoraRepository: IBitacoraRepository,
  ) {}

  async ejecutar(dto: RegistrarBitacoraDto): Promise<void> {
    try {
      const bitacora = Bitacora.registrar({
        tipoEvento: dto.tipoEvento,
        servicioSistema: dto.servicioSistema,
        detalle: dto.detalle,
        criterioConsulta: dto.criterioConsulta,
        request: dto.request,
        response: dto.response,
        usuario: dto.usuario,
        ip: dto.ip,
        entidadId: dto.entidadId,
        accion: dto.accion,
        duracionMs: dto.duracionMs,
      });

      await this.bitacoraRepository.guardar(bitacora);
    } catch (error: any) {
      // Si falla la auditoría, no rompemos el flujo principal pero sí logueamos agresivamente
      this.logger.error(`Error guardando auditoría: ${error.message}`, error.stack);
    }
  }
}
