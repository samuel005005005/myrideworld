---
description: Convenciones TypeScript/JS Clean Architecture
globs: **/*.{ts,js,tsx,jsx}
alwaysApply: false
---
# Estructura Base - JavaScript/TypeScript con Clean Architecture

## Propósito

Define la estructura obligatoria para proyectos JS/TS (Node.js backend, Angular, React) siguiendo Clean Architecture. Se activa automáticamente al trabajar con archivos `.ts`, `.js`, `.tsx`, `.jsx`.

---

## Estructura de Proyecto - Backend Node.js (NestJS / Express)

```
📁 src/
├── 📁 domain/                             # Capa de Dominio
│   ├── 📁 entities/
│   │   ├── usuario.entity.ts
│   │   └── pedido.entity.ts
│   ├── 📁 value-objects/
│   │   └── email.value-object.ts
│   ├── 📁 repositories/                   # Interfaces
│   │   └── usuario.repository.ts
│   ├── 📁 services/                       # Servicios de dominio
│   │   └── precio.service.ts
│   ├── 📁 exceptions/
│   │   └── domain.exception.ts
│   └── 📁 events/
│       └── usuario-creado.event.ts
│
├── 📁 application/                        # Capa de Aplicación
│   ├── 📁 use-cases/
│   │   ├── crear-usuario.use-case.ts
│   │   ├── obtener-usuario.use-case.ts
│   │   └── listar-usuarios.use-case.ts
│   ├── 📁 dto/
│   │   ├── crear-usuario.dto.ts
│   │   └── usuario-response.dto.ts
│   ├── 📁 interfaces/
│   │   └── email.service.interface.ts
│   └── 📁 mappers/
│       └── usuario.mapper.ts
│
├── 📁 infrastructure/                     # Capa de Infraestructura
│   ├── 📁 persistence/
│   │   ├── 📁 entities/                   # Entidades ORM (TypeORM/Prisma)
│   │   │   └── usuario.orm-entity.ts
│   │   ├── 📁 repositories/
│   │   │   └── usuario.repository.impl.ts
│   │   ├── 📁 migrations/
│   │   └── database.config.ts
│   ├── 📁 services/
│   │   └── email.service.impl.ts
│   └── 📁 config/
│       └── env.config.ts
│
├── 📁 presentation/                       # Capa de Presentación
│   ├── 📁 controllers/
│   │   └── usuarios.controller.ts
│   ├── 📁 middlewares/
│   │   ├── error-handler.middleware.ts
│   │   └── auth.middleware.ts
│   ├── 📁 validators/                     # Schemas de validación (Zod/Joi)
│   │   └── usuario.validator.ts
│   └── 📁 decorators/                     # Decoradores custom (NestJS)
│
├── 📁 shared/                             # Utilidades compartidas
│   ├── 📁 types/
│   │   └── result.type.ts
│   └── 📁 utils/
│
└── main.ts                                # Entry point

📁 tests/
├── 📁 unit/
├── 📁 integration/
└── 📁 e2e/
```

---

## Estructura de Proyecto - Frontend Angular

```
📁 src/app/
├── 📁 core/                               # Singleton services, guards, interceptors
│   ├── 📁 interceptors/
│   │   └── auth.interceptor.ts
│   ├── 📁 guards/
│   │   └── auth.guard.ts
│   └── 📁 services/
│       └── auth.service.ts
│
├── 📁 shared/                             # Componentes, pipes, directivas reutilizables
│   ├── 📁 components/
│   ├── 📁 pipes/
│   └── 📁 directives/
│
├── 📁 features/                           # Módulos por feature (lazy loaded)
│   └── 📁 usuarios/
│       ├── 📁 domain/
│       │   ├── entities/
│       │   └── repositories/
│       ├── 📁 application/
│       │   ├── use-cases/
│       │   └── dto/
│       ├── 📁 infrastructure/
│       │   ├── repositories/
│       │   └── mappers/
│       ├── 📁 presentation/
│       │   ├── pages/
│       │   │   └── usuarios-list/
│       │   │       ├── usuarios-list.component.ts
│       │   │       ├── usuarios-list.component.html
│       │   │       └── usuarios-list.component.scss
│       │   └── components/
│       ├── usuarios.routes.ts
│       └── usuarios.module.ts (o standalone)
│
└── app.routes.ts
```

---

## Patrones por Capa

### Dominio - Entidad

```typescript
// domain/entities/usuario.entity.ts

export interface UsuarioProps {
  id?: string;
  nombre: string;
  email: string;
  estado?: EstadoUsuario;
  fechaCreacion?: Date;
}

export enum EstadoUsuario {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  SUSPENDIDO = 'suspendido',
}

export class Usuario {
  private readonly _id: string;
  private _nombre: string;
  private _email: string;
  private _estado: EstadoUsuario;
  private readonly _fechaCreacion: Date;

  private constructor(props: UsuarioProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._nombre = props.nombre;
    this._email = props.email;
    this._estado = props.estado ?? EstadoUsuario.ACTIVO;
    this._fechaCreacion = props.fechaCreacion ?? new Date();

    this.validar();
  }

  static crear(props: UsuarioProps): Usuario {
    return new Usuario(props);
  }

  get id(): string { return this._id; }
  get nombre(): string { return this._nombre; }
  get email(): string { return this._email; }
  get estado(): EstadoUsuario { return this._estado; }
  get fechaCreacion(): Date { return this._fechaCreacion; }

  desactivar(): void {
    if (this._estado === EstadoUsuario.INACTIVO) {
      throw new DomainException('El usuario ya está inactivo.');
    }
    this._estado = EstadoUsuario.INACTIVO;
  }

  private validar(): void {
    if (!this._nombre?.trim()) {
      throw new DomainException('El nombre es obligatorio.');
    }
    if (!this._email?.includes('@')) {
      throw new DomainException('El email no es válido.');
    }
  }
}
```

### Dominio - Interfaz de Repositorio

```typescript
// domain/repositories/usuario.repository.ts

import { Usuario } from '../entities/usuario.entity';

export interface IUsuarioRepository {
  obtenerPorId(id: string): Promise<Usuario | null>;
  obtenerPorEmail(email: string): Promise<Usuario | null>;
  listarTodos(options?: { limit: number; offset: number }): Promise<Usuario[]>;
  guardar(usuario: Usuario): Promise<Usuario>;
  eliminar(id: string): Promise<void>;
  existeEmail(email: string): Promise<boolean>;
}

// Token para inyección de dependencias
export const USUARIO_REPOSITORY = Symbol('IUsuarioRepository');
```

### Aplicación - Caso de Uso

```typescript
// application/use-cases/crear-usuario.use-case.ts

import { Inject, Injectable } from '@nestjs/common'; // o sin framework
import { IUsuarioRepository, USUARIO_REPOSITORY } from '../../domain/repositories/usuario.repository';
import { Usuario } from '../../domain/entities/usuario.entity';
import { CrearUsuarioDto } from '../dto/crear-usuario.dto';
import { UsuarioResponseDto } from '../dto/usuario-response.dto';
import { UsuarioMapper } from '../mappers/usuario.mapper';
import { DomainException } from '../../domain/exceptions/domain.exception';

@Injectable()
export class CrearUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: IUsuarioRepository,
  ) {}

  async ejecutar(dto: CrearUsuarioDto): Promise<UsuarioResponseDto> {
    const existeEmail = await this.usuarioRepository.existeEmail(dto.email);
    if (existeEmail) {
      throw new DomainException('El email ya está registrado.');
    }

    const usuario = Usuario.crear({
      nombre: dto.nombre,
      email: dto.email,
    });

    const guardado = await this.usuarioRepository.guardar(usuario);
    return UsuarioMapper.toResponse(guardado);
  }
}
```

### Aplicación - DTOs con Validación (Zod)

```typescript
// application/dto/crear-usuario.dto.ts

import { z } from 'zod';

export const crearUsuarioSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(100),
  email: z.string().email('El email no es válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type CrearUsuarioDto = z.infer<typeof crearUsuarioSchema>;
```

### Infraestructura - Repositorio

```typescript
// infrastructure/persistence/repositories/usuario.repository.impl.ts

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { IUsuarioRepository } from '../../../domain/repositories/usuario.repository';
import { Usuario } from '../../../domain/entities/usuario.entity';
import { UsuarioOrmEntity } from '../entities/usuario.orm-entity';

@Injectable()
export class UsuarioRepositoryImpl implements IUsuarioRepository {
  constructor(
    @InjectRepository(UsuarioOrmEntity)
    private readonly ormRepo: Repository<UsuarioOrmEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<Usuario | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async guardar(usuario: Usuario): Promise<Usuario> {
    const entity = this.toOrm(usuario);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  async existeEmail(email: string): Promise<boolean> {
    return await this.ormRepo.exists({ where: { email } });
  }

  private toDomain(entity: UsuarioOrmEntity): Usuario {
    return Usuario.crear({
      id: entity.id,
      nombre: entity.nombre,
      email: entity.email,
      estado: entity.estado,
      fechaCreacion: entity.fechaCreacion,
    });
  }

  private toOrm(usuario: Usuario): Partial<UsuarioOrmEntity> {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      estado: usuario.estado,
    };
  }

  // ... demás métodos
}
```

### Presentación - Controller

```typescript
// presentation/controllers/usuarios.controller.ts

import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CrearUsuarioUseCase } from '../../application/use-cases/crear-usuario.use-case';
import { ObtenerUsuarioUseCase } from '../../application/use-cases/obtener-usuario.use-case';
import { CrearUsuarioDto, crearUsuarioSchema } from '../../application/dto/crear-usuario.dto';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

@Controller('api/usuarios')
export class UsuariosController {
  constructor(
    private readonly crearUsuario: CrearUsuarioUseCase,
    private readonly obtenerUsuario: ObtenerUsuarioUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(
    @Body(new ZodValidationPipe(crearUsuarioSchema)) dto: CrearUsuarioDto,
  ) {
    return await this.crearUsuario.ejecutar(dto);
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return await this.obtenerUsuario.ejecutar(id);
  }
}
```

---

## Librerías Recomendadas

### Backend

| Librería | Propósito |
|----------|-----------|
| `NestJS` / `Express` | Framework web |
| `TypeORM` / `Prisma` | ORM |
| `Zod` / `class-validator` | Validación |
| `tsyringe` / Nest DI | Inyección de dependencias |
| `Jest` / `Vitest` | Testing |
| `Pino` / `Winston` | Logging |

### Frontend (Angular)

| Librería | Propósito |
|----------|-----------|
| `Angular` 17+ | Framework |
| `NgRx` / `Signals` | State management |
| `RxJS` | Programación reactiva |
| `Tailwind` / `Angular Material` | UI |
| `Jest` / `Karma` | Testing |

---

## Convenciones de Nomenclatura JS/TS

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Archivos | kebab-case + sufijo | `crear-usuario.use-case.ts` |
| Clases | PascalCase | `UsuarioRepository` |
| Interfaces | PascalCase con prefijo `I` | `IUsuarioRepository` |
| Funciones | camelCase | `obtenerPorId()` |
| Variables/props | camelCase | `nombreCompleto` |
| Constantes | UPPER_SNAKE_CASE | `MAX_REINTENTOS` |
| Enums | PascalCase (enum y valores) | `EstadoUsuario.ACTIVO` |
| Types | PascalCase | `UsuarioResponse` |
| Componentes Angular | kebab-case selector | `app-usuario-card` |
| Servicios Angular | PascalCase + Service | `UsuarioService` |

---

## Reglas para el Agente

1. **TypeScript estricto**. `strict: true` en tsconfig. No usar `any` sin justificación.
2. **Interfaces para contratos**. Repositorios y servicios externos siempre tienen interfaz.
3. **Un use case por archivo**. Método principal: `ejecutar()`.
4. **Una clase o interfaz exportada por archivo (obligatorio)**.
   - Prohibido agrupar varios `@Injectable`, DTOs, guards, schemas Mongo o `interface` en el mismo `.ts`.
   - Cada DTO (`FareViajeDto`, `CancelarViajeDto`, …) = su propio archivo bajo `aplicacion/dto/`.
   - Controllers solo exportan la clase del controller; no definir DTOs inline.
   - Types/aliases auxiliares del mismo contrato pueden vivir junto a la interfaz **solo si no son otra `class`/`interface` de dominio distinto**; preferí archivo dedicado.
5. **Inmutabilidad**. Usa `readonly`, `as const`, objetos inmutables por defecto.
6. **Async/await** para operaciones asíncronas. No mezclar callbacks con promises.
7. **Validación con Zod/class-validator** en la frontera. Nunca confiar en datos sin validar.
8. **Archivos con sufijo de tipo**: `.entity.ts`, `.caso-uso.ts` / `.use-case.ts`, `.repository.ts`, `.dto.ts`, `.controller.ts`.
9. **Inyección por constructor**. No instanciar dependencias directamente con `new`.
10. **Error handling** con clases de error tipadas. No lanzar strings ni Error genérico.
11. **Barrel exports** (`index.ts`) por módulo para imports limpios, pero no en la raíz del proyecto.
12. **Prohibido `Record<…>`**. Ver sección siguiente.

---

## Tipado: prohibido `Record` y bolsas genéricas

**Nunca** uses `Record<string, T>`, `Record<string, unknown>`, ni aliases equivalentes como “mapa suelto” de propiedades.

Motivo: oculta el contrato, rompe tipado estricto y empuja datos sin forma a dominio/presentación.

### Qué usar en su lugar

| Caso | Alternativa |
|------|-------------|
| Request autenticado conductor/admin | `ReqConductor` / `ReqAdmin` en `compartido/presentacion/tipos-request-http.ts` |
| Cabeceras HTTP | `CabecerasHttp` (`{ [nombre: string]: string \| string[] \| undefined }`) o tipo dedicado |
| Metadatos de email | `MetaEmail` en el puerto `notificador-email.port.ts` |
| Cuerpo de idempotencia | `CuerpoIdempotencia` |
| Diccionario con claves conocidas | tipo/objeto explícito, mapped type `{ readonly [K in Clave]: … }`, o `Map` tipado |
| Documento Mongo lean / cast puntual | tipo dedicado `DocX` / interfaz del schema; no `Record` en firma pública |

### Ejemplos

```typescript
// ❌ Mal
@Req() req: { conductorId: string; headers: Record<string, string> }
meta?: Record<string, unknown>
async ejecutar<T extends Record<string, unknown>>(…)

// ✅ Bien
@Req() req: ReqConductor
meta?: MetaEmail
async ejecutar<T extends object>(…)
```

En infraestructura (mappers de docs) preferí tipar el doc; si hace falta index signature, usa `{ [clave: string]: unknown }` **solo localmente** y conviértelo a un tipo de dominio antes de salir de la capa.
