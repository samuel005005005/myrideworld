import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../compartidos/middlewares/auth.guard.js';
import { RolesGuard } from '../../../../compartidos/middlewares/roles.guard.js';
import { AdminRolesGuard } from '../../../../compartidos/middlewares/admin-roles.guard.js';
import { Roles as RolesDecorator } from '../../../../compartidos/decoradores/roles.decorator.js';
import { AdminRoles } from '../../../../compartidos/decoradores/admin-roles.decorator.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { RolesAdmin } from '../../../../compartidos/constantes/roles-admin.enum.js';
import { ListarBitacoraUseCase } from '../../aplicacion/casos-uso/listar-bitacora.use-case.js';

@ApiTags('Bitácora')
@Controller('api/bitacora')
@UseGuards(AuthGuard, RolesGuard, AdminRolesGuard)
@RolesDecorator(Roles.ADMIN)
@AdminRoles(
  RolesAdmin.SUPER_ADMIN,
  RolesAdmin.AUDITOR,
  RolesAdmin.OPERACIONES,
)
@ApiBearerAuth()
export class BitacoraController {
  constructor(private readonly listarBitacora: ListarBitacoraUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Listar eventos de bitácora (admin)' })
  @ApiQuery({ name: 'desde', required: false })
  @ApiQuery({ name: 'hasta', required: false })
  @ApiQuery({ name: 'servicio', required: false })
  @ApiQuery({ name: 'accion', required: false })
  async listar(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('servicio') servicio?: string,
    @Query('accion') accion?: string,
  ) {
    const eventos = await this.listarBitacora.ejecutar({
      desde: desde ? new Date(desde) : undefined,
      hasta: hasta ? new Date(hasta) : undefined,
      servicio,
      accion,
    });

    return eventos.map((e) => ({
      id: e.id,
      tipoEvento: e.tipoEvento,
      servicioSistema: e.servicioSistema,
      detalle: e.detalle,
      usuario: e.usuario,
      fecha: e.fecha,
      accion: e.accion,
      entidadId: e.entidadId,
      ip: e.ip,
      duracionMs: e.duracionMs,
    }));
  }
}
