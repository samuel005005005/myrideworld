export const MENSAJES = {
  VALIDACION: {
    COMUNES: {
      NOMBRE_OBLIGATORIO: 'El nombre es obligatorio',
      EMAIL_INVALIDO: 'El email no es válido',
      TELEFONO_MIN: 'El teléfono debe tener al menos 8 caracteres',
      PASSWORD_MIN: 'La contraseña debe tener al menos 6 caracteres',
      ROL_INVALIDO: 'El rol debe ser PASAJERO, CONDUCTOR o ADMIN',
    },
    CONDUCTORES: {
      MARCA_OBLIGATORIA: 'La marca del vehículo es obligatoria',
      MODELO_OBLIGATORIO: 'El modelo del vehículo es obligatorio',
      COLOR_OBLIGATORIO: 'El color del vehículo es obligatorio',
      PLACA_OBLIGATORIA: 'La placa del vehículo es obligatoria',
    },
    VIAJES: {
      LATITUD_INVALIDA: 'La latitud debe estar entre -90 y 90',
      LONGITUD_INVALIDA: 'La longitud debe estar entre -180 y 180',
      PASAJERO_ID_UUID: 'El ID del pasajero debe ser un UUID válido',
      CONDUCTOR_ID_UUID: 'El ID del conductor debe ser un UUID válido',
    },
    CALIFICACIONES: {
      VIAJE_ID_UUID: 'El ID del viaje debe ser un UUID válido',
      PUNTUACION_RANGO: 'La puntuación debe estar entre 1 y 5',
    },
  },
  SWAGGER: {
    COMUNES: {
      EJEMPLO_EMAIL: 'usuario@ejemplo.com',
      EJEMPLO_PASSWORD: 'MiClaveSegura123',
      EJEMPLO_TELEFONO: '+18091234567',
      EJEMPLO_UUID: '123e4567-e89b-12d3-a456-426614174000',
      EJEMPLO_UUID_2: '123e4567-e89b-12d3-a456-426614174001',
      DESC_EMAIL: 'Correo electrónico válido',
      DESC_PASSWORD: 'Contraseña segura',
      DESC_TELEFONO: 'Teléfono de contacto con código de país',
    },
    PASAJEROS: {
      EJEMPLO_NOMBRE: 'Juan Pérez',
      DESC_NOMBRE: 'Nombre completo del pasajero',
    },
    CONDUCTORES: {
      EJEMPLO_NOMBRE: 'María López',
      DESC_NOMBRE: 'Nombre completo del conductor',
      EJEMPLO_MARCA: 'Toyota',
      EJEMPLO_MODELO: 'Corolla',
      EJEMPLO_COLOR: 'Blanco',
      EJEMPLO_PLACA: 'A123BC',
    },
    VIAJES: {
      DESC_PASAJERO_ID: 'UUID del pasajero que solicita el viaje',
      DESC_LATITUD_ORIGEN: 'Latitud del punto de origen',
      DESC_LONGITUD_ORIGEN: 'Longitud del punto de origen',
      DESC_LATITUD_DESTINO: 'Latitud del punto de destino',
      DESC_LONGITUD_DESTINO: 'Longitud del punto de destino',
      DESC_ORIGEN_DIRECCION: 'Dirección legible del punto de origen',
      DESC_DESTINO_DIRECCION: 'Dirección legible del punto de destino',
      EJEMPLO_LATITUD_ORIGEN: -34.6037,
      EJEMPLO_LONGITUD_ORIGEN: -58.3816,
      EJEMPLO_LATITUD_DESTINO: -34.5837,
      EJEMPLO_LONGITUD_DESTINO: -58.4016,
      EJEMPLO_ORIGEN_DIRECCION: 'Hard Rock Hotel & Casino Punta Cana',
      EJEMPLO_DESTINO_DIRECCION: 'Aeropuerto Internacional de Punta Cana (PUJ)',
      DESC_CONDUCTOR_ID: 'UUID del conductor',
      EJEMPLO_MOTIVO: 'El conductor tarda mucho',
    },
    CALIFICACIONES: {
      DESC_VIAJE_ID: 'ID del viaje completado',
      DESC_PUNTUACION: 'Calificación de 1 a 5 estrellas',
      EJEMPLO_COMENTARIO: 'Excelente conductor, muy amable.',
    },
  },
  HTTP: {
    RESPUESTAS: {
      CREADO_OK: 'Recurso creado exitosamente.',
      DATOS_INVALIDOS: 'Datos inválidos o email duplicado.',
      NO_AUTORIZADO: 'Token inválido o ausente.',
      NO_ENCONTRADO: 'El recurso solicitado no existe.',
      ERROR_SERVIDOR: 'Error interno del servidor.',
    },
  },
  EXCEPCIONES: {
    COMUNES: {
      EMAIL_INVALIDO: 'El email no es válido.',
      NOMBRE_OBLIGATORIO: 'El nombre es obligatorio.',
    },
    CONDUCTORES: {
      SOLO_PENDIENTE_APROBAR: 'Solo se pueden aprobar conductores en estado pendiente.',
      PLACA_OBLIGATORIA: 'La placa del vehículo es obligatoria.',
      NO_ENCONTRADO: 'Conductor no encontrado',
      EMAIL_REGISTRADO: 'El email ya está registrado.',
      DOCUMENTOS_SOLO_PROPIOS: 'Solo puedes subir documentos de tu propio perfil.',
      DISPONIBILIDAD_INVALIDA: 'Estado de disponibilidad no válido.',
      SOLO_APROBADO_CONECTAR:
        'Solo un conductor aprobado puede ponerse en línea.',
    },
    CONFIGURACION: {
      VALOR_VACIO: 'El valor no puede estar vacío.',
      CLAVE_OBLIGATORIA: 'La clave es obligatoria.',
      VALOR_OBLIGATORIO: 'El valor es obligatorio.',
      NO_ENCONTRADA: 'Configuración no encontrada.',
      NO_DEFINIDA: (clave: string) =>
        `La configuración "${clave}" no está definida. Debe cargarla el administrador.`,
      VALOR_NUMERICO_INVALIDO: (clave: string) =>
        `La configuración "${clave}" no tiene un valor numérico válido.`,
      FEE_PLATAFORMA_DESC: 'Porcentaje de comisión de la plataforma',
      TIMEOUT_VIAJE_MINUTOS_DESC: 'Minutos antes de cancelar un viaje sin aceptar',
      TIMEOUT_OFERTA_CONDUCTOR_SEGUNDOS_DESC:
        'Segundos que un conductor tiene para aceptar o rechazar una oferta',
      MAX_CONDUCTORES_OFERTA_PARALELA_DESC:
        'Máximo de conductores que reciben una oferta a la vez (los N más cercanos)',
      RADIO_ASIGNACION_KM_DESC:
        'Radio en km para buscar conductores al asignar un viaje',
      MAX_MARCADORES_FLOTA_MAPA_DESC:
        'Máximo de conductores a mostrar en el mapa del pasajero',
      TARIFA_BASE_DESC: 'Tarifa base (USD) definida por la asociación',
      TARIFA_KM_DESC: 'Precio por kilómetro (USD) definido por la asociación',
      TARIFA_MINIMA_DESC: 'Tarifa mínima (USD) definida por la asociación',
      TARIFA_ZONA_CAP_CANA_DESC:
        'Precio fijo (USD) para viajes con origen y destino dentro de Cap Cana',
      GEOCERCA_CAP_CANA_DESC:
        'Bbox JSON Cap Cana: {"tipo":"bbox","latMin":…,"latMax":…,"lngMin":…,"lngMax":…}',
      GEOCERCA_CAP_CANA_INVALIDA:
        'GEOCERCA_CAP_CANA debe ser un JSON bbox válido (tipo, latMin, latMax, lngMin, lngMax).',
      SOPORTE_TELEFONO_DESC: 'Teléfono de la central de asistencia',
      SOPORTE_WHATSAPP_DESC: 'WhatsApp oficial (solo dígitos con código país)',
      CLAVE_FEE_PLATAFORMA: 'FEE_PLATAFORMA',
      CLAVE_TIMEOUT_VIAJE_MINUTOS: 'TIMEOUT_VIAJE_MINUTOS',
      CLAVE_TIMEOUT_OFERTA_CONDUCTOR_SEGUNDOS: 'TIMEOUT_OFERTA_CONDUCTOR_SEGUNDOS',
      CLAVE_MAX_CONDUCTORES_OFERTA_PARALELA: 'MAX_CONDUCTORES_OFERTA_PARALELA',
      CLAVE_RADIO_ASIGNACION_KM: 'RADIO_ASIGNACION_KM',
      CLAVE_MAX_MARCADORES_FLOTA_MAPA: 'MAX_MARCADORES_FLOTA_MAPA',
      CLAVE_TARIFA_BASE: 'TARIFA_BASE',
      CLAVE_TARIFA_KM: 'TARIFA_KM',
      CLAVE_TARIFA_MINIMA: 'TARIFA_MINIMA',
      CLAVE_TARIFA_ZONA_CAP_CANA: 'TARIFA_ZONA_CAP_CANA',
      CLAVE_GEOCERCA_CAP_CANA: 'GEOCERCA_CAP_CANA',
      CLAVE_SOPORTE_TELEFONO: 'SOPORTE_TELEFONO',
      CLAVE_SOPORTE_WHATSAPP: 'SOPORTE_WHATSAPP',
      CLAVE_RADIO_PROXIMIDAD_ORIGEN_M: 'RADIO_PROXIMIDAD_ORIGEN_M',
      CLAVE_RADIO_PROXIMIDAD_DESTINO_M: 'RADIO_PROXIMIDAD_DESTINO_M',
      CLAVE_RADIO_MAPA_FLOTA_KM: 'RADIO_MAPA_FLOTA_KM',
      RADIO_PROXIMIDAD_ORIGEN_M_DESC:
        'Radio en metros para marcar llegada / iniciar cerca del origen',
      RADIO_PROXIMIDAD_DESTINO_M_DESC:
        'Radio en metros para completar el viaje cerca del destino',
      RADIO_MAPA_FLOTA_KM_DESC:
        'Radio en km para mostrar conductores disponibles en el mapa del pasajero',
    },
    TARIFAS: {
      PRECIO_MAYOR_CERO: 'El precio debe ser mayor a cero.',
      ORIGEN_DESTINO_OBLIGATORIOS: 'Origen y destino son obligatorios.',
      NO_ENCONTRADA: 'Tarifa no encontrada.',
      ZONA_DUPLICADA: 'Ya existe una zona con ese nombre.',
      ZONA_NO_ENCONTRADA: (nombre: string) =>
        `La zona "${nombre}" no está en el catálogo. Créala antes en Tarifario.`,
    },
    VIAJES: {
      NO_DISPONIBLE_ASIGNACION: 'El viaje no está disponible para asignación.',
      SOLO_ASIGNADO_CAMINO_LLEGADA: 'El viaje debe estar asignado o en camino para marcar llegada.',
      SOLO_INICIO_VALIDO: 'El conductor debe estar asignado, en camino o haber llegado para iniciar el viaje.',
      SOLO_CURSO_COMPLETAR: 'El viaje debe estar en curso para ser completado.',
      NO_CANCELABLE: 'El viaje no puede ser cancelado en su estado actual.',
      SOLO_RECHAZABLE_SOLICITADO: 'Solo se puede rechazar un viaje en estado solicitado.',
      PASAJERO_ID_OBLIGATORIO: 'El ID del pasajero es obligatorio.',
      TARIFA_NEGATIVA: 'La tarifa no puede ser negativa.',
      NO_ENCONTRADO: 'Viaje no encontrado',
      CANCELACION_NO_SOLICITADO: 'No puedes cancelar un viaje que no solicitaste.',
      CANCELACION_NO_ASIGNADO: 'No puedes cancelar un viaje que no tienes asignado.',
      LLEGADA_SOLO_CONDUCTOR: 'Solo el conductor asignado puede marcar la llegada.',
      ACCION_SOLO_CONDUCTOR_ASIGNADO: 'Solo el conductor asignado puede realizar esta acción.',
      YA_ASIGNADO: 'El viaje ya fue tomado por otro conductor.',
      YA_NO_DISPONIBLE: 'Este viaje ya no esta disponible.',
      CANCELADO_NO_ACEPTABLE: 'El pasajero cancelo el viaje.',
      SIN_CONDUCTORES: 'No hay conductores disponibles',
      SIN_CONDUCTORES_ZONA: 'No hay conductores disponibles en tu zona',
      COMPLETADO_EXITOSO: 'Viaje completado exitosamente',
      TIMEOUT_AGOTADO: 'Tiempo de espera agotado',
      SALA_NO_AUTORIZADA: 'No autorizado para unirse a esta sala.',
      CONSULTA_NO_AUTORIZADA: 'No autorizado para consultar este viaje.',
      GPS_CONDUCTOR_REQUERIDO:
        'Se requiere ubicacion GPS reciente del conductor para esta accion.',
      FUERA_DE_PROXIMIDAD: (distanciaMetros: number, radioMetros: number) =>
        `No puedes continuar: estas a ${distanciaMetros} m del punto (maximo permitido ${radioMetros} m). Acercate e intenta de nuevo.`,
    },
    CALIFICACIONES: {
      RANGO_PUNTUACION: 'La puntuación debe estar entre 1 y 5.',
      NO_ENCONTRADO: 'Viaje no encontrado',
      SOLO_PASAJERO_CALIFICA: 'Solo el pasajero del viaje puede calificar al conductor.',
      SOLO_COMPLETADOS: 'Solo se pueden calificar viajes completados.',
      YA_CALIFICADO: 'Este viaje ya fue calificado.',
    },
    PASAJEROS: {
      EMAIL_REGISTRADO: 'El email ya está registrado.',
      NO_ENCONTRADO: 'Pasajero no encontrado.',
    },
    PAGOS_BALANCES: {
      VIAJE_ID_OBLIGATORIO: 'El ID del viaje es obligatorio.',
      CONDUCTOR_ID_OBLIGATORIO: 'El ID del conductor es obligatorio.',
      MONTO_NETO_NEGATIVO: 'El monto neto no puede ser negativo.',
      NO_ENCONTRADO: 'Pago o balance no encontrado.',
    },
    AUTH: {
      CREDENCIALES_INVALIDAS: 'Credenciales inválidas.',
      ROL_INVALIDO: 'Rol no válido.',
      TOKEN_AUSENTE: 'Token ausente.',
      ADMIN_INACTIVO: 'Cuenta de administrador desactivada.',
      SESION_OTRO_DISPOSITIVO:
        'Tu sesión se abrió en otro dispositivo. Volvé a iniciar sesión.',
    },
    ADMINISTRADORES: {
      EMAIL_REGISTRADO: 'El email de administrador ya está registrado.',
      NO_ENCONTRADO: 'Administrador no encontrado.',
    },
    CONDUCTORES_FLOTA: {
      SOLO_PENDIENTE_RECHAZAR: 'Solo se pueden rechazar conductores pendientes.',
      SOLO_APROBADO_SUSPENDER: 'Solo se pueden suspender conductores aprobados.',
      SOLO_SUSPENDIDO_REACTIVAR: 'Solo se pueden reactivar conductores suspendidos.',
    },
    PROCESOS_BATCH: {
      PROCESO_OBLIGATORIO: 'El nombre del proceso es obligatorio.',
      TOTAL_REGISTROS_NEGATIVO: 'Total de registros no puede ser negativo.',
      EJECUCION_ID_OBLIGATORIO: 'ID de ejecución padre es obligatorio.',
      VALOR_CLAVE_OBLIGATORIO: 'El valor clave (identificador legible) es obligatorio.',
      DISPARADO_OK: 'Proceso de timeout de viajes disparado correctamente',
      SECRETO_INVALIDO: 'Secreto de proceso batch inválido o ausente.',
    },
    IDEMPOTENCIA: {
      LLAVE_REQUERIDA: 'La llave de idempotencia es requerida.',
      PAYLOAD_DIFERENTE: 'Idempotency-Key está siendo usada con un payload diferente.',
      EN_PROGRESO: 'La solicitud está en progreso. Intente nuevamente en unos segundos.',
    },
    CONFIG: {
      JWT_SECRET_REQUERIDO: 'JWT_SECRET es obligatorio. Defínelo en el entorno.',
    },
    BITACORA: {
      DETALLE_OBLIGATORIO: 'El detalle de la bitácora es obligatorio.',
      USUARIO_OBLIGATORIO: 'El usuario que realiza la acción es obligatorio.',
      ACCION_OBLIGATORIA: 'La acción es obligatoria.',
    },
  },
  INFRAESTRUCTURA: {
    CONFIGURACION: {
      VALOR_POR_DEFECTO: (clave: string) => `Valor por defecto auto-generado para ${clave}`,
    }
  }
};
