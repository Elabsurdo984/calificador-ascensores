import { CreateElevatorDTO, ElevatorLocationType } from './domain';
import {
  calculateSecondsPerFloor,
  calculateSpeedScore,
  calculateOverallScore
} from './core';

/**
 * Ejemplo de cómo se usaría el modelo para calificar un ascensor
 */

// Simulas que cronometraste un ascensor: 15 segundos para subir 5 pisos
const totalSeconds = 15;
const floorsTraversed = 5;

// Calculas segundos por piso
const secondsPerFloor = calculateSecondsPerFloor({ totalSeconds, floorsTraversed });
console.log(`Velocidad: ${secondsPerFloor} segundos/piso`); // 3 s/piso

// Calculas el score de velocidad automáticamente
const speedScore = calculateSpeedScore(secondsPerFloor);
console.log(`Score de velocidad: ${speedScore}/10`); // ~3.33/10

// Creas la calificación completa
const newElevator: CreateElevatorDTO = {
  location: {
    name: 'Hotel Marriott Plaza',
    city: 'Buenos Aires',
    country: 'Argentina',
    type: ElevatorLocationType.HOTEL
  },
  speedMeasurement: {
    totalSeconds,
    floorsTraversed,
    secondsPerFloor
  },
  rating: {
    speed: speedScore,
    smoothness: 8,  // Lo calificas manualmente
    design: 7,      // Lo calificas manualmente
    capacity: 9     // Lo calificas manualmente
  },
  notes: 'Ascensor panorámico con vista al obelisco',
  dateVisited: new Date('2026-01-15')
};

// Calculas el score general
const overallScore = calculateOverallScore(newElevator.rating);
console.log(`Score general: ${overallScore}/10`); // Promedio de todas las calificaciones

console.log('\nElevador completo:', {
  ...newElevator,
  overallScore
});
