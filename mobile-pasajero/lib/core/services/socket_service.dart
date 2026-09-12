import 'dart:io' show Platform;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

import '../constants/env_keys.dart';

final socketServiceProvider = Provider<SocketService>((ref) {
  return SocketService();
});

class SocketService {
  IO.Socket? _socket;
  String? _viajePendienteId;

  Future<void> conectar() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('jwt_token');
    if (token == null) {
      return;
    }

    if (_socket?.connected == true) {
      return;
    }

    _socket?.dispose();
    _socket = IO.io(
      dotenv.env[EnvKeys.socketUrl] ??
          (Platform.isAndroid
              ? 'http://10.0.2.2:3000'
              : 'http://127.0.0.1:3000'),
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .setAuth({'token': token})
          .setExtraHeaders({
            'Authorization': 'Bearer $token',
            'Bypass-Tunnel-Reminder': 'true',
          })
          .build(),
    );

    _socket?.onConnect((_) {
      if (_viajePendienteId != null) {
        _emitirUnirseAViaje(_viajePendienteId!);
      }
    });

    _socket?.connect();
  }

  void unirseAViaje(String viajeId) {
    _viajePendienteId = viajeId;
    if (_socket?.connected == true) {
      _emitirUnirseAViaje(viajeId);
    }
  }

  void _emitirUnirseAViaje(String viajeId) {
    emitir('unirseAViaje', {'viajeId': viajeId});
  }

  void escuchar(String evento, void Function(dynamic) callback) {
    _socket?.off(evento);
    _socket?.on(evento, callback);
  }

  void emitir(String evento, dynamic data) {
    _socket?.emit(evento, data);
  }

  void escucharUbicacionActualizada(
    void Function(Map<String, dynamic>) callback,
  ) {
    escuchar('ubicacionActualizada', (data) {
      if (data is Map) {
        callback(Map<String, dynamic>.from(data));
      }
    });
  }

  void escucharViajeAceptado(void Function() callback) {
    escuchar('viajeAceptado', (_) => callback());
  }

  void escucharConductorLlego(void Function() callback) {
    escuchar('conductorLlego', (_) => callback());
  }

  void escucharViajeIniciado(void Function() callback) {
    escuchar('viajeIniciado', (_) => callback());
  }

  void escucharViajeCompletado(void Function(Map<String, dynamic>) callback) {
    escuchar('viajeCompletado', (data) {
      if (data is Map) {
        callback(Map<String, dynamic>.from(data));
      }
    });
  }

  void limpiarSuscripciones() {
    _socket?.off('ubicacionActualizada');
    _socket?.off('viajeAceptado');
    _socket?.off('conductorLlego');
    _socket?.off('viajeIniciado');
    _socket?.off('viajeCompletado');
  }

  void desconectar() {
    _viajePendienteId = null;
    limpiarSuscripciones();
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}
