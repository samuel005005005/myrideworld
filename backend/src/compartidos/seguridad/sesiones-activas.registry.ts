import { Injectable } from '@nestjs/common';

type ExpulsorSesiones = (userId: string, sidVigente: string) => void;

/**
 * Una sesión JWT vigente por usuario (sid).
 * En memoria: válido con una instancia API; con N réplicas → Redis.
 */
@Injectable()
export class SesionesActivasRegistry {
  private readonly vigentes = new Map<string, string>();
  private expulsor: ExpulsorSesiones | null = null;

  registrarExpulsor(expulsor: ExpulsorSesiones): void {
    this.expulsor = expulsor;
  }

  /** Nuevo login: invalida el sid anterior y expulsa sockets viejos. */
  activar(userId: string, sid: string): void {
    this.vigentes.set(userId, sid);
    this.expulsor?.(userId, sid);
  }

  /**
   * Tras reinicio de API el mapa está vacío: el primer token válido
   * rehidrata la sesión; el resto con otro sid queda inválido.
   */
  esVigente(userId: string, sid: string | undefined): boolean {
    if (!sid) {
      return false;
    }
    const actual = this.vigentes.get(userId);
    if (actual === undefined) {
      this.vigentes.set(userId, sid);
      return true;
    }
    return actual === sid;
  }

  invalidar(userId: string): void {
    this.vigentes.delete(userId);
  }
}
