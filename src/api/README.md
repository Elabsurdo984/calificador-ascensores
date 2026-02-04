# API REST - Calificador de Ascensores

API RESTful construida con Express + TypeScript para gestionar calificaciones de ascensores.

## Iniciar la API

```bash
# Modo desarrollo
npm run api

# Modo desarrollo con auto-reload
npm run api:dev
```

La API estará disponible en `http://localhost:3001`

## Endpoints

### Health Check

```
GET /api/health
```

Verifica que la API esté funcionando.

**Respuesta:**
```json
{
  "status": "ok",
  "message": "Calificador de Ascensores API"
}
```

### Obtener todos los ascensores

```
GET /api/elevators
```

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "location": {
      "name": "Torre Eiffel",
      "city": "París",
      "country": "Francia",
      "type": "tower"
    },
    "speedMeasurement": {
      "totalSeconds": 60,
      "floorsTraversed": 50,
      "secondsPerFloor": 1.2
    },
    "rating": {
      "speed": 8.33,
      "smoothness": 9,
      "design": 10,
      "capacity": 7
    },
    "overallScore": 8.58,
    "notes": "Vista espectacular",
    "dateVisited": "2026-01-20T00:00:00.000Z",
    "createdAt": "2026-02-04T19:45:01.784Z",
    "updatedAt": "2026-02-04T19:45:01.784Z"
  }
]
```

### Obtener ascensor por ID

```
GET /api/elevators/:id
```

**Parámetros:**
- `id` - UUID del ascensor

**Respuestas:**
- `200` - Ascensor encontrado
- `404` - Ascensor no encontrado

### Buscar por ciudad

```
GET /api/elevators/city/:city
```

**Parámetros:**
- `city` - Nombre de la ciudad (ej: "París", "Buenos Aires")

### Buscar por tipo

```
GET /api/elevators/type/:type
```

**Parámetros:**
- `type` - Tipo de edificio: `hotel`, `residential`, `shopping`, `tower`, `office`, `other`

### Top N ascensores

```
GET /api/elevators/top/:limit
```

**Parámetros:**
- `limit` - Cantidad de ascensores a devolver (ej: 10)

### Crear ascensor

```
POST /api/elevators
Content-Type: application/json
```

**Body:**
```json
{
  "location": {
    "name": "Hotel Marriott Plaza",
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
  "notes": "Ascensor panorámico",
  "dateVisited": "2026-01-15T00:00:00.000Z"
}
```

**Respuestas:**
- `201` - Ascensor creado exitosamente
- `400` - Datos inválidos o incompletos

### Actualizar ascensor

```
PUT /api/elevators/:id
Content-Type: application/json
```

**Body:** (campos parciales)
```json
{
  "notes": "Nuevas notas actualizadas",
  "rating": {
    "smoothness": 10
  }
}
```

**Respuestas:**
- `200` - Ascensor actualizado
- `404` - Ascensor no encontrado
- `400` - Datos inválidos

### Eliminar ascensor

```
DELETE /api/elevators/:id
```

**Respuestas:**
- `204` - Ascensor eliminado exitosamente
- `404` - Ascensor no encontrado

## CORS

La API tiene CORS habilitado para permitir peticiones desde cualquier origen (útil para desarrollo).

## Persistencia

Los datos se guardan en `./data/elevators.json` usando el repositorio JSON del backend.

## Manejo de errores

Todos los errores devuelven un objeto JSON con el siguiente formato:

```json
{
  "error": "Descripción del error"
}
```

Códigos de estado comunes:
- `200` - OK
- `201` - Creado
- `204` - Sin contenido (éxito sin respuesta)
- `400` - Petición inválida
- `404` - No encontrado
- `500` - Error del servidor

## Ejemplos con curl

```bash
# Health check
curl http://localhost:3001/api/health

# Obtener todos
curl http://localhost:3001/api/elevators

# Crear ascensor
curl -X POST http://localhost:3001/api/elevators \
  -H "Content-Type: application/json" \
  -d '{
    "location": {"name": "Test", "type": "hotel"},
    "speedMeasurement": {"totalSeconds": 10, "floorsTraversed": 5, "secondsPerFloor": 2},
    "rating": {"speed": 5, "smoothness": 7, "design": 6, "capacity": 8}
  }'

# Obtener top 5
curl http://localhost:3001/api/elevators/top/5

# Eliminar
curl -X DELETE http://localhost:3001/api/elevators/[UUID]
```
