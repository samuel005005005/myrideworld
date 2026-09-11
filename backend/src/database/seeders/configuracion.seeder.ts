import { Injectable, Inject, Logger } from '@nestjs/common';
import type { IConfiguracionRepository } from '../../features/configuracion/dominio/repositorios/configuracion.repository.js';
import { CONFIGURACION_REPOSITORY } from '../../features/configuracion/dominio/repositorios/configuracion.repository.js';
import { Configuracion } from '../../features/configuracion/dominio/entidades/configuracion.entity.js';
import { MENSAJES } from '../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class ConfiguracionSeeder {
  private readonly logger = new Logger(ConfiguracionSeeder.name);

  constructor(
    @Inject(CONFIGURACION_REPOSITORY)
    private readonly configRepo: IConfiguracionRepository,
  ) { }

  async seed() {
    this.logger.log('Iniciando seed de Configuraciones...');
    const configuracionesIniciales = [
      { clave: MENSAJES.EXCEPCIONES.CONFIGURACION.CLAVE_FEE_PLATAFORMA, valor: '0.20', descripcion: MENSAJES.EXCEPCIONES.CONFIGURACION.FEE_PLATAFORMA_DESC },
      { clave: MENSAJES.EXCEPCIONES.CONFIGURACION.CLAVE_TIMEOUT_VIAJE_MINUTOS, valor: '5', descripcion: MENSAJES.EXCEPCIONES.CONFIGURACION.TIMEOUT_VIAJE_MINUTOS_DESC },
    ];

    for (const conf of configuracionesIniciales) {
      const existe = await this.configRepo.obtenerValor(conf.clave, null as any);
      if (existe === null) {
        const nueva = Configuracion.crear(conf);
        await this.configRepo.guardar(nueva);
        this.logger.log(`Configuración creada: ${conf.clave}`);
      } else {
        this.logger.log(`Configuración existente: ${conf.clave}`);
      }
    }
  }
}
