import { Location, ElevatorRating, SpeedMeasurement } from './types';

/**
 * Entidad principal: Ascensor calificado
 */
export interface Elevator {
  id: string;
  location: Location;
  speedMeasurement: SpeedMeasurement;
  rating: ElevatorRating;
  overallScore: number;      // Promedio de todas las calificaciones
  notes?: string;            // Notas adicionales opcionales
  dateVisited: Date;         // Fecha de la calificación
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear un nuevo ascensor (sin campos generados automáticamente)
 */
export interface CreateElevatorDTO {
  location: Location;
  speedMeasurement: SpeedMeasurement;
  rating: ElevatorRating;
  notes?: string;
  dateVisited?: Date; // Opcional, por defecto será la fecha actual
}

/**
 * DTO para actualizar un ascensor existente
 */
export interface UpdateElevatorDTO {
  location?: Partial<Location>;
  speedMeasurement?: Partial<SpeedMeasurement>;
  rating?: Partial<ElevatorRating>;
  notes?: string;
  dateVisited?: Date;
}
