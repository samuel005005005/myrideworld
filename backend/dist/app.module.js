var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
import { BitacoraModule } from './features/bitacora/bitacora.module.js';
import { ProcesosBatchModule } from './features/procesos-batch/procesos-batch.module.js';
import { IdempotenciaModule } from './features/idempotencia/idempotencia.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
            }),
            ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            TypeOrmModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USER', 'postgres'),
                    password: configService.get('DB_PASS', 'password'),
                    database: configService.get('DB_NAME', 'myride_mvp'),
                    autoLoadEntities: true,
                    synchronize: true,
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
            BitacoraModule,
            ProcesosBatchModule,
            IdempotenciaModule,
        ],
        controllers: [AppController],
        providers: [AppService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map