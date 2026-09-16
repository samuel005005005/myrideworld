import { Global, Module } from '@nestjs/common';
import { SesionesActivasRegistry } from './sesiones-activas.registry.js';
import { AuthGuard } from '../middlewares/auth.guard.js';
import { WsJwtGuard } from '../middlewares/ws-jwt.guard.js';
import { JwtAuthModule } from './jwt-auth.module.js';

@Global()
@Module({
  imports: [JwtAuthModule],
  providers: [SesionesActivasRegistry, AuthGuard, WsJwtGuard],
  exports: [SesionesActivasRegistry, AuthGuard, WsJwtGuard],
})
export class SesionesModule {}
