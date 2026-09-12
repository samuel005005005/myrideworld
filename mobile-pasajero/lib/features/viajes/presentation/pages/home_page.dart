import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:dio/dio.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/services/api_service.dart';
import '../../../../core/services/socket_service.dart';

final selectedVehicleProvider = StateProvider<String>((ref) => 'sedan');
final selectedPaymentProvider = StateProvider<String>((ref) => 'cash');
final isRequestingProvider = StateProvider<bool>((ref) => false);

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  final MapController _mapController = MapController();

  String _pickupLocation = 'Aeropuerto Punta Cana';
  String _dropoffLocation = 'Hard Rock Hotel';

  List<LatLng> _routePoints = [];
  double _routeDistanceKm = 0.0;
  int _routeDurationMin = 0;

  final Map<String, LatLng> _locationCoords = {
    'Aeropuerto Punta Cana': const LatLng(18.5674, -68.3634),
    'Hard Rock Hotel': const LatLng(18.7302, -68.5284),
    'Aeropuerto Internacional de Punta Cana (PUJ)': const LatLng(
      18.5674,
      -68.3634,
    ),
    'Hard Rock Hotel & Casino Punta Cana': const LatLng(18.7302, -68.5284),
    'Coco Bongo Punta Cana': const LatLng(18.6300, -68.4200),
    'Bávaro Beach Resort': const LatLng(18.6811, -68.4287),
    'Cap Cana Marina': const LatLng(18.4984, -68.3846),
    'Uvero Alto Plaza': const LatLng(18.8143, -68.6186),
    'BlueMall Puntacana': const LatLng(18.5583, -68.3756),
    'Downtown Punta Cana': const LatLng(18.6182, -68.3976),
  };

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _fetchRoute();
      _loginAutomatico();
    });
  }

  Future<void> _loginAutomatico() async {
    try {
      final apiService = ref.read(apiServiceProvider);
      // Background silent login with the seeded test user
      await apiService.login('pasajero@myride.com', '12345678', 'pasajero');
      print('Auto-login successful!');
    } catch (e) {
      print('Auto-login failed: $e');
    }
  }

  Future<void> _fetchRoute() async {
    final start = _locationCoords[_pickupLocation];
    final end = _locationCoords[_dropoffLocation];

    if (start == null || end == null) return;

    try {
      final dio = Dio();
      final url =
          'https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?geometries=geojson';
      final response = await dio.get(url);

      if (response.data != null &&
          response.data['routes'] != null &&
          response.data['routes'].isNotEmpty) {
        final geometry =
            response.data['routes'][0]['geometry']['coordinates'] as List;
        final distanceMeters = response.data['routes'][0]['distance'] as num;
        final durationSeconds = response.data['routes'][0]['duration'] as num;

        setState(() {
          _routePoints = geometry
              .map((coord) => LatLng(coord[1], coord[0]))
              .toList();
          _routeDistanceKm = distanceMeters / 1000.0;
          _routeDurationMin = (durationSeconds / 60.0).ceil();
        });

        if (_routePoints.isNotEmpty) {
          final bounds = LatLngBounds.fromPoints(_routePoints);
          _mapController.fitCamera(
            CameraFit.bounds(
              bounds: bounds,
              padding: const EdgeInsets.only(
                top: 100,
                bottom: 400,
                left: 50,
                right: 50,
              ),
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('Error fetching route: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final selectedVehicle = ref.watch(selectedVehicleProvider);
    final selectedPayment = ref.watch(selectedPaymentProvider);
    final isRequesting = ref.watch(isRequestingProvider);

    const brandPrimary = Color(0xFFF59E0B); // Taxi Veron Orange / Yellow
    const brandLight = Color(0xFFFEF3C7);
    const textDark = Color(0xFF1E293B);
    const textGrey = Color(0xFF545454);
    const bgGrey = Color(0xFFEEEEEE);
    const dividerColor = Color(0xFFE2E2E2);

    String formatETA(int extraMinutes) {
      if (extraMinutes == 0) return '--:--';
      final now = DateTime.now().add(Duration(minutes: extraMinutes));
      final hour = now.hour > 12
          ? now.hour - 12
          : (now.hour == 0 ? 12 : now.hour);
      final minute = now.minute.toString().padLeft(2, '0');
      final ampm = now.hour >= 12 ? 'PM' : 'AM';
      return '$hour:$minute $ampm';
    }

    final etaSedan = formatETA(_routeDurationMin);
    final etaMinivan = formatETA(_routeDurationMin + 2);
    final etaSuv = formatETA(_routeDurationMin + 5);

    double sedanPrice = _routeDistanceKm > 0
        ? 10.0 + (_routeDistanceKm * 1.5)
        : 35.0;
    double minivanPrice = _routeDistanceKm > 0
        ? 15.0 + (_routeDistanceKm * 2.5)
        : 55.0;
    double suvPrice = _routeDistanceKm > 0
        ? 25.0 + (_routeDistanceKm * 3.0)
        : 65.0;

    // Fixed Fare Calculation
    double basePrice = sedanPrice;
    if (selectedVehicle == 'minivan') basePrice = minivanPrice;
    if (selectedVehicle == 'suv') basePrice = suvPrice;

    // Apply 7.5% fee if card
    double finalPrice = selectedPayment == 'card'
        ? basePrice * 1.075
        : basePrice;

    return Scaffold(
      key: _scaffoldKey,
      drawer: _buildDrawer(context),
      body: Stack(
        children: [
          // 1. Full Screen Map (Uber/Clean Style)
          Positioned.fill(
            child: FlutterMap(
              mapController: _mapController,
              options: const MapOptions(
                initialCenter: LatLng(18.5820, -68.3971), // Punta Cana
                initialZoom: 12.0,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.example.myride',
                ),
                if (_routePoints.isNotEmpty)
                  PolylineLayer(
                    polylines: [
                      Polyline(
                        points: _routePoints,
                        strokeWidth: 4.0,
                        color: brandPrimary,
                      ),
                    ],
                  ),
                if (_routePoints.isNotEmpty)
                  MarkerLayer(
                    markers: [
                      Marker(
                        point: _routePoints.first,
                        child: const Icon(
                          Icons.location_on,
                          color: Colors.green,
                          size: 36,
                        ),
                      ),
                      Marker(
                        point: _routePoints.last,
                        child: const Icon(
                          Icons.location_on,
                          color: Colors.red,
                          size: 36,
                        ),
                      ),
                    ],
                  ),
              ],
            ),
          ),

          // Floating Menu Button (Top Left)
          Positioned(
            top: MediaQuery.of(context).padding.top + 16,
            left: 16,
            child: CircleAvatar(
              backgroundColor: Colors.white,
              radius: 24,
              child: IconButton(
                icon: const Icon(Icons.menu, color: textDark),
                onPressed: () {
                  _scaffoldKey.currentState?.openDrawer();
                },
              ),
            ),
          ),

          // 3. Bottom Sheet Card
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
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
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Drag handle
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

                  // Official Badge (Requirement)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.verified_user, color: brandPrimary, size: 14),
                      const SizedBox(width: 4),
                      Text(
                        'Tarifas Oficiales Reguladas (MITUR)',
                        style: TextStyle(
                          fontSize: 12,
                          color: brandPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Route Inputs (Uber Style)
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
                                margin: const EdgeInsets.symmetric(vertical: 4),
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
                                _buildLocationTrigger(
                                  value: _pickupLocation,
                                  onTap: () async {
                                    final result = await context.push<String>(
                                      '/search-location',
                                      extra: {
                                        'pickup': _pickupLocation,
                                        'dropoff': _dropoffLocation,
                                        'focusDropoff': false,
                                      },
                                    );
                                    if (result != null) {
                                      setState(() => _pickupLocation = result);
                                      _fetchRoute();
                                    }
                                  },
                                ),
                                const SizedBox(height: 8),
                                _buildLocationTrigger(
                                  value: _dropoffLocation,
                                  onTap: () async {
                                    final result = await context.push<String>(
                                      '/search-location',
                                      extra: {
                                        'pickup': _pickupLocation,
                                        'dropoff': _dropoffLocation,
                                        'focusDropoff': true,
                                      },
                                    );
                                    if (result != null) {
                                      setState(() => _dropoffLocation = result);
                                      _fetchRoute();
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
                  if (_routeDistanceKm > 0)
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0, bottom: 4.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.info_outline,
                            size: 16,
                            color: Colors.black54,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            '${_routeDistanceKm.toStringAsFixed(1)} km • $_routeDurationMin min de viaje',
                            style: const TextStyle(
                              fontSize: 13,
                              color: Colors.black54,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  const SizedBox(height: 12),
                  const Divider(height: 1, color: dividerColor),

                  // Vehicle List
                  SizedBox(
                    height: 200,
                    child: ListView(
                      padding: EdgeInsets.zero,
                      children: [
                        _buildUberVehicleTile(
                          id: 'sedan',
                          name: 'Sedán',
                          eta: etaSedan,
                          capacity: '4',
                          basePrice: sedanPrice,
                          icon: Icons.directions_car,
                          selectedId: selectedVehicle,
                          paymentMethod: selectedPayment,
                          brandPrimary: brandPrimary,
                          onTap: () =>
                              ref.read(selectedVehicleProvider.notifier).state =
                                  'sedan',
                        ),
                        _buildUberVehicleTile(
                          id: 'minivan',
                          name: 'Van Familiar',
                          eta: etaMinivan,
                          capacity: '6',
                          basePrice: minivanPrice,
                          icon: Icons.airport_shuttle,
                          selectedId: selectedVehicle,
                          paymentMethod: selectedPayment,
                          brandPrimary: brandPrimary,
                          onTap: () =>
                              ref.read(selectedVehicleProvider.notifier).state =
                                  'minivan',
                        ),
                        _buildUberVehicleTile(
                          id: 'suv',
                          name: 'SUV Premium',
                          eta: etaSuv,
                          capacity: '6',
                          basePrice: suvPrice,
                          icon: Icons.time_to_leave,
                          selectedId: selectedVehicle,
                          paymentMethod: selectedPayment,
                          brandPrimary: brandPrimary,
                          onTap: () =>
                              ref.read(selectedVehicleProvider.notifier).state =
                                  'suv',
                        ),
                      ],
                    ),
                  ),

                  const Divider(height: 1, color: dividerColor),

                  // Payment & Request Row
                  Padding(
                    padding: EdgeInsets.only(
                      left: 16,
                      right: 16,
                      top: 12,
                      bottom: MediaQuery.of(context).padding.bottom + 12,
                    ),
                    child: Row(
                      children: [
                        // Payment Selector
                        InkWell(
                          onTap: () {
                            ref.read(selectedPaymentProvider.notifier).state =
                                selectedPayment == 'cash' ? 'card' : 'cash';
                          },
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
                              children: [
                                Icon(
                                  selectedPayment == 'cash'
                                      ? Icons.money
                                      : Icons.credit_card,
                                  size: 20,
                                  color: textDark,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  selectedPayment == 'cash'
                                      ? 'Efectivo'
                                      : 'Tarjeta',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black87,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                const Icon(Icons.keyboard_arrow_up, size: 16),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        // Request Button
                        Expanded(
                          child: ElevatedButton(
                            onPressed: isRequesting
                                ? null
                                : () async {
                                    ref
                                            .read(isRequestingProvider.notifier)
                                            .state =
                                        true;
                                    try {
                                      final apiService = ref.read(
                                        apiServiceProvider,
                                      );
                                      final pasajeroId =
                                          apiService.currentUserId;

                                      if (pasajeroId == null) {
                                        ScaffoldMessenger.of(
                                          context,
                                        ).showSnackBar(
                                          const SnackBar(
                                            content: Text(
                                              'Error: No se pudo autenticar al pasajero.',
                                            ),
                                          ),
                                        );
                                        return;
                                      }

                                      final start =
                                          _locationCoords[_pickupLocation]!;
                                      final end =
                                          _locationCoords[_dropoffLocation]!;

                                      final viajeId = await apiService
                                          .solicitarViaje(
                                            pasajeroId: pasajeroId,
                                            origenLat: start.latitude,
                                            origenLng: start.longitude,
                                            destinoLat: end.latitude,
                                            destinoLng: end.longitude,
                                          );

                                      if (context.mounted) {
                                        ref
                                                .read(
                                                  isRequestingProvider.notifier,
                                                )
                                                .state =
                                            false;
                                        // Navigate to active trip screen, passing the viajeId
                                        context.go(
                                          '/viaje-active',
                                          extra: {'viajeId': viajeId},
                                        );
                                      }
                                    } catch (e) {
                                      if (context.mounted) {
                                        ref
                                                .read(
                                                  isRequestingProvider.notifier,
                                                )
                                                .state =
                                            false;
                                        ScaffoldMessenger.of(
                                          context,
                                        ).showSnackBar(
                                          SnackBar(
                                            content: Text(
                                              'Error al pedir el viaje: $e',
                                            ),
                                          ),
                                        );
                                      }
                                    }
                                  },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: brandPrimary,
                              foregroundColor: Colors.black87,
                              padding: const EdgeInsets.symmetric(vertical: 16),
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
                                : Text(
                                    'Pedir ${selectedVehicle.toUpperCase()} • US\$${finalPrice.toStringAsFixed(2)}',
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLocationTrigger({
    required String value,
    required VoidCallback onTap,
  }) {
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

  Widget _buildUberVehicleTile({
    required String id,
    required String name,
    required String eta,
    required String capacity,
    required double basePrice,
    required IconData icon,
    required String selectedId,
    required String paymentMethod,
    required Color brandPrimary,
    required VoidCallback onTap,
  }) {
    final selected = selectedId == id;
    final borderColor = selected ? brandPrimary : Colors.transparent;
    final bgColor = selected
        ? brandPrimary.withOpacity(0.08)
        : Colors.transparent;

    double finalPrice = paymentMethod == 'card' ? basePrice * 1.075 : basePrice;

    return InkWell(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: bgColor,
          border: Border.all(color: borderColor, width: 2),
          borderRadius: BorderRadius.circular(12),
        ),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        child: Row(
          children: [
            Icon(icon, size: 40, color: Colors.black87),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Icon(Icons.person, size: 14, color: Colors.black54),
                      Text(
                        capacity,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.black54,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    eta,
                    style: const TextStyle(fontSize: 13, color: Colors.black54),
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  'US\$${finalPrice.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: Colors.black87,
                  ),
                ),
                if (paymentMethod == 'card')
                  const Text(
                    '+7.5% fee incl.',
                    style: TextStyle(fontSize: 10, color: Colors.black54),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawer(BuildContext context) {
    const textDark = Color(0xFF1E293B);
    const brandPrimary = Color(0xFFF59E0B);

    return Drawer(
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topRight: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: SafeArea(
        child: Column(
          children: [
            // Elegant Header
            InkWell(
              onTap: () {
                context.pop();
                context.push('/perfil');
              },
              child: Container(
                padding: const EdgeInsets.only(
                  left: 24,
                  right: 24,
                  top: 40,
                  bottom: 24,
                ),
                child: Row(
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: brandPrimary, width: 2),
                        boxShadow: [
                          BoxShadow(
                            color: brandPrimary.withOpacity(0.2),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const CircleAvatar(
                        radius: 32,
                        backgroundColor: Colors.white,
                        backgroundImage: NetworkImage(
                          'https://randomuser.me/api/portraits/men/44.jpg',
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Juan Pérez',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              color: textDark,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: brandPrimary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  Icons.star,
                                  color: brandPrimary,
                                  size: 14,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  '5.0 Pasajero',
                                  style: TextStyle(
                                    color: brandPrimary.withOpacity(0.9),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Menu Items
            _buildDrawerItem(
              icon: Icons.history,
              title: 'Mis Viajes',
              onTap: () {
                context.pop();
                context.push('/history');
              },
            ),
            _buildDrawerItem(
              icon: Icons.credit_card,
              title: 'Métodos de Pago',
              onTap: () {
                context.pop();
                context.push('/pagos');
              },
            ),
            _buildDrawerItem(
              icon: Icons.local_offer_outlined,
              title: 'Promociones',
              onTap: () => context.pop(),
            ),
            _buildDrawerItem(
              icon: Icons.support_agent,
              title: 'Ayuda y Soporte',
              onTap: () {
                context.pop();
                context.push('/ayuda');
              },
            ),

            const Spacer(),

            // Footer
            Padding(
              padding: const EdgeInsets.all(32),
              child: TextButton.icon(
                onPressed: () => context.go('/welcome'),
                style: TextButton.styleFrom(
                  foregroundColor: Colors.red.shade500,
                  alignment: Alignment.centerLeft,
                  padding: EdgeInsets.zero,
                ),
                icon: const Icon(Icons.logout, size: 22),
                label: const Text(
                  'Cerrar Sesión',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawerItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 32, vertical: 4),
      leading: Icon(icon, color: const Color(0xFF1E293B), size: 26),
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: Color(0xFF1E293B),
        ),
      ),
      onTap: onTap,
    );
  }
}
