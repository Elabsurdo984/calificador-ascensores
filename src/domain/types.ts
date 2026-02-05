/**
 * Tipos de lugares donde se encuentran los ascensores
 */
export enum ElevatorLocationType {
  HOTEL = 'hotel',
  RESIDENTIAL = 'residential',
  SHOPPING = 'shopping',
  TOWER = 'tower',
  OFFICE = 'office',
  OTHER = 'other'
}

/**
 * Medición de velocidad con cronómetro
 */
export interface SpeedMeasurement {
  totalSeconds: number;    // Tiempo total medido con cronómetro
  floorsTraversed: number; // Cantidad de pisos recorridos
  secondsPerFloor: number; // Calculado: totalSeconds / floorsTraversed
}

/**
 * Calificaciones del ascensor (escala 1-10)
 */
export interface ElevatorRating {
  // Rendimiento
  speed: number;           // 10 = 1s/piso, escala según velocidad (calculado automáticamente)
  smoothness: number;      // Suavidad del viaje, sin sacudidas (1-10)
  precision: number;       // Precisión al detenerse en el piso (1-10)

  // Confort
  noise: number;           // Nivel de ruido (1=muy ruidoso, 10=silencioso)
  lighting: number;        // Calidad de iluminación (1-10)
  ventilation: number;     // Ventilación y temperatura (1-10)
  spaciousness: number;    // Amplitud y sensación de espacio (1-10)

  // Estado y mantenimiento
  cleanliness: number;     // Limpieza general (1-10)
  maintenance: number;     // Estado de mantenimiento (1-10)

  // Diseño y tecnología
  design: number;          // Diseño interior y estética (1-10)
  technology: number;      // Tecnología (pantallas, botones, indicadores) (1-10)

  // Seguridad y accesibilidad
  safety: number;          // Sensación de seguridad (1-10)
  accessibility: number;   // Accesibilidad para personas con movilidad reducida (1-10)
}

/**
 * Información técnica del ascensor
 */
export interface TechnicalInfo {
  brand?: string;         // Marca (ej: Otis, Schindler, ThyssenKrupp)
  model?: string;         // Modelo
  year?: number;          // Año de instalación/fabricación
  maxLoad?: number;       // Carga máxima en kg
  maxPersons?: number;    // Capacidad máxima de personas
  floors?: number;        // Número de pisos que sirve
}

/**
 * Ubicación del ascensor
 */
export interface Location {
  name: string;           // Nombre del lugar (ej: "Hotel Marriott", "Torre Eiffel")
  city?: string;          // Ciudad
  country?: string;       // País
  type: ElevatorLocationType;
  address?: string;       // Dirección opcional
  coordinates?: {         // Para futuro mapa
    lat: number;
    lng: number;
  };
  technicalInfo?: TechnicalInfo; // Información técnica del ascensor
}
