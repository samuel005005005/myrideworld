import 'package:dio/dio.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';

import '../../../../core/config/firebase_options.dart';
import '../../../../core/constants/api_endpoints.dart';
import 'oferta_viaje_alerta_service.dart';

@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  final data = message.data;
  final tipo = data['tipo'];
  final alerta = OfertaViajeAlertaService.instancia;
  await alerta.inicializar();

  if (tipo == 'oferta_cancelada') {
    final viajeId = data['viajeId'];
    if (viajeId is String) {
      alerta.avisarCancelacion(viajeId);
    }
    return;
  }

  if (tipo == 'nuevo_viaje') {
    final viaje = alerta.viajeDesdePayloadData(Map<String, dynamic>.from(data));
    if (viaje != null) {
      await alerta.iniciarAlerta(viaje);
    }
  }
}

class PushOfertaViajeService {
  PushOfertaViajeService({required this.dio});

  final Dio dio;
  bool _activo = false;

  Future<void> iniciar() async {
    if (_activo) {
      return;
    }

    try {
      if (Firebase.apps.isEmpty) {
        await Firebase.initializeApp(
          options: DefaultFirebaseOptions.currentPlatform,
        );
      }
      FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

      final messaging = FirebaseMessaging.instance;
      await messaging.requestPermission(alert: true, sound: true, badge: true);
      await messaging.setForegroundNotificationPresentationOptions(
        alert: true,
        badge: true,
        sound: true,
      );

      FirebaseMessaging.onMessage.listen(_manejarMensaje);
      FirebaseMessaging.onMessageOpenedApp.listen(_manejarMensaje);

      final inicial = await messaging.getInitialMessage();
      if (inicial != null) {
        _manejarMensaje(inicial);
      }

      final token = await messaging.getToken().timeout(
        const Duration(seconds: 8),
      );
      if (token != null) {
        await registrarTokenEnApi(token).timeout(const Duration(seconds: 5));
      }
      messaging.onTokenRefresh.listen(registrarTokenEnApi);

      _activo = true;
      if (kDebugMode) {
        debugPrint('FCM activo (proyecto myride-1e31b)');
      }
    } catch (error) {
      if (kDebugMode) {
        debugPrint('No se pudo iniciar FCM: $error');
      }
    }
  }

  Future<void> registrarTokenEnApi(String token) async {
    try {
      await dio.put(
        ApiEndpoints.tokenPushConductor,
        data: {'token': token},
      );
    } catch (error) {
      if (kDebugMode) {
        debugPrint('No se pudo registrar token FCM: $error');
      }
    }
  }

  void _manejarMensaje(RemoteMessage message) {
    final data = message.data;
    final tipo = data['tipo'];
    final alerta = OfertaViajeAlertaService.instancia;

    if (tipo == 'oferta_cancelada') {
      final viajeId = data['viajeId'];
      if (viajeId is String) {
        alerta.avisarCancelacion(viajeId);
      }
      return;
    }

    if (tipo == 'nuevo_viaje') {
      final viaje = alerta.viajeDesdePayloadData(
        Map<String, dynamic>.from(data),
      );
      if (viaje != null) {
        alerta.iniciarAlerta(viaje);
      }
    }
  }
}
