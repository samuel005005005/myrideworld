import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../../../compartidos/middlewares/auth.guard.js';
import { RolesGuard } from '../../../../compartidos/middlewares/roles.guard.js';
import { Roles } from '../../../../compartidos/decoradores/roles.decorator.js';
import { SolicitarViajeUseCase } from '../../aplicacion/casos-uso/solicitar-viaje.use-case.js';
import { solicitarViajeSchema } from '../../aplicacion/dto/solicitar-viaje.dto.js';
import { SolicitarViajeDto } from '../../aplicacion/dto/solicitar-viaje.dto.js';
import { AceptarViajeUseCase } from '../../aplicacion/casos-uso/aceptar-viaje.use-case.js';
import { MarcarLlegadaUseCase } from '../../aplicacion/casos-uso/marcar-llegada.use-case.js';
import { IniciarViajeUseCase } from '../../aplicacion/casos-uso/iniciar-viaje.use-case.js';
import { CompletarViajeUseCase } from '../../aplicacion/casos-uso/completar-viaje.use-case.js';
import { CancelarViajeUseCase } from '../../aplicacion/casos-uso/cancelar-viaje.use-case.js';
import { ListarViajesUseCase } from '../../aplicacion/casos-uso/listar-viajes.use-case.js';
import { ViajeMapper } from '../../aplicacion/mappers/viaje.mapper.js';
import { AceptarViajeDto } from '../../aplicacion/dto/aceptar-viaje.dto.js';
import { CancelarViajeDto } from '../../aplicacion/dto/cancelar-viaje.dto.js';
import { Roles as RolesEnum } from '../../../../compartidos/constantes/roles.enum.js';

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
  ) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Listar todos los viajes (Solo Admin)' })
  async listarTodos(@Req() req: any) {
    const viajes = await this.listarViajes.ejecutar(req.user.sub, req.user.rol as RolesEnum);
    return viajes.map(v => ViajeMapper.toResponse(v));
  }

  @Get('mis-viajes')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.PASAJERO, RolesEnum.CONDUCTOR)
  @ApiOperation({ summary: 'Historial de viajes del usuario actual' })
  async misViajes(@Req() req: any) {
    const viajes = await this.listarViajes.ejecutar(req.user.sub, req.user.rol as RolesEnum);
    return viajes.map(v => ViajeMapper.toResponse(v));
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.PASAJERO)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Solicitar un nuevo viaje (Solo Pasajeros)' })
  async solicitar(
    @Body() dto: SolicitarViajeDto,
    @Req() req: any,
  ) {
    // Para mayor seguridad podríamos forzar que el pasajeroId sea el del token
    // dto.pasajeroId = req.user.sub;
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
    @Body() dto: AceptarViajeDto,
    @Req() req: any,
  ) {
    // Garantizamos que el conductor que acepta es el autenticado
    dto.conductorId = req.user.sub;
    const viaje = await this.aceptarViaje.ejecutar(id, dto);
    return ViajeMapper.toResponse(viaje);
  }

  @Post(':id/llegada')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.CONDUCTOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Notificar que el conductor ha llegado al punto de recogida' })
  async llegada(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const conductorId = req.user.sub;
    const viaje = await this.marcarLlegada.ejecutar(id, conductorId);
    return ViajeMapper.toResponse(viaje);
  }

  @Post(':id/iniciar')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.CONDUCTOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar un viaje (Solo Conductores)' })
  async iniciar(
    @Param('id') id: string,
  ) {
    const viaje = await this.iniciarViaje.ejecutar(id);
    return ViajeMapper.toResponse(viaje);
  }

  @Post(':id/completar')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.CONDUCTOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Completar el viaje y generar cobro (Solo Conductores)' })
  async completar(
    @Param('id') id: string,
  ) {
    const viaje = await this.completarViaje.ejecutar(id);
    return ViajeMapper.toResponse(viaje);
  }

  @Post(':id/cancelar')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.PASAJERO, RolesEnum.CONDUCTOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar un viaje' })
  async cancelar(
    @Param('id') id: string,
    @Body() dto: CancelarViajeDto,
    @Req() req: any,
  ) {
    const actorId = req.user.sub;
    const rol = req.user.rol;
    const viaje = await this.cancelarViaje.ejecutar(id, actorId, rol, dto.motivo);
    return ViajeMapper.toResponse(viaje);
  }
}
