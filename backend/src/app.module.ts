import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HttpThrottlerGuard } from './compartidos/middlewares/http-throttler.guard.js';

import { PasajerosModule } from './features/pasajeros/pasajeros.module.js';
import { ConductoresModule } from './features/conductores/conductores.module.js';
import { TarifasModule } from './features/tarifas/tarifas.module.js';
import { ViajesModule } from './features/viajes/viajes.module.js';
import { PagosBalancesModule } from './features/pagos-balances/pagos-balances.module.js';
import { ConfiguracionModule } from './features/configuracion/configuracion.module.js';
import { AuthModule } from './features/auth/auth.module.js';
import { CalificacionesModule } from './features/calificaciones/calificaciones.module.js';
import { BitacoraModule } from './features/bitacora/bitacora.module.js';
import { ProcesosBatchModule } from './features/procesos-batch/procesos-batch.module.js';
import { IdempotenciaModule } from './features/idempotencia/idempotencia.module.js';
import { AdministradoresModule } from './features/administradores/administradores.module.js';
import { AdminDashboardModule } from './features/admin-dashboard/admin-dashboard.module.js';
import { SesionesModule } from './compartidos/seguridad/sesiones.module.js';
import { MENSAJES } from './compartidos/constantes/mensajes.const.js';

function obtenerJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(MENSAJES.EXCEPCIONES.CONFIG.JWT_SECRET_REQUERIDO);
  }
  return secret;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        secret: obtenerJwtSecret(),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    SesionesModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV', 'development');
        return {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USER', 'postgres'),
          password: configService.get<string>('DB_PASS', 'password'),
          database: configService.get<string>('DB_NAME', 'myride_mvp'),
          autoLoadEntities: true,
          synchronize: nodeEnv !== 'production',
        };
      },
    }),
    PasajerosModule,
    ConductoresModule,
    TarifasModule,
    ViajesModule,
    PagosBalancesModule,
    ConfiguracionModule,
    AuthModule,
    CalificacionesModule,
    BitacoraModule,
    ProcesosBatchModule,
    IdempotenciaModule,
    AdministradoresModule,
    AdminDashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: HttpThrottlerGuard,
    },
  ],
})
export class AppModule {}
