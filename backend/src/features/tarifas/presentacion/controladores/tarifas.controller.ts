import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../compartidos/middlewares/auth.guard.js';
import { RolesGuard } from '../../../../compartidos/middlewares/roles.guard.js';
import { AdminRolesGuard } from '../../../../compartidos/middlewares/admin-roles.guard.js';
import { Roles } from '../../../../compartidos/decoradores/roles.decorator.js';
import { AdminRoles } from '../../../../compartidos/decoradores/admin-roles.decorator.js';
import { Roles as RolesEnum } from '../../../../compartidos/constantes/roles.enum.js';
import { RolesAdmin } from '../../../../compartidos/constantes/roles-admin.enum.js';
import { EstadosTarifa } from '../../../../compartidos/constantes/estados-tarifa.enum.js';
import { ZodValidationPipe } from '../../../../compartidos/utilidades/pipes/zod-validation.pipe.js';
import { EstimarTarifaUseCase } from '../../aplicacion/casos-uso/estimar-tarifa.use-case.js';
import { CrearTarifaUseCase } from '../../aplicacion/casos-uso/crear-tarifa.use-case.js';
import { ListarTarifasUseCase } from '../../aplicacion/casos-uso/listar-tarifas.use-case.js';
import { ActualizarTarifaUseCase } from '../../aplicacion/casos-uso/actualizar-tarifa.use-case.js';
import {
  EstimarTarifaDto,
  estimarTarifaSchema,
} from '../../aplicacion/dto/estimar-tarifa.dto.js';
import {
  CrearTarifaDto,
  crearTarifaSchema,
  ActualizarTarifaDto,
  actualizarTarifaSchema,
} from '../../aplicacion/dto/crear-actualizar-tarifa.dto.js';
import { TarifaMapper } from '../../aplicacion/mappers/tarifa.mapper.js';

@ApiTags('Tarifas')
@ApiBearerAuth()
@Controller('api/tarifas')
export class TarifasController {
  constructor(
    private readonly estimarTarifa: EstimarTarifaUseCase,
    private readonly crearTarifa: CrearTarifaUseCase,
    private readonly listarTarifas: ListarTarifasUseCase,
    private readonly actualizarTarifa: ActualizarTarifaUseCase,
  ) {}

  @Post('estimar')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.PASAJERO, RolesEnum.CONDUCTOR, RolesEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Estimar tarifa: prioriza OD activa por nombre; si no, fórmula base+km',
  })
  async estimar(
    @Body(new ZodValidationPipe(estimarTarifaSchema)) dto: EstimarTarifaDto,
  ) {
    const resultado = await this.estimarTarifa.ejecutar(dto, false);
    return TarifaMapper.toEstimacionResponse(resultado);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard, AdminRolesGuard)
  @Roles(RolesEnum.ADMIN)
  @AdminRoles(
    RolesAdmin.SUPER_ADMIN,
    RolesAdmin.FINANZAS,
    RolesAdmin.AUDITOR,
  )
  @ApiOperation({ summary: 'Listar tarifas OD' })
  @ApiQuery({ name: 'estado', required: false, enum: EstadosTarifa })
  async listar(@Query('estado') estado?: EstadosTarifa) {
    const tarifas = await this.listarTarifas.ejecutar(estado);
    return tarifas.map((t) => TarifaMapper.toResponse(t));
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard, AdminRolesGuard)
  @Roles(RolesEnum.ADMIN)
  @AdminRoles(RolesAdmin.SUPER_ADMIN, RolesAdmin.FINANZAS)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear tarifa OD' })
  async crear(
    @Body(new ZodValidationPipe(crearTarifaSchema)) dto: CrearTarifaDto,
  ) {
    const tarifa = await this.crearTarifa.ejecutar(dto);
    return TarifaMapper.toResponse(tarifa);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard, AdminRolesGuard)
  @Roles(RolesEnum.ADMIN)
  @AdminRoles(RolesAdmin.SUPER_ADMIN, RolesAdmin.FINANZAS)
  @ApiOperation({ summary: 'Actualizar tarifa OD / activar-inactivar' })
  async actualizar(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(actualizarTarifaSchema))
    dto: ActualizarTarifaDto,
  ) {
    const tarifa = await this.actualizarTarifa.ejecutar(id, dto);
    return TarifaMapper.toResponse(tarifa);
  }
}
