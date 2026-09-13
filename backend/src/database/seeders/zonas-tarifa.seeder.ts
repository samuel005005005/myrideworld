import { Logger } from '@nestjs/common';
import type { IZonaTarifaRepository } from '../../features/tarifas/dominio/repositorios/zona-tarifa.repository.js';
import { ZonaTarifa } from '../../features/tarifas/dominio/entidades/zona-tarifa.entity.js';

/** Catálogo inicial de zonas — solo en seed, no en runtime de apps. */
const ZONAS_SEED = [
  'Aeropuerto Internacional de Punta Cana (PUJ)',
  'Hard Rock Hotel & Casino Punta Cana',
  'Coco Bongo Punta Cana',
  'Bavaro Beach Resort',
  'Cap Cana Marina',
  'Uvero Alto Plaza',
  'BlueMall Puntacana',
  'Downtown Punta Cana',
  'Bávaro',
  'Macao',
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
