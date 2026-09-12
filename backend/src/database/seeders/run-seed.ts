import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../../app.module.js';
import { ConfiguracionSeeder } from './configuracion.seeder.js';
import { UsuariosSeeder } from './usuarios.seeder.js';
import { AdministradoresSeeder } from './administradores.seeder.js';
import { TarifasOdSeeder } from './tarifas-od.seeder.js';
import { CrearPasajeroUseCase } from '../../features/pasajeros/aplicacion/casos-uso/crear-pasajero.use-case.js';
import { CrearConductorUseCase } from '../../features/conductores/aplicacion/casos-uso/crear-conductor.use-case.js';
import { CONFIGURACION_REPOSITORY } from '../../features/configuracion/dominio/repositorios/configuracion.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../features/conductores/dominio/repositorios/conductor.repository.js';
import { ADMINISTRADOR_REPOSITORY } from '../../features/administradores/dominio/repositorios/administrador.repository.js';
import { TARIFA_REPOSITORY } from '../../features/tarifas/dominio/repositorios/tarifa.repository.js';
import { HASHEADOR_PASSWORD } from '../../compartidos/seguridad/hasheador-password.port.js';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const configRepo = app.get(CONFIGURACION_REPOSITORY);
  const configSeeder = new ConfiguracionSeeder(configRepo);
  await configSeeder.seed();

  const adminRepo = app.get(ADMINISTRADOR_REPOSITORY);
  const hasheador = app.get(HASHEADOR_PASSWORD);
  const configService = app.get(ConfigService);
  const adminSeeder = new AdministradoresSeeder(
    adminRepo,
    hasheador,
    configService,
  );
  await adminSeeder.seed();

  const tarifaRepo = app.get(TARIFA_REPOSITORY);
  const tarifasOdSeeder = new TarifasOdSeeder(tarifaRepo);
  await tarifasOdSeeder.seed();

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
