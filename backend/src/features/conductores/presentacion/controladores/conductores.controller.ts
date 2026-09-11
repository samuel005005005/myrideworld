import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CrearConductorUseCase } from '../../aplicacion/casos-uso/crear-conductor.use-case.js';
import { crearConductorSchema } from '../../aplicacion/dto/crear-conductor.dto.js';
import type { CrearConductorDto } from '../../aplicacion/dto/crear-conductor.dto.js';
import { ZodValidationPipe } from '../../../../compartidos/utilidades/pipes/zod-validation.pipe.js';
import { AuthGuard } from '../../../../compartidos/middlewares/auth.guard.js';
import { RolesGuard } from '../../../../compartidos/middlewares/roles.guard.js';
import { Roles as RolesDecorator } from '../../../../compartidos/decoradores/roles.decorator.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { UseGuards, Get, Patch, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const H = MENSAJES.HTTP.RESPUESTAS;
import { EstadosConductor } from '../../../../compartidos/constantes/estados-conductor.enum.js';
import { AprobarConductorUseCase } from '../../aplicacion/casos-uso/aprobar-conductor.use-case.js';
import { ListarConductoresUseCase } from '../../aplicacion/casos-uso/listar-conductores.use-case.js';
import { SubirDocumentosUseCase } from '../../aplicacion/casos-uso/subir-documentos.use-case.js';
import { ObtenerConductorUseCase } from '../../aplicacion/casos-uso/obtener-conductor.use-case.js';
import { ActualizarConductorUseCase } from '../../aplicacion/casos-uso/actualizar-conductor.use-case.js';
import { actualizarConductorSchema, ActualizarConductorDto } from '../../aplicacion/dto/actualizar-conductor.dto.js';
import { ConductorMapper } from '../../aplicacion/mappers/conductor.mapper.js';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Conductores')
@Controller('api/conductores')
export class ConductoresController {
  constructor(
    private readonly crearConductor: CrearConductorUseCase,
    private readonly aprobarConductor: AprobarConductorUseCase,
    private readonly listarConductores: ListarConductoresUseCase,
    private readonly subirDocumentos: SubirDocumentosUseCase,
    private readonly obtenerConductor: ObtenerConductorUseCase,
    private readonly actualizarConductor: ActualizarConductorUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo conductor' })
  @ApiResponse({ status: 201, description: H.CREADO_OK })
  @ApiResponse({ status: 400, description: H.DATOS_INVALIDOS })
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

  @Post(':id/documentos')
  @UseGuards(AuthGuard, RolesGuard)
  @RolesDecorator(Roles.CONDUCTOR, Roles.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Subir documentos del conductor' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'fotoPerfil', maxCount: 1 },
        { name: 'licencia', maxCount: 1 },
        { name: 'seguro', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/documentos',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      }
    )
  )
  async subirDocumentosEndpoint(
    @Param('id') id: string,
    @UploadedFiles() files: { fotoPerfil?: Express.Multer.File[]; licencia?: Express.Multer.File[]; seguro?: Express.Multer.File[] },
  ) {
    const rutas = {
      fotoPerfil: files.fotoPerfil?.[0]?.path,
      licencia: files.licencia?.[0]?.path,
      seguro: files.seguro?.[0]?.path,
    };

    const conductor = await this.subirDocumentos.ejecutar(id, rutas);
    return ConductorMapper.toResponse(conductor);
  }

  @Get('me')
  @UseGuards(AuthGuard, RolesGuard)
  @RolesDecorator(Roles.CONDUCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del conductor autenticado' })
  async obtenerPerfil(@Req() req: any) {
    const conductor = await this.obtenerConductor.ejecutar(req.user.sub);
    return ConductorMapper.toResponse(conductor);
  }

  @Patch('me')
  @UseGuards(AuthGuard, RolesGuard)
  @RolesDecorator(Roles.CONDUCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar perfil del conductor autenticado' })
  async actualizarPerfil(
    @Req() req: any,
    @Body(new ZodValidationPipe(actualizarConductorSchema)) dto: ActualizarConductorDto
  ) {
    const conductor = await this.actualizarConductor.ejecutar(req.user.sub, dto);
    return ConductorMapper.toResponse(conductor);
  }
}
