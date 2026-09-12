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
      EJEMPLO_LATITUD_ORIGEN: -34.6037,
      EJEMPLO_LONGITUD_ORIGEN: -58.3816,
      EJEMPLO_LATITUD_DESTINO: -34.5837,
      EJEMPLO_LONGITUD_DESTINO: -58.4016,
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
    },
    CONFIGURACION: {
      VALOR_VACIO: 'El valor no puede estar vacío.',
      CLAVE_OBLIGATORIA: 'La clave es obligatoria.',
      VALOR_OBLIGATORIO: 'El valor es obligatorio.',
      FEE_PLATAFORMA_DESC: 'Porcentaje de comisión de la plataforma',
      TIMEOUT_VIAJE_MINUTOS_DESC: 'Minutos antes de cancelar un viaje sin aceptar',
      CLAVE_FEE_PLATAFORMA: 'FEE_PLATAFORMA',
      CLAVE_TIMEOUT_VIAJE_MINUTOS: 'TIMEOUT_VIAJE_MINUTOS',
    },
    TARIFAS: {
      PRECIO_MAYOR_CERO: 'El precio debe ser mayor a cero.',
      ORIGEN_DESTINO_OBLIGATORIOS: 'Origen y destino son obligatorios.',
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
      SIN_CONDUCTORES: 'No hay conductores disponibles',
      SIN_CONDUCTORES_ZONA: 'No hay conductores disponibles en tu zona',
      COMPLETADO_EXITOSO: 'Viaje completado exitosamente',
      TIMEOUT_AGOTADO: 'Tiempo de espera agotado',
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
    },
    AUTH: {
      CREDENCIALES_INVALIDAS: 'Credenciales inválidas.',
      ROL_INVALIDO: 'Rol no válido.',
      TOKEN_AUSENTE: 'Token ausente.',
    },
    PROCESOS_BATCH: {
      PROCESO_OBLIGATORIO: 'El nombre del proceso es obligatorio.',
      TOTAL_REGISTROS_NEGATIVO: 'Total de registros no puede ser negativo.',
      EJECUCION_ID_OBLIGATORIO: 'ID de ejecución padre es obligatorio.',
      VALOR_CLAVE_OBLIGATORIO: 'El valor clave (identificador legible) es obligatorio.',
      DISPARADO_OK: 'Proceso de timeout de viajes disparado correctamente',
    },
    IDEMPOTENCIA: {
      LLAVE_REQUERIDA: 'La llave de idempotencia es requerida.',
      PAYLOAD_DIFERENTE: 'Idempotency-Key está siendo usada con un payload diferente.',
      EN_PROGRESO: 'La solicitud está en progreso. Intente nuevamente en unos segundos.',
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
