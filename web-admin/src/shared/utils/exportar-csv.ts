export function exportarCsv(
  nombreArchivo: string,
  columnas: readonly string[],
  filas: readonly (readonly string[])[],
): void {
  const escapar = (valor: string) => {
    if (/[",\n]/.test(valor)) {
      return `"${valor.replace(/"/g, '""')}"`;
    }
    return valor;
  };

  const lineas = [
    columnas.map(escapar).join(','),
    ...filas.map((fila) => fila.map(escapar).join(',')),
  ];

  const blob = new Blob([lineas.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();
  URL.revokeObjectURL(url);
}
