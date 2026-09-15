import { Module } from '@nestjs/common';
import { AuthController } from './presentacion/controladores/auth.controller.js';
import { LoginUseCase } from './aplicacion/casos-uso/login.use-case.js';
import { PasajerosModule } from '../pasajeros/pasajeros.module.js';
import { ConductoresModule } from '../conductores/conductores.module.js';
import { AdministradoresModule } from '../administradores/administradores.module.js';
import { SeguridadModule } from '../../compartidos/seguridad/seguridad.module.js';
import { JwtAuthModule } from '../../compartidos/seguridad/jwt-auth.module.js';
import { GENERADOR_TOKEN } from './aplicacion/puertos/generador-token.port.js';
import { JwtGeneradorToken } from './infraestructura/jwt-generador-token.adapter.js';

@Module({
  imports: [
    PasajerosModule,
    ConductoresModule,
    AdministradoresModule,
    SeguridadModule,
    JwtAuthModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    {
      provide: GENERADOR_TOKEN,
      useClass: JwtGeneradorToken,
    },
  ],
  exports: [JwtAuthModule],
})
export class AuthModule {}
