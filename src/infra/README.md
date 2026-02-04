# Capa de Infraestructura

Esta capa maneja la persistencia de datos usando archivos JSON.

## Estructura

```
infra/
├── repositories/
│   ├── IElevatorRepository.ts    # Interfaz del repositorio
│   └── JsonElevatorRepository.ts # Implementación con JSON
├── storage/
│   └── fileStorage.ts            # Utilidades para leer/escribir JSON
└── index.ts                      # Exports públicos
```

## Uso del Repositorio

### Crear instancia

```typescript
import { JsonElevatorRepository } from './infra';

// Por defecto guarda en ./data/elevators.json
const repository = new JsonElevatorRepository();

// O especificar otra ruta
const customRepo = new JsonElevatorRepository('./mi-carpeta/datos.json');
```

### Guardar un ascensor

```typescript
import { CreateElevatorDTO, ElevatorLocationType } from './domain';

const elevator: CreateElevatorDTO = {
  location: {
    name: 'Torre Eiffel',
    city: 'París',
    country: 'Francia',
    type: ElevatorLocationType.TOWER
  },
  speedMeasurement: {
    totalSeconds: 60,
    floorsTraversed: 50,
    secondsPerFloor: 1.2
  },
  rating: {
    speed: 8.5,
    smoothness: 9,
    design: 10,
    capacity: 7
  },
  notes: 'Vista espectacular'
};

const saved = await repository.save(elevator);
console.log('ID generado:', saved.id);
console.log('Score general:', saved.overallScore);
```

### Consultar datos

```typescript
// Obtener todos
const all = await repository.findAll();

// Buscar por ID
const elevator = await repository.findById('uuid-aqui');

// Buscar por ciudad
const parisElevators = await repository.findByCity('París');

// Buscar por tipo
const hotels = await repository.findByType('hotel');

// Top 10 mejor calificados
const top10 = await repository.findTopRated(10);
```

### Actualizar

```typescript
const updated = await repository.update('uuid-aqui', {
  rating: {
    smoothness: 10  // Solo actualiza smoothness
  },
  notes: 'Nuevas notas'
});
```

### Eliminar

```typescript
const deleted = await repository.delete('uuid-aqui');
console.log('Eliminado:', deleted); // true o false
```

## Formato del archivo JSON

```json
{
  "elevators": [
    {
      "id": "uuid-generado",
      "location": {
        "name": "Hotel Marriott",
        "city": "Buenos Aires",
        "country": "Argentina",
        "type": "hotel"
      },
      "speedMeasurement": {
        "totalSeconds": 15,
        "floorsTraversed": 5,
        "secondsPerFloor": 3
      },
      "rating": {
        "speed": 3.33,
        "smoothness": 8,
        "design": 7,
        "capacity": 9
      },
      "overallScore": 6.83,
      "notes": "Notas opcionales",
      "dateVisited": "2026-01-15T00:00:00.000Z",
      "createdAt": "2026-02-04T19:45:01.777Z",
      "updatedAt": "2026-02-04T19:45:01.836Z"
    }
  ]
}
```

## Campos generados automáticamente

El repositorio genera automáticamente:
- `id`: UUID único para cada ascensor
- `overallScore`: Promedio de todas las calificaciones
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de última actualización
- `dateVisited`: Fecha actual si no se especifica

## Ventajas de JSON local

✓ Sin dependencias externas
✓ Fácil de compartir (solo copia el archivo)
✓ Legible y editable manualmente
✓ Portable entre sistemas
✓ Perfecto para comenzar y prototipar

## Migración futura

La interfaz `IElevatorRepository` permite cambiar fácilmente a otra base de datos:
- `SqliteElevatorRepository`
- `MongoElevatorRepository`
- `PostgresElevatorRepository`

Solo implementa la interfaz y todo el resto del código seguirá funcionando.
