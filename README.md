# 🏢 Calificador de Ascensores

Sistema completo para calificar, guardar y comparar ascensores de todo el mundo.

## 🎯 Características

- ✅ Calificar ascensores por velocidad, suavidad, diseño y capacidad
- ✅ Cálculo automático de scores basado en mediciones
- ✅ Persistencia de datos en JSON local
- ✅ Interfaz web moderna con React + Tailwind CSS
- ✅ Ranking de mejores ascensores
- ✅ Filtros y búsquedas

## 🏗️ Estructura del proyecto

```
calificador-ascensores/
├── src/                    # Backend TypeScript
│   ├── domain/            # Modelos y tipos
│   ├── core/              # Lógica de negocio
│   ├── infra/             # Persistencia (JSON)
│   └── ui/                # (Futuro: CLI)
├── web/                   # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Servicios
│   │   └── types/         # Tipos TypeScript
│   └── package.json
├── data/                  # Datos persistidos (gitignored)
└── package.json
```

## 🚀 Inicio rápido

### Backend (Node.js + TypeScript)

```bash
# Instalar dependencias
npm install

# Ejecutar ejemplo sin persistencia
npm run dev

# Ejecutar ejemplo con persistencia
npm run dev:persist
```

### Frontend (React Web App)

```bash
# Ir a la carpeta web
cd web

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 📊 Cómo funciona

### 1. Medición de velocidad

Cronometra un ascensor y registra:
- Tiempo total en segundos
- Cantidad de pisos recorridos
- El sistema calcula automáticamente: segundos/piso

### 2. Calificaciones (1-10)

- **Velocidad**: Calculada automáticamente (10pts = 1s/piso)
- **Suavidad**: Qué tan suave es el viaje
- **Diseño**: Estética interior del ascensor
- **Capacidad**: Espacio y capacidad de personas

### 3. Score general

Promedio de las 4 calificaciones, calculado automáticamente.

## 🔧 Tecnologías

### Backend
- TypeScript 5.3
- Node.js
- Arquitectura hexagonal (dominio, core, infra)
- Persistencia: JSON local

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- localStorage para datos

## 📁 Persistencia

Los datos se guardan en:
- **Backend**: `./data/elevators.json`
- **Frontend**: localStorage del navegador

Ambos están en `.gitignore` para no versionar datos personales.

## 🎨 UI Web

La interfaz web incluye:

1. **Formulario de calificación**
   - Campos de ubicación (nombre, ciudad, país, tipo)
   - Medición de velocidad
   - Sliders para calificaciones
   - Notas opcionales

2. **Lista de ascensores**
   - Vista en tarjetas (cards)
   - Filtros: Todos / Top 10
   - Ordenar: Por score / Por fecha
   - Eliminar ascensores

3. **Visualización**
   - Scores con colores (verde/amarillo/rojo)
   - Detalles de mediciones
   - Fechas de visita

## 📝 Ejemplo de uso

```typescript
import { JsonElevatorRepository } from './infra';
import { ElevatorLocationType } from './domain';

const repository = new JsonElevatorRepository();

// Crear calificación
const elevator = await repository.save({
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
    speed: 8.33,
    smoothness: 9,
    design: 10,
    capacity: 7
  },
  notes: 'Vista espectacular'
});

// Obtener top 10
const topRated = await repository.findTopRated(10);
```

## 🔜 Próximas mejoras

- [ ] API REST para conectar backend y frontend
- [ ] Tests unitarios
- [ ] Gráficos y estadísticas
- [ ] Mapa interactivo con ubicaciones
- [ ] Exportar datos (CSV, PDF)
- [ ] Compartir calificaciones
- [ ] CLI interactiva
- [ ] PWA (offline support)

## 📄 Licencia

MIT
