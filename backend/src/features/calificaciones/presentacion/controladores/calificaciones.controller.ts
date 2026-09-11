import { Controller, Post, Body, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../../../compartidos/middlewares/auth.guard.js';
import { RolesGuard } from '../../../../compartidos/middlewares/roles.guard.js';
import { Roles } from '../../../../compartidos/decoradores/roles.decorator.js';
import { CalificarConductorUseCase } from '../../aplicacion/casos-uso/calificar-conductor.use-case.js';
import { CalificarConductorDto, calificarConductorSchema } from '../../aplicacion/dto/calificar-conductor.dto.js';
import { ZodValidationPipe } from '../../../../compartidos/utilidades/pipes/zod-validation.pipe.js';
import { Roles as RolesEnum } from '../../../../compartidos/constantes/roles.enum.js';

@ApiTags('Calificaciones')
@ApiBearerAuth()
@Controller('api/calificaciones')
export class CalificacionesController {
  constructor(
    private readonly calificarConductor: CalificarConductorUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.PASAJERO)
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
