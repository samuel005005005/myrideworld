import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../../../../compartidos/middlewares/auth.guard.js';
import { RolesGuard } from '../../../../compartidos/middlewares/roles.guard.js';
import { AdminRolesGuard } from '../../../../compartidos/middlewares/admin-roles.guard.js';
import { Roles } from '../../../../compartidos/decoradores/roles.decorator.js';
import { AdminRoles } from '../../../../compartidos/decoradores/admin-roles.decorator.js';
import { RolesAdmin } from '../../../../compartidos/constantes/roles-admin.enum.js';
import { SolicitarViajeUseCase } from '../../aplicacion/casos-uso/solicitar-viaje.use-case.js';
import {
  solicitarViajeSchema,
  SolicitarViajeDto,
} from '../../aplicacion/dto/solicitar-viaje.dto.js';
import { AceptarViajeUseCase } from '../../aplicacion/casos-uso/aceptar-viaje.use-case.js';
import { MarcarLlegadaUseCase } from '../../aplicacion/casos-uso/marcar-llegada.use-case.js';
import { IniciarViajeUseCase } from '../../aplicacion/casos-uso/iniciar-viaje.use-case.js';
import { CompletarViajeUseCase } from '../../aplicacion/casos-uso/completar-viaje.use-case.js';
import { CancelarViajeUseCase } from '../../aplicacion/casos-uso/cancelar-viaje.use-case.js';
import { ListarViajesUseCase } from '../../aplicacion/casos-uso/listar-viajes.use-case.js';
import { RechazarViajeUseCase } from '../../aplicacion/casos-uso/rechazar-viaje.use-case.js';
import { ObtenerViajeActivoUseCase } from '../../aplicacion/casos-uso/obtener-viaje-activo.use-case.js';
import { ObtenerViajePorIdUseCase } from '../../aplicacion/casos-uso/obtener-viaje-por-id.use-case.js';
import { ViajeMapper } from '../../aplicacion/mappers/viaje.mapper.js';
import { ConductorMapper } from '../../../conductores/aplicacion/mappers/conductor.mapper.js';
import {
  AceptarViajeDto,
  aceptarViajeSchema,
} from '../../aplicacion/dto/aceptar-viaje.dto.js';
import {
  CancelarViajeDto,
  cancelarViajeSchema,
} from '../../aplicacion/dto/cancelar-viaje.dto.js';
import { Roles as RolesEnum } from '../../../../compartidos/constantes/roles.enum.js';
import { IdempotenciaInterceptor } from '../../../idempotencia/presentacion/interceptores/idempotencia.interceptor.js';
import { ZodValidationPipe } from '../../../../compartidos/utilidades/pipes/zod-validation.pipe.js';
import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';

@ApiTags('Viajes')
@ApiBearerAuth()
@Controller('api/viajes')
export class ViajesController {
  constructor(
    private readonly solicitarViaje: SolicitarViajeUseCase,
    private readonly aceptarViaje: AceptarViajeUseCase,
    private readonly marcarLlegada: MarcarLlegadaUseCase,
    private readonly iniciarViaje: IniciarViajeUseCase,
    private readonly completarViaje: CompletarViajeUseCase,
    private readonly cancelarViaje: CancelarViajeUseCase,
    private readonly listarViajes: ListarViajesUseCase,
    private readonly rechazarViaje: RechazarViajeUseCase,
    private readonly obtenerViajeActivo: ObtenerViajeActivoUseCase,
    private readonly obtenerViajePorId: ObtenerViajePorIdUseCase,
  ) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard, AdminRolesGuard)
  @Roles(RolesEnum.ADMIN)
  @AdminRoles(
    RolesAdmin.SUPER_ADMIN,
    RolesAdmin.OPERACIONES,
    RolesAdmin.AUDITOR,
  )
  @ApiOperation({ summary: 'Listar viajes (admin)' })
  @ApiQuery({ name: 'estado', required: false, enum: EstadosViaje })
  @ApiQuery({ name: 'desde', required: false })
  @ApiQuery({ name: 'hasta', required: false })
  async listarTodos(
    @Req() req: { user: { sub: string; rol: string } },
    @Query('estado') estado?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    const viajes = await this.listarViajes.ejecutar(
      req.user.sub,
      req.user.rol as RolesEnum,
      {
        estado,
        desde: desde ? new Date(desde) : undefined,
        hasta: hasta ? new Date(hasta) : undefined,
      },
    );
    return viajes.map((v) => ViajeMapper.toResponse(v));
  }

  @Get('mis-viajes')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.PASAJERO, RolesEnum.CONDUCTOR)
  @ApiOperation({ summary: 'Historial de viajes del usuario actual' })
  async misViajes(@Req() req: { user: { sub: string; rol: string } }) {
    const viajes = await this.listarViajes.ejecutar(
      req.user.sub,
      req.user.rol as RolesEnum,
    );
    return viajes.map((v) => ViajeMapper.toResponse(v));
  }

  @Get('activo')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.CONDUCTOR)
  @ApiOperation({ summary: 'Obtener viaje activo del conductor (si existe)' })
  async viajeActivo(@Req() req: { user: { sub: string } }) {
    const viaje = await this.obtenerViajeActivo.ejecutar(req.user.sub);
    return viaje ? ViajeMapper.toResponse(viaje) : null;
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.PASAJERO, RolesEnum.CONDUCTOR, RolesEnum.ADMIN)
  @ApiOperation({
    summary: 'Detalle de viaje (participantes) con resumen del conductor',
  })
  async obtenerPorId(
    @Param('id') id: string,
    @Req() req: { user: { sub: string; rol: string } },
  ) {
    const detalle = await this.obtenerViajePorId.ejecutar(
      id,
      req.user.sub,
      req.user.rol as RolesEnum,
    );
    return ViajeMapper.toResponse(
      detalle.viaje,
      detalle.conductor
        ? ConductorMapper.toResumenPublico(detalle.conductor)
        : null,
    );
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(IdempotenciaInterceptor)
  @Roles(RolesEnum.PASAJERO)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Solicitar un nuevo viaje (Solo Pasajeros)' })
  async solicitar(
    @Body(new ZodValidationPipe(solicitarViajeSchema)) dto: SolicitarViajeDto,
    @Req() req: { user: { sub: string } },
  ) {
    dto.pasajeroId = req.user.sub;
    const viaje = await this.solicitarViaje.ejecutar(dto);
    return ViajeMapper.toResponse(viaje);
  }

  @Post(':id/aceptar')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.CONDUCTOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aceptar un viaje disponible (Solo Conductores)' })
  async aceptar(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(aceptarViajeSchema)) dto: AceptarViajeDto,
    @Req() req: { user: { sub: string } },
  ) {
    dto.conductorId = req.user.sub;
    const viaje = await this.aceptarViaje.ejecutar(id, dto);
    return ViajeMapper.toResponse(viaje);
  }

  @Post(':id/llegada')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.CONDUCTOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Notificar que el conductor ha llegado al punto de recogida',
  })
  async llegada(
    @Param('id') id: string,
    @Req() req: { user: { sub: string } },
  ) {
    const viaje = await this.marcarLlegada.ejecutar(id, req.user.sub);
    return ViajeMapper.toResponse(viaje);
  }

  @Post(':id/iniciar')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.CONDUCTOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar un viaje (Solo Conductores)' })
  async iniciar(
    @Param('id') id: string,
    @Req() req: { user: { sub: string } },
  ) {
    const viaje = await this.iniciarViaje.ejecutar(id, req.user.sub);
    return ViajeMapper.toResponse(viaje);
  }

  @Post(':id/completar')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.CONDUCTOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Completar el viaje y generar cobro (Solo Conductores)',
  })
  async completar(
    @Param('id') id: string,
    @Req() req: { user: { sub: string } },
  ) {
    const viaje = await this.completarViaje.ejecutar(id, req.user.sub);
    return ViajeMapper.toResponse(viaje);
  }

  @Post(':id/cancelar')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.PASAJERO, RolesEnum.CONDUCTOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar un viaje' })
  async cancelar(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(cancelarViajeSchema)) dto: CancelarViajeDto,
    @Req() req: { user: { sub: string; rol: string } },
  ) {
    const viaje = await this.cancelarViaje.ejecutar(
      id,
      req.user.sub,
      req.user.rol as RolesEnum,
      dto.motivo,
    );
    return ViajeMapper.toResponse(viaje);
  }

  @Post(':id/rechazar')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.CONDUCTOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rechazar un viaje sugerido (asigna al siguiente conductor)',
  })
  async rechazar(
    @Param('id') id: string,
    @Req() req: { user: { sub: string } },
  ) {
    const viaje = await this.rechazarViaje.ejecutar(id, req.user.sub);
    return ViajeMapper.toResponse(viaje);
  }
}
