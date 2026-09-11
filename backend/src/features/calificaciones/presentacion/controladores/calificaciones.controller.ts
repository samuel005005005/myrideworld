import { Controller, Post, Body, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../../auth/presentacion/middlewares/auth.guard.js';
import { RolesGuard } from '../../../auth/presentacion/middlewares/roles.guard.js';
import { Roles } from '../../../auth/presentacion/middlewares/roles.decorator.js';
import { CalificarConductorUseCase } from '../../aplicacion/casos-uso/calificar-conductor.use-case.js';
import { CalificarConductorDto, calificarConductorSchema } from '../../aplicacion/dto/calificar-conductor.dto.js';
import { ZodValidationPipe } from '../../../../compartidos/pipes/zod-validation.pipe.js';

@ApiTags('Calificaciones')
@ApiBearerAuth()
@Controller('api/calificaciones')
export class CalificacionesController {
  constructor(
    private readonly calificarConductor: CalificarConductorUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('PASAJERO')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Calificar a un conductor tras un viaje completado' })
  async calificar(
    @Body(new ZodValidationPipe(calificarConductorSchema)) dto: CalificarConductorDto,
    @Req() req: any,
  ) {
    const pasajeroId = req.user.sub;
    return await this.calificarConductor.ejecutar(pasajeroId, dto);
  }
}
