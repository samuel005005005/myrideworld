# Documento de Requerimientos Consolidados: MVP Plataforma Transporte Turístico - Punta Cana

## 1. Visión General
Desarrollar una plataforma digital de transporte turístico para Punta Cana orientada a pasajeros y conductores de taxis turísticos asociados. El objetivo principal de este MVP es lograr una solución simple, funcional y estable que permita a la Asociación de Taxis operar digitalmente conectando pasajeros y conductores mediante geolocalización y asignación automática en el menor tiempo posible.

## 2. Historias de Usuario (Core MVP)

### 2.1 Pasajero
- **US-1.1.1:** Como pasajero, quiero poder registrarme, iniciar sesión y recuperar mi contraseña, para acceder a la aplicación de transporte. (Prioridad: Must Have)
- **US-1.1.2:** Como pasajero, quiero solicitar un viaje seleccionando una ubicación de recogida y un destino, para que el sistema busque un conductor. (Prioridad: Must Have)
- **US-1.1.3:** Como pasajero, quiero visualizar la tarifa correspondiente antes de confirmar la solicitud, para conocer el costo del servicio de antemano. (Prioridad: Must Have)
- **US-1.1.4:** Como pasajero, quiero ver la información del conductor asignado (nombre, foto, vehículo, placa) y su ubicación y ETA, para identificar quién me recogerá. (Prioridad: Must Have)
- **US-1.1.5:** Como pasajero, quiero poder pagar en efectivo o tarjeta de crédito/débito, para tener opciones flexibles de pago. (Prioridad: Must Have)
- **US-1.1.6:** Como pasajero, quiero calificar al conductor al finalizar un viaje, para proveer retroalimentación sobre la calidad del servicio. (Prioridad: Should Have)
- **US-1.1.7:** Como pasajero, quiero poder cancelar mi solicitud antes o después de la asignación, para desistir del servicio si cambian mis planes. (Prioridad: Must Have)

### 2.2 Conductor
- **US-1.2.1:** Como conductor, quiero iniciar sesión con las credenciales que me asignó la asociación, para operar en la app. (Prioridad: Must Have)
- **US-1.2.2:** Como conductor, quiero recibir notificaciones (timbre) de solicitudes de viaje con origen, destino, tarifa y tiempo límite — aunque la app esté en segundo plano o cerrada — hasta aceptar o rechazar. (Prioridad: Must Have)
- **US-1.2.3:** Como conductor, quiero marcar "Llegué", "Iniciar viaje" y "Finalizar viaje", para registrar el progreso del servicio y notificar al pasajero y al sistema. (Prioridad: Must Have)
- **US-1.2.4:** Como conductor, quiero poder consultar mis balances (cantidad de viajes, completados, cancelados, monto generado), para llevar un control de mis ingresos. (Prioridad: Must Have)
- **US-1.2.5:** Como conductor, quiero poder marcar "Pasajero no se presentó", para registrar la incidencia y quedar libre para otro viaje. (Prioridad: Must Have)

### 2.3 Administrador
- **US-1.3.1:** Como administrador, quiero dar de alta conductores (datos, vehículo, credenciales), aprobar/activar/desactivar y ver documentación, para mantener el control de la flota de la asociación. (Prioridad: Must Have)
- **US-1.3.2:** Como administrador, quiero poder crear, modificar, consultar y activar/desactivar tarifas basadas en origen/destino/zona/ruta, para mantener actualizado el tarifario de la asociación. (Prioridad: Must Have)
- **US-1.3.5:** Como administrador, quiero configurar el precio fijo de viajes internos en Cap Cana (valor inicial USD 4) y la geocerca de esa zona, igual que el resto del tarifario, para ajustar la tarifa local sin redeploy. (Prioridad: Must Have)
- **US-1.3.3:** Como administrador, quiero visualizar un dashboard general de la operación (conductores disponibles/ocupados, viajes activos/completados), para monitorear el negocio en tiempo real. (Prioridad: Must Have)
- **US-1.3.4:** Como administrador, quiero poder ver el registro histórico de viajes, pagos, balances por conductor y auditoría de cancelaciones, para gestionar las finanzas y resolver disputas. (Prioridad: Must Have)

## 3. Capacidades Core del Sistema

- **REQ-3.1 Sistema de Tarifas Fijas:** La plataforma usará un tarifario preestablecido por la Asociación. El precio se determina antes de solicitar el viaje según prioridad: (1) viaje interno Cap Cana → tarifa plana configurable; (2) par Origen-Destino activo del tarifario; (3) fórmula base + km (+ mínimo). NO habrá tarifa dinámica por demanda.
- **REQ-3.2 Asignación Automática Escalonada:** Al haber una solicitud, el sistema busca conductores activos, conectados, disponibles y con GPS válido. Ordena por proximidad y envía la solicitud al más cercano.
- **REQ-3.3 Manejo de Estados de Viaje:** Seguimiento estricto: Solicitado -> Buscando conductor -> Conductor asignado -> Conductor en camino -> Conductor llegó -> Viaje en curso -> Completado. (Alternos: Cancelado, Sin conductor disponible).
- **REQ-3.4 Control de Ubicación:** Precisión GPS indispensable. Validación de proximidad (radio configurable) para permitir al conductor marcar "Llegué".
- **REQ-3.5 Integración de Pasarela de Pagos:** Integración con la pasarela existente. La información de la tarjeta no se almacena en los servidores propios.
- **REQ-3.6 Infraestructura del MVP:** Compuesta por App Pasajero, App Conductor, Panel Web Admin, Backend API y Base de Datos.

## 4. Reglas de Negocio

| ID | Regla | Aplicación | Impacto |
|----|------|-------------|--------|
| BR-ASG-001 | **Tiempo de respuesta escalonada:** El conductor tiene un tiempo límite configurable para aceptar o rechazar el viaje. Si se acaba el tiempo sin respuesta o si rechaza, la solicitud pasa automáticamente al siguiente conductor más cercano. | Asignación de viajes | Traspaso al siguiente conductor o estado "Sin conductor disponible" |
| BR-PAG-001 | **Cargo por procesamiento (Tarjeta):** Todo viaje pagado mediante pasarela electrónica sufre un cargo del 7.5% sobre la tarifa bruta. Este cargo se deduce para calcular el monto neto generado. | Finalización y Balance | Descuento en balance del conductor |
| BR-PAG-002 | **Viajes en Efectivo:** No aplican cargos de procesamiento electrónico. Todo el valor bruto es el valor generado. | Finalización y Balance | 0% cargo |
| BR-CNC-001 | **Cancelaciones y Penalidades:** En la fase MVP, NO existen penalidades ni cobros automáticos por cancelación (ni para pasajero ni para conductor). Toda cancelación solo genera un registro de auditoría. | Cancelación de viaje | Administrativo (Informativo) |
| BR-LIQ-001 | **Responsabilidad de Liquidación:** Los balances calculados por la plataforma son distribuidos de forma externa (semanalmente) por la Asociación de Taxis. La app NO requiere sistema de retiro de fondos (withdraw) automático para el conductor. | Pagos | Fuera del alcance del sistema transaccional |
| BR-VAL-001 | **Validación de Llegada:** El conductor solo puede marcar "Llegué" si su ubicación GPS actual se encuentra dentro del radio configurable respecto a las coordenadas del punto de recogida establecido. | Progreso del Viaje | Bloqueo de acción en App Conductor |
| BR-TAR-001 | **Tarifa plana Cap Cana:** Si origen y destino están ambos dentro de la geocerca Cap Cana, el precio del viaje es la tarifa plana de zona (seed inicial USD 4), configurable desde Admin (`TARIFA_ZONA_CAP_CANA` o equivalente). No se aplica fórmula base+km ni pares OD externos. | Estimación / solicitud | Precio fijo interno |
| BR-TAR-002 | **Fuera de Cap Cana / mixtos (confirmado):** Si origen o destino (o ambos) están fuera de Cap Cana, aplica el tarifario OD activo; si no hay par OD, la fórmula `TARIFA_BASE` + km × `TARIFA_KM` con piso `TARIFA_MINIMA`. | Estimación / solicitud | Precio según tarifario externo |
| BR-TAR-003 | **Geocerca Cap Cana en Admin (confirmado):** No hay polígono oficial entregado; la asociación define y ajusta la geocerca en Admin (MVP: bbox editable; evolución: polígono GeoJSON). Seed inicial aproximado en configuración; el monto plano sigue siendo `TARIFA_ZONA_CAP_CANA` (USD 4). Sin hardcode en apps. | Admin / Configuración | Cambio de precio/zona sin redeploy |

## 5. Criterios de Éxito (Prueba E2E)
**SC-1: Flujo Operativo Núcleo (Core Loop)**
1. El pasajero inicia sesión e indica origen y destino.
2. El sistema determina la tarifa (Cap Cana plana si aplica; si no, OD o fórmula).
3. El pasajero confirma la solicitud.
4. El sistema identifica conductores disponibles cercanos y ofrece el viaje escalonadamente.
5. El conductor más cercano recibe la notificación y acepta dentro del tiempo límite.
6. El pasajero visualiza en tiempo real la información y ubicación del conductor.
7. El conductor llega al origen (validado por GPS) y marca llegada.
8. El conductor inicia el viaje.
9. El conductor llega al destino y finaliza el viaje, el sistema registra el método de pago seleccionado.
10. El sistema actualiza inmediatamente los balances y el estado de cuenta tanto del pasajero (si aplica) como del conductor, siendo visible en el panel administrativo.
