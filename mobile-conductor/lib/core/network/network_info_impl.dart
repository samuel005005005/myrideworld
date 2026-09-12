import 'package:connectivity_plus/connectivity_plus.dart';

import 'network_info.dart';

class NetworkInfoImpl implements NetworkInfo {
  final Connectivity connectivity;

  NetworkInfoImpl(this.connectivity);

  @override
  Future<bool> get estaConectado async {
    final resultados = await connectivity.checkConnectivity();
    return resultados.any((r) => r != ConnectivityResult.none);
  }
}
