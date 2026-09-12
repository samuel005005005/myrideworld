import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { TimeoutViajesUseCase } from '../../aplicacion/casos-uso/timeout-viajes.use-case.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@ApiExcludeController()
@Controller('api/procesos-batch')
export class ProcesosBatchController {
  constructor(
    private readonly timeoutViajesUseCase: TimeoutViajesUseCase,
    private readonly configService: ConfigService,
  ) {}

  @Post('timeout-viajes')
  @HttpCode(HttpStatus.OK)
  async dispararTimeoutViajes(
    @Headers('x-batch-secret') batchSecret?: string,
  ) {
    const esperado = this.configService.get<string>('BATCH_SECRET');
    if (!esperado || batchSecret !== esperado) {
      throw new UnauthorizedException(
        MENSAJES.EXCEPCIONES.PROCESOS_BATCH.SECRETO_INVALIDO,
      );
    }

    this.timeoutViajesUseCase.ejecutar().catch((e) => console.error(e));
    return { mensaje: MENSAJES.EXCEPCIONES.PROCESOS_BATCH.DISPARADO_OK };
  }
}
