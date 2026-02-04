# Guía de uso - Calificador de Ascensores

## Inicio rápido

### 1. Backend API (Puerto 3001)

```bash
# Instalar dependencias (solo primera vez)
npm install

# Iniciar API REST
npm run api
```

La API estará en `http://localhost:3001`

### 2. Frontend Web (Puerto 5173)

```bash
# Ir a la carpeta web
cd web

# Instalar dependencias (solo primera vez)
npm install

# Iniciar aplicación web
npm run dev
```

La web estará en `http://localhost:5173`

## Usar la aplicación

### Desde la interfaz web

1. Abre `http://localhost:5173` en tu navegador
2. Haz clic en "+ Nuevo Ascensor"
3. Completa el formulario:
   - **Ubicación**: Nombre, ciudad, país, tipo
   - **Medición**: Cronometra el ascensor y registra tiempo y pisos
   - **Calificaciones**: Usa los sliders para calificar
   - **Notas** (opcional): Observaciones adicionales
4. Haz clic en "Guardar Calificación"
5. Ve la lista de ascensores con filtros y ordenamiento

### Desde la API REST

```bash
# Ver todos los ascensores
curl http://localhost:3001/api/elevators

# Ver top 5 mejor calificados
curl http://localhost:3001/api/elevators/top/5

# Buscar por ciudad
curl http://localhost:3001/api/elevators/city/Paris

# Crear un nuevo ascensor
curl -X POST http://localhost:3001/api/elevators \
  -H "Content-Type: application/json" \
  -d '{
    "location": {
      "name": "Empire State Building",
      "city": "New York",
      "country": "USA",
      "type": "tower"
    },
    "speedMeasurement": {
      "totalSeconds": 37,
      "floorsTraversed": 80,
      "secondsPerFloor": 0.4625
    },
    "rating": {
      "speed": 9.5,
      "smoothness": 8,
      "design": 7,
      "capacity": 6
    },
    "notes": "Muy rápido, vista increíble"
  }'
```

## Scripts disponibles

### Backend

```bash
npm run dev           # Ejemplo sin persistencia
npm run dev:persist   # Ejemplo con persistencia JSON
npm run api           # API REST (producción)
npm run api:dev       # API REST con auto-reload
npm run build         # Compilar TypeScript
```

### Frontend

```bash
cd web
npm run dev           # Servidor de desarrollo
npm run build         # Build para producción
npm run preview       # Preview del build
```

## Arquitectura

```
┌─────────────────┐
│  Frontend Web   │  React + Tailwind CSS
│  localhost:5173 │  (Puerto 5173)
└────────┬────────┘
         │ HTTP
         │ fetch()
         ↓
┌─────────────────┐
│   API REST      │  Express + TypeScript
│  localhost:3001 │  (Puerto 3001)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Repositorio    │  JsonElevatorRepository
│  JSON           │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Archivo JSON   │  ./data/elevators.json
│  (Persistencia) │
└─────────────────┘
```

## Datos

Los datos se guardan en `./data/elevators.json` (ignorado en git).

### Formato

```json
{
  "elevators": [
    {
      "id": "uuid",
      "location": { ... },
      "speedMeasurement": { ... },
      "rating": { ... },
      "overallScore": 8.5,
      "notes": "...",
      "dateVisited": "2026-01-15T00:00:00.000Z",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

## Troubleshooting

### La API no inicia

- Verifica que el puerto 3001 no esté en uso
- Revisa los logs en la terminal

### El frontend muestra error de conexión

- Asegúrate de que la API esté corriendo en `http://localhost:3001`
- Verifica que CORS esté habilitado en la API

### No se guardan los datos

- La API debe estar corriendo para persistir datos
- Verifica que el directorio `./data` tenga permisos de escritura

### Pantalla en blanco en el frontend

- Abre la consola del navegador (F12) para ver errores
- Haz un hard refresh (Ctrl+Shift+R)
- Verifica que las dependencias estén instaladas: `cd web && npm install`

## Próximos pasos

- [ ] Agregar autenticación
- [ ] Implementar gráficos y estadísticas
- [ ] Agregar mapa interactivo
- [ ] Exportar a PDF/CSV
- [ ] Tests automatizados
- [ ] Deploy en producción
