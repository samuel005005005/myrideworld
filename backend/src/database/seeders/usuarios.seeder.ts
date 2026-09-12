import { Injectable, Logger, Inject } from '@nestjs/common';
import { CrearPasajeroUseCase } from '../../features/pasajeros/aplicacion/casos-uso/crear-pasajero.use-case.js';
import { CrearConductorUseCase } from '../../features/conductores/aplicacion/casos-uso/crear-conductor.use-case.js';
import type { IConductorRepository } from '../../features/conductores/dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../features/conductores/dominio/repositorios/conductor.repository.js';
import { EstadosConductor } from '../../compartidos/constantes/estados-conductor.enum.js';

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

    try {
      await this.crearPasajero.ejecutar({
        nombreCompleto: 'Pasajero de Prueba',
        email: 'pasajero@myride.com',
        password: '12345678',
        telefono: '+1234567890',
      });
      this.logger.log('Pasajero de prueba creado.');
    } catch (e: any) {
      this.logger.log(`Pasajero de prueba omitido (ya existe o error: ${e.message})`);
    }

    try {
      await this.crearConductor.ejecutar({
        nombreCompleto: 'Conductor de Prueba',
        email: 'conductor@myride.com',
        password: '12345678',
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

    const conductor = await this.conductorRepository.obtenerPorEmail('conductor@myride.com');
    if (conductor) {
      try {
        if (conductor.estadoAprobacion !== EstadosConductor.APROBADO) {
          conductor.aprobar();
        }
        conductor.actualizarUbicacion(18.582, -68.3971);
        await this.conductorRepository.guardar(conductor);
        this.logger.log('Conductor de prueba aprobado y geolocalizado.');
      } catch (e: any) {
        this.logger.log(`No se pudo preparar conductor: ${e.message}`);
      }
    }
  }
}
