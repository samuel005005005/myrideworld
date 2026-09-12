import { Module } from '@nestjs/common';
import { ConductoresModule } from '../conductores/conductores.module.js';
import { ViajesModule } from '../viajes/viajes.module.js';
import { ObtenerDashboardUseCase } from './aplicacion/casos-uso/obtener-dashboard.use-case.js';
import { AdminDashboardController } from './presentacion/controladores/admin-dashboard.controller.js';

@Module({
  imports: [ConductoresModule, ViajesModule],
  controllers: [AdminDashboardController],
  providers: [ObtenerDashboardUseCase],
})
export class AdminDashboardModule {}
