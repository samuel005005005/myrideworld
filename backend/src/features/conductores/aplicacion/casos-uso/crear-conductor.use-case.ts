import { Inject, Injectable } from '@nestjs/common';
import type { IConductorRepository } from '../../dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../dominio/repositorios/conductor.repository.js';
import { Conductor } from '../../dominio/entidades/conductor.entity.js';
import { CrearConductorDto } from '../dto/crear-conductor.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CrearConductorUseCase {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
  ) {}

  async ejecutar(dto: CrearConductorDto): Promise<Conductor> {
    const existeEmail = await this.conductorRepository.obtenerPorEmail(dto.email);
    if (existeEmail) {
      throw new Error('El email ya está registrado.');
    }

    const passwordHash = await bcrypt.hash(dto.password ?? '123456', 10);

    const conductor = Conductor.crear({
      nombreCompleto: dto.nombreCompleto,
      email: dto.email,
      telefono: dto.telefono,
      vehiculoMarca: dto.vehiculoMarca,
      vehiculoModelo: dto.vehiculoModelo,
      vehiculoColor: dto.vehiculoColor,
      vehiculoPlaca: dto.vehiculoPlaca,
      passwordHash,
    });

    return await this.conductorRepository.guardar(conductor);
  }
}
