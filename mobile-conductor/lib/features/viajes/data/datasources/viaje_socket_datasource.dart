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
  final Set<String> _viajesUnidos = <String>{};
  ({double lat, double lng})? _flotaPendiente;
  final List<void Function(String viajeId)> _listenersViajeCancelado = [];
  void Function()? _onConnectExtra;
  void Function()? _onDisconnectExtra;
  void Function(String motivo)? _onSesionReemplazada;
  bool _conectando = false;

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
    if (_conectando) {
      return;
    }

    _conectando = true;
    try {
      _socket?.dispose();
      final listo = Completer<void>();
      _socket = io.io(
        socketUrl,
        io.OptionBuilder()
            .setTransports(['websocket'])
            .enableReconnection()
            .setReconnectionAttempts(20)
            .setReconnectionDelay(1200)
            .disableAutoConnect()
            .setAuth({'token': token})
            .setExtraHeaders({'Authorization': 'Bearer $token'})
            .build(),
      );

      _socket?.onConnect((_) {
        if (kDebugMode) {
          debugPrint(AppStrings.socketConectado);
        }
        _rehidratarSesion();
        _engancharSesionReemplazada();
        _onConnectExtra?.call();
        if (!listo.isCompleted) {
          listo.complete();
        }
      });

      _socket?.onReconnect((_) {
        _rehidratarSesion();
        _engancharSesionReemplazada();
        _onConnectExtra?.call();
      });

      _socket?.onDisconnect((_) {
        if (kDebugMode) {
          debugPrint(AppStrings.socketDesconectado);
        }
        _onDisconnectExtra?.call();
      });

      _socket?.onConnectError((error) {
        if (!listo.isCompleted) {
          listo.completeError(error ?? 'connect_error');
        }
      });

      _engancharSesionReemplazada();
      _socket?.connect();
      try {
        await listo.future.timeout(const Duration(seconds: 8));
      } catch (_) {
        // Continúa: onConnect/onReconnect rehidratan al conectar.
      }
    } finally {
      _conectando = false;
    }
  }

  void _rehidratarSesion() {
    if (_conductorPendienteId != null) {
      _emitirIdentificarConductor(_conductorPendienteId!);
    }
    final viajes = <String>{
      ..._viajesUnidos,
      if (_viajePendienteId != null) _viajePendienteId!,
    };
    for (final viajeId in viajes) {
      _emitirUnirseAViaje(viajeId);
    }
    final flota = _flotaPendiente;
    if (flota != null) {
      _socket?.emit('publicarUbicacionFlota', {
        'lat': flota.lat,
        'lng': flota.lng,
      });
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
    _viajesUnidos.add(viajeId);
    if (_socket?.connected == true) {
      _emitirUnirseAViaje(viajeId);
    }
  }

  @override
  void salirDeViaje(String viajeId) {
    if (_viajePendienteId == viajeId) {
      _viajePendienteId = null;
    }
    _viajesUnidos.remove(viajeId);
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
    // No reemplazar handlers internos: se encadenan vía callbacks.
    _onConnectExtra = onConnect;
    _onDisconnectExtra = onDisconnect;
    if (_socket?.connected == true) {
      onConnect();
    }
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
  void escucharEstadoViaje(void Function(Viaje viaje) callback) {
    _socket?.off('estadoViaje');
    _socket?.on('estadoViaje', (data) {
      if (data is! Map) {
        return;
      }
      try {
        final viaje = ViajeMapper.toDomain(
          ViajeMapper.fromApiData(Map<String, dynamic>.from(data)),
        );
        callback(viaje);
      } catch (_) {
        // Payload inválido.
      }
    });
  }

  @override
  void escucharSesionReemplazada(void Function(String motivo) callback) {
    _onSesionReemplazada = callback;
    _engancharSesionReemplazada();
  }

  void _engancharSesionReemplazada() {
    final callback = _onSesionReemplazada;
    if (callback == null || _socket == null) {
      return;
    }
    _socket?.off('sesionReemplazada');
    _socket?.on('sesionReemplazada', (data) {
      var motivo = 'Sesión reemplazada';
      if (data is Map && data['motivo'] is String) {
        motivo = data['motivo'] as String;
      }
      callback(motivo);
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
    _viajesUnidos.clear();
    _flotaPendiente = null;
    _onConnectExtra = null;
    _onDisconnectExtra = null;
    _listenersViajeCancelado.clear();
    _socket?.off('nuevoViajeDisponible');
    _socket?.off('ofertaViajeCancelada');
    _socket?.off('viajeCancelado');
    _socket?.off('estadoViaje');
    _socket?.off('sesionReemplazada');
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}
