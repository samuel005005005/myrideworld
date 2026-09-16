import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/theme/app_theme.dart';
import '../../domain/entities/estado_viaje_activo.dart';
import '../../domain/entities/viaje.dart';
import '../controllers/viaje_activo_controller.dart';
import '../controllers/viaje_activo_state.dart';
import '../utils/abrir_navegacion_externa.dart';
import '../utils/app_navegacion_externa.dart';
import '../widgets/marcador_mapa_viaje.dart';
import '../widgets/capa_marcador_posicion_suave.dart';

class ViajeActivePage extends ConsumerStatefulWidget {
  final Viaje viaje;

  const ViajeActivePage({super.key, required this.viaje});

  @override
  ConsumerState<ViajeActivePage> createState() => _ViajeActivePageState();
}

class _ViajeActivePageState extends ConsumerState<ViajeActivePage> {
  final MapController _mapController = MapController();
  String? _ultimoAjusteCamaraClave;
  late final ViajeActivoController _viajeActivoController =
      ref.read(viajeActivoControllerProvider.notifier);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      if (!mounted) {
        return;
      }
      await _viajeActivoController.inicializar(widget.viaje);
    });
  }

  @override
  void dispose() {
    // Diferir: no mutar providers durante dispose/build.
    Future<void>(() => _viajeActivoController.limpiar());
    super.dispose();
  }

  bool _mostrarMarcadorRecogida(EstadoViajeActivo estado) {
    return estado == EstadoViajeActivo.enCaminoAlPasajero ||
        estado == EstadoViajeActivo.esperandoPasajero;
  }

  void _ajustarCamara({
    required LatLng conductor,
    required LatLng? recogida,
    required LatLng destino,
    required List<LatLng> puntosRuta,
  }) {
    final todos = <LatLng>[
      if (conductor.latitude != 0 || conductor.longitude != 0) conductor,
      ?recogida,
      destino,
      ...puntosRuta,
    ];
    if (todos.length < 2) {
      _mapController.move(todos.isEmpty ? destino : todos.first, 14);
      return;
    }
    _mapController.fitCamera(
      CameraFit.bounds(
        bounds: LatLngBounds.fromPoints(todos),
        padding: const EdgeInsets.fromLTRB(48, 140, 48, 160),
      ),
    );
  }

  void _programarAjusteCamara(ViajeActivoState estado) {
    final viaje = estado.viaje;
    if (viaje == null) {
      return;
    }
    final clave =
        '${viaje.id}|${estado.estado.name}|${estado.puntosRuta.length}';
    if (_ultimoAjusteCamaraClave == clave) {
      return;
    }
    _ultimoAjusteCamaraClave = clave;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) {
        return;
      }
      final incluirRecogida = _mostrarMarcadorRecogida(estado.estado);
      _ajustarCamara(
        conductor: LatLng(estado.latitudActual, estado.longitudActual),
        recogida: incluirRecogida
            ? LatLng(viaje.origenLat, viaje.origenLng)
            : null,
        destino: LatLng(viaje.destinoLat, viaje.destinoLng),
        puntosRuta: estado.puntosRuta,
      );
    });
  }

  Future<void> _copiarInfoMarcador({
    required LatLng punto,
  }) async {
    final texto = AppStrings.formatoCoordenada(
      punto.latitude,
      punto.longitude,
    );
    await Clipboard.setData(ClipboardData(text: texto));
    if (!mounted) {
      return;
    }
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(AppStrings.viajeMarcadorCopiado),
        duration: Duration(seconds: 2),
      ),
    );
  }

  Future<void> _mostrarDetalleMarcador({
    required String titulo,
    required Color color,
    required IconData icono,
    required String? lugar,
  }) {
    final textoLugar = (lugar == null || lugar.trim().isEmpty)
        ? AppStrings.viajeDireccionCargando
        : lugar;
    return showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(icono, color: color, size: 26),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            titulo,
                            style: const TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textDark,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            textoLugar,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: AppTheme.textGrey,
                              height: 1.3,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text(AppStrings.viajeMarcadorCerrar),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final estado = ref.watch(viajeActivoControllerProvider);
    ref.listen<ViajeActivoState>(viajeActivoControllerProvider, (
      anterior,
      siguiente,
    ) {
      if (siguiente.errorMensaje != null &&
          siguiente.errorMensaje != anterior?.errorMensaje &&
          mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(siguiente.errorMensaje!),
            duration: const Duration(seconds: 6),
            backgroundColor: const Color(0xFFB91C1C),
          ),
        );
        ref.read(viajeActivoControllerProvider.notifier).limpiarError();
      }

      if (siguiente.viaje != null && mounted) {
        _programarAjusteCamara(siguiente);
      }

      if (siguiente.finalizado && mounted) {
        final recibo = siguiente.recibo;
        if (recibo != null) {
          context.go('/recibo', extra: recibo);
        } else {
          context.go('/home');
        }
      }

      if (siguiente.canceladoRemotamente &&
          !(anterior?.canceladoRemotamente ?? false) &&
          mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(AppStrings.viajeCanceladoPorPasajero),
            duration: Duration(seconds: 4),
          ),
        );
        context.go('/home');
      }
    });

    // GPS / socket aún no listos: no mostrar pantalla de error.
    if (estado.viaje == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final controller = ref.read(viajeActivoControllerProvider.notifier);
    final ubicacionActual = controller.obtenerUbicacionActual();
    final pasajero = controller.obtenerUbicacionPasajero();
    final destino = controller.obtenerUbicacionDestino();
    final puntosRuta = estado.puntosRuta;
    final mostrarRecogida = _mostrarMarcadorRecogida(estado.estado);

    _programarAjusteCamara(estado);

    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: FlutterMap(
              mapController: _mapController,
              options: MapOptions(
                initialCenter: mostrarRecogida ? pasajero : destino,
                initialZoom: 13,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.myride.mobile_conductor',
                ),
                if (puntosRuta.isNotEmpty)
                  PolylineLayer(
                    polylines: [
                      Polyline(
                        points: puntosRuta,
                        strokeWidth: 5,
                        color: AppTheme.brandPrimary,
                      ),
                    ],
                  ),
                MarkerLayer(
                  markers: [
                    if (mostrarRecogida)
                      Marker(
                        point: pasajero,
                        width: 148,
                        height: 98,
                        alignment: Alignment.bottomCenter,
                        child: MarcadorMapaViaje(
                          color: const Color(0xFF2563EB),
                          icono: Icons.person_rounded,
                          etiqueta: AppStrings.formatoMarcadorConLugar(
                            AppStrings.viajeMarcadorRecogida,
                            estado.direccionRecogida,
                          ),
                          conPunta: true,
                          onTap: () => _mostrarDetalleMarcador(
                            titulo: AppStrings.viajeDetalleRecogida,
                            color: const Color(0xFF2563EB),
                            icono: Icons.person_rounded,
                            lugar: estado.direccionRecogida,
                          ),
                          onLongPress: () => _copiarInfoMarcador(
                            punto: pasajero,
                          ),
                        ),
                      ),
                    Marker(
                      point: destino,
                      width: 148,
                      height: 98,
                      alignment: Alignment.bottomCenter,
                      child: MarcadorMapaViaje(
                        color: const Color(0xFFDC2626),
                        icono: Icons.place_rounded,
                        etiqueta: AppStrings.formatoMarcadorConLugar(
                          AppStrings.viajeMarcadorDestino,
                          estado.direccionDestino,
                        ),
                        conPunta: true,
                        onTap: () => _mostrarDetalleMarcador(
                          titulo: AppStrings.viajeDetalleDestino,
                          color: const Color(0xFFDC2626),
                          icono: Icons.place_rounded,
                          lugar: estado.direccionDestino,
                        ),
                        onLongPress: () => _copiarInfoMarcador(
                          punto: destino,
                        ),
                      ),
                    ),
                  ],
                ),
                CapaMarcadorPosicionSuave(
                  destino:
                      (ubicacionActual.latitude != 0 ||
                          ubicacionActual.longitude != 0)
                      ? ubicacionActual
                      : null,
                  width: 148,
                  height: 88,
                  builder: (context, puntoVisible) {
                    return MarcadorMapaViaje(
                      color: AppTheme.brandPrimary,
                      icono: Icons.directions_car_filled_rounded,
                      etiqueta: AppStrings.formatoMarcadorConLugar(
                        AppStrings.viajeMarcadorConductor,
                        estado.direccionConductor,
                      ),
                      onTap: () => _mostrarDetalleMarcador(
                        titulo: AppStrings.viajeDetalleConductor,
                        color: AppTheme.brandPrimary,
                        icono: Icons.directions_car_filled_rounded,
                        lugar: estado.direccionConductor,
                      ),
                      onLongPress: () => _copiarInfoMarcador(
                        punto: ubicacionActual.latitude != 0 ||
                                ubicacionActual.longitude != 0
                            ? ubicacionActual
                            : puntoVisible,
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
          Positioned(
            top: MediaQuery.of(context).padding.top + 12,
            left: 16,
            right: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: const [
                  BoxShadow(color: Colors.black12, blurRadius: 10),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppTheme.brandPrimaryLight,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.navigation_outlined,
                      color: AppTheme.brandPrimary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          controller.obtenerTituloEstado(),
                          style: const TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 15,
                            color: AppTheme.textDark,
                          ),
                        ),
                        if (estado.etaInfo.isNotEmpty &&
                            controller.obtenerTituloEstado() !=
                                AppStrings.viajeEstadoEsperando)
                          Text(
                            estado.etaInfo,
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppTheme.textGrey,
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            left: 16,
            right: 16,
            bottom: MediaQuery.of(context).padding.bottom + 16,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => _abrirNavegacion(
                          AppNavegacionExterna.googleMaps,
                          controller.obtenerUbicacionObjetivo(),
                        ),
                        icon: const Icon(Icons.map_outlined, size: 18),
                        label: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: const Text(AppStrings.viajeAbrirGoogleMaps),
                        ),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.textDark,
                          backgroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          side: const BorderSide(color: AppTheme.borderGrey),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => _abrirNavegacion(
                          AppNavegacionExterna.waze,
                          controller.obtenerUbicacionObjetivo(),
                        ),
                        icon: const Icon(Icons.navigation_outlined, size: 18),
                        label: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: const Text(AppStrings.viajeAbrirWaze),
                        ),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.textDark,
                          backgroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          side: const BorderSide(color: AppTheme.borderGrey),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.brandPrimary,
                    foregroundColor: Colors.black87,
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    minimumSize: const Size.fromHeight(52),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    elevation: 0,
                  ),
                  onPressed: estado.procesando
                      ? null
                      : () {
                          controller.avanzarEstado();
                        },
                  child: estado.procesando
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.black87,
                          ),
                        )
                      : Text(
                          controller.obtenerTextoBoton(),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _abrirNavegacion(
    AppNavegacionExterna app,
    LatLng destino,
  ) async {
    try {
      await AbrirNavegacionExterna.abrir(
        app: app,
        latitud: destino.latitude,
        longitud: destino.longitude,
      );
    } catch (_) {
      if (!mounted) {
        return;
      }
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text(AppStrings.errorAbrirNavegacion)),
      );
    }
  }
}
