import 'dart:async';

import 'package:socket_io_client/socket_io_client.dart' as io;

import '../../../../core/config/app_env.dart';
import '../../../../core/storage/session_storage.dart';
import '../../domain/entities/recibo_viaje.dart';
import '../../domain/entities/conductor_asignado.dart';
import '../../domain/entities/conductor_cercano.dart';
import '../../domain/entities/viaje.dart';
import '../../domain/repositories/viaje_realtime_gateway.dart';
import '../mappers/conductor_asignado_mapper.dart';
import '../mappers/conductor_cercano_mapper.dart';
import '../mappers/recibo_viaje_mapper.dart';
import '../mappers/viaje_mapper.dart';

class ViajeSocketDataSource implements ViajeRealtimeGateway {
  final SessionStorage sessionStorage;

  io.Socket? _socket;
  String? _viajePendienteId;
  ({double lat, double lng})? _flotaPendiente;
  bool _conectando = false;
  void Function(String motivo)? _onSesionReemplazada;

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
    if (_conectando) {
      return;
    }

    _conectando = true;
    try {
      _socket?.dispose();
      final listo = Completer<void>();
      _socket = io.io(
        AppEnv.socketUrl,
        io.OptionBuilder()
            .setTransports(['websocket'])
            .enableForceNew()
            .enableReconnection()
            .setReconnectionAttempts(20)
            .setReconnectionDelay(1200)
            .disableAutoConnect()
            .setAuth({'token': token})
            .setExtraHeaders({'Authorization': 'Bearer $token'})
            .build(),
      );

      _socket?.onConnect((_) {
        _rehidratarSesion();
        _engancharSesionReemplazada();
        if (!listo.isCompleted) {
          listo.complete();
        }
      });

      _socket?.onConnectError((error) {
        if (!listo.isCompleted) {
          listo.completeError(error ?? 'connect_error');
        }
      });

      _socket?.onReconnect((_) {
        _rehidratarSesion();
        _engancharSesionReemplazada();
      });

      _engancharSesionReemplazada();
      _socket?.connect();
      try {
        await listo.future.timeout(const Duration(seconds: 8));
      } catch (_) {
        // Sigue: onConnect/onReconnect rehidratan al conectar.
      }
    } finally {
      _conectando = false;
    }
  }

  void _rehidratarSesion() {
    if (_viajePendienteId != null) {
      _emitirUnirseAViaje(_viajePendienteId!);
    }
    final flota = _flotaPendiente;
    if (flota != null) {
      _emitirObservarFlota(flota.lat, flota.lng);
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
  void observarFlota({required double latitud, required double longitud}) {
    _flotaPendiente = (lat: latitud, lng: longitud);
    if (_socket?.connected == true) {
      _emitirObservarFlota(latitud, longitud);
    }
  }

  @override
  void dejarDeObservarFlota() {
    _flotaPendiente = null;
    _socket?.emit('dejarDeObservarFlota');
  }

  void _emitirUnirseAViaje(String viajeId) {
    _socket?.emit('unirseAViaje', {'viajeId': viajeId});
  }

  void _emitirObservarFlota(double lat, double lng) {
    _socket?.emit('observarFlota', {'lat': lat, 'lng': lng});
  }

  void _escuchar(String evento, void Function(dynamic) callback) {
    _socket?.off(evento);
    _socket?.on(evento, callback);
  }

  @override
  void escucharUbicacionConductorFlota(
    void Function(ConductorCercano conductor) callback,
  ) {
    _escuchar('ubicacionConductorFlota', (data) {
      if (data is! Map) {
        return;
      }
      try {
        callback(
          ConductorCercanoMapper.fromJson(Map<String, dynamic>.from(data)),
        );
      } catch (_) {
        // Payload inválido: se ignora.
      }
    });
  }

  @override
  void escucharConductorFueraDeFlota(
    void Function(String conductorId) callback,
  ) {
    _escuchar('conductorFueraDeFlota', (data) {
      if (data is! Map) {
        return;
      }
      final id = data['conductorId'];
      if (id is String && id.isNotEmpty) {
        callback(id);
      }
    });
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
  void escucharViajeAceptado(
    void Function(ConductorAsignado? conductor) callback,
  ) {
    _escuchar('viajeAceptado', (data) {
      if (data is! Map) {
        callback(null);
        return;
      }
      final payload = Map<String, dynamic>.from(data);
      final conductorJson = payload['conductor'];
      if (conductorJson is Map) {
        callback(
          ConductorAsignadoMapper.fromJson(
            Map<String, dynamic>.from(conductorJson),
          ),
        );
        return;
      }
      callback(null);
    });
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
  void escucharEstadoViaje(
    void Function(Viaje viaje, double? latConductor, double? lngConductor)
        callback,
  ) {
    _escuchar('estadoViaje', (data) {
      if (data is! Map) {
        return;
      }
      try {
        final payload = Map<String, dynamic>.from(data);
        final viaje = ViajeMapper.fromJson(payload);
        final ubicacion = payload['ubicacionConductor'];
        double? lat;
        double? lng;
        if (ubicacion is Map) {
          final u = Map<String, dynamic>.from(ubicacion);
          final latRaw = u['lat'];
          final lngRaw = u['lng'];
          if (latRaw is num && lngRaw is num) {
            lat = latRaw.toDouble();
            lng = lngRaw.toDouble();
          }
        }
        callback(viaje, lat, lng);
      } catch (_) {
        // Payload inválido: se ignora.
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
  void desconectar() {
    _viajePendienteId = null;
    _flotaPendiente = null;
    _onSesionReemplazada = null;
    final socket = _socket;
    _socket = null;
    if (socket == null) {
      return;
    }
    socket.off('ubicacionConductorFlota');
    socket.off('conductorFueraDeFlota');
    socket.off('ubicacionActualizada');
    socket.off('viajeAceptado');
    socket.off('conductorLlego');
    socket.off('viajeIniciado');
    socket.off('viajeCompletado');
    socket.off('estadoViaje');
    socket.off('sesionReemplazada');
    try {
      socket.io.reconnection = false;
      socket.io.skipReconnect = true;
    } catch (_) {
      // Manager antiguo: dispose corta el ciclo igual.
    }
    socket.disconnect();
    socket.dispose();
  }
}
