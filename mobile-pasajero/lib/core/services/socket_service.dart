import 'dart:io' show Platform;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'api_service.dart';

final socketServiceProvider = Provider<SocketService>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return SocketService(apiService);
});

class SocketService {
  final ApiService _apiService;
  IO.Socket? _socket;
  String? _viajePendienteId;

  Function(Map<String, dynamic>)? onUbicacionActualizada;

  SocketService(this._apiService);

  void connect() {
    final token = _apiService.currentToken;
    if (token == null) {
      print('Cannot connect socket: No JWT token found');
      return;
    }

    if (_socket?.connected == true) {
      return;
    }

    _socket?.dispose();
    _socket = IO.io(
      dotenv.env['SOCKET_URL'] ??
          (Platform.isAndroid ? 'http://10.0.2.2:3000' : 'http://127.0.0.1:3000'),
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
      print('Socket connected');
      if (_viajePendienteId != null) {
        _emitirUnirseAViaje(_viajePendienteId!);
      }
    });

    _socket?.onDisconnect((_) {
      print('Socket disconnected');
    });

    _socket?.on('ubicacionActualizada', (data) {
      if (onUbicacionActualizada != null && data is Map) {
        onUbicacionActualizada!(Map<String, dynamic>.from(data));
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
    print('Uniéndose al viaje $viajeId');
    _socket?.emit('unirseAViaje', {'viajeId': viajeId});
  }

  void on(String event, Function(dynamic) callback) {
    _socket?.on(event, callback);
  }

  void emit(String event, dynamic data) {
    _socket?.emit(event, data);
  }

  void disconnect() {
    _viajePendienteId = null;
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}
