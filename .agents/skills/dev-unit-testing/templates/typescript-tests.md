# Template Tests - TypeScript (Jest / Vitest)

## Fuente de ubicación

Estructura de carpetas del stack: [`.agents/rules/convention-typescript.md`](../../rules/convention-typescript.md)  
Convenciones de tests: skill `unit-testing`.

## Estructura

```
tests/
├── unit/
│   ├── domain/
│   │   └── usuario.entity.spec.ts
│   └── application/
│       └── crear-usuario.use-case.spec.ts
├── integration/
│   └── usuarios.controller.spec.ts
└── helpers/
    └── mock-factory.ts
```

## Plantilla: Test de Use Case

```typescript
import { CrearUsuarioUseCase } from '@/application/use-cases/crear-usuario.use-case';
import { IUsuarioRepository } from '@/domain/repositories/usuario.repository';
import { Usuario } from '@/domain/entities/usuario.entity';
import { DomainException } from '@/domain/exceptions/domain.exception';

describe('CrearUsuarioUseCase', () => {
  let sut: CrearUsuarioUseCase;
  let mockRepository: jest.Mocked<IUsuarioRepository>;

  beforeEach(() => {
    mockRepository = {
      obtenerPorId: jest.fn(),
      obtenerPorEmail: jest.fn(),
      guardar: jest.fn(),
      eliminar: jest.fn(),
      existeEmail: jest.fn(),
      listarTodos: jest.fn(),
    };
    sut = new CrearUsuarioUseCase(mockRepository);
  });

  describe('ejecutar', () => {
    const dtoValido = {
      nombre: 'Juan Pérez',
      email: 'juan@email.com',
      password: 'Pass1234',
    };

    it('DebeCrearUsuario_CuandoDatosSonValidos', async () => {
      // Arrange
      mockRepository.existeEmail.mockResolvedValue(false);
      mockRepository.guardar.mockResolvedValue(
        Usuario.crear({ nombre: dtoValido.nombre, email: dtoValido.email }),
      );

      // Act
      const resultado = await sut.ejecutar(dtoValido);

      // Assert
      expect(resultado.nombre).toBe('Juan Pérez');
      expect(resultado.email).toBe('juan@email.com');
      expect(mockRepository.guardar).toHaveBeenCalledTimes(1);
    });

    it('DebeLanzarExcepcion_CuandoEmailYaRegistrado', async () => {
      // Arrange
      mockRepository.existeEmail.mockResolvedValue(true);

      // Act & Assert
      await expect(sut.ejecutar(dtoValido)).rejects.toThrow(DomainException);
      await expect(sut.ejecutar(dtoValido)).rejects.toThrow(/email/i);
      expect(mockRepository.guardar).not.toHaveBeenCalled();
    });

    it('DebeLanzarExcepcion_CuandoNombreEstaVacio', async () => {
      // Arrange
      const dtoInvalido = { ...dtoValido, nombre: '' };
      mockRepository.existeEmail.mockResolvedValue(false);

      // Act & Assert
      await expect(sut.ejecutar(dtoInvalido)).rejects.toThrow(DomainException);
    });
  });
});
```

## Plantilla: Test de Entidad

```typescript
import { Usuario, EstadoUsuario } from '@/domain/entities/usuario.entity';
import { DomainException } from '@/domain/exceptions/domain.exception';

describe('Usuario', () => {
  describe('crear', () => {
    it('DebeCrearUsuario_CuandoDatosSonValidos', () => {
      // Act
      const usuario = Usuario.crear({ nombre: 'Juan', email: 'juan@email.com' });

      // Assert
      expect(usuario.nombre).toBe('Juan');
      expect(usuario.email).toBe('juan@email.com');
      expect(usuario.estado).toBe(EstadoUsuario.ACTIVO);
      expect(usuario.id).toBeDefined();
    });

    it('DebeLanzarExcepcion_CuandoNombreEstaVacio', () => {
      expect(() => Usuario.crear({ nombre: '', email: 'juan@email.com' }))
        .toThrow(DomainException);
    });

    it('DebeLanzarExcepcion_CuandoEmailEsInvalido', () => {
      expect(() => Usuario.crear({ nombre: 'Juan', email: 'no-es-email' }))
        .toThrow(DomainException);
    });
  });

  describe('desactivar', () => {
    it('DebeDesactivarUsuario_CuandoEstadoEsActivo', () => {
      // Arrange
      const usuario = Usuario.crear({ nombre: 'Juan', email: 'juan@email.com' });

      // Act
      usuario.desactivar();

      // Assert
      expect(usuario.estado).toBe(EstadoUsuario.INACTIVO);
    });

    it('DebeLanzarExcepcion_CuandoUsuarioYaEstaInactivo', () => {
      // Arrange
      const usuario = Usuario.crear({ nombre: 'Juan', email: 'juan@email.com' });
      usuario.desactivar();

      // Act & Assert
      expect(() => usuario.desactivar()).toThrow(/ya está inactivo/i);
    });
  });
});
```

## Plantilla: Mock Factory (helpers)

```typescript
// tests/helpers/mock-factory.ts

import { IUsuarioRepository } from '@/domain/repositories/usuario.repository';

export function crearMockRepository(): jest.Mocked<IUsuarioRepository> {
  return {
    obtenerPorId: jest.fn(),
    obtenerPorEmail: jest.fn(),
    listarTodos: jest.fn(),
    guardar: jest.fn(),
    eliminar: jest.fn(),
    existeEmail: jest.fn(),
  };
}
```

## Configuración

```json
// jest.config.ts o vitest.config.ts
{
  "moduleNameMapper": {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  "testMatch": ["**/*.spec.ts"]
}
```
