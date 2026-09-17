import { Logger } from '@nestjs/common';
import type { IZonaTarifaRepository } from '../../features/tarifas/dominio/repositorios/zona-tarifa.repository.js';
import { ZonaTarifa } from '../../features/tarifas/dominio/entidades/zona-tarifa.entity.js';

/**
 * Catálogo de zonas tarifario (OD externo).
 * Lugares Cap Cana: puntos típicos dentro de la geocerca bbox seed;
 * la tarifa plana interna no depende de esta lista (usa geocerca).
 */
const ZONAS_SEED = [
  // Externos / mixtos (fuera o borde Cap Cana)
  'Aeropuerto Internacional de Punta Cana (PUJ)',
  'Hard Rock Hotel & Casino Punta Cana',
  'Coco Bongo Punta Cana',
  'Bavaro Beach Resort',
  'Uvero Alto Plaza',
  'BlueMall Puntacana',
  'Downtown Punta Cana',
  'Bávaro',
  'Macao',
  // Internos Cap Cana (dentro geocerca seed ~18.45–18.53 / -68.48–-68.35)
  'Cap Cana Marina',
  'Juanillo Beach Cap Cana',
  'Punta Espada Golf Club',
  'Eden Roc Cap Cana',
  'Sanctuary Cap Cana',
  'Secrets Cap Cana Resort & Spa',
  'Hyatt Zilara Cap Cana',
  'Hyatt Ziva Cap Cana',
  'The St. Regis Cap Cana Resort',
  'Dreams Cap Cana Resort & Spa',
  'Fishing Lodge Cap Cana',
  'Hotel Casa Don Luis Cap Cana',
  'Caletón Beach Club Cap Cana',
] as const;

export class ZonasTarifaSeeder {
  private readonly logger = new Logger(ZonasTarifaSeeder.name);

  constructor(private readonly repo: IZonaTarifaRepository) {}

  async seed(): Promise<void> {
    this.logger.log('Iniciando seed de zonas tarifario...');
    for (const nombre of ZONAS_SEED) {
      const existe = await this.repo.obtenerPorNombre(nombre);
      if (existe) {
        this.logger.log(`Zona existente: ${nombre}`);
        continue;
      }
      await this.repo.guardar(ZonaTarifa.crear({ nombre, activa: true }));
      this.logger.log(`Zona creada: ${nombre}`);
    }
  }
}
