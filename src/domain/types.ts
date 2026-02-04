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
  speed: number;      // 10 = 1s/piso, escala según velocidad
  smoothness: number; // Suavidad del viaje (1-10)
  design: number;     // Diseño interior (1-10)
  capacity: number;   // Capacidad (1-10)
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
}
