import 'package:equatable/equatable.dart';

class Failure extends Equatable {
  final String mensaje;

  const Failure(this.mensaje);

  @override
  List<Object?> get props => [mensaje];
}
