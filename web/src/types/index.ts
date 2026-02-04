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
  speed: number;
  smoothness: number;
  design: number;
  capacity: number;
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
