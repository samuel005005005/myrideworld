import 'package:shared_preferences/shared_preferences.dart';

import '../models/sesion_usuario_model.dart';

class AuthLocalDataSource {
  Future<void> guardarSesion(SesionUsuarioModel modelo) async {
    final preferencias = await SharedPreferences.getInstance();
    await preferencias.setString('jwt_token', modelo.token);
    if (modelo.userId != null) {
      await preferencias.setString('user_id', modelo.userId!);
    }
    if (modelo.rol != null) {
      await preferencias.setString('user_rol', modelo.rol!);
    }
  }
}
