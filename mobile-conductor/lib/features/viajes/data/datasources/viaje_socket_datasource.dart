import 'dart:async';

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
  ({double lat, double lng})? _flotaPendiente;
  final List<void Function(String viajeId)> _listenersViajeCancelado = [];

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
    final listo = Completer<void>();
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
      final flota = _flotaPendiente;
      if (flota != null) {
        _socket?.emit('publicarUbicacionFlota', {
          'lat': flota.lat,
          'lng': flota.lng,
        });
      }
      if (!listo.isCompleted) {
        listo.complete();
      }
    });

    _socket?.onDisconnect((_) {
      if (kDebugMode) {
        debugPrint(AppStrings.socketDesconectado);
      }
    });

    _socket?.onConnectError((error) {
      if (!listo.isCompleted) {
        listo.completeError(error ?? 'connect_error');
      }
    });

    _socket?.connect();
    try {
      await listo.future.timeout(const Duration(seconds: 8));
    } catch (_) {
      // Continúa: el listener onConnect identificará al reconectar.
    }
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

  @override
  void salirDeViaje(String viajeId) {
    if (_viajePendienteId == viajeId) {
      _viajePendienteId = null;
    }
    _socket?.emit('salirDeViaje', {'viajeId': viajeId});
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
    _socket?.onConnect((_) {
      if (_conductorPendienteId != null) {
        _emitirIdentificarConductor(_conductorPendienteId!);
      }
      if (_viajePendienteId != null) {
        _emitirUnirseAViaje(_viajePendienteId!);
      }
      final flota = _flotaPendiente;
      if (flota != null) {
        _socket?.emit('publicarUbicacionFlota', {
          'lat': flota.lat,
          'lng': flota.lng,
        });
      }
      onConnect();
    });
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
  void escucharOfertaCancelada(void Function(String viajeId) callback) {
    _socket?.off('ofertaViajeCancelada');
    _socket?.on('ofertaViajeCancelada', (data) {
      if (data is! Map) {
        return;
      }
      final viajeId = data['viajeId'];
      if (viajeId is String && viajeId.isNotEmpty) {
        callback(viajeId);
      }
    });
  }

  @override
  void escucharViajeCancelado(void Function(String viajeId) callback) {
    _listenersViajeCancelado.add(callback);
    _socket?.off('viajeCancelado');
    _socket?.on('viajeCancelado', (data) {
      if (data is! Map) {
        return;
      }
      final viajeId = data['viajeId'];
      if (viajeId is! String || viajeId.isEmpty) {
        return;
      }
      for (final listener in List<void Function(String)>.from(
        _listenersViajeCancelado,
      )) {
        listener(viajeId);
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
  void publicarUbicacionFlota({
    required double latitud,
    required double longitud,
  }) {
    _flotaPendiente = (lat: latitud, lng: longitud);
    if (_socket?.connected != true) {
      return;
    }
    _socket?.emit('publicarUbicacionFlota', {
      'lat': latitud,
      'lng': longitud,
    });
  }

  @override
  void salirDeFlota() {
    _flotaPendiente = null;
    _socket?.emit('salirDeFlota');
  }

  @override
  void desconectar() {
    _conductorPendienteId = null;
    _viajePendienteId = null;
    _flotaPendiente = null;
    _listenersViajeCancelado.clear();
    _socket?.off('nuevoViajeDisponible');
    _socket?.off('ofertaViajeCancelada');
    _socket?.off('viajeCancelado');
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}
