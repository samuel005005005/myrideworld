import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
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
import { ZodValidationPipe } from '../../../../compartidos/utilidades/pipes/zod-validation.pipe.js';
import { ListarConfiguracionesUseCase } from '../../aplicacion/casos-uso/listar-configuraciones.use-case.js';
import { ListarConfiguracionesPublicasUseCase } from '../../aplicacion/casos-uso/listar-configuraciones-publicas.use-case.js';
import { ActualizarConfiguracionUseCase } from '../../aplicacion/casos-uso/actualizar-configuracion.use-case.js';
import {
  ActualizarConfiguracionDto,
  actualizarConfiguracionSchema,
} from '../../aplicacion/dto/actualizar-configuracion.dto.js';
import { ConfiguracionResponseDto } from '../../aplicacion/dto/configuracion-response.dto.js';
import { ConfiguracionMapper } from '../../aplicacion/mappers/configuracion.mapper.js';

@ApiTags('Configuración')
@Controller('api/configuracion')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class ConfiguracionController {
  constructor(
    private readonly listarConfiguraciones: ListarConfiguracionesUseCase,
    private readonly listarConfiguracionesPublicas: ListarConfiguracionesPublicasUseCase,
    private readonly actualizarConfiguracion: ActualizarConfiguracionUseCase,
  ) {}

  @Get('publica')
  @RolesDecorator(Roles.PASAJERO, Roles.CONDUCTOR, Roles.ADMIN)
  @ApiOperation({
    summary: 'Parámetros públicos (soporte) para apps cliente',
  })
  @ApiResponse({ status: 200, type: [ConfiguracionResponseDto] })
  async listarPublica(): Promise<ConfiguracionResponseDto[]> {
    const items = await this.listarConfiguracionesPublicas.ejecutar();
    return items.map((item) => ConfiguracionMapper.toResponse(item));
  }

  @Get()
  @UseGuards(AdminRolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @AdminRoles(
    RolesAdmin.SUPER_ADMIN,
    RolesAdmin.OPERACIONES,
    RolesAdmin.FINANZAS,
  )
  @ApiOperation({
    summary: 'Listar parámetros de configuración (tarifas, fees, timeouts)',
  })
  @ApiResponse({ status: 200, type: [ConfiguracionResponseDto] })
  async listar(): Promise<ConfiguracionResponseDto[]> {
    const items = await this.listarConfiguraciones.ejecutar();
    return items.map((item) => ConfiguracionMapper.toResponse(item));
  }

  @Patch(':clave')
  @UseGuards(AdminRolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @AdminRoles(
    RolesAdmin.SUPER_ADMIN,
    RolesAdmin.OPERACIONES,
    RolesAdmin.FINANZAS,
  )
  @ApiOperation({ summary: 'Actualizar valor de una clave de configuración' })
  @ApiResponse({ status: 200, type: ConfiguracionResponseDto })
  async actualizar(
    @Param('clave') clave: string,
    @Body(new ZodValidationPipe(actualizarConfiguracionSchema))
    dto: ActualizarConfiguracionDto,
  ): Promise<ConfiguracionResponseDto> {
    const actualizada = await this.actualizarConfiguracion.ejecutar(clave, dto);
    return ConfiguracionMapper.toResponse(actualizada);
  }
}
