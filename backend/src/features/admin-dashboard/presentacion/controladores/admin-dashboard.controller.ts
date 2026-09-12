import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../compartidos/middlewares/auth.guard.js';
import { RolesGuard } from '../../../../compartidos/middlewares/roles.guard.js';
import { AdminRolesGuard } from '../../../../compartidos/middlewares/admin-roles.guard.js';
import { Roles as RolesDecorator } from '../../../../compartidos/decoradores/roles.decorator.js';
import { AdminRoles } from '../../../../compartidos/decoradores/admin-roles.decorator.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { RolesAdmin } from '../../../../compartidos/constantes/roles-admin.enum.js';
import { ObtenerDashboardUseCase } from '../../aplicacion/casos-uso/obtener-dashboard.use-case.js';

@ApiTags('Admin Dashboard')
@Controller('api/admin/dashboard')
@UseGuards(AuthGuard, RolesGuard, AdminRolesGuard)
@RolesDecorator(Roles.ADMIN)
@AdminRoles(
  RolesAdmin.SUPER_ADMIN,
  RolesAdmin.OPERACIONES,
  RolesAdmin.AUDITOR,
)
@ApiBearerAuth()
export class AdminDashboardController {
  constructor(private readonly obtenerDashboard: ObtenerDashboardUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Contadores operativos del dashboard' })
  async obtener() {
    return this.obtenerDashboard.ejecutar();
  }
}
