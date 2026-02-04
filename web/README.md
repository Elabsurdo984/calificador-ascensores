# Calificador de Ascensores - Web UI

Aplicación web React + TypeScript + Tailwind CSS para calificar y comparar ascensores.

## Tecnologías

- **React 18** - Librería de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool rápido
- **Tailwind CSS** - Framework de estilos utility-first

## Instalación

```bash
cd web
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/` (o el siguiente puerto disponible)

## Build para producción

```bash
npm run build
npm run preview  # Ver preview del build
```

## Características

### Calificar ascensores
- Formulario interactivo con validaciones
- Cálculo automático de velocidad (segundos/piso)
- Sliders para calificaciones (suavidad, diseño, capacidad)
- Score general automático

### Ver y gestionar
- Lista de todos los ascensores calificados
- Tarjetas con información detallada
- Filtros: Todos / Top 10
- Ordenar por: Score / Fecha
- Eliminar ascensores

### Almacenamiento
- Datos guardados en `localStorage` del navegador
- Persistencia automática
- Sin necesidad de backend (por ahora)

## Estructura

```
web/
├── src/
│   ├── components/
│   │   ├── ElevatorForm.tsx    # Formulario de calificación
│   │   ├── ElevatorList.tsx    # Lista de ascensores
│   │   └── ElevatorCard.tsx    # Tarjeta individual
│   ├── services/
│   │   └── elevatorService.ts  # Lógica de negocio y storage
│   ├── types/
│   │   └── index.ts            # Tipos TypeScript
│   ├── App.tsx                 # Componente principal
│   └── main.tsx                # Entry point
├── index.html
└── package.json
```

## Próximas mejoras

- [ ] Conectar con API REST (en lugar de localStorage)
- [ ] Gráficos y estadísticas
- [ ] Búsqueda y filtros avanzados
- [ ] Compartir calificaciones
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Mapa con ubicaciones
