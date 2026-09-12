import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../dto/login.dto.js';
import type { IPasajeroRepository } from '../../../pasajeros/dominio/repositorios/pasajero.repository.js';
import { PASAJERO_REPOSITORY } from '../../../pasajeros/dominio/repositorios/pasajero.repository.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import type { IAdministradorRepository } from '../../../administradores/dominio/repositorios/administrador.repository.js';
import { ADMINISTRADOR_REPOSITORY } from '../../../administradores/dominio/repositorios/administrador.repository.js';
import { RolesAdmin } from '../../../../compartidos/constantes/roles-admin.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import type { IHasheadorPassword } from '../../../../compartidos/seguridad/hasheador-password.port.js';
import { HASHEADOR_PASSWORD } from '../../../../compartidos/seguridad/hasheador-password.port.js';
import type { IGeneradorToken } from '../puertos/generador-token.port.js';
import { GENERADOR_TOKEN } from '../puertos/generador-token.port.js';

const E = MENSAJES.EXCEPCIONES.AUTH;

export interface LoginResultado {
  token: string;
  adminRol?: RolesAdmin;
  nombreCompleto?: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(GENERADOR_TOKEN) private readonly generadorToken: IGeneradorToken,
    private readonly configService: ConfigService,
    @Inject(PASAJERO_REPOSITORY) private readonly pasajeroRepository: IPasajeroRepository,
    @Inject(CONDUCTOR_REPOSITORY) private readonly conductorRepository: IConductorRepository,
    @Inject(ADMINISTRADOR_REPOSITORY)
    private readonly administradorRepository: IAdministradorRepository,
    @Inject(HASHEADOR_PASSWORD) private readonly hasheadorPassword: IHasheadorPassword,
  ) {}

  async ejecutar(dto: LoginDto): Promise<LoginResultado> {
    let id: string;
    let adminRol: RolesAdmin | undefined;
    let nombreCompleto: string | undefined;

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
      const admin = await this.administradorRepository.obtenerPorEmail(dto.email);
      if (admin) {
        if (!admin.activo) {
          throw new DomainException(E.ADMIN_INACTIVO, 401);
        }
        const isMatch = await this.hasheadorPassword.comparar(
          dto.password,
          admin.passwordHash,
        );
        if (!isMatch) {
          throw new DomainException(E.CREDENCIALES_INVALIDAS, 401);
        }
        id = admin.id;
        adminRol = admin.rolAdmin;
        nombreCompleto = admin.nombreCompleto;
      } else {
        // Fallback temporal un release: credenciales env si aún no hay seed
        const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
        const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
        if (
          !adminEmail ||
          !adminPassword ||
          dto.email !== adminEmail ||
          dto.password !== adminPassword
        ) {
          throw new DomainException(E.CREDENCIALES_INVALIDAS, 401);
        }
        id = 'admin-env-fallback';
        adminRol = RolesAdmin.SUPER_ADMIN;
        nombreCompleto = 'Admin (env)';
      }
    } else {
      throw new DomainException(E.ROL_INVALIDO, 401);
    }

    const payload: Record<string, unknown> = { sub: id, rol: dto.rol };
    if (adminRol) {
      payload.adminRol = adminRol;
    }

    const token = await this.generadorToken.firmar(payload);

    return { token, adminRol, nombreCompleto };
  }
}
