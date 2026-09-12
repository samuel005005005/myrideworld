import { Controller, Post, Body, HttpCode, HttpStatus, Get, Patch, Req, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CrearPasajeroUseCase } from '../../aplicacion/casos-uso/crear-pasajero.use-case.js';
import { ObtenerPasajeroUseCase } from '../../aplicacion/casos-uso/obtener-pasajero.use-case.js';
import { ActualizarPasajeroUseCase } from '../../aplicacion/casos-uso/actualizar-pasajero.use-case.js';
import { ListarPasajerosUseCase } from '../../aplicacion/casos-uso/listar-pasajeros.use-case.js';
import { crearPasajeroSchema } from '../../aplicacion/dto/crear-pasajero.dto.js';
import { CrearPasajeroDto } from '../../aplicacion/dto/crear-pasajero.dto.js';
import { actualizarPasajeroSchema, ActualizarPasajeroDto } from '../../aplicacion/dto/actualizar-pasajero.dto.js';
import { ZodValidationPipe } from '../../../../compartidos/utilidades/pipes/zod-validation.pipe.js';
import { PasajeroMapper } from '../../aplicacion/mappers/pasajero.mapper.js';
import { PasajeroResponseDto } from '../../aplicacion/dto/pasajero-response.dto.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';
import { AuthGuard } from '../../../../compartidos/middlewares/auth.guard.js';
import { RolesGuard } from '../../../../compartidos/middlewares/roles.guard.js';
import { AdminRolesGuard } from '../../../../compartidos/middlewares/admin-roles.guard.js';
import { Roles as RolesDecorator } from '../../../../compartidos/decoradores/roles.decorator.js';
import { AdminRoles } from '../../../../compartidos/decoradores/admin-roles.decorator.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { RolesAdmin } from '../../../../compartidos/constantes/roles-admin.enum.js';

const H = MENSAJES.HTTP.RESPUESTAS;

@ApiTags('Pasajeros')
@Controller('api/pasajeros')
export class PasajerosController {
  constructor(
    private readonly crearPasajero: CrearPasajeroUseCase,
    private readonly obtenerPasajero: ObtenerPasajeroUseCase,
    private readonly actualizarPasajero: ActualizarPasajeroUseCase,
    private readonly listarPasajeros: ListarPasajerosUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo pasajero' })
  @ApiResponse({ status: 201, description: H.CREADO_OK, type: PasajeroResponseDto })
  @ApiResponse({ status: 400, description: H.DATOS_INVALIDOS })
  async crear(@Body(new ZodValidationPipe(crearPasajeroSchema)) dto: CrearPasajeroDto): Promise<PasajeroResponseDto> {
    const pasajero = await this.crearPasajero.ejecutar(dto);
    return PasajeroMapper.toResponse(pasajero);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard, AdminRolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @AdminRoles(
    RolesAdmin.SUPER_ADMIN,
    RolesAdmin.OPERACIONES,
    RolesAdmin.AUDITOR,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar pasajeros (admin)' })
  @ApiQuery({ name: 'q', required: false })
  async listar(@Query('q') q?: string): Promise<PasajeroResponseDto[]> {
    const lista = await this.listarPasajeros.ejecutar(q);
    return lista.map((p) => PasajeroMapper.toResponse(p));
  }

  @Get('me')
  @UseGuards(AuthGuard, RolesGuard)
  @RolesDecorator(Roles.PASAJERO)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del pasajero autenticado' })
  @ApiResponse({ status: 200, type: PasajeroResponseDto })
  async obtenerPerfil(@Req() req: any): Promise<PasajeroResponseDto> {
    const pasajero = await this.obtenerPasajero.ejecutar(req.user.sub);
    return PasajeroMapper.toResponse(pasajero);
  }

  @Patch('me')
  @UseGuards(AuthGuard, RolesGuard)
  @RolesDecorator(Roles.PASAJERO)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar perfil del pasajero autenticado' })
  @ApiResponse({ status: 200, type: PasajeroResponseDto })
  async actualizarPerfil(
    @Req() req: any,
    @Body(new ZodValidationPipe(actualizarPasajeroSchema)) dto: ActualizarPasajeroDto
  ): Promise<PasajeroResponseDto> {
    const pasajero = await this.actualizarPasajero.ejecutar(req.user.sub, dto);
    return PasajeroMapper.toResponse(pasajero);
  }
}
