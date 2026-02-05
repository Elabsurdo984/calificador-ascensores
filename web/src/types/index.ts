// Tipos del dominio (copiados del proyecto principal)

export const ElevatorLocationType = {
  HOTEL: 'hotel',
  RESIDENTIAL: 'residential',
  SHOPPING: 'shopping',
  TOWER: 'tower',
  OFFICE: 'office',
  OTHER: 'other'
} as const;

export type ElevatorLocationType = typeof ElevatorLocationType[keyof typeof ElevatorLocationType];

export interface SpeedMeasurement {
  totalSeconds: number;
  floorsTraversed: number;
  secondsPerFloor: number;
}

export interface ElevatorRating {
  // Rendimiento
  speed: number;           // Calculado automáticamente
  smoothness: number;      // Suavidad del viaje
  precision: number;       // Precisión al detenerse

  // Confort
  noise: number;           // Nivel de ruido (1=ruidoso, 10=silencioso)
  lighting: number;        // Calidad de iluminación
  ventilation: number;     // Ventilación y temperatura
  spaciousness: number;    // Amplitud y espacio

  // Estado y mantenimiento
  cleanliness: number;     // Limpieza general
  maintenance: number;     // Estado de mantenimiento

  // Diseño y tecnología
  design: number;          // Diseño interior
  technology: number;      // Tecnología y sistemas

  // Seguridad y accesibilidad
  safety: number;          // Sensación de seguridad
  accessibility: number;   // Accesibilidad
}

export interface TechnicalInfo {
  brand?: string;         // Marca
  model?: string;         // Modelo
  year?: number;          // Año de instalación
  maxLoad?: number;       // Carga máxima en kg
  maxPersons?: number;    // Capacidad máxima de personas
  floors?: number;        // Número de pisos que sirve
}

export interface Location {
  name: string;
  city?: string;
  country?: string;
  type: ElevatorLocationType;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  technicalInfo?: TechnicalInfo;
}

export interface Elevator {
  id: string;
  location: Location;
  speedMeasurement: SpeedMeasurement;
  rating: ElevatorRating;
  overallScore: number;
  notes?: string;
  dateVisited: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateElevatorDTO {
  location: Location;
  speedMeasurement: SpeedMeasurement;
  rating: ElevatorRating;
  notes?: string;
  dateVisited?: Date;
}
