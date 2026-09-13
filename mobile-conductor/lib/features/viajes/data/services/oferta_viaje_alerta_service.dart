import 'dart:async';

import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_ringtone_player/flutter_ringtone_player.dart';

import '../../domain/entities/viaje.dart';

/// Timbre + notificación de oferta hasta aceptar/rechazar/cancelar.
class OfertaViajeAlertaService {
  OfertaViajeAlertaService._();

  static final OfertaViajeAlertaService instancia = OfertaViajeAlertaService._();

  final FlutterLocalNotificationsPlugin _notificaciones =
      FlutterLocalNotificationsPlugin();
  final StreamController<Viaje> _ofertas = StreamController<Viaje>.broadcast();
  final StreamController<String> _cancelaciones =
      StreamController<String>.broadcast();

  bool _inicializado = false;
  String? _viajeSonandoId;

  Stream<Viaje> get ofertas => _ofertas.stream;
  Stream<String> get cancelaciones => _cancelaciones.stream;

  Future<void> inicializar() async {
    if (_inicializado) {
      return;
    }
    const android = AndroidInitializationSettings('@mipmap/ic_launcher');
    const ios = DarwinInitializationSettings();
    await _notificaciones.initialize(
      settings: const InitializationSettings(android: android, iOS: ios),
      onDidReceiveNotificationResponse: (respuesta) {
        // La UI ya escucha el stream de ofertas.
      },
    );

    final androidPlugin = _notificaciones
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >();
    await androidPlugin?.createNotificationChannel(
      const AndroidNotificationChannel(
        'ofertas_viaje',
        'Ofertas de viaje',
        description: 'Alerta sonora de nuevo viaje MyRide',
        importance: Importance.max,
        playSound: true,
        enableVibration: true,
      ),
    );
    await androidPlugin?.requestNotificationsPermission();

    _inicializado = true;
  }

  Future<void> iniciarAlerta(Viaje viaje) async {
    await inicializar();
    _viajeSonandoId = viaje.id;
    if (!_ofertas.isClosed) {
      _ofertas.add(viaje);
    }

    await FlutterRingtonePlayer().play(
      android: AndroidSounds.ringtone,
      ios: IosSounds.alarm,
      looping: true,
      volume: 1,
      asAlarm: true,
    );

    await _notificaciones.show(
      id: 91001,
      title: 'Nuevo viaje MyRide',
      body:
          'US\$${viaje.tarifaEstimada.toStringAsFixed(2)} — Abrí la app para aceptar o rechazar',
      notificationDetails: const NotificationDetails(
        android: AndroidNotificationDetails(
          'ofertas_viaje',
          'Ofertas de viaje',
          channelDescription: 'Alerta sonora de nuevo viaje MyRide',
          importance: Importance.max,
          priority: Priority.max,
          category: AndroidNotificationCategory.call,
          fullScreenIntent: true,
          ongoing: true,
          autoCancel: false,
          playSound: true,
        ),
        iOS: DarwinNotificationDetails(
          presentAlert: true,
          presentSound: true,
          interruptionLevel: InterruptionLevel.timeSensitive,
        ),
      ),
      payload: viaje.id,
    );
  }

  Future<void> detener({String? viajeId}) async {
    if (viajeId != null &&
        _viajeSonandoId != null &&
        _viajeSonandoId != viajeId) {
      return;
    }
    _viajeSonandoId = null;
    await FlutterRingtonePlayer().stop();
    await _notificaciones.cancel(id: 91001);
  }

  void avisarCancelacion(String viajeId) {
    if (!_cancelaciones.isClosed) {
      _cancelaciones.add(viajeId);
    }
    unawaited(detener(viajeId: viajeId));
  }

  Viaje? viajeDesdePayloadData(Map<String, dynamic> data) {
    final id = data['viajeId'] as String?;
    if (id == null || id.isEmpty) {
      return null;
    }
    final origenLat = double.tryParse('${data['origenLat']}');
    final origenLng = double.tryParse('${data['origenLng']}');
    final destinoLat = double.tryParse('${data['destinoLat']}');
    final destinoLng = double.tryParse('${data['destinoLng']}');
    final tarifa = double.tryParse('${data['tarifaEstimada']}');
    if (origenLat == null ||
        origenLng == null ||
        destinoLat == null ||
        destinoLng == null ||
        tarifa == null) {
      return null;
    }
    return Viaje(
      id: id,
      pasajeroId: '',
      conductorId: null,
      estado: 'Solicitado',
      origenLat: origenLat,
      origenLng: origenLng,
      destinoLat: destinoLat,
      destinoLng: destinoLng,
      tarifaEstimada: tarifa,
      fechaCreacion: DateTime.now(),
    );
  }
}
