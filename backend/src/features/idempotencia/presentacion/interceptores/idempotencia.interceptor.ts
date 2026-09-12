import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IDEMPOTENCIA_REPOSITORY } from '../../dominio/repositorios/idempotencia.repository.js';
import type { IIdempotenciaRepository } from '../../dominio/repositorios/idempotencia.repository.js';
import { Idempotencia } from '../../dominio/entidades/idempotencia.entity.js';
import { EstadoIdempotencia } from '../../dominio/entidades/estado-idempotencia.enum.js';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class IdempotenciaInterceptor implements NestInterceptor {
  constructor(
    @Inject(IDEMPOTENCIA_REPOSITORY)
    private readonly idempotenciaRepository: IIdempotenciaRepository,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request & { user?: { sub?: string } }>();

    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return next.handle();
    }

    const rawKey = request.headers['idempotency-key'] as string | undefined;
    if (!rawKey) {
      return next.handle();
    }

    const userId = request.user?.sub ?? 'anon';
    const idempotencyKey = `${userId}:${rawKey}`;
    const requestHash = this.generarHash(request.body);

    let registro =
      await this.idempotenciaRepository.obtenerPorLlave(idempotencyKey);

    if (registro) {
      if (
        registro.cuerpoPeticionHash &&
        registro.cuerpoPeticionHash !== requestHash
      ) {
        throw new ConflictException(
          MENSAJES.EXCEPCIONES.IDEMPOTENCIA.PAYLOAD_DIFERENTE,
        );
      }

      if (registro.estado === EstadoIdempotencia.COMPLETADO) {
        const res = ctx.getResponse<Response>();
        res.status(registro.codigoEstado ?? 200);
        return of(registro.respuesta);
      }

      if (registro.estado === EstadoIdempotencia.EN_PROGRESO) {
        throw new ConflictException(
          MENSAJES.EXCEPCIONES.IDEMPOTENCIA.EN_PROGRESO,
        );
      }

      if (registro.estado === EstadoIdempotencia.ERROR) {
        registro = Idempotencia.iniciar(
          idempotencyKey,
          request.url,
          requestHash,
        );
        await this.idempotenciaRepository.guardar(registro);
      }
    } else {
      registro = Idempotencia.iniciar(idempotencyKey, request.url, requestHash);
      await this.idempotenciaRepository.guardar(registro);
    }

    return next.handle().pipe(
      switchMap((data) =>
        from(
          (async () => {
            const res = ctx.getResponse<Response>();
            const actualizado =
              await this.idempotenciaRepository.obtenerPorLlave(idempotencyKey);
            if (actualizado) {
              actualizado.completar(res.statusCode, data);
              await this.idempotenciaRepository.guardar(actualizado);
            }
            return data;
          })(),
        ),
      ),
    );
  }

  private generarHash(body: unknown): string {
    if (!body || typeof body !== 'object' || Object.keys(body as object).length === 0) {
      return '';
    }
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(body))
      .digest('hex');
  }
}
