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

@Module({
  imports: [
    PasajerosModule,
    ConductoresModule,
    SeguridadModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'super-secret-key'),
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
export class AuthModule {}
