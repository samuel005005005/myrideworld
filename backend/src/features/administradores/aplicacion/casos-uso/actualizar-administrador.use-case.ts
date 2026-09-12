import { Inject, Injectable } from '@nestjs/common';
import type { IAdministradorRepository } from '../../dominio/repositorios/administrador.repository.js';
import { ADMINISTRADOR_REPOSITORY } from '../../dominio/repositorios/administrador.repository.js';
import { Administrador } from '../../dominio/entidades/administrador.entity.js';
import { ActualizarAdministradorDto } from '../dto/crear-actualizar-administrador.dto.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import type { IHasheadorPassword } from '../../../../compartidos/seguridad/hasheador-password.port.js';
import { HASHEADOR_PASSWORD } from '../../../../compartidos/seguridad/hasheador-password.port.js';

@Injectable()
export class ActualizarAdministradorUseCase {
  constructor(
    @Inject(ADMINISTRADOR_REPOSITORY)
    private readonly repo: IAdministradorRepository,
    @Inject(HASHEADOR_PASSWORD)
    private readonly hasheador: IHasheadorPassword,
  ) {}

  async ejecutar(
    id: string,
    dto: ActualizarAdministradorDto,
  ): Promise<Administrador> {
    const admin = await this.repo.obtenerPorId(id);
    if (!admin) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.ADMINISTRADORES.NO_ENCONTRADO,
        404,
      );
    }

    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await this.hasheador.hashear(dto.password);
    }

    admin.actualizar({
      nombreCompleto: dto.nombreCompleto,
      rolAdmin: dto.rolAdmin,
      passwordHash,
    });

    if (dto.activo === true) {
      admin.activar();
    } else if (dto.activo === false) {
      admin.desactivar();
    }

    return this.repo.guardar(admin);
  }
}
