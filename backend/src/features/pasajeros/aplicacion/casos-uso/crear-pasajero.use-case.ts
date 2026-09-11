import { Inject, Injectable } from '@nestjs/common';
import type { IPasajeroRepository } from '../../dominio/repositorios/pasajero.repository.js';
import { PASAJERO_REPOSITORY } from '../../dominio/repositorios/pasajero.repository.js';
import { Pasajero } from '../../dominio/entidades/pasajero.entity.js';
import { CrearPasajeroDto } from '../dto/crear-pasajero.dto.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CrearPasajeroUseCase {
  constructor(
    @Inject(PASAJERO_REPOSITORY)
    private readonly pasajeroRepository: IPasajeroRepository,
  ) {}

  async ejecutar(dto: CrearPasajeroDto): Promise<Pasajero> {
    const existeEmail = await this.pasajeroRepository.obtenerPorEmail(dto.email);
    if (existeEmail) {
      throw new DomainException(MENSAJES.EXCEPCIONES.PASAJEROS.EMAIL_REGISTRADO);
    }

    const passwordHash = await bcrypt.hash(dto.password ?? '123456', 10);

    const pasajero = Pasajero.crear({
      nombreCompleto: dto.nombreCompleto,
      email: dto.email,
      telefono: dto.telefono,
      passwordHash: passwordHash,
    });

    return await this.pasajeroRepository.guardar(pasajero);
  }
}
