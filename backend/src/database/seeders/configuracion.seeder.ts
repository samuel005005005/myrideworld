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
  ) {}

  async seed() {
    this.logger.log('Iniciando seed de Configuraciones...');
    const C = MENSAJES.EXCEPCIONES.CONFIGURACION;
    const configuracionesIniciales = [
      {
        clave: C.CLAVE_FEE_PLATAFORMA,
        valor: '0.20',
        descripcion: C.FEE_PLATAFORMA_DESC,
      },
      {
        clave: C.CLAVE_TIMEOUT_VIAJE_MINUTOS,
        valor: '5',
        descripcion: C.TIMEOUT_VIAJE_MINUTOS_DESC,
      },
      {
        clave: C.CLAVE_TIMEOUT_OFERTA_CONDUCTOR_SEGUNDOS,
        valor: '30',
        descripcion: C.TIMEOUT_OFERTA_CONDUCTOR_SEGUNDOS_DESC,
      },
      {
        clave: C.CLAVE_TARIFA_BASE,
        valor: '30.0',
        descripcion: C.TARIFA_BASE_DESC,
      },
      {
        clave: C.CLAVE_TARIFA_KM,
        valor: '15.0',
        descripcion: C.TARIFA_KM_DESC,
      },
      {
        clave: C.CLAVE_TARIFA_MINIMA,
        valor: '50.0',
        descripcion: C.TARIFA_MINIMA_DESC,
      },
      {
        clave: C.CLAVE_TARIFA_ZONA_CAP_CANA,
        valor: '4',
        descripcion: C.TARIFA_ZONA_CAP_CANA_DESC,
      },
      {
        clave: C.CLAVE_GEOCERCA_CAP_CANA,
        valor: JSON.stringify({
          tipo: 'bbox',
          latMin: 18.45,
          latMax: 18.53,
          lngMin: -68.48,
          lngMax: -68.35,
        }),
        descripcion: C.GEOCERCA_CAP_CANA_DESC,
      },
      {
        clave: C.CLAVE_SOPORTE_TELEFONO,
        valor: '+18095550100',
        descripcion: C.SOPORTE_TELEFONO_DESC,
      },
      {
        clave: C.CLAVE_SOPORTE_WHATSAPP,
        valor: '18095550100',
        descripcion: C.SOPORTE_WHATSAPP_DESC,
      },
      {
        clave: C.CLAVE_RADIO_PROXIMIDAD_ORIGEN_M,
        valor: '200',
        descripcion: C.RADIO_PROXIMIDAD_ORIGEN_M_DESC,
      },
      {
        clave: C.CLAVE_RADIO_PROXIMIDAD_DESTINO_M,
        valor: '200',
        descripcion: C.RADIO_PROXIMIDAD_DESTINO_M_DESC,
      },
      {
        clave: C.CLAVE_RADIO_MAPA_FLOTA_KM,
        valor: '25',
        descripcion: C.RADIO_MAPA_FLOTA_KM_DESC,
      },
    ];

    for (const conf of configuracionesIniciales) {
      const existe = await this.configRepo.obtenerPorClave(conf.clave);
      if (!existe) {
        const nueva = Configuracion.crear(conf);
        await this.configRepo.guardar(nueva);
        this.logger.log(`Configuración creada: ${conf.clave}`);
      } else {
        this.logger.log(`Configuración existente: ${conf.clave}`);
      }
    }
  }
}
