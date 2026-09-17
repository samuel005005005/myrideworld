import 'dart:async';
import 'dart:io';

import 'package:audioplayers/audioplayers.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_ringtone_player/flutter_ringtone_player.dart';

import '../../domain/entities/viaje.dart';

/// Timbre + notificación de oferta hasta aceptar/rechazar/cancelar.
///
/// En Android el ringtone del sistema hace loop nativo.
/// En iOS SystemSound no loopea: usamos asset WAV con [AudioPlayer].
class OfertaViajeAlertaService {
  OfertaViajeAlertaService._();

  static final OfertaViajeAlertaService instancia = OfertaViajeAlertaService._();

  static const String _assetAlertaIos = 'sounds/alerta_oferta.wav';

  final FlutterLocalNotificationsPlugin _notificaciones =
      FlutterLocalNotificationsPlugin();
  final StreamController<Viaje> _ofertas = StreamController<Viaje>.broadcast();
  final StreamController<String> _cancelaciones =
      StreamController<String>.broadcast();
  final AudioPlayer _playerIos = AudioPlayer();

  bool _inicializado = false;
  String? _viajeSonandoId;
  int _generacionAlerta = 0;

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

    if (Platform.isIOS) {
      await _playerIos.setReleaseMode(ReleaseMode.loop);
      await _playerIos.setVolume(1);
      await _playerIos.setAudioContext(
        AudioContext(
          iOS: AudioContextIOS(
            category: AVAudioSessionCategory.playback,
            options: {AVAudioSessionOptions.duckOthers},
          ),
        ),
      );
    }

    _inicializado = true;
  }

  Future<void> iniciarAlerta(Viaje viaje) async {
    await inicializar();
    final generacion = ++_generacionAlerta;
    _viajeSonandoId = viaje.id;
    if (!_ofertas.isClosed) {
      _ofertas.add(viaje);
    }

    await _iniciarSonido();
    if (generacion != _generacionAlerta) {
      return;
    }

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

  Future<void> _iniciarSonido() async {
    if (Platform.isIOS) {
      await _playerIos.stop();
      await _playerIos.play(AssetSource(_assetAlertaIos));
      return;
    }

    await FlutterRingtonePlayer().play(
      android: AndroidSounds.ringtone,
      ios: IosSounds.alarm,
      looping: true,
      volume: 1,
      asAlarm: true,
    );
  }

  Future<void> detener({String? viajeId}) async {
    if (viajeId != null &&
        _viajeSonandoId != null &&
        _viajeSonandoId != viajeId) {
      return;
    }
    final generacion = ++_generacionAlerta;
    _viajeSonandoId = null;
    if (Platform.isIOS) {
      await _playerIos.stop();
    } else {
      await FlutterRingtonePlayer().stop();
    }
    if (generacion != _generacionAlerta) {
      return;
    }
    await _notificaciones.cancel(id: 91001);
  }

  /// Reanuda timbre/notificación sin reemitir al stream de ofertas
  /// (evita duplicar la cola cuando queda más de un viaje sonando).
  Future<void> reanudarAlerta(Viaje viaje) async {
    await inicializar();
    if (_viajeSonandoId == viaje.id) {
      return;
    }
    final generacion = ++_generacionAlerta;
    _viajeSonandoId = viaje.id;
    await _iniciarSonido();
    if (generacion != _generacionAlerta) {
      return;
    }
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

  /// Avisa a la UI; el controller decide si para el timbre o reanuda otra oferta.
  void avisarCancelacion(String viajeId) {
    if (!_cancelaciones.isClosed) {
      _cancelaciones.add(viajeId);
    }
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
      origenDireccion: _textoPayload(data['origenDireccion']),
      destinoDireccion: _textoPayload(data['destinoDireccion']),
      tarifaEstimada: tarifa,
      fechaCreacion: DateTime.now(),
    );
  }

  String? _textoPayload(Object? valor) {
    if (valor is! String) {
      return null;
    }
    final texto = valor.trim();
    return texto.isEmpty ? null : texto;
  }
}
