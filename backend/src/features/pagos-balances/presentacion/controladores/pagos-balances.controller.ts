import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../../../compartidos/middlewares/auth.guard.js';
import { RolesGuard } from '../../../../compartidos/middlewares/roles.guard.js';
import { AdminRolesGuard } from '../../../../compartidos/middlewares/admin-roles.guard.js';
import { Roles as RolesDecorator } from '../../../../compartidos/decoradores/roles.decorator.js';
import { AdminRoles } from '../../../../compartidos/decoradores/admin-roles.decorator.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { RolesAdmin } from '../../../../compartidos/constantes/roles-admin.enum.js';
import { ListarMisBalancesUseCase } from '../../aplicacion/casos-uso/listar-mis-balances.use-case.js';
import { ObtenerPagoPorViajeUseCase } from '../../aplicacion/casos-uso/obtener-pago-por-viaje.use-case.js';
import { ListarPagosAdminUseCase } from '../../aplicacion/casos-uso/listar-pagos-admin.use-case.js';
import { ObtenerLiquidacionUseCase } from '../../aplicacion/casos-uso/obtener-liquidacion.use-case.js';
import { PagoBalanceMapper } from '../../aplicacion/mappers/pago-balance.mapper.js';
import { PagoBalanceResponseDto } from '../../aplicacion/dto/pago-balance-response.dto.js';

@ApiTags('Pagos y Balances')
@Controller('api/pagos-balances')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class PagosBalancesController {
  constructor(
    private readonly listarMisBalances: ListarMisBalancesUseCase,
    private readonly obtenerPagoPorViaje: ObtenerPagoPorViajeUseCase,
    private readonly listarPagosAdmin: ListarPagosAdminUseCase,
    private readonly obtenerLiquidacion: ObtenerLiquidacionUseCase,
  ) {}

  @Get('mis-balances')
  @RolesDecorator(Roles.CONDUCTOR)
  @ApiOperation({ summary: 'Listar balances del conductor autenticado' })
  @ApiResponse({ status: 200, type: [PagoBalanceResponseDto] })
  async listar(@Req() req: { user: { sub: string } }) {
    const pagos = await this.listarMisBalances.ejecutar(req.user.sub);
    return pagos.map((pago) => PagoBalanceMapper.toResponse(pago));
  }

  @Get('por-viaje/:viajeId')
  @RolesDecorator(Roles.CONDUCTOR)
  @ApiOperation({ summary: 'Obtener pago generado por un viaje completado' })
  @ApiResponse({ status: 200, type: PagoBalanceResponseDto })
  async porViaje(
    @Param('viajeId') viajeId: string,
    @Req() req: { user: { sub: string } },
  ) {
    const pago = await this.obtenerPagoPorViaje.ejecutar(viajeId, req.user.sub);
    return PagoBalanceMapper.toResponse(pago);
  }

  @Get('liquidacion')
  @UseGuards(AdminRolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @AdminRoles(
    RolesAdmin.SUPER_ADMIN,
    RolesAdmin.FINANZAS,
    RolesAdmin.AUDITOR,
  )
  @ApiOperation({ summary: 'Resumen de liquidación (admin)' })
  @ApiQuery({ name: 'conductorId', required: false })
  @ApiQuery({ name: 'desde', required: false })
  @ApiQuery({ name: 'hasta', required: false })
  async liquidacion(
    @Query('conductorId') conductorId?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.obtenerLiquidacion.ejecutar({
      conductorId,
      desde: desde ? new Date(desde) : undefined,
      hasta: hasta ? new Date(hasta) : undefined,
    });
  }

  @Get()
  @UseGuards(AdminRolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @AdminRoles(
    RolesAdmin.SUPER_ADMIN,
    RolesAdmin.FINANZAS,
    RolesAdmin.AUDITOR,
  )
  @ApiOperation({ summary: 'Listar pagos/balances (admin)' })
  @ApiQuery({ name: 'conductorId', required: false })
  @ApiQuery({ name: 'desde', required: false })
  @ApiQuery({ name: 'hasta', required: false })
  async listarAdmin(
    @Query('conductorId') conductorId?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    const pagos = await this.listarPagosAdmin.ejecutar({
      conductorId,
      desde: desde ? new Date(desde) : undefined,
      hasta: hasta ? new Date(hasta) : undefined,
    });
    return pagos.map((pago) => PagoBalanceMapper.toResponse(pago));
  }
}
