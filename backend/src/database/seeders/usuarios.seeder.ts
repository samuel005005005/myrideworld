import { Injectable, Logger, Inject } from '@nestjs/common';
import { CrearPasajeroUseCase } from '../../features/pasajeros/aplicacion/casos-uso/crear-pasajero.use-case.js';
import { CrearConductorUseCase } from '../../features/conductores/aplicacion/casos-uso/crear-conductor.use-case.js';
import type { IConductorRepository } from '../../features/conductores/dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../features/conductores/dominio/repositorios/conductor.repository.js';
import { EstadosConductor } from '../../compartidos/constantes/estados-conductor.enum.js';

/** Cuentas demo solo vía seed (no en runtime de producto). */
const PASAJEROS_DEMO: ReadonlyArray<{
  nombreCompleto: string;
  email: string;
  password: string;
  telefono: string;
}> = [
  {
    nombreCompleto: 'Pasajero Demo 1',
    email: 'pasajero@myride.com',
    password: '12345678',
    telefono: '+18095550101',
  },
  {
    nombreCompleto: 'Pasajero Demo 2',
    email: 'pasajero2@myride.com',
    password: '12345678',
    telefono: '+18095550102',
  },
];

const CONDUCTORES_DEMO: ReadonlyArray<{
  nombreCompleto: string;
  email: string;
  password: string;
  telefono: string;
  vehiculoMarca: string;
  vehiculoModelo: string;
  vehiculoColor: string;
  vehiculoPlaca: string;
  lat: number;
  lng: number;
}> = [
  {
    nombreCompleto: 'Conductor Demo 1',
    email: 'conductor@myride.com',
    password: '12345678',
    telefono: '+18095550201',
    vehiculoMarca: 'Toyota',
    vehiculoModelo: 'Corolla',
    vehiculoColor: 'Rojo',
    vehiculoPlaca: 'ABC-1234',
    lat: 18.582,
    lng: -68.3971,
  },
  {
    nombreCompleto: 'Conductor Demo 2',
    email: 'conductor2@myride.com',
    password: '12345678',
    telefono: '+18095550202',
    vehiculoMarca: 'Hyundai',
    vehiculoModelo: 'Elantra',
    vehiculoColor: 'Negro',
    vehiculoPlaca: 'XYZ-5678',
    lat: 18.49,
    lng: -68.4,
  },
];

@Injectable()
export class UsuariosSeeder {
  private readonly logger = new Logger(UsuariosSeeder.name);

  constructor(
    private readonly crearPasajero: CrearPasajeroUseCase,
    private readonly crearConductor: CrearConductorUseCase,
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
  ) {}

  async seed() {
    this.logger.log('Iniciando seed de Usuarios...');

    for (const p of PASAJEROS_DEMO) {
      try {
        await this.crearPasajero.ejecutar(p);
        this.logger.log(`Pasajero creado: ${p.email}`);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        this.logger.log(`Pasajero omitido ${p.email}: ${msg}`);
      }
    }

    for (const c of CONDUCTORES_DEMO) {
      try {
        await this.crearConductor.ejecutar({
          nombreCompleto: c.nombreCompleto,
          email: c.email,
          password: c.password,
          telefono: c.telefono,
          vehiculoMarca: c.vehiculoMarca,
          vehiculoModelo: c.vehiculoModelo,
          vehiculoColor: c.vehiculoColor,
          vehiculoPlaca: c.vehiculoPlaca,
        });
        this.logger.log(`Conductor creado: ${c.email}`);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        this.logger.log(`Conductor omitido ${c.email}: ${msg}`);
      }

      await this.aprobarYUbicar(c.email, c.lat, c.lng);
    }
  }

  private async aprobarYUbicar(
    email: string,
    lat: number,
    lng: number,
  ): Promise<void> {
    const conductor = await this.conductorRepository.obtenerPorEmail(email);
    if (!conductor) {
      return;
    }
    try {
      if (conductor.estadoAprobacion !== EstadosConductor.APROBADO) {
        conductor.aprobar();
      }
      conductor.actualizarUbicacion(lat, lng);
      await this.conductorRepository.guardar(conductor);
      this.logger.log(`Conductor aprobado y geolocalizado: ${email}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      this.logger.log(`No se pudo preparar conductor ${email}: ${msg}`);
    }
  }
}
