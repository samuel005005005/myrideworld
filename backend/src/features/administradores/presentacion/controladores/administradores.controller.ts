import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../compartidos/middlewares/auth.guard.js';
import { RolesGuard } from '../../../../compartidos/middlewares/roles.guard.js';
import { AdminRolesGuard } from '../../../../compartidos/middlewares/admin-roles.guard.js';
import { Roles as RolesDecorator } from '../../../../compartidos/decoradores/roles.decorator.js';
import { AdminRoles } from '../../../../compartidos/decoradores/admin-roles.decorator.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { RolesAdmin } from '../../../../compartidos/constantes/roles-admin.enum.js';
import { ZodValidationPipe } from '../../../../compartidos/utilidades/pipes/zod-validation.pipe.js';
import {
  crearAdministradorSchema,
  CrearAdministradorDto,
  actualizarAdministradorSchema,
  ActualizarAdministradorDto,
} from '../../aplicacion/dto/crear-actualizar-administrador.dto.js';
import { CrearAdministradorUseCase } from '../../aplicacion/casos-uso/crear-administrador.use-case.js';
import { ListarAdministradoresUseCase } from '../../aplicacion/casos-uso/listar-administradores.use-case.js';
import { ActualizarAdministradorUseCase } from '../../aplicacion/casos-uso/actualizar-administrador.use-case.js';
import { AdministradorMapper } from '../../aplicacion/mappers/administrador.mapper.js';

@ApiTags('Administradores')
@Controller('api/administradores')
@UseGuards(AuthGuard, RolesGuard, AdminRolesGuard)
@RolesDecorator(Roles.ADMIN)
@AdminRoles(RolesAdmin.SUPER_ADMIN)
@ApiBearerAuth()
export class AdministradoresController {
  constructor(
    private readonly crearAdministrador: CrearAdministradorUseCase,
    private readonly listarAdministradores: ListarAdministradoresUseCase,
    private readonly actualizarAdministrador: ActualizarAdministradorUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear usuario admin (solo SUPER_ADMIN)' })
  async crear(
    @Body(new ZodValidationPipe(crearAdministradorSchema))
    dto: CrearAdministradorDto,
  ) {
    const admin = await this.crearAdministrador.ejecutar(dto);
    return AdministradorMapper.toResponse(admin);
  }

  @Get()
  @ApiOperation({ summary: 'Listar administradores' })
  async listar() {
    const lista = await this.listarAdministradores.ejecutar();
    return lista.map((a) => AdministradorMapper.toResponse(a));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar administrador' })
  async actualizar(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(actualizarAdministradorSchema))
    dto: ActualizarAdministradorDto,
  ) {
    const admin = await this.actualizarAdministrador.ejecutar(id, dto);
    return AdministradorMapper.toResponse(admin);
  }
}
