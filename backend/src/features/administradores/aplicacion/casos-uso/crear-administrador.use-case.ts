import { Inject, Injectable } from '@nestjs/common';
import type { IAdministradorRepository } from '../../dominio/repositorios/administrador.repository.js';
import { ADMINISTRADOR_REPOSITORY } from '../../dominio/repositorios/administrador.repository.js';
import { Administrador } from '../../dominio/entidades/administrador.entity.js';
import { CrearAdministradorDto } from '../dto/crear-actualizar-administrador.dto.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import type { IHasheadorPassword } from '../../../../compartidos/seguridad/hasheador-password.port.js';
import { HASHEADOR_PASSWORD } from '../../../../compartidos/seguridad/hasheador-password.port.js';

@Injectable()
export class CrearAdministradorUseCase {
  constructor(
    @Inject(ADMINISTRADOR_REPOSITORY)
    private readonly repo: IAdministradorRepository,
    @Inject(HASHEADOR_PASSWORD)
    private readonly hasheador: IHasheadorPassword,
  ) {}

  async ejecutar(dto: CrearAdministradorDto): Promise<Administrador> {
    const existe = await this.repo.obtenerPorEmail(dto.email);
    if (existe) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.ADMINISTRADORES.EMAIL_REGISTRADO,
      );
    }

    const passwordHash = await this.hasheador.hashear(dto.password);
    const admin = Administrador.crear({
      nombreCompleto: dto.nombreCompleto,
      email: dto.email,
      passwordHash,
      rolAdmin: dto.rolAdmin,
    });

    return this.repo.guardar(admin);
  }
}
