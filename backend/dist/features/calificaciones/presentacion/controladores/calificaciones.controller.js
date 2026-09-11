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
import { Controller, Post, Body, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../../auth/presentacion/middlewares/auth.guard.js';
import { RolesGuard } from '../../../auth/presentacion/middlewares/roles.guard.js';
import { Roles } from '../../../auth/presentacion/middlewares/roles.decorator.js';
import { CalificarConductorUseCase } from '../../aplicacion/casos-uso/calificar-conductor.use-case.js';
import { CalificarConductorDto, calificarConductorSchema } from '../../aplicacion/dto/calificar-conductor.dto.js';
import { ZodValidationPipe } from '../../../../compartidos/pipes/zod-validation.pipe.js';
let CalificacionesController = class CalificacionesController {
    calificarConductor;
    constructor(calificarConductor) {
        this.calificarConductor = calificarConductor;
    }
    async calificar(dto, req) {
        const pasajeroId = req.user.sub;
        return await this.calificarConductor.ejecutar(pasajeroId, dto);
    }
};
__decorate([
    Post(),
    UseGuards(AuthGuard, RolesGuard),
    Roles('PASAJERO'),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: 'Calificar a un conductor tras un viaje completado' }),
    __param(0, Body(new ZodValidationPipe(calificarConductorSchema))),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CalificarConductorDto, Object]),
    __metadata("design:returntype", Promise)
], CalificacionesController.prototype, "calificar", null);
CalificacionesController = __decorate([
    ApiTags('Calificaciones'),
    ApiBearerAuth(),
    Controller('api/calificaciones'),
    __metadata("design:paramtypes", [CalificarConductorUseCase])
], CalificacionesController);
export { CalificacionesController };
//# sourceMappingURL=calificaciones.controller.js.map