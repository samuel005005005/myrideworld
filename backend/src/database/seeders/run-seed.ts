import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module.js';
import { ConfiguracionSeeder } from './configuracion.seeder.js';
import { UsuariosSeeder } from './usuarios.seeder.js';
import { CrearPasajeroUseCase } from '../../features/pasajeros/aplicacion/casos-uso/crear-pasajero.use-case.js';
import { CrearConductorUseCase } from '../../features/conductores/aplicacion/casos-uso/crear-conductor.use-case.js';
import { CONFIGURACION_REPOSITORY } from '../../features/configuracion/dominio/repositorios/configuracion.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../features/conductores/dominio/repositorios/conductor.repository.js';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const configRepo = app.get(CONFIGURACION_REPOSITORY);
  const configSeeder = new ConfiguracionSeeder(configRepo);
  await configSeeder.seed();

  const crearPasajero = app.get(CrearPasajeroUseCase);
  const crearConductor = app.get(CrearConductorUseCase);
  const conductorRepository = app.get(CONDUCTOR_REPOSITORY);
  const usuariosSeeder = new UsuariosSeeder(
    crearPasajero,
    crearConductor,
    conductorRepository,
  );
  await usuariosSeeder.seed();

  await app.close();
}
bootstrap();
