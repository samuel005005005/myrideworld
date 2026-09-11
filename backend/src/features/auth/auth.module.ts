import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './presentacion/controladores/auth.controller.js';
import { LoginUseCase } from './aplicacion/casos-uso/login.use-case.js';
import { PasajerosModule } from '../pasajeros/pasajeros.module.js';
import { ConductoresModule } from '../conductores/conductores.module.js';

@Module({
  imports: [
    PasajerosModule,
    ConductoresModule,
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
  providers: [LoginUseCase],
  exports: [JwtModule], // Exportado para usar en guards de otros módulos
})
export class AuthModule {}
