# Template TypeScript - Clean Architecture (NestJS / Express / Angular)

## Fuente de estructura y convenciones

Árbol backend/frontend, nomenclatura y ejemplos canónicos:

[`.cursor/rules/convention-typescript.mdc`](../../rules/convention-typescript.md)

Este archivo solo aporta **plantillas con placeholders**. Si hay conflicto (p. ej. ubicación de mappers), gana `estructuras/typescript.md`.

## Plantilla: Entidad

```typescript
export class {Entidad} {
  private constructor(private readonly props: {Entidad}Props) {
    this.validar();
  }

  static crear(props: {Entidad}Props): {Entidad} {
    return new {Entidad}(props);
  }

  get id(): string { return this.props.id; }
  // ... getters

  {comportamiento}(): void {
    // Validación + lógica
  }

  private validar(): void {
    // Invariantes
  }
}
```

## Plantilla: Use Case

```typescript
@Injectable()
export class {NombreUseCase} {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly repository: I{Entidad}Repository,
  ) {}

  async ejecutar(dto: {Nombre}Dto): Promise<{Retorno}> {
    // 1. Validar
    // 2. Ejecutar lógica
    // 3. Persistir
    // 4. Retornar
  }
}
```

## Plantilla: Controller

```typescript
@Controller('api/{feature}')
export class {Feature}Controller {
  constructor(private readonly {useCase}: {NombreUseCase}) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body(new ZodValidationPipe(schema)) dto: {Nombre}Dto) {
    return await this.{useCase}.ejecutar(dto);
  }
}
```

## Plantilla: Validación (Zod)

```typescript
export const {nombre}Schema = z.object({
  {campo}: z.string().min(1, '{campo} es obligatorio').max(100),
});

export type {Nombre}Dto = z.infer<typeof {nombre}Schema>;
```

## Plantilla: Mappers

Los mappers mantienen aisladas las capas. La entidad de dominio no conoce TypeORM/Prisma, y los ORM entities nunca llegan a los controllers.

### Flujo de transformación

```
ORM Entity (infra) → Entidad Domain → Response DTO (application/presentation)
Request DTO (presentation) → Entidad Domain → ORM Entity (infra)
```

### Mapper de Infraestructura (ORM ↔ Dominio)

```typescript
// infrastructure/persistence/mappers/usuario.mapper.ts

import { Usuario, EstadoUsuario } from '../../../domain/entities/usuario.entity';
import { UsuarioOrmEntity } from '../entities/usuario.orm-entity';

export class UsuarioPersistenceMapper {
  static toDomain(orm: UsuarioOrmEntity): Usuario {
    return Usuario.crear({
      id: orm.id,
      nombre: orm.nombre,
      email: orm.email,
      estado: orm.estado as EstadoUsuario,
      fechaCreacion: orm.fechaCreacion,
    });
  }

  static toOrm(entidad: Usuario): Partial<UsuarioOrmEntity> {
    return {
      id: entidad.id,
      nombre: entidad.nombre,
      email: entidad.email,
      estado: entidad.estado,
      fechaCreacion: entidad.fechaCreacion,
    };
  }

  static toDomainList(orms: UsuarioOrmEntity[]): Usuario[] {
    return orms.map(this.toDomain);
  }
}
```

### Mapper de Aplicación (Dominio → Response DTO)

```typescript
// application/mappers/usuario.mapper.ts

import { Usuario } from '../../domain/entities/usuario.entity';
import { UsuarioResponseDto } from '../dto/usuario-response.dto';

export class UsuarioMapper {
  static toResponse(entidad: Usuario): UsuarioResponseDto {
    return {
      id: entidad.id,
      nombre: entidad.nombre,
      email: entidad.email,
      estado: entidad.estado,
      fechaCreacion: entidad.fechaCreacion.toISOString(),
    };
  }

  static toResponseList(entidades: Usuario[]): UsuarioResponseDto[] {
    return entidades.map(this.toResponse);
  }
}
```

### Uso en el Repositorio

```typescript
// infrastructure/persistence/repositories/usuario.repository.impl.ts

async obtenerPorId(id: string): Promise<Usuario | null> {
  const entity = await this.ormRepo.findOne({ where: { id } });
  return entity ? UsuarioPersistenceMapper.toDomain(entity) : null;
}

async guardar(usuario: Usuario): Promise<Usuario> {
  const orm = UsuarioPersistenceMapper.toOrm(usuario);
  const saved = await this.ormRepo.save(orm);
  return UsuarioPersistenceMapper.toDomain(saved as UsuarioOrmEntity);
}
```

### Uso en el Use Case

```typescript
async ejecutar(dto: CrearUsuarioDto): Promise<UsuarioResponseDto> {
  const usuario = Usuario.crear({ nombre: dto.nombre, email: dto.email });
  const guardado = await this.repository.guardar(usuario);
  return UsuarioMapper.toResponse(guardado);
}
```

### Reglas de Mappers

| Dirección | Ubicación | Responsable |
|-----------|-----------|-------------|
| ORM Entity → Entidad Domain | `infrastructure/persistence/mappers/` | Repositorio |
| Entidad Domain → ORM Entity | `infrastructure/persistence/mappers/` | Repositorio |
| Entidad Domain → Response DTO | `application/mappers/` | Use Case |
| Request DTO → params creación | Use Case directamente | Use Case |

### Qué NO hacer

- No importar ORM entities en application ni domain.
- No retornar entidades de dominio desde controllers.
- No usar decoradores de TypeORM (@Entity, @Column) en entidades de dominio.
- No pasar DTOs de request hasta la capa de dominio sin transformar.

## Paquetes

- Backend: NestJS/Express, TypeORM/Prisma, Zod, tsyringe, Jest/Vitest, Pino
- Frontend: Angular 17+, NgRx/Signals, RxJS, Tailwind/Material, Jest/Karma
