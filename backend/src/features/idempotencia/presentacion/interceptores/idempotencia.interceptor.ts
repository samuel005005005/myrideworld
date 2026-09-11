import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ConflictException, Inject } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IDEMPOTENCIA_REPOSITORY } from '../../dominio/repositorios/idempotencia.repository.js';
import type { IIdempotenciaRepository } from '../../dominio/repositorios/idempotencia.repository.js';
import { Idempotencia, EstadoIdempotencia } from '../../dominio/entidades/idempotencia.entity.js';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class IdempotenciaInterceptor implements NestInterceptor {
  constructor(
    @Inject(IDEMPOTENCIA_REPOSITORY)
    private readonly idempotenciaRepository: IIdempotenciaRepository,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    
    // Solo aplicar a POST, PUT, PATCH, DELETE
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return next.handle();
    }

    const idempotencyKey = request.headers['idempotency-key'] as string;
    
    // Si no mandan llave, dejamos que siga (o podríamos forzarlo lanzando error)
    if (!idempotencyKey) {
      return next.handle();
    }

    const requestHash = this.generarHash(request.body);
    
    // Verificar si ya existe en la base de datos
    let registro = await this.idempotenciaRepository.obtenerPorLlave(idempotencyKey);

    if (registro) {
      // Validar si el cuerpo cambió (opcional pero recomendado)
      if (registro.cuerpoPeticionHash && registro.cuerpoPeticionHash !== requestHash) {
        throw new ConflictException('Idempotency-Key está siendo usada con un payload diferente.');
      }

      if (registro.estado === EstadoIdempotencia.COMPLETADO) {
        const res = ctx.getResponse<Response>();
        res.status(registro.codigoEstado ?? 200);
        return of(registro.respuesta);
      }

      if (registro.estado === EstadoIdempotencia.EN_PROGRESO) {
        throw new ConflictException('La solicitud está en progreso. Intente nuevamente en unos segundos.');
      }

      // Si es ERROR, podríamos permitir reintentar o devolver el error
      if (registro.estado === EstadoIdempotencia.ERROR) {
        // Para este interceptor simple, dejaremos que vuelva a procesarse actualizando el registro a EN_PROGRESO
        registro = Idempotencia.iniciar(idempotencyKey, request.url, requestHash);
        await this.idempotenciaRepository.guardar(registro);
      }
    } else {
      // Crear nuevo registro EN_PROGRESO
      registro = Idempotencia.iniciar(idempotencyKey, request.url, requestHash);
      await this.idempotenciaRepository.guardar(registro);
    }

    return next.handle().pipe(
      tap({
        next: async (data) => {
          const res = ctx.getResponse<Response>();
          // Obtener el registro fresco por si acaso
          const actualizado = await this.idempotenciaRepository.obtenerPorLlave(idempotencyKey);
          if (actualizado) {
            actualizado.completar(res.statusCode, data);
            await this.idempotenciaRepository.guardar(actualizado);
          }
        },
        error: async (error) => {
          const actualizado = await this.idempotenciaRepository.obtenerPorLlave(idempotencyKey);
          if (actualizado) {
            const status = error.status || 500;
            const resBody = error.response || { message: error.message };
            actualizado.fallar(status, resBody);
            await this.idempotenciaRepository.guardar(actualizado);
          }
        },
      }),
    );
  }

  private generarHash(body: any): string {
    if (!body || Object.keys(body).length === 0) return '';
    return crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');
  }
}
