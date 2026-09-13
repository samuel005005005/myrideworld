import { Logger } from '@nestjs/common';
import type { ITarifaRepository } from '../../features/tarifas/dominio/repositorios/tarifa.repository.js';
import { Tarifa } from '../../features/tarifas/dominio/entidades/tarifa.entity.js';
import { EstadosTarifa } from '../../compartidos/constantes/estados-tarifa.enum.js';

const OD_SEED: ReadonlyArray<{
  origen: string;
  destino: string;
  precio: number;
}> = [
  {
    origen: 'Aeropuerto Internacional de Punta Cana (PUJ)',
    destino: 'Bávaro',
    precio: 45,
  },
  {
    origen: 'Aeropuerto Internacional de Punta Cana (PUJ)',
    destino: 'Cap Cana Marina',
    precio: 55,
  },
  {
    origen: 'Bávaro',
    destino: 'Uvero Alto Plaza',
    precio: 35,
  },
  {
    origen: 'Aeropuerto Internacional de Punta Cana (PUJ)',
    destino: 'Hard Rock Hotel & Casino Punta Cana',
    precio: 50,
  },
];

export class TarifasOdSeeder {
  private readonly logger = new Logger(TarifasOdSeeder.name);

  constructor(private readonly repo: ITarifaRepository) {}

  async seed(): Promise<void> {
    this.logger.log('Iniciando seed de tarifas OD...');
    for (const item of OD_SEED) {
      const existente = await this.repo.obtenerTarifaActiva(
        item.origen,
        item.destino,
      );
      if (existente) {
        this.logger.log(`Tarifa OD existente: ${item.origen} → ${item.destino}`);
        continue;
      }

      const tarifa = Tarifa.crear({
        origen: item.origen,
        destino: item.destino,
        precio: item.precio,
        estado: EstadosTarifa.ACTIVO,
      });
      await this.repo.guardar(tarifa);
      this.logger.log(
        `Tarifa OD creada: ${item.origen} → ${item.destino} = ${item.precio}`,
      );
    }
  }
}
