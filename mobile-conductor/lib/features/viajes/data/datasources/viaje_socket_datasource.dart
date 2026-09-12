import 'package:flutter/foundation.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

import '../../../../core/constants/app_strings.dart';
import '../../../../core/storage/session_storage.dart';
import '../../domain/entities/viaje.dart';
import '../../domain/repositories/viaje_realtime_gateway.dart';
import '../mappers/viaje_mapper.dart';

class ViajeSocketDataSource implements ViajeRealtimeGateway {
  final SessionStorage sessionStorage;
  final String socketUrl;

  io.Socket? _socket;
  String? _conductorPendienteId;
  String? _viajePendienteId;

  ViajeSocketDataSource({
    required this.sessionStorage,
    required this.socketUrl,
  });

  @override
  Future<void> conectar() async {
    final token = await sessionStorage.obtenerToken();
    if (token == null || token.isEmpty) {
      if (kDebugMode) {
        debugPrint(AppStrings.socketSinToken);
      }
      return;
    }

    if (_socket?.connected == true) {
      return;
    }

    _socket?.dispose();
    _socket = io.io(
      socketUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .setAuth({'token': token})
          .setExtraHeaders({'Authorization': 'Bearer $token'})
          .build(),
    );

    _socket?.onConnect((_) {
      if (kDebugMode) {
        debugPrint(AppStrings.socketConectado);
      }
      if (_conductorPendienteId != null) {
        _emitirIdentificarConductor(_conductorPendienteId!);
      }
      if (_viajePendienteId != null) {
        _emitirUnirseAViaje(_viajePendienteId!);
      }
    });

    _socket?.onDisconnect((_) {
      if (kDebugMode) {
        debugPrint(AppStrings.socketDesconectado);
      }
    });

    _socket?.connect();
  }

  @override
  void identificarConductor(String conductorId) {
    _conductorPendienteId = conductorId;
    if (_socket?.connected == true) {
      _emitirIdentificarConductor(conductorId);
    }
  }

  @override
  void unirseAViaje(String viajeId) {
    _viajePendienteId = viajeId;
    if (_socket?.connected == true) {
      _emitirUnirseAViaje(viajeId);
    }
  }

  void _emitirIdentificarConductor(String conductorId) {
    _socket?.emit('identificarConductor', {'conductorId': conductorId});
  }

  void _emitirUnirseAViaje(String viajeId) {
    _socket?.emit('unirseAViaje', {'viajeId': viajeId});
  }

  @override
  void escucharEstadoConexion({
    required void Function() onConnect,
    required void Function() onDisconnect,
  }) {
    _socket?.off('connect');
    _socket?.off('disconnect');
    _socket?.onConnect((_) => onConnect());
    _socket?.onDisconnect((_) => onDisconnect());
  }

  @override
  void escucharNuevoViaje(void Function(Viaje viaje) callback) {
    _socket?.off('nuevoViajeDisponible');
    _socket?.on('nuevoViajeDisponible', (data) {
      if (data is! Map) {
        return;
      }
      try {
        final viaje = ViajeMapper.toDomain(
          ViajeMapper.fromApiData(Map<String, dynamic>.from(data)),
        );
        callback(viaje);
      } catch (_) {
        // Payload inválido: se ignora en el adaptador.
      }
    });
  }

  @override
  void actualizarUbicacion({
    required String viajeId,
    required double latitud,
    required double longitud,
  }) {
    _socket?.emit('actualizarUbicacion', {
      'viajeId': viajeId,
      'lat': latitud,
      'lng': longitud,
    });
  }

  @override
  void desconectar() {
    _conductorPendienteId = null;
    _viajePendienteId = null;
    _socket?.off('nuevoViajeDisponible');
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}
