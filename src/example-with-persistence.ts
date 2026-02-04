import { CreateElevatorDTO, ElevatorLocationType } from './domain';
import {
  calculateSecondsPerFloor,
  calculateSpeedScore
} from './core';
import { JsonElevatorRepository } from './infra';

/**
 * Ejemplo de uso del repositorio para persistir ascensores
 */
async function main() {
  // Crear el repositorio (guardará en ./data/elevators.json)
  const repository = new JsonElevatorRepository();

  console.log('=== CREANDO ASCENSORES ===\n');

  // Ascensor 1: Hotel Marriott
  const elevator1: CreateElevatorDTO = {
    location: {
      name: 'Hotel Marriott Plaza',
      city: 'Buenos Aires',
      country: 'Argentina',
      type: ElevatorLocationType.HOTEL
    },
    speedMeasurement: {
      totalSeconds: 15,
      floorsTraversed: 5,
      secondsPerFloor: calculateSecondsPerFloor({ totalSeconds: 15, floorsTraversed: 5 })
    },
    rating: {
      speed: calculateSpeedScore(3),
      smoothness: 8,
      design: 7,
      capacity: 9
    },
    notes: 'Ascensor panorámico con vista al obelisco',
    dateVisited: new Date('2026-01-15')
  };

  const saved1 = await repository.save(elevator1);
  console.log('✓ Guardado:', saved1.location.name, `(ID: ${saved1.id})`);
  console.log('  Score general:', saved1.overallScore);

  // Ascensor 2: Torre Eiffel
  const elevator2: CreateElevatorDTO = {
    location: {
      name: 'Torre Eiffel',
      city: 'París',
      country: 'Francia',
      type: ElevatorLocationType.TOWER
    },
    speedMeasurement: {
      totalSeconds: 60,
      floorsTraversed: 50,
      secondsPerFloor: calculateSecondsPerFloor({ totalSeconds: 60, floorsTraversed: 50 })
    },
    rating: {
      speed: calculateSpeedScore(1.2),
      smoothness: 9,
      design: 10,
      capacity: 7
    },
    notes: 'Ascensor histórico, vista espectacular',
    dateVisited: new Date('2026-01-20')
  };

  const saved2 = await repository.save(elevator2);
  console.log('✓ Guardado:', saved2.location.name, `(ID: ${saved2.id})`);
  console.log('  Score general:', saved2.overallScore);

  // Ascensor 3: Mall de Palermo
  const elevator3: CreateElevatorDTO = {
    location: {
      name: 'Alto Palermo Shopping',
      city: 'Buenos Aires',
      country: 'Argentina',
      type: ElevatorLocationType.SHOPPING
    },
    speedMeasurement: {
      totalSeconds: 12,
      floorsTraversed: 4,
      secondsPerFloor: calculateSecondsPerFloor({ totalSeconds: 12, floorsTraversed: 4 })
    },
    rating: {
      speed: calculateSpeedScore(3),
      smoothness: 6,
      design: 5,
      capacity: 8
    },
    notes: 'Ascensor comercial estándar'
  };

  const saved3 = await repository.save(elevator3);
  console.log('✓ Guardado:', saved3.location.name, `(ID: ${saved3.id})`);
  console.log('  Score general:', saved3.overallScore);

  console.log('\n=== CONSULTANDO DATOS ===\n');

  // Obtener todos
  const allElevators = await repository.findAll();
  console.log(`Total de ascensores: ${allElevators.length}`);

  // Buscar por ciudad
  const buenosAiresElevators = await repository.findByCity('Buenos Aires');
  console.log(`\nAscensores en Buenos Aires: ${buenosAiresElevators.length}`);
  buenosAiresElevators.forEach(e => {
    console.log(`  - ${e.location.name} (Score: ${e.overallScore})`);
  });

  // Top 2 mejor calificados
  const topRated = await repository.findTopRated(2);
  console.log('\nTop 2 mejor calificados:');
  topRated.forEach((e, i) => {
    console.log(`  ${i + 1}. ${e.location.name} - Score: ${e.overallScore}`);
  });

  console.log('\n=== ACTUALIZANDO ===\n');

  // Actualizar notas del primer ascensor
  const updated = await repository.update(saved1.id, {
    notes: 'Ascensor panorámico con vista al obelisco. Muy recomendado!'
  });
  console.log('✓ Actualizado:', updated?.location.name);
  console.log('  Nuevas notas:', updated?.notes);

  console.log('\n=== BUSCAR POR ID ===\n');

  const found = await repository.findById(saved2.id);
  if (found) {
    console.log('Ascensor encontrado:', found.location.name);
    console.log('Velocidad:', found.speedMeasurement.secondsPerFloor, 's/piso');
    console.log('Score general:', found.overallScore);
  }

  console.log('\n✓ Todos los datos guardados en ./data/elevators.json');
}

// Ejecutar ejemplo
main().catch(console.error);
