import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { PASAJERO_REPOSITORY } from './features/pasajeros/dominio/repositorios/pasajero.repository.js';
import { CONDUCTOR_REPOSITORY } from './features/conductores/dominio/repositorios/conductor.repository.js';
import { Pasajero } from './features/pasajeros/dominio/entidades/pasajero.entity.js';
import { Conductor } from './features/conductores/dominio/entidades/conductor.entity.js';
import { EstadosConductor } from './compartidos/constantes/estados-conductor.enum.js';
import { EstadosDisponibilidadConductor } from './compartidos/constantes/estados-disponibilidad-conductor.enum.js';

import * as bcrypt from 'bcrypt';

async function bootstrap() {
  console.log('Iniciando Seeder...');
  const app = await NestFactory.createApplicationContext(AppModule);

  const pasajeroRepo = app.get(PASAJERO_REPOSITORY);
  const conductorRepo = app.get(CONDUCTOR_REPOSITORY);

  const passwordHash = await bcrypt.hash('12345678', 10);

  // Crear Pasajero
  try {
    console.log('Creando pasajero...');
    const pasajero = await Pasajero.crear({
      nombreCompleto: 'Juan Pasajero',
      email: 'pasajero@myride.com',
      telefono: '809-555-1234',
      passwordHash: passwordHash,
    });

    await pasajeroRepo.guardar(pasajero);
    console.log('Pasajero creado exitosamente.');
  } catch (e: any) {
    console.error('Error creando pasajero (tal vez ya existe):', e.message);
  }

  // Crear Conductor
  try {
    console.log('Creando conductor...');
    const conductor = await Conductor.crear({
      nombreCompleto: 'Pedro Conductor',
      email: 'conductor@myride.com',
      telefono: '809-555-9876',
      passwordHash: passwordHash,
      vehiculoMarca: 'Toyota',
      vehiculoModelo: 'Camry',
      vehiculoColor: 'Blanco',
      vehiculoPlaca: 'A123456',
    });

    // Aprobamos al conductor para que pueda recibir viajes (lo pone en CONECTADO)
    conductor.aprobar();

    // Lo guardamos
    await conductorRepo.guardar(conductor);
    console.log('Conductor creado exitosamente.');
  } catch (e: any) {
    console.error('Error creando conductor (tal vez ya existe):', e.message);
  }

  await app.close();
  console.log('Seeder finalizado.');
}

bootstrap();
