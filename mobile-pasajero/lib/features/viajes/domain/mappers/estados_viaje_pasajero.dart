class EstadosViajePasajero {
  const EstadosViajePasajero._();

  static bool esBusqueda(String estado) {
    final n = estado.toLowerCase();
    return n.contains('solicit') || n.contains('buscand');
  }

  static bool esEnCursoAsignado(String estado) {
    final n = estado.toLowerCase();
    return n.contains('asign') ||
        n.contains('camino') ||
        n.contains('llego') ||
        n.contains('llegó') ||
        n.contains('curso') ||
        n.contains('inici');
  }
}
