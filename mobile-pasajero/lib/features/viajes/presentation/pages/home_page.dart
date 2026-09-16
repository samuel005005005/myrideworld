import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../domain/entities/metodo_pago.dart';
import '../../domain/entities/tipo_vehiculo.dart';
import '../../domain/mappers/estados_viaje_pasajero.dart';
import '../controllers/home_controller.dart';
import '../controllers/home_state.dart';
import '../controllers/home_state_status.dart';
import '../widgets/home_drawer.dart';
import '../widgets/home_vehicle_tile.dart';
import '../widgets/marcador_conductor_flota.dart';
import '../widgets/marcador_mapa_viaje.dart';

final selectedVehicleProvider = StateProvider<TipoVehiculo>(
  (ref) => TipoVehiculo.sedan,
);
final selectedPaymentProvider = StateProvider<MetodoPago>(
  (ref) => MetodoPago.efectivo,
);

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final MapController _mapController = MapController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(homeControllerProvider.notifier).inicializar();
    });
  }

  @override
  Widget build(BuildContext context) {
    final estado = ref.watch(homeControllerProvider);
    final selectedVehicle = ref.watch(selectedVehicleProvider);
    final selectedPayment = ref.watch(selectedPaymentProvider);
    final isRequesting = estado.status == HomeStateStatus.loading;

    ref.listen<HomeState>(homeControllerProvider, (anterior, siguiente) {
      if (siguiente.routePoints.isNotEmpty &&
          anterior?.routePoints != siguiente.routePoints) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (!mounted) {
            return;
          }
          _ajustarCamaraRuta(siguiente);
        });
      }

      final errorMessage = siguiente.errorMessage;
      if (errorMessage != null &&
          errorMessage != anterior?.errorMessage &&
          mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(errorMessage)));
      }

      final viaje = siguiente.activeTrip;
      if (viaje != null &&
          viaje.id != anterior?.activeTrip?.id &&
          siguiente.status == HomeStateStatus.tripRequested &&
          mounted) {
        context.go('/radar', extra: viaje);
      }

      final restaurar = siguiente.viajeParaRestaurar;
      if (restaurar != null &&
          restaurar.id != anterior?.viajeParaRestaurar?.id &&
          mounted) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (!mounted) {
            return;
          }
          ref.read(homeControllerProvider.notifier).consumirViajeParaRestaurar();
          if (EstadosViajePasajero.esBusqueda(restaurar.estado)) {
            context.go('/radar', extra: restaurar);
          } else {
            context.go('/viaje-active', extra: restaurar);
          }
        });
      }
    });

    const brandPrimary = Color(0xFFF59E0B);
    const textDark = Color(0xFF1E293B);
    const bgGrey = Color(0xFFEEEEEE);
    const dividerColor = Color(0xFFE2E2E2);

    final routeDistanceKm = estado.routeDistanceKm;
    final routeDurationMin = estado.routeDurationMin;
    final routePoints = estado.routePoints;
    final etaSedan = _formatEta(routeDurationMin);
    final etaMinivan = _formatEta(routeDurationMin + 2);
    final etaSuv = _formatEta(routeDurationMin + 5);

    final ubicacionActual =
        estado.currentLocation ?? const LatLng(18.5820, -68.3971);
    final ubicacionDestino = estado.destinationLocation;

    return Scaffold(
      key: _scaffoldKey,
      drawer: const HomeDrawer(),
      body: Stack(
        children: [
          Positioned.fill(
            child: FlutterMap(
              mapController: _mapController,
              options: MapOptions(
                initialCenter: ubicacionActual,
                initialZoom: 12.0,
                onTap: (_, punto) {
                  ref
                      .read(homeControllerProvider.notifier)
                      .seleccionarDestinoEnMapa(punto);
                },
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.example.myride',
                ),
                if (routePoints.isNotEmpty)
                  PolylineLayer(
                    polylines: [
                      Polyline(
                        points: routePoints,
                        strokeWidth: 4.0,
                        color: brandPrimary,
                      ),
                    ],
                  ),
                if (estado.activeTrip == null)
                  CapaConductoresFlota(
                    conductores: estado.conductoresCercanos,
                    onTap: (conductor, punto) => _mostrarDetalleMarcador(
                      titulo: AppStrings.trackingDetalleConductor,
                      color: brandPrimary,
                      icono: Icons.directions_car_filled_rounded,
                      lugar: AppStrings.marcadorConductorFlota,
                      punto: punto,
                    ),
                    onLongPress: (conductor, punto) =>
                        _copiarInfoMarcador(punto: punto),
                  ),
                MarkerLayer(
                  markers: [
                    if (routePoints.isNotEmpty)
                      Marker(
                        point: routePoints.first,
                        width: 148,
                        height: 98,
                        alignment: Alignment.bottomCenter,
                        child: MarcadorMapaViaje(
                          color: const Color(0xFF2563EB),
                          icono: Icons.person_rounded,
                          etiqueta: AppStrings.formatoMarcadorConLugar(
                            AppStrings.trackingMarcadorRecogida,
                            estado.pickupLabel,
                          ),
                          conPunta: true,
                          onTap: () => _mostrarDetalleMarcador(
                            titulo: AppStrings.trackingDetalleRecogida,
                            color: const Color(0xFF2563EB),
                            icono: Icons.person_rounded,
                            lugar: estado.pickupLabel,
                            punto: routePoints.first,
                          ),
                          onLongPress: () => _copiarInfoMarcador(
                            punto: routePoints.first,
                          ),
                        ),
                      )
                    else if (estado.currentLocation != null)
                      Marker(
                        point: estado.currentLocation!,
                        width: 148,
                        height: 98,
                        alignment: Alignment.bottomCenter,
                        child: MarcadorMapaViaje(
                          color: const Color(0xFF2563EB),
                          icono: Icons.person_rounded,
                          etiqueta: AppStrings.formatoMarcadorConLugar(
                            AppStrings.trackingMarcadorTu,
                            estado.pickupLabel,
                          ),
                          conPunta: true,
                          onTap: () => _mostrarDetalleMarcador(
                            titulo: AppStrings.trackingDetalleRecogida,
                            color: const Color(0xFF2563EB),
                            icono: Icons.person_rounded,
                            lugar: estado.pickupLabel,
                            punto: estado.currentLocation!,
                          ),
                          onLongPress: () => _copiarInfoMarcador(
                            punto: estado.currentLocation!,
                          ),
                        ),
                      ),
                    if (routePoints.isNotEmpty)
                      Marker(
                        point: routePoints.last,
                        width: 148,
                        height: 98,
                        alignment: Alignment.bottomCenter,
                        child: MarcadorMapaViaje(
                          color: const Color(0xFFDC2626),
                          icono: Icons.place_rounded,
                          etiqueta: AppStrings.formatoMarcadorConLugar(
                            AppStrings.trackingMarcadorDestino,
                            estado.dropoffLabel,
                          ),
                          conPunta: true,
                          onTap: () => _mostrarDetalleMarcador(
                            titulo: AppStrings.trackingDetalleDestino,
                            color: const Color(0xFFDC2626),
                            icono: Icons.place_rounded,
                            lugar: estado.dropoffLabel,
                            punto: routePoints.last,
                          ),
                          onLongPress: () => _copiarInfoMarcador(
                            punto: routePoints.last,
                          ),
                        ),
                      )
                    else if (ubicacionDestino != null)
                      Marker(
                        point: ubicacionDestino,
                        width: 148,
                        height: 98,
                        alignment: Alignment.bottomCenter,
                        child: MarcadorMapaViaje(
                          color: const Color(0xFFDC2626),
                          icono: Icons.place_rounded,
                          etiqueta: AppStrings.formatoMarcadorConLugar(
                            AppStrings.trackingMarcadorDestino,
                            estado.dropoffLabel,
                          ),
                          conPunta: true,
                          onTap: () => _mostrarDetalleMarcador(
                            titulo: AppStrings.trackingDetalleDestino,
                            color: const Color(0xFFDC2626),
                            icono: Icons.place_rounded,
                            lugar: estado.dropoffLabel,
                            punto: ubicacionDestino,
                          ),
                          onLongPress: () => _copiarInfoMarcador(
                            punto: ubicacionDestino,
                          ),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
          Positioned(
            top: MediaQuery.of(context).padding.top + 16,
            left: 16,
            child: CircleAvatar(
              backgroundColor: Colors.white,
              radius: 24,
              child: IconButton(
                icon: const Icon(Icons.menu, color: textDark),
                onPressed: () => _scaffoldKey.currentState?.openDrawer(),
              ),
            ),
          ),
          DraggableScrollableSheet(
            initialChildSize: 0.52,
            minChildSize: 0.14,
            maxChildSize: 0.92,
            snap: true,
            snapSizes: const [0.14, 0.52, 0.92],
            builder: (context, scrollController) {
              return Container(
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(20),
                    topRight: Radius.circular(20),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 10,
                      offset: Offset(0, -2),
                    ),
                  ],
                ),
                child: ListView(
                  controller: scrollController,
                  padding: EdgeInsets.zero,
                  children: [
                    Center(
                      child: Container(
                        margin: const EdgeInsets.only(top: 8, bottom: 8),
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade300,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.verified_user,
                            color: brandPrimary,
                            size: 14,
                          ),
                          SizedBox(width: 4),
                          Flexible(
                            child: Text(
                              AppStrings.homeOfficialRatesMitur,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 12,
                                color: brandPrimary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    if (estado.destinationLocation == null)
                      const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          AppStrings.homeMoveMap,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.black54,
                          ),
                        ),
                      ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: dividerColor),
                        ),
                        padding: const EdgeInsets.all(12),
                        child: Row(
                          children: [
                            Column(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: Colors.grey,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                Container(
                                  width: 1,
                                  height: 28,
                                  color: Colors.grey,
                                  margin: const EdgeInsets.symmetric(
                                    vertical: 4,
                                  ),
                                ),
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: Colors.black,
                                    shape: BoxShape.rectangle,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                children: [
                                  _LocationTrigger(
                                    value: estado.pickupLabel,
                                    onTap: () async {
                                      final result = await context.push<String>(
                                        '/search-location',
                                        extra: {
                                          'pickup': estado.pickupLabel,
                                          'dropoff': estado.dropoffLabel,
                                          'focusDropoff': false,
                                        },
                                      );
                                      if (result != null) {
                                        await ref
                                            .read(
                                              homeControllerProvider.notifier,
                                            )
                                            .seleccionarOrigen(result);
                                      }
                                    },
                                  ),
                                  const SizedBox(height: 8),
                                  _LocationTrigger(
                                    value: estado.dropoffLabel,
                                    onTap: () async {
                                      final result = await context.push<String>(
                                        '/search-location',
                                        extra: {
                                          'pickup': estado.pickupLabel,
                                          'dropoff': estado.dropoffLabel,
                                          'focusDropoff': true,
                                        },
                                      );
                                      if (result != null) {
                                        await ref
                                            .read(
                                              homeControllerProvider.notifier,
                                            )
                                            .seleccionarDestino(result);
                                      }
                                    },
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    if (routeDistanceKm > 0)
                      Padding(
                        padding: const EdgeInsets.only(top: 8, bottom: 4),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.info_outline,
                              size: 16,
                              color: Colors.black54,
                            ),
                            const SizedBox(width: 6),
                            Flexible(
                              child: Text(
                                AppStrings.homeResumenRuta(
                                  routeDistanceKm,
                                  routeDurationMin,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  fontSize: 13,
                                  color: Colors.black54,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    const SizedBox(height: 12),
                    const Divider(height: 1, color: dividerColor),
                    Container(
                      padding: const EdgeInsets.all(16),
                      margin: const EdgeInsets.symmetric(
                        vertical: 8,
                        horizontal: 16,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: dividerColor),
                      ),
                      child: Row(
                        children: [
                          Text(
                            AppStrings.homeResumenDistancia(routeDistanceKm),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: textDark,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Flexible(
                            child: Text(
                              AppStrings.homeResumenEta(routeDurationMin),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              textAlign: TextAlign.end,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: textDark,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    HomeVehicleTile(
                      id: TipoVehiculo.sedan.name,
                      name: AppStrings.homeVehicleSedan,
                      eta: etaSedan,
                      capacity: 4,
                      tarifaOficial: estado.tarifaEstimada,
                      estimandoTarifa:
                          estado.destinationLocation != null &&
                          estado.tarifaEstimada == null,
                      icon: Icons.directions_car,
                      selectedId: selectedVehicle.name,
                      brandPrimary: brandPrimary,
                      onTap: () =>
                          ref.read(selectedVehicleProvider.notifier).state =
                              TipoVehiculo.sedan,
                    ),
                    HomeVehicleTile(
                      id: TipoVehiculo.minivan.name,
                      name: AppStrings.homeVehicleMinivan,
                      eta: etaMinivan,
                      capacity: 6,
                      tarifaOficial: estado.tarifaEstimada,
                      estimandoTarifa:
                          estado.destinationLocation != null &&
                          estado.tarifaEstimada == null,
                      icon: Icons.airport_shuttle,
                      selectedId: selectedVehicle.name,
                      brandPrimary: brandPrimary,
                      onTap: () =>
                          ref.read(selectedVehicleProvider.notifier).state =
                              TipoVehiculo.minivan,
                    ),
                    HomeVehicleTile(
                      id: TipoVehiculo.suv.name,
                      name: AppStrings.homeVehicleSuv,
                      eta: etaSuv,
                      capacity: 6,
                      tarifaOficial: estado.tarifaEstimada,
                      estimandoTarifa:
                          estado.destinationLocation != null &&
                          estado.tarifaEstimada == null,
                      icon: Icons.time_to_leave,
                      selectedId: selectedVehicle.name,
                      brandPrimary: brandPrimary,
                      onTap: () =>
                          ref.read(selectedVehicleProvider.notifier).state =
                              TipoVehiculo.suv,
                    ),
                    const Divider(height: 1, color: dividerColor),
                    Padding(
                      padding: EdgeInsets.only(
                        left: 16,
                        right: 16,
                        top: 12,
                        bottom: MediaQuery.of(context).padding.bottom + 12,
                      ),
                      child: Row(
                        children: [
                          Flexible(
                            child: InkWell(
                              onTap: () =>
                                  ref
                                          .read(
                                            selectedPaymentProvider.notifier,
                                          )
                                          .state =
                                      selectedPayment == MetodoPago.efectivo
                                      ? MetodoPago.tarjeta
                                      : MetodoPago.efectivo,
                              borderRadius: BorderRadius.circular(8),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 12,
                                ),
                                decoration: BoxDecoration(
                                  color: bgGrey,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      selectedPayment == MetodoPago.efectivo
                                          ? Icons.money
                                          : Icons.credit_card,
                                      size: 20,
                                      color: textDark,
                                    ),
                                    const SizedBox(width: 8),
                                    Flexible(
                                      child: Text(
                                        selectedPayment == MetodoPago.efectivo
                                            ? AppStrings.homePaymentCashShort
                                            : AppStrings.homePaymentCardShort,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: Colors.black87,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 4),
                                    const Icon(
                                      Icons.keyboard_arrow_up,
                                      size: 16,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            flex: 2,
                            child: ElevatedButton(
                              onPressed:
                                  isRequesting ||
                                      estado.tarifaEstimada == null ||
                                      estado.destinationLocation == null
                                  ? null
                                  : () async {
                                      await ref
                                          .read(
                                            homeControllerProvider.notifier,
                                          )
                                          .requestTrip();
                                    },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: brandPrimary,
                                foregroundColor: Colors.black87,
                                padding: const EdgeInsets.symmetric(
                                  vertical: 16,
                                  horizontal: 8,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                elevation: 0,
                              ),
                              child: isRequesting
                                  ? const SizedBox(
                                      width: 24,
                                      height: 24,
                                      child: CircularProgressIndicator(
                                        color: Colors.black87,
                                        strokeWidth: 2,
                                      ),
                                    )
                                  : FittedBox(
                                      fit: BoxFit.scaleDown,
                                      child: Text(
                                        estado.tarifaEstimada == null
                                            ? AppStrings
                                                  .homeSolicitarVehiculoSinPrecio(
                                                _etiquetaVehiculo(
                                                  selectedVehicle,
                                                ),
                                              )
                                            : AppStrings.homeSolicitarVehiculo(
                                                _etiquetaVehiculo(
                                                  selectedVehicle,
                                                ),
                                                estado.tarifaEstimada!,
                                              ),
                                        maxLines: 1,
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Future<void> _copiarInfoMarcador({required LatLng punto}) async {
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
        content: Text(AppStrings.trackingMarcadorCopiado),
        duration: Duration(seconds: 2),
      ),
    );
  }

  Future<void> _mostrarDetalleMarcador({
    required String titulo,
    required Color color,
    required IconData icono,
    required String? lugar,
    required LatLng punto,
  }) {
    final textoLugar = (lugar == null || lugar.trim().isEmpty)
        ? AppStrings.trackingDireccionCargando
        : lugar;
    final coords = AppStrings.formatoCoordenada(
      punto.latitude,
      punto.longitude,
    );

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
                              color: Color(0xFF1E293B),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            textoLugar,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF64748B),
                              height: 1.3,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            coords,
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF1E293B),
                              fontFamily: 'monospace',
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
                  child: FilledButton.icon(
                    onPressed: () async {
                      Navigator.of(context).pop();
                      await _copiarInfoMarcador(punto: punto);
                    },
                    icon: const Icon(Icons.copy_rounded, size: 18),
                    label: const Text(AppStrings.trackingMarcadorCopiarCoords),
                  ),
                ),
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text(AppStrings.trackingMarcadorCerrar),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _ajustarCamaraRuta(HomeState estado) {
    final puntos = <LatLng>[
      ...estado.routePoints,
      if (estado.currentLocation != null) estado.currentLocation!,
      if (estado.destinationLocation != null) estado.destinationLocation!,
    ];
    if (puntos.isEmpty) {
      return;
    }

    if (puntos.length == 1) {
      try {
        _mapController.move(puntos.first, 15);
      } catch (_) {
        // Mapa aún no listo.
      }
      return;
    }

    final bounds = LatLngBounds.fromPoints(puntos);
    final areaCero =
        bounds.north == bounds.south && bounds.east == bounds.west;
    if (areaCero) {
      try {
        _mapController.move(puntos.first, 15);
      } catch (_) {}
      return;
    }

    try {
      _mapController.fitCamera(
        CameraFit.bounds(
          bounds: bounds,
          padding: const EdgeInsets.only(
            top: 100,
            bottom: 220,
            left: 50,
            right: 50,
          ),
          maxZoom: 16,
        ),
      );
    } catch (_) {
      // Zoom no finito / mapa no listo: se ignora.
    }
  }

  String _formatEta(int extraMinutes) {
    if (extraMinutes <= 0) {
      return AppStrings.homeEtaNoDisponible;
    }

    final now = DateTime.now().add(Duration(minutes: extraMinutes));
    final hour = now.hour > 12
        ? now.hour - 12
        : (now.hour == 0 ? 12 : now.hour);
    final minute = now.minute.toString().padLeft(2, '0');
    final ampm = now.hour >= 12 ? 'PM' : 'AM';
    return '$hour:$minute $ampm';
  }

  String _etiquetaVehiculo(TipoVehiculo vehiculo) {
    return switch (vehiculo) {
      TipoVehiculo.minivan => AppStrings.homeVehicleMinivanLabel,
      TipoVehiculo.suv => AppStrings.homeVehicleSuvLabel,
      TipoVehiculo.sedan => AppStrings.homeVehicleSedanLabel,
    };
  }
}

class _LocationTrigger extends StatelessWidget {
  final String value;
  final VoidCallback onTap;

  const _LocationTrigger({required this.value, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(6),
      child: Container(
        height: 40,
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: Colors.grey.shade200,
          borderRadius: BorderRadius.circular(6),
        ),
        alignment: Alignment.centerLeft,
        child: Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.w500,
            fontSize: 14,
            color: Colors.black87,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ),
    );
  }
}
