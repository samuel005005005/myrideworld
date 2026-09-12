import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

import '../constants/app_strings.dart';
import '../providers/core_providers.dart';

final socketServiceProvider = Provider<SocketService>((ref) {
  return SocketService(ref.watch(socketBaseUrlProvider));
});

class SocketService {
  final String _socketUrl;
  IO.Socket? _socket;
  String? _tokenActual;
  String? _conductorPendienteId;
  String? _viajePendienteId;

  SocketService(this._socketUrl);

  Future<void> conectar({required String token}) async {
    if (token.isEmpty) {
      debugPrint(AppStrings.socketSinToken);
      return;
    }

    if (_socket?.connected == true && _tokenActual == token) {
      return;
    }

    _tokenActual = token;
    _socket?.dispose();
    _socket = IO.io(
      _socketUrl,
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
      debugPrint(AppStrings.socketConectado);
      if (_conductorPendienteId != null) {
        _emitirIdentificarConductor(_conductorPendienteId!);
      }
      if (_viajePendienteId != null) {
        _emitirUnirseAViaje(_viajePendienteId!);
      }
    });

    _socket?.onDisconnect((_) {
      debugPrint(AppStrings.socketDesconectado);
    });

    _socket?.connect();
  }

  void identificarConductor(String conductorId) {
    _conductorPendienteId = conductorId;
    if (_socket?.connected == true) {
      _emitirIdentificarConductor(conductorId);
    }
  }

  void unirseAViaje(String viajeId) {
    _viajePendienteId = viajeId;
    if (_socket?.connected == true) {
      _emitirUnirseAViaje(viajeId);
    }
  }

  void _emitirIdentificarConductor(String conductorId) {
    emitir('identificarConductor', {'conductorId': conductorId});
  }

  void _emitirUnirseAViaje(String viajeId) {
    emitir('unirseAViaje', {'viajeId': viajeId});
  }

  void escuchar(String evento, void Function(dynamic) callback) {
    _socket?.off(evento);
    _socket?.on(evento, callback);
  }

  void dejarDeEscuchar(String evento) {
    _socket?.off(evento);
  }

  void emitir(String evento, dynamic data) {
    _socket?.emit(evento, data);
  }

  void actualizarUbicacion({
    required String viajeId,
    required double latitud,
    required double longitud,
  }) {
    emitir('actualizarUbicacion', {
      'viajeId': viajeId,
      'lat': latitud,
      'lng': longitud,
    });
  }

  void desconectar() {
    _conductorPendienteId = null;
    _viajePendienteId = null;
    _tokenActual = null;
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}
