import { ElevatorRating, SpeedMeasurement } from '../domain/types';

/**
 * Calcula el score de velocidad basado en segundos por piso
 * 10 puntos = 1 segundo/piso
 * Escala lineal: mientras más rápido, mejor score
 */
export function calculateSpeedScore(secondsPerFloor: number): number {
  // 1 s/piso = 10 puntos
  // 2 s/piso = 5 puntos
  // 3+ s/piso = escala descendente
  const score = 10 / secondsPerFloor;

  // Limitar entre 1 y 10
  return Math.max(1, Math.min(10, score));
}

/**
 * Calcula los segundos por piso a partir de una medición
 */
export function calculateSecondsPerFloor(measurement: Omit<SpeedMeasurement, 'secondsPerFloor'>): number {
  if (measurement.floorsTraversed === 0) {
    throw new Error('floorsTraversed cannot be zero');
  }
  return measurement.totalSeconds / measurement.floorsTraversed;
}

/**
 * Calcula el score general (promedio de todas las calificaciones)
 */
export function calculateOverallScore(rating: ElevatorRating): number {
  const { speed, smoothness, design, capacity } = rating;
  const sum = speed + smoothness + design + capacity;
  const average = sum / 4;

  // Redondear a 2 decimales
  return Math.round(average * 100) / 100;
}

/**
 * Valida que una calificación esté en el rango 1-10
 */
export function validateRating(value: number, fieldName: string): void {
  if (value < 1 || value > 10) {
    throw new Error(`${fieldName} must be between 1 and 10`);
  }
}

/**
 * Valida todas las calificaciones de un ascensor
 */
export function validateElevatorRating(rating: ElevatorRating): void {
  validateRating(rating.speed, 'speed');
  validateRating(rating.smoothness, 'smoothness');
  validateRating(rating.design, 'design');
  validateRating(rating.capacity, 'capacity');
}

/**
 * Valida una medición de velocidad
 */
export function validateSpeedMeasurement(measurement: SpeedMeasurement): void {
  if (measurement.totalSeconds <= 0) {
    throw new Error('totalSeconds must be greater than 0');
  }
  if (measurement.floorsTraversed <= 0) {
    throw new Error('floorsTraversed must be greater than 0');
  }
  if (measurement.secondsPerFloor <= 0) {
    throw new Error('secondsPerFloor must be greater than 0');
  }
}
