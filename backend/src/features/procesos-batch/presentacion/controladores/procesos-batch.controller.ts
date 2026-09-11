import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { TimeoutViajesUseCase } from '../../aplicacion/casos-uso/timeout-viajes.use-case.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@ApiExcludeController() // Ocultar endpoint de proceso batch en Swagger
@Controller('api/procesos-batch')
export class ProcesosBatchController {
  constructor(
    private readonly timeoutViajesUseCase: TimeoutViajesUseCase,
  ) {}

  @Post('timeout-viajes')
  @HttpCode(HttpStatus.OK)
  async dispararTimeoutViajes() {
    // Idealmente aquí se validaría un token, o el header x-amz-sns-message-type de AWS SNS
    this.timeoutViajesUseCase.ejecutar().catch(e => console.error(e));
    return { mensaje: MENSAJES.EXCEPCIONES.PROCESOS_BATCH.DISPARADO_OK };
  }
}
