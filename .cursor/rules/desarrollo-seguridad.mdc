---
description: Validación, inyección, secretos, Parameter Store, auth
alwaysApply: false
---
# Seguridad en el Desarrollo

## Propósito

Reglas obligatorias de seguridad que el agente debe aplicar en todo código generado. Cubre validación de entrada, manejo de secretos, autenticación, prevención de inyección y protección de datos sensibles.

---

## Validación de Entrada

### Regla Principal

**Nunca confiar en datos que vienen del exterior** — request body, query params, path params, headers, archivos, webhooks, colas de mensajes.

### Qué Validar

| Fuente | Validaciones obligatorias |
|--------|--------------------------|
| Request body | Tipo de dato, longitud máxima, formato, valores permitidos |
| Path params | Formato esperado (UUID, numérico), existencia del recurso |
| Query params | Rangos válidos, paginación con límites, no permitir wildcards |
| Headers | Content-Type esperado, tamaño máximo |
| Archivos | Extensión, MIME type real (no solo extensión), tamaño máximo |
| Datos de BD | Validar al reconstruir entidades (no asumir que la BD es limpia) |

### Dónde Validar

```
Presentación → Validación de formato (DTOs, schemas)
Aplicación   → Validación de reglas de negocio
Dominio      → Invariantes de la entidad (siempre se valida)
```

### Ejemplo de Validación Defensiva

```
// BIEN: valida en el DTO + valida en la entidad
CrearUsuarioRequest → @NotBlank, @Email, @Size
Usuario.crear()     → validar internamente (doble barrera)

// MAL: solo valida en el controller y confía ciegamente después
```

---

## Prevención de Inyección

### SQL Injection

- **Siempre** usar queries parametrizadas / prepared statements.
- **Nunca** concatenar input del usuario en queries SQL.
- Si se usa un ORM (JPA, EF Core, SQLAlchemy), usar sus métodos tipados.
- Para queries dinámicas, usar Criteria API, Specifications o Query Builders.

```
// MAL
"SELECT * FROM usuarios WHERE email = '" + email + "'"

// BIEN
"SELECT * FROM usuarios WHERE email = :email"  → con parámetro
```

### NoSQL Injection

- No construir queries con objetos del request sin sanitizar.
- Validar que los campos del filtro sean los permitidos.

### Command Injection

- No ejecutar comandos del sistema con input del usuario.
- Si es inevitable, usar listas de argumentos (no strings concatenados).
- Sanitizar y validar contra una whitelist.

### XSS (Cross-Site Scripting)

- Escapar output HTML por defecto.
- No usar `innerHTML` o equivalentes con datos del usuario.
- Aplicar Content Security Policy (CSP) headers.

---

## Manejo de Secretos

### Reglas Absolutas

- **Nunca** hardcodear secretos en código fuente (API keys, passwords, tokens).
- **Nunca** commitear archivos `.env`, `credentials.json`, llaves privadas.
- **Nunca** loguear valores de secretos (solo su key/nombre).

### Dónde Guardar Secretos

| Ambiente | Método |
|----------|--------|
| Local | `.env` (en `.gitignore`) o vault local |
| CI/CD | Variables de entorno del pipeline (secretas) |
| Producción | AWS Secrets Manager, Azure Key Vault, HashiCorp Vault |

### .gitignore Obligatorio

```gitignore
# Secretos
.env
.env.*
*.pem
*.key
credentials.json
secrets/
```

---

## Autenticación y Autorización

### Principios

- Autenticación (quién eres) separada de autorización (qué puedes hacer).
- Implementar como cross-cutting concern (middleware/filter), no en cada endpoint.
- Tokens JWT: validar firma, expiración, issuer y audience.
- No almacenar tokens en localStorage (preferir httpOnly cookies o memoria).

### Passwords

- Hashear con bcrypt, scrypt o Argon2. Nunca MD5 ni SHA sin salt.
- No limitar la longitud máxima del password a menos de 128 chars.
- No revelar si el email existe en errores de login ("credenciales inválidas").

### API Keys

- Rotar periódicamente.
- Permisos mínimos necesarios (principio de menor privilegio).
- Rate limiting por API key.

---

## Protección de Datos Sensibles (PII)

### En código

- No loguear datos personales: email, teléfono, dirección, documentos.
- Si necesitas loguear para debug, enmascarar: `j***@email.com`.
- En respuestas de error, no exponer detalles internos (stack traces, queries).

### En base de datos

- Encriptar campos sensibles en reposo si el compliance lo requiere.
- Soft delete para datos con requerimientos legales de retención.
- Acceso a datos por principio de menor privilegio.

### En DTOs de respuesta

- No devolver más campos de los necesarios.
- No devolver IDs internos si no son necesarios para el cliente.
- Campos sensibles (password hash, tokens internos) nunca en responses.

---

## Headers de Seguridad HTTP

Si el proyecto expone API web, incluir:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-XSS-Protection: 0  (depender de CSP, no de este header legacy)
```

---

## Dependencias

- Usar versiones exactas (pinned), no rangos abiertos.
- Revisar dependencias por vulnerabilidades conocidas (Dependabot, Snyk, OWASP Dependency Check).
- No agregar dependencias con pocos mantenedores o nombres sospechosos (typosquatting).
- Actualizar dependencias con vulnerabilidades críticas de inmediato.

---

## Reglas para el Agente

1. **Toda entrada externa se valida**. Sin excepción. Si no hay validación, agregarla.
2. **Queries parametrizadas siempre**. Si ves concatenación de strings en SQL, corregirla inmediatamente.
3. **No hardcodear secretos**. Si el usuario pega un secret en código, advertirle y moverlo a config.
4. **Enmascarar datos sensibles** en logs. Nunca loguear passwords, tokens, PII completa.
5. **Respuestas de error genéricas** al exterior. Detalles solo en logs internos.
6. **Verificar .gitignore** antes de commitear. Asegurar que `.env` y archivos de secretos estén excluidos.
7. **No introducir dependencias** sin verificar que son legítimas y mantenidas.
8. **Principio de menor privilegio** en todo: acceso a BD, permisos de API, scopes de tokens.
9. **HTTPS siempre** en URLs de servicios externos. No aceptar HTTP.
10. **Si algo parece inseguro, advertir al usuario** antes de implementarlo.
