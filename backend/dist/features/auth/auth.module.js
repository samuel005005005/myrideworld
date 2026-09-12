var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './presentacion/controladores/auth.controller.js';
import { LoginUseCase } from './aplicacion/casos-uso/login.use-case.js';
import { PasajerosModule } from '../pasajeros/pasajeros.module.js';
import { ConductoresModule } from '../conductores/conductores.module.js';
import { SeguridadModule } from '../../compartidos/seguridad/seguridad.module.js';
import { GENERADOR_TOKEN } from './aplicacion/puertos/generador-token.port.js';
import { JwtGeneradorToken } from './infraestructura/jwt-generador-token.adapter.js';
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Module({
        imports: [
            PasajerosModule,
            ConductoresModule,
            SeguridadModule,
            JwtModule.registerAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET', 'super-secret-key'),
                    signOptions: { expiresIn: '1h' },
                }),
            }),
        ],
        controllers: [AuthController],
        providers: [
            LoginUseCase,
            {
                provide: GENERADOR_TOKEN,
                useClass: JwtGeneradorToken,
            },
        ],
        exports: [JwtModule],
    })
], AuthModule);
export { AuthModule };
//# sourceMappingURL=auth.module.js.map