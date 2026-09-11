---
trigger: always_on
---

# Convención de Arquitectura - NestJS (Clean Architecture + Vertical Slices)

## Propósito

Define la estructura y mejores prácticas obligatorias exclusivas para el Backend en NestJS, combinando Arquitectura Limpia (Clean Architecture) con Vertical Slices. Se activa automáticamente al trabajar con este framework.

---

## Estructura de Proyecto - Backend Node.js (NestJS / Express)

```
📁 src/
├── 📁 features/                           # Vertical Slices (Módulos de negocio)
│   └── 📁 usuarios/                       # Feature (Ej. Usuarios, Viajes)
│       ├── 📁 dominio/                    # Capa de Dominio (Pura)
│       │   ├── 📁 entidades/
│       │   │   └── usuario.entity.ts
│       │   ├── 📁 value-objects/
│       │   ├── 📁 repositorios/           # Interfaces de Contratos
│       │   │   └── usuario.repository.ts
│       │   ├── 📁 servicios/
│       │   └── 📁 excepciones/
│       │
│       ├── 📁 aplicacion/                 # Capa de Aplicación (Casos de Uso)
│       │   ├── 📁 casos-uso/
│       │   │   └── crear-usuario.use-case.ts
│       │   ├── 📁 dto/
│       │   │   └── crear-usuario.dto.ts
│       │   └── 📁 mappers/
│       │       └── usuario.mapper.ts
│       │
│       ├── 📁 infraestructura/            # Capa de Infraestructura (TypeORM, APIs)
│       │   ├── 📁 persistencia/
│       │   │   ├── 📁 entidades/          # Entidades ORM
│       │   │   │   └── usuario.orm-entity.ts
│       │   │   └── 📁 repositorios/       # Implementaciones
│       │   │       └── usuario.repository.impl.ts
│       │   └── 📁 servicios/
│       │
│       ├── 📁 presentacion/               # Capa de Presentación (Controladores)
│       │   ├── 📁 controladores/
│       │   │   └── usuarios.controller.ts
│       │   └── 📁 middlewares/
│       │
│       └── usuarios.module.ts             # Módulo NestJS del feature
│
├── 📁 compartidos/                        # Utilidades globales y transversales
│   ├── 📁 tipos/
│   └── 📁 utilidades/
│
└── main.ts                                # Entry point

📁 tests/
├── 📁 unit/
├── 📁 integration/
└── 📁 e2e/
```

---



---

## Patrones por Capa (NestJS)

### Dominio - Entidad

```typescript
// src/features/usuarios/dominio/entidades/usuario.entity.ts

// src/features/usuarios/dominio/entidades/usuario.props.ts
export interface UsuarioProps {
  id?: string;
  nombre: string;
  email: string;
  estado?: string;
  fechaCreacion?: Date;
}

// src/features/usuarios/dominio/entidades/usuario.entity.ts
import { UsuarioProps } from './usuario.props';

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
    this._estado = props.estado ?? 'activo';
    this._fechaCreacion = props.fechaCreacion ?? new Date();

    this.validar();
  }

  static crear(props: UsuarioProps): Usuario {
    return new Usuario(props);
  }

  get id(): string { return this._id; }
  get nombre(): string { return this._nombre; }
  get email(): string { return this._email; }
  get estado(): string { return this._estado; }
  get fechaCreacion(): Date { return this._fechaCreacion; }

  desactivar(): void {
    if (this._estado === 'inactivo') {
      throw new Error('El usuario ya está inactivo.'); // O DomainException custom
    }
    this._estado = 'inactivo';
  }

  private validar(): void {
    if (!this._nombre?.trim()) {
      throw new Error('El nombre es obligatorio.');
    }
    if (!this._email?.includes('@')) {
      throw new Error('El email no es válido.');
    }
  }
}
```

### Dominio - Interfaz de Repositorio

```typescript
// src/features/usuarios/dominio/repositorios/usuario.repository.ts

import { Usuario } from '../entidades/usuario.entity';

export interface IUsuarioRepository {
  obtenerPorId(id: string): Promise<Usuario | null>;
  obtenerPorEmail(email: string): Promise<Usuario | null>;
  listarTodos(options?: { limit: number; offset: number }): Promise<Usuario[]>;
  guardar(usuario: Usuario): Promise<Usuario>;
  eliminar(id: string): Promise<void>;
  existeEmail(email: string): Promise<boolean>;
}

// Token para inyección de dependencias en NestJS
export const USUARIO_REPOSITORY = Symbol('IUsuarioRepository');
```

### Aplicación - Caso de Uso

```typescript
// src/features/usuarios/aplicacion/casos-uso/crear-usuario.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { IUsuarioRepository, USUARIO_REPOSITORY } from '../../dominio/repositorios/usuario.repository';
import { Usuario } from '../../dominio/entidades/usuario.entity';
import { CrearUsuarioDto } from '../dto/crear-usuario.dto';

@Injectable()
export class CrearUsuarioUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: IUsuarioRepository,
  ) {}

  async ejecutar(dto: CrearUsuarioDto): Promise<Usuario> {
    const existeEmail = await this.usuarioRepository.existeEmail(dto.email);
    if (existeEmail) {
      throw new Error('El email ya está registrado.');
    }

    const usuario = Usuario.crear({
      nombre: dto.nombre,
      email: dto.email,
    });

    const guardado = await this.usuarioRepository.guardar(usuario);
    return guardado; // Mapear a Response DTO si es necesario
  }
}
```

### Aplicación - DTOs con Validación (Zod)

```typescript
// src/features/usuarios/aplicacion/dto/crear-usuario.dto.ts

import { z } from 'zod';

export const crearUsuarioSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(100),
  email: z.string().email('El email no es válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type CrearUsuarioDto = z.infer<typeof crearUsuarioSchema>;
```

### Infraestructura - Repositorio (Mappers)

```typescript
// src/features/usuarios/infraestructura/persistencia/repositorios/usuario.repository.impl.ts

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { IUsuarioRepository } from '../../../dominio/repositorios/usuario.repository';
import { Usuario } from '../../../dominio/entidades/usuario.entity';
import { UsuarioOrmEntity } from '../entidades/usuario.orm-entity';

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

  // Mappers (Domain <-> ORM)
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
// src/features/usuarios/presentacion/controladores/usuarios.controller.ts

import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CrearUsuarioUseCase } from '../../aplicacion/casos-uso/crear-usuario.use-case';
import { CrearUsuarioDto, crearUsuarioSchema } from '../../aplicacion/dto/crear-usuario.dto';
// (Asumiendo que existe un ZodValidationPipe custom en compartidos)
// import { ZodValidationPipe } from '../../../../compartidos/pipes/zod-validation.pipe';

@Controller('api/usuarios')
export class UsuariosController {
  constructor(
    private readonly crearUsuario: CrearUsuarioUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(
    // @Body(new ZodValidationPipe(crearUsuarioSchema)) dto: CrearUsuarioDto,
    @Body() dto: CrearUsuarioDto
  ) {
    return await this.crearUsuario.ejecutar(dto);
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
   - **¡ATENCIÓN!** Esto incluye las interfaces de propiedades (`Props`). Deben extraerse a su propio archivo (ej. `usuario.props.ts`).
   - Cada DTO (`FareViajeDto`, `CancelarViajeDto`, …) = su propio archivo bajo `aplicacion/dto/`.
   - Controllers solo exportan la clase del controller; no definir DTOs internamente.