import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../../app.module.js';
import { ConfiguracionSeeder } from './configuracion.seeder.js';
import { UsuariosSeeder } from './usuarios.seeder.js';
import { AdministradoresSeeder } from './administradores.seeder.js';
import { ZonasTarifaSeeder } from './zonas-tarifa.seeder.js';
import { TarifasOdSeeder } from './tarifas-od.seeder.js';
import { CrearPasajeroUseCase } from '../../features/pasajeros/aplicacion/casos-uso/crear-pasajero.use-case.js';
import { CrearConductorUseCase } from '../../features/conductores/aplicacion/casos-uso/crear-conductor.use-case.js';
import { CONFIGURACION_REPOSITORY } from '../../features/configuracion/dominio/repositorios/configuracion.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../features/conductores/dominio/repositorios/conductor.repository.js';
import { ADMINISTRADOR_REPOSITORY } from '../../features/administradores/dominio/repositorios/administrador.repository.js';
import { TARIFA_REPOSITORY } from '../../features/tarifas/dominio/repositorios/tarifa.repository.js';
import { ZONA_TARIFA_REPOSITORY } from '../../features/tarifas/dominio/repositorios/zona-tarifa.repository.js';
import { HASHEADOR_PASSWORD } from '../../compartidos/seguridad/hasheador-password.port.js';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const configRepo = app.get(CONFIGURACION_REPOSITORY);
  await new ConfiguracionSeeder(configRepo).seed();

  const adminRepo = app.get(ADMINISTRADOR_REPOSITORY);
  const hasheador = app.get(HASHEADOR_PASSWORD);
  const configService = app.get(ConfigService);
  await new AdministradoresSeeder(adminRepo, hasheador, configService).seed();

  const zonaRepo = app.get(ZONA_TARIFA_REPOSITORY);
  await new ZonasTarifaSeeder(zonaRepo).seed();

  const tarifaRepo = app.get(TARIFA_REPOSITORY);
  await new TarifasOdSeeder(tarifaRepo).seed();

  const crearPasajero = app.get(CrearPasajeroUseCase);
  const crearConductor = app.get(CrearConductorUseCase);
  const conductorRepository = app.get(CONDUCTOR_REPOSITORY);
  await new UsuariosSeeder(
    crearPasajero,
    crearConductor,
    conductorRepository,
  ).seed();

  await app.close();
}
bootstrap();
