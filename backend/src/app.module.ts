import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { PasajerosModule } from './features/pasajeros/pasajeros.module.js';
import { ConductoresModule } from './features/conductores/conductores.module.js';
import { TarifasModule } from './features/tarifas/tarifas.module.js';
import { ViajesModule } from './features/viajes/viajes.module.js';
import { PagosBalancesModule } from './features/pagos-balances/pagos-balances.module.js';
import { ConfiguracionModule } from './features/configuracion/configuracion.module.js';
import { AuthModule } from './features/auth/auth.module.js';
import { CalificacionesModule } from './features/calificaciones/calificaciones.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en toda la aplicación
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 segundos
      limit: 100, // 100 peticiones por minuto por IP
    }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASS', 'password'),
        database: configService.get<string>('DB_NAME', 'myride_mvp'),
        autoLoadEntities: true,
        synchronize: true, // Auto-crea tablas en desarrollo (¡no usar en prod!)
      }),
    }),
    PasajerosModule,
    ConductoresModule,
    TarifasModule,
    ViajesModule,
    PagosBalancesModule,
    ConfiguracionModule,
    AuthModule,
    CalificacionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
