import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto.js';
import type { IPasajeroRepository } from '../../../pasajeros/dominio/repositorios/pasajero.repository.js';
import { PASAJERO_REPOSITORY } from '../../../pasajeros/dominio/repositorios/pasajero.repository.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(PASAJERO_REPOSITORY) private readonly pasajeroRepository: IPasajeroRepository,
    @Inject(CONDUCTOR_REPOSITORY) private readonly conductorRepository: IConductorRepository,
  ) {}

  async ejecutar(dto: LoginDto): Promise<{ token: string }> {
    let id: string;

    if (dto.rol === Roles.PASAJERO) {
      const pasajero = await this.pasajeroRepository.obtenerPorEmail(dto.email);
      if (!pasajero) throw new UnauthorizedException('Credenciales inválidas');
      
      const isMatch = await bcrypt.compare(dto.password, pasajero.passwordHash);
      if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');
      
      id = pasajero.id;
    } else {
      const conductor = await this.conductorRepository.obtenerPorEmail(dto.email);
      if (!conductor) throw new UnauthorizedException('Credenciales inválidas');
      
      const isMatch = await bcrypt.compare(dto.password, conductor.passwordHash);
      if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');
      
      id = conductor.id;
    }

    const payload = { sub: id, rol: dto.rol };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }
}
