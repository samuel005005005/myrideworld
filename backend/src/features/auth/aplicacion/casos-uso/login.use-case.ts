import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../dto/login.dto.js';
import type { IPasajeroRepository } from '../../../pasajeros/dominio/repositorios/pasajero.repository.js';
import { PASAJERO_REPOSITORY } from '../../../pasajeros/dominio/repositorios/pasajero.repository.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import type { IHasheadorPassword } from '../../../../compartidos/seguridad/hasheador-password.port.js';
import { HASHEADOR_PASSWORD } from '../../../../compartidos/seguridad/hasheador-password.port.js';
import type { IGeneradorToken } from '../puertos/generador-token.port.js';
import { GENERADOR_TOKEN } from '../puertos/generador-token.port.js';

const E = MENSAJES.EXCEPCIONES.AUTH;

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(GENERADOR_TOKEN) private readonly generadorToken: IGeneradorToken,
    private readonly configService: ConfigService,
    @Inject(PASAJERO_REPOSITORY) private readonly pasajeroRepository: IPasajeroRepository,
    @Inject(CONDUCTOR_REPOSITORY) private readonly conductorRepository: IConductorRepository,
    @Inject(HASHEADOR_PASSWORD) private readonly hasheadorPassword: IHasheadorPassword,
  ) {}

  async ejecutar(dto: LoginDto): Promise<{ token: string }> {
    let id: string;

    if (dto.rol === Roles.PASAJERO) {
      const pasajero = await this.pasajeroRepository.obtenerPorEmail(dto.email);
      if (!pasajero) {
        throw new DomainException(E.CREDENCIALES_INVALIDAS, 401);
      }

      const isMatch = await this.hasheadorPassword.comparar(
        dto.password,
        pasajero.passwordHash,
      );
      if (!isMatch) {
        throw new DomainException(E.CREDENCIALES_INVALIDAS, 401);
      }

      id = pasajero.id;
    } else if (dto.rol === Roles.CONDUCTOR) {
      const conductor = await this.conductorRepository.obtenerPorEmail(dto.email);
      if (!conductor) {
        throw new DomainException(E.CREDENCIALES_INVALIDAS, 401);
      }

      const isMatch = await this.hasheadorPassword.comparar(
        dto.password,
        conductor.passwordHash,
      );
      if (!isMatch) {
        throw new DomainException(E.CREDENCIALES_INVALIDAS, 401);
      }

      id = conductor.id;
    } else if (dto.rol === Roles.ADMIN) {
      const adminEmail =
        this.configService.get<string>('ADMIN_EMAIL') || 'admin@myride.com';
      const adminPassword =
        this.configService.get<string>('ADMIN_PASSWORD') || 'admin123';

      if (dto.email !== adminEmail || dto.password !== adminPassword) {
        throw new DomainException(E.CREDENCIALES_INVALIDAS, 401);
      }
      id = 'admin-1';
    } else {
      throw new DomainException(E.ROL_INVALIDO, 401);
    }

    const token = await this.generadorToken.firmar({ sub: id, rol: dto.rol });

    return { token };
  }
}
