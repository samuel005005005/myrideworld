var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CrearConductorUseCase } from '../../aplicacion/casos-uso/crear-conductor.use-case.js';
import { crearConductorSchema } from '../../aplicacion/dto/crear-conductor.dto.js';
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
let ConductoresController = class ConductoresController {
    crearConductor;
    aprobarConductor;
    listarConductores;
    subirDocumentos;
    obtenerConductor;
    actualizarConductor;
    constructor(crearConductor, aprobarConductor, listarConductores, subirDocumentos, obtenerConductor, actualizarConductor) {
        this.crearConductor = crearConductor;
        this.aprobarConductor = aprobarConductor;
        this.listarConductores = listarConductores;
        this.subirDocumentos = subirDocumentos;
        this.obtenerConductor = obtenerConductor;
        this.actualizarConductor = actualizarConductor;
    }
    async crear(dto) {
        const conductor = await this.crearConductor.ejecutar(dto);
        return ConductorMapper.toResponse(conductor);
    }
    async listar(estado) {
        const conductores = await this.listarConductores.ejecutar({ estadoAprobacion: estado });
        return conductores.map(c => ConductorMapper.toResponseList(c));
    }
    async aprobar(id) {
        const conductor = await this.aprobarConductor.ejecutar(id);
        return ConductorMapper.toResponseList(conductor);
    }
    async subirDocumentosEndpoint(id, files) {
        const rutas = {
            fotoPerfil: files.fotoPerfil?.[0]?.path,
            licencia: files.licencia?.[0]?.path,
            seguro: files.seguro?.[0]?.path,
        };
        const conductor = await this.subirDocumentos.ejecutar(id, rutas);
        return ConductorMapper.toResponse(conductor);
    }
    async obtenerPerfil(req) {
        const conductor = await this.obtenerConductor.ejecutar(req.user.sub);
        return ConductorMapper.toResponse(conductor);
    }
    async actualizarPerfil(req, dto) {
        const conductor = await this.actualizarConductor.ejecutar(req.user.sub, dto);
        return ConductorMapper.toResponse(conductor);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: 'Registrar un nuevo conductor' }),
    ApiResponse({ status: 201, description: H.CREADO_OK }),
    ApiResponse({ status: 400, description: H.DATOS_INVALIDOS }),
    __param(0, Body(new ZodValidationPipe(crearConductorSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], ConductoresController.prototype, "crear", null);
__decorate([
    Get(),
    UseGuards(AuthGuard, RolesGuard),
    RolesDecorator(Roles.ADMIN),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar conductores (Solo Admin)' }),
    ApiQuery({ name: 'estado', required: false, enum: EstadosConductor }),
    __param(0, Query('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConductoresController.prototype, "listar", null);
__decorate([
    Patch(':id/aprobar'),
    UseGuards(AuthGuard, RolesGuard),
    RolesDecorator(Roles.ADMIN),
    ApiBearerAuth(),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Aprobar un conductor pendiente (Solo Admin)' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConductoresController.prototype, "aprobar", null);
__decorate([
    Post(':id/documentos'),
    UseGuards(AuthGuard, RolesGuard),
    RolesDecorator(Roles.CONDUCTOR, Roles.ADMIN),
    ApiBearerAuth(),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Subir documentos del conductor' }),
    UseInterceptors(FileFieldsInterceptor([
        { name: 'fotoPerfil', maxCount: 1 },
        { name: 'licencia', maxCount: 1 },
        { name: 'seguro', maxCount: 1 },
    ], {
        storage: diskStorage({
            destination: './uploads/documentos',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    })),
    __param(0, Param('id')),
    __param(1, UploadedFiles()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConductoresController.prototype, "subirDocumentosEndpoint", null);
__decorate([
    Get('me'),
    UseGuards(AuthGuard, RolesGuard),
    RolesDecorator(Roles.CONDUCTOR),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Obtener perfil del conductor autenticado' }),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConductoresController.prototype, "obtenerPerfil", null);
__decorate([
    Patch('me'),
    UseGuards(AuthGuard, RolesGuard),
    RolesDecorator(Roles.CONDUCTOR),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Actualizar perfil del conductor autenticado' }),
    __param(0, Req()),
    __param(1, Body(new ZodValidationPipe(actualizarConductorSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ActualizarConductorDto]),
    __metadata("design:returntype", Promise)
], ConductoresController.prototype, "actualizarPerfil", null);
ConductoresController = __decorate([
    ApiTags('Conductores'),
    Controller('api/conductores'),
    __metadata("design:paramtypes", [CrearConductorUseCase,
        AprobarConductorUseCase,
        ListarConductoresUseCase,
        SubirDocumentosUseCase,
        ObtenerConductorUseCase,
        ActualizarConductorUseCase])
], ConductoresController);
export { ConductoresController };
//# sourceMappingURL=conductores.controller.js.map