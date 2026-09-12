import 'dart:io' show Platform;

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

import '../../../../core/constants/env_keys.dart';
import '../../../../core/storage/session_storage.dart';
import '../../domain/entities/recibo_viaje.dart';
import '../../domain/repositories/viaje_realtime_gateway.dart';
import '../mappers/recibo_viaje_mapper.dart';

class ViajeSocketDataSource implements ViajeRealtimeGateway {
  final SessionStorage sessionStorage;

  io.Socket? _socket;
  String? _viajePendienteId;

  ViajeSocketDataSource({required this.sessionStorage});

  @override
  Future<void> conectar() async {
    final token = await sessionStorage.obtenerToken();
    if (token == null || token.isEmpty) {
      return;
    }

    if (_socket?.connected == true) {
      return;
    }

    _socket?.dispose();
    _socket = io.io(
      dotenv.env[EnvKeys.socketUrl] ??
          (Platform.isAndroid
              ? 'http://10.0.2.2:3000'
              : 'http://127.0.0.1:3000'),
      io.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .setAuth({'token': token})
          .setExtraHeaders({'Authorization': 'Bearer $token'})
          .build(),
    );

    _socket?.onConnect((_) {
      if (_viajePendienteId != null) {
        _emitirUnirseAViaje(_viajePendienteId!);
      }
    });

    _socket?.connect();
  }

  @override
  void unirseAViaje(String viajeId) {
    _viajePendienteId = viajeId;
    if (_socket?.connected == true) {
      _emitirUnirseAViaje(viajeId);
    }
  }

  void _emitirUnirseAViaje(String viajeId) {
    _socket?.emit('unirseAViaje', {'viajeId': viajeId});
  }

  void _escuchar(String evento, void Function(dynamic) callback) {
    _socket?.off(evento);
    _socket?.on(evento, callback);
  }

  @override
  void escucharUbicacionActualizada(
    void Function(double latitud, double longitud) callback,
  ) {
    _escuchar('ubicacionActualizada', (data) {
      if (data is! Map) {
        return;
      }
      final payload = Map<String, dynamic>.from(data);
      final lat = payload['lat'] as num?;
      final lng = payload['lng'] as num?;
      if (lat == null || lng == null) {
        return;
      }
      callback(lat.toDouble(), lng.toDouble());
    });
  }

  @override
  void escucharViajeAceptado(void Function() callback) {
    _escuchar('viajeAceptado', (_) => callback());
  }

  @override
  void escucharConductorLlego(void Function() callback) {
    _escuchar('conductorLlego', (_) => callback());
  }

  @override
  void escucharViajeIniciado(void Function() callback) {
    _escuchar('viajeIniciado', (_) => callback());
  }

  @override
  void escucharViajeCompletado(void Function(ReciboViaje recibo) callback) {
    _escuchar('viajeCompletado', (data) {
      if (data is! Map) {
        return;
      }
      callback(
        ReciboViajeMapper.fromEventoCompletado(
          Map<String, dynamic>.from(data),
        ),
      );
    });
  }

  @override
  void desconectar() {
    _viajePendienteId = null;
    _socket?.off('ubicacionActualizada');
    _socket?.off('viajeAceptado');
    _socket?.off('conductorLlego');
    _socket?.off('viajeIniciado');
    _socket?.off('viajeCompletado');
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}
