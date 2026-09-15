import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';
import type { IPushConductor } from '../../aplicacion/puertos/push-conductor.port.js';
import type { ViajeDisponibleNotificacion } from '../../aplicacion/puertos/viaje-disponible-notificacion.js';
import type { IConductorRepository } from '../../../conductores/dominio/repositorios/conductor.repository.js';
import { CONDUCTOR_REPOSITORY } from '../../../conductores/dominio/repositorios/conductor.repository.js';

@Injectable()
export class FirebasePushConductorAdapter
  implements IPushConductor, OnModuleInit
{
  private readonly logger = new Logger(FirebasePushConductorAdapter.name);
  private listo = false;

  constructor(
    private readonly config: ConfigService,
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
  ) {}

  onModuleInit(): void {
    const json = this.config.get<string>('FIREBASE_SERVICE_ACCOUNT_JSON');
    const path = this.config.get<string>('GOOGLE_APPLICATION_CREDENTIALS');

    try {
      if (admin.apps.length > 0) {
        this.listo = true;
        return;
      }
      if (json?.trim()) {
        const credenciales = JSON.parse(json) as admin.ServiceAccount;
        admin.initializeApp({
          credential: admin.credential.cert(credenciales),
        });
        this.listo = true;
        this.logger.log('FCM inicializado con FIREBASE_SERVICE_ACCOUNT_JSON');
        return;
      }
      if (path?.trim()) {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
        this.listo = true;
        this.logger.log('FCM inicializado con GOOGLE_APPLICATION_CREDENTIALS');
        return;
      }
      this.logger.warn(
        'FCM no configurado: definí FIREBASE_SERVICE_ACCOUNT_JSON o GOOGLE_APPLICATION_CREDENTIALS para timbre con app cerrada',
      );
    } catch (error) {
      this.logger.error(`No se pudo inicializar FCM: ${String(error)}`);
      this.listo = false;
    }
  }

  async enviarOfertaViaje(
    conductorId: string,
    viaje: ViajeDisponibleNotificacion,
  ): Promise<void> {
    if (!this.listo) {
      return;
    }
    const conductor = await this.conductorRepository.obtenerPorId(conductorId);
    const token = conductor?.tokenPushFcm;
    if (!token) {
      this.logger.warn(
        `Conductor ${conductorId} sin token FCM; solo llegará por socket si está abierto`,
      );
      return;
    }

    const data = {
      tipo: 'nuevo_viaje',
      viajeId: viaje.id,
      origenLat: String(viaje.origenLat),
      origenLng: String(viaje.origenLng),
      destinoLat: String(viaje.destinoLat),
      destinoLng: String(viaje.destinoLng),
      tarifaEstimada: String(viaje.tarifaEstimada),
      ...(viaje.origenDireccion
        ? { origenDireccion: viaje.origenDireccion }
        : {}),
      ...(viaje.destinoDireccion
        ? { destinoDireccion: viaje.destinoDireccion }
        : {}),
    };

    try {
      await admin.messaging().send({
        token,
        android: {
          priority: 'high',
          ttl: 60_000,
          notification: {
            title: 'Nuevo viaje MyRide',
            body: `Tarifa US$${viaje.tarifaEstimada.toFixed(2)} — tocá para aceptar o rechazar`,
            channelId: 'ofertas_viaje',
            sound: 'default',
            priority: 'max',
            defaultVibrateTimings: true,
            sticky: true,
          },
        },
        apns: {
          headers: {
            'apns-priority': '10',
            'apns-push-type': 'alert',
          },
          payload: {
            aps: {
              alert: {
                title: 'Nuevo viaje MyRide',
                body: `Tarifa US$${viaje.tarifaEstimada.toFixed(2)}`,
              },
              sound: 'default',
              contentAvailable: true,
              interruptionLevel: 'timeSensitive',
            },
          },
        },
        data,
      });
    } catch (error) {
      this.logger.error(
        `FCM oferta viaje ${viaje.id} → ${conductorId}: ${String(error)}`,
      );
    }
  }

  async cancelarOfertaViaje(
    conductorId: string,
    viajeId: string,
  ): Promise<void> {
    if (!this.listo) {
      return;
    }
    const conductor = await this.conductorRepository.obtenerPorId(conductorId);
    const token = conductor?.tokenPushFcm;
    if (!token) {
      return;
    }
    try {
      await admin.messaging().send({
        token,
        android: { priority: 'high' },
        apns: {
          headers: { 'apns-priority': '10' },
          payload: { aps: { contentAvailable: true } },
        },
        data: {
          tipo: 'oferta_cancelada',
          viajeId,
        },
      });
    } catch (error) {
      this.logger.warn(
        `FCM cancelar oferta ${viajeId} → ${conductorId}: ${String(error)}`,
      );
    }
  }
}
