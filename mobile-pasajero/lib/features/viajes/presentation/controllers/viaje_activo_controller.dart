import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../domain/repositories/viaje_realtime_gateway.dart';
import '../../domain/usecases/cancelar_viaje_params.dart';
import '../../domain/usecases/obtener_ruta_usecase.dart';
import '../../domain/usecases/obtener_viaje_por_id_params.dart';
import '../providers/viajes_provider.dart';
import 'viaje_activo_state.dart';

final viajeActivoControllerProvider =
    NotifierProvider<ViajeActivoController, ViajeActivoState>(
      ViajeActivoController.new,
    );

class ViajeActivoController extends Notifier<ViajeActivoState> {
  static const double _metrosMinimosParaNuevaRuta = 80;

  bool _seguimientoIniciado = false;
  LatLng? _ultimoOrigenRuta;
  final Distance _calculadoraDistancia = const Distance();

  @override
  ViajeActivoState build() {
    ref.onDispose(detenerSeguimiento);

    return const ViajeActivoState(
      estadoViaje: AppStrings.trackingEsperandoConfirmacion,
    );
  }

  ViajeRealtimeGateway get _gateway => ref.read(viajeRealtimeGatewayProvider);

  Future<void> iniciarSeguimiento(String? viajeId) async {
    if (_seguimientoIniciado) {
      return;
    }

    _seguimientoIniciado = true;

    if (viajeId != null && viajeId.isNotEmpty) {
      state = state.copyWith(viajeId: viajeId);
    }

    final gateway = _gateway;

    final detalleFuture = (viajeId != null && viajeId.isNotEmpty)
        ? _cargarDetalleViaje(viajeId)
        : Future<void>.value();

    await gateway.conectar();
    if (viajeId != null && viajeId.isNotEmpty) {
      gateway.unirseAViaje(viajeId);
    }

    gateway.escucharUbicacionActualizada((lat, lng) {
      final conductor = LatLng(lat, lng);
      state = state.copyWith(ubicacionConductor: conductor);
      _actualizarEtaLocal(conductor);
      unawaited(_actualizarRuta(forzar: false));
    });

    gateway.escucharViajeAceptado((conductor) {
      state = state.copyWith(
        estadoViaje: AppStrings.trackingConductorEnCamino,
        haciaDestino: false,
        conductor: conductor,
      );
      unawaited(_actualizarRuta(forzar: true));
    });

    gateway.escucharConductorLlego(() {
      state = state.copyWith(
        estadoViaje: AppStrings.trackingConductorHaLlegado,
        infoEta: null,
        puntosRuta: const <LatLng>[],
      );
    });

    gateway.escucharViajeIniciado(() {
      state = state.copyWith(
        estadoViaje: AppStrings.trackingViajeEnCursoDestino,
        haciaDestino: true,
        infoEta: null,
      );
      _ultimoOrigenRuta = null;
      unawaited(_actualizarRuta(forzar: true));
    });

    gateway.escucharViajeCompletado((recibo) {
      state = state.copyWith(reciboPendiente: recibo);
    });

    await detalleFuture;
  }

  Future<bool> cancelarViajeActivo() async {
    final id = state.viajeId;
    if (id == null || id.isEmpty || state.cancelando) {
      return false;
    }

    state = state.copyWith(cancelando: true, errorCancelacion: null);
    final resultado = await ref.read(cancelarViajeUseCaseProvider)(
      CancelarViajeParams(viajeId: id),
    );

    return resultado.foldLogged(
      'ViajeActivoController.cancelarViajeActivo',
      (failure) {
        state = state.copyWith(
          cancelando: false,
          errorCancelacion: failure.mensaje,
        );
        return false;
      },
      (_) {
        state = state.copyWith(
          cancelando: false,
          cancelado: true,
          estadoViaje: AppStrings.trackingViajeCancelado,
          infoEta: null,
          puntosRuta: const <LatLng>[],
        );
        detenerSeguimiento();
        return true;
      },
    );
  }

  Future<void> _cargarDetalleViaje(String viajeId) async {
    final resultado = await ref.read(obtenerViajePorIdUseCaseProvider)(
      ObtenerViajePorIdParams(viajeId),
    );
    resultado.fold((_) {}, (viaje) {
      final haciaDestino = _estadoHaciaDestino(viaje.estado);
      state = state.copyWith(
        viajeId: viajeId,
        origen: LatLng(viaje.origenLat, viaje.origenLng),
        destino: LatLng(viaje.destinoLat, viaje.destinoLng),
        conductor: viaje.conductor,
        haciaDestino: haciaDestino,
        estadoViaje: _tituloDesdeEstadoApi(viaje.estado),
      );
      unawaited(_actualizarRuta(forzar: true));
    });
  }

  bool _estadoHaciaDestino(String estadoApi) {
    final normalizado = estadoApi.toLowerCase();
    return normalizado.contains('curso') || normalizado.contains('inici');
  }

  String _tituloDesdeEstadoApi(String estadoApi) {
    final normalizado = estadoApi.toLowerCase();
    if (normalizado.contains('llego') || normalizado.contains('llegó')) {
      return AppStrings.trackingConductorHaLlegado;
    }
    if (_estadoHaciaDestino(estadoApi)) {
      return AppStrings.trackingViajeEnCursoDestino;
    }
    if (normalizado.contains('asign') ||
        normalizado.contains('camino') ||
        normalizado.contains('acept')) {
      return AppStrings.trackingConductorEnCamino;
    }
    return AppStrings.trackingEsperandoConfirmacion;
  }

  LatLng? _ubicacionObjetivo() {
    if (state.haciaDestino) {
      return state.destino;
    }
    return state.origen;
  }

  void _actualizarEtaLocal(LatLng conductor) {
    final objetivo = _ubicacionObjetivo();
    if (objetivo == null) {
      return;
    }
    final metros = _calculadoraDistancia.as(
      LengthUnit.Meter,
      conductor,
      objetivo,
    );
    if (metros < 50) {
      state = state.copyWith(infoEta: AppStrings.trackingMuyCerca);
      return;
    }
    final kilometros = metros / 1000;
    final minutos = (metros / 500).ceil();
    state = state.copyWith(
      infoEta: AppStrings.formatoEtaTracking(kilometros, minutos),
    );
  }

  Future<void> _actualizarRuta({required bool forzar}) async {
    final conductor = state.ubicacionConductor;
    final objetivo = _ubicacionObjetivo();
    if (conductor == null || objetivo == null) {
      return;
    }

    if (!forzar && _ultimoOrigenRuta != null) {
      final desplazamiento = _calculadoraDistancia.as(
        LengthUnit.Meter,
        _ultimoOrigenRuta!,
        conductor,
      );
      if (desplazamiento < _metrosMinimosParaNuevaRuta) {
        return;
      }
    }

    _ultimoOrigenRuta = conductor;

    final resultado = await ref.read(obtenerRutaUseCaseProvider)(
      ObtenerRutaParams(
        origenLat: conductor.latitude,
        origenLng: conductor.longitude,
        destinoLat: objetivo.latitude,
        destinoLng: objetivo.longitude,
      ),
    );

    resultado.fold(
      (_) {},
      (ruta) {
        state = state.copyWith(
          puntosRuta: ruta.puntos
              .map((punto) => LatLng(punto.latitud, punto.longitud))
              .toList(),
          infoEta: AppStrings.formatoEtaTracking(
            ruta.distanciaKm,
            ruta.duracionMinutos,
          ),
        );
      },
    );
  }

  void consumirReciboPendiente() {
    state = state.copyWith(reciboPendiente: null);
  }

  void detenerSeguimiento() {
    if (!_seguimientoIniciado) {
      return;
    }

    _seguimientoIniciado = false;
    _ultimoOrigenRuta = null;
    _gateway.desconectar();
  }
}
