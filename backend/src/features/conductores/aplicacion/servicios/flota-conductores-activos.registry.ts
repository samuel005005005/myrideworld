import { Injectable } from '@nestjs/common';

/**
 * Conductores que están publicando GPS de flota por socket (heartbeat).
 * Evita mostrar en el mapa a quien quedó "Conectado" en BD sin sesión real.
 */
@Injectable()
export class FlotaConductoresActivosRegistry {
  private readonly vistos = new Map<string, number>();
  /** Sin publicar ubicación en este lapso → no aparece en mapa de flota. */
  private readonly ttlMs = 90_000;

  tocar(conductorId: string): void {
    this.vistos.set(conductorId, Date.now());
  }

  salir(conductorId: string): void {
    this.vistos.delete(conductorId);
  }

  estaActivoEnFlota(conductorId: string): boolean {
    const visto = this.vistos.get(conductorId);
    if (visto === undefined) {
      return false;
    }
    if (Date.now() - visto > this.ttlMs) {
      this.vistos.delete(conductorId);
      return false;
    }
    return true;
  }
}
