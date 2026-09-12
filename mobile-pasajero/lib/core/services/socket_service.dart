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
  
  Function(Map<String, dynamic>)? onUbicacionActualizada;

  SocketService(this._apiService);

  void connect() {
    final token = _apiService.currentToken;
    if (token == null) {
      print('Cannot connect socket: No JWT token found');
      return;
    }

    _socket = IO.io(
      dotenv.env['SOCKET_URL'] ?? 'http://10.0.0.202:3000',
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .setExtraHeaders({
            'Authorization': 'Bearer $token',
            'Bypass-Tunnel-Reminder': 'true', // Evadir advertencia de localtunnel
          })
          .build(),
    );

    _socket?.connect();

    _socket?.onConnect((_) {
      print('Socket connected');
    });

    _socket?.onDisconnect((_) {
      print('Socket disconnected');
    });

    _socket?.on('ubicacionActualizada', (data) {
      if (onUbicacionActualizada != null) {
        onUbicacionActualizada!(Map<String, dynamic>.from(data));
      }
    });
  }

  void unirseAViaje(String viajeId) {
    if (_socket?.connected == true) {
      print('Uniéndose al viaje $viajeId');
      _socket?.emit('unirseAViaje', { 'viajeId': viajeId });
    } else {
      print('Socket not connected, cannot join viaje');
    }
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}
