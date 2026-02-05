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
  const {
    speed, smoothness, precision,
    noise, lighting, ventilation, spaciousness,
    cleanliness, maintenance,
    design, technology,
    safety, accessibility
  } = rating;

  const sum = speed + smoothness + precision + noise + lighting + ventilation +
              spaciousness + cleanliness + maintenance + design + technology +
              safety + accessibility;
  const average = sum / 13;

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
  // Rendimiento
  validateRating(rating.speed, 'speed');
  validateRating(rating.smoothness, 'smoothness');
  validateRating(rating.precision, 'precision');

  // Confort
  validateRating(rating.noise, 'noise');
  validateRating(rating.lighting, 'lighting');
  validateRating(rating.ventilation, 'ventilation');
  validateRating(rating.spaciousness, 'spaciousness');

  // Estado y mantenimiento
  validateRating(rating.cleanliness, 'cleanliness');
  validateRating(rating.maintenance, 'maintenance');

  // Diseño y tecnología
  validateRating(rating.design, 'design');
  validateRating(rating.technology, 'technology');

  // Seguridad y accesibilidad
  validateRating(rating.safety, 'safety');
  validateRating(rating.accessibility, 'accessibility');
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
