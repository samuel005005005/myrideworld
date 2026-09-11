import { Injectable, Logger } from '@nestjs/common';
import { CrearPasajeroUseCase } from '../../features/pasajeros/aplicacion/casos-uso/crear-pasajero.use-case.js';
import { CrearConductorUseCase } from '../../features/conductores/aplicacion/casos-uso/crear-conductor.use-case.js';

@Injectable()
export class UsuariosSeeder {
  private readonly logger = new Logger(UsuariosSeeder.name);

  constructor(
    private readonly crearPasajero: CrearPasajeroUseCase,
    private readonly crearConductor: CrearConductorUseCase,
  ) {}

  async seed() {
    this.logger.log('Iniciando seed de Usuarios...');

    // 1. Crear Pasajero
    try {
      await this.crearPasajero.ejecutar({
        nombreCompleto: 'Pasajero de Prueba',
        email: 'pasajero@myride.com',
        password: 'Password123!',
        telefono: '+1234567890',
      });
      this.logger.log('Pasajero de prueba creado.');
    } catch (e: any) {
      this.logger.log(`Pasajero de prueba omitido (ya existe o error: ${e.message})`);
    }

    // 2. Crear Conductor
    try {
      await this.crearConductor.ejecutar({
        nombreCompleto: 'Conductor de Prueba',
        email: 'conductor@myride.com',
        password: 'Password123!',
        telefono: '+1987654321',
        vehiculoMarca: 'Toyota',
        vehiculoModelo: 'Corolla',
        vehiculoColor: 'Rojo',
        vehiculoPlaca: 'ABC-1234',
      });
      this.logger.log('Conductor de prueba creado.');
    } catch (e: any) {
      this.logger.log(`Conductor de prueba omitido (ya existe o error: ${e.message})`);
    }
  }
}
