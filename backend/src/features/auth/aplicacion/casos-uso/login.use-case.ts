import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto.js';
import type { IPasajeroRepository } from '../../../pasajeros/dominio/repositorios/pasajero.repository.js';
import { PASAJERO_REPOSITORY } from '../../../pasajeros/dominio/repositorios/pasajero.repository.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const E = MENSAJES.EXCEPCIONES.AUTH;

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(PASAJERO_REPOSITORY) private readonly pasajeroRepository: IPasajeroRepository,
    @Inject(CONDUCTOR_REPOSITORY) private readonly conductorRepository: IConductorRepository,
  ) {}

  async ejecutar(dto: LoginDto): Promise<{ token: string }> {
    let id: string;

    if (dto.rol === Roles.PASAJERO) {
      const pasajero = await this.pasajeroRepository.obtenerPorEmail(dto.email);
      if (!pasajero) throw new UnauthorizedException(E.CREDENCIALES_INVALIDAS);
      
      const isMatch = await bcrypt.compare(dto.password, pasajero.passwordHash);
      if (!isMatch) throw new UnauthorizedException(E.CREDENCIALES_INVALIDAS);
      
      id = pasajero.id;
    } else if (dto.rol === Roles.CONDUCTOR) {
      const conductor = await this.conductorRepository.obtenerPorEmail(dto.email);
      if (!conductor) throw new UnauthorizedException(E.CREDENCIALES_INVALIDAS);
      
      const isMatch = await bcrypt.compare(dto.password, conductor.passwordHash);
      if (!isMatch) throw new UnauthorizedException(E.CREDENCIALES_INVALIDAS);
      
      id = conductor.id;
    } else if (dto.rol === Roles.ADMIN) {
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'admin@myride.com';
      const adminPassword = this.configService.get<string>('ADMIN_PASSWORD') || 'admin123';
      
      if (dto.email !== adminEmail || dto.password !== adminPassword) {
        throw new UnauthorizedException(E.CREDENCIALES_INVALIDAS);
      }
      id = 'admin-1';
    } else {
      throw new UnauthorizedException(E.ROL_INVALIDO);
    }

    const payload = { sub: id, rol: dto.rol };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }
}
