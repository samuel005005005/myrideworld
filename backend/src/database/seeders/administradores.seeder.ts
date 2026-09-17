import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IAdministradorRepository } from '../../features/administradores/dominio/repositorios/administrador.repository.js';
import { Administrador } from '../../features/administradores/dominio/entidades/administrador.entity.js';
import { RolesAdmin } from '../../compartidos/constantes/roles-admin.enum.js';
import type { IHasheadorPassword } from '../../compartidos/seguridad/hasheador-password.port.js';

/** Usuarios demo solo vía seed (no en runtime de producto). */
const DEMOS: ReadonlyArray<{
  email: string;
  nombreCompleto: string;
  rolAdmin: RolesAdmin;
}> = [
  {
    email: 'ops@myride.com',
    nombreCompleto: 'Admin Operaciones',
    rolAdmin: RolesAdmin.OPERACIONES,
  },
  {
    email: 'finanzas@myride.com',
    nombreCompleto: 'Admin Finanzas',
    rolAdmin: RolesAdmin.FINANZAS,
  },
  {
    email: 'auditor@myride.com',
    nombreCompleto: 'Admin Auditor',
    rolAdmin: RolesAdmin.AUDITOR,
  },
];

export class AdministradoresSeeder {
  private readonly logger = new Logger(AdministradoresSeeder.name);

  constructor(
    private readonly repo: IAdministradorRepository,
    private readonly hasheador: IHasheadorPassword,
    private readonly config: ConfigService,
  ) {}

  async seed(): Promise<void> {
    const email =
      this.config.get<string>('ADMIN_EMAIL') ?? 'admin@myride.com';
    const password =
      this.config.get<string>('ADMIN_PASSWORD') ?? 'admin123';

    await this.asegurarAdmin({
      email,
      password,
      nombreCompleto: 'Super Admin',
      rolAdmin: RolesAdmin.SUPER_ADMIN,
    });

    for (const demo of DEMOS) {
      await this.asegurarAdmin({
        email: demo.email,
        password,
        nombreCompleto: demo.nombreCompleto,
        rolAdmin: demo.rolAdmin,
      });
    }
  }

  private async asegurarAdmin(datos: {
    email: string;
    password: string;
    nombreCompleto: string;
    rolAdmin: RolesAdmin;
  }): Promise<void> {
    const existente = await this.repo.obtenerPorEmail(datos.email);
    const passwordHash = await this.hasheador.hashear(datos.password);

    if (existente) {
      // Re-seed alinea hash con ADMIN_PASSWORD del .env actual.
      existente.actualizar({
        nombreCompleto: datos.nombreCompleto,
        rolAdmin: datos.rolAdmin,
        passwordHash,
      });
      if (!existente.activo) {
        existente.activar();
      }
      await this.repo.guardar(existente);
      this.logger.log(`Admin seed actualizado: ${datos.email}`);
      return;
    }

    const admin = Administrador.crear({
      nombreCompleto: datos.nombreCompleto,
      email: datos.email,
      passwordHash,
      rolAdmin: datos.rolAdmin,
      activo: true,
    });

    await this.repo.guardar(admin);
    this.logger.log(`Admin sembrado (${datos.rolAdmin}): ${datos.email}`);
  }
}
