import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CrearConductorUseCase } from '../../aplicacion/casos-uso/crear-conductor.use-case.js';
import { crearConductorSchema } from '../../aplicacion/dto/crear-conductor.dto.js';
import type { CrearConductorDto } from '../../aplicacion/dto/crear-conductor.dto.js';
import { ZodValidationPipe } from '../../../../compartidos/utilidades/pipes/zod-validation.pipe.js';
import { AuthGuard } from '../../../../compartidos/middlewares/auth.guard.js';
import { RolesGuard } from '../../../../compartidos/middlewares/roles.guard.js';
import { Roles as RolesDecorator } from '../../../../compartidos/decoradores/roles.decorator.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { UseGuards, Get, Patch, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EstadosConductor } from '../../../../compartidos/constantes/estados-conductor.enum.js';
import { AprobarConductorUseCase } from '../../aplicacion/casos-uso/aprobar-conductor.use-case.js';
import { ListarConductoresUseCase } from '../../aplicacion/casos-uso/listar-conductores.use-case.js';
import { ConductorMapper } from '../../aplicacion/mappers/conductor.mapper.js';

@ApiTags('Conductores')
@Controller('api/conductores')
export class ConductoresController {
  constructor(
    private readonly crearConductor: CrearConductorUseCase,
    private readonly aprobarConductor: AprobarConductorUseCase,
    private readonly listarConductores: ListarConductoresUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body(new ZodValidationPipe(crearConductorSchema)) dto: CrearConductorDto) {
    const conductor = await this.crearConductor.ejecutar(dto);
    return ConductorMapper.toResponse(conductor);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar conductores (Solo Admin)' })
  @ApiQuery({ name: 'estado', required: false, enum: EstadosConductor })
  async listar(@Query('estado') estado?: EstadosConductor) {
    const conductores = await this.listarConductores.ejecutar({ estadoAprobacion: estado });
    return conductores.map(c => ConductorMapper.toResponseList(c));
  }

  @Patch(':id/aprobar')
  @UseGuards(AuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aprobar un conductor pendiente (Solo Admin)' })
  async aprobar(@Param('id') id: string) {
    const conductor = await this.aprobarConductor.ejecutar(id);
    return ConductorMapper.toResponseList(conductor);
  }
}
