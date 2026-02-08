import { PrismaElevatorRepository } from './infra/repositories/PrismaElevatorRepository';
import { ElevatorLocationType } from './domain/types';

async function main() {
  console.log('Probando conexión a base de datos...');
  const repo = new PrismaElevatorRepository();

  try {
    const newElevator = await repo.save({
      location: {
        name: "Test Elevator Full",
        city: "Test City",
        country: "Test Country",
        type: ElevatorLocationType.OFFICE,
        technicalInfo: {
            brand: "Otis",
            floors: 20
        }
      },
      speedMeasurement: {
        totalSeconds: 10,
        floorsTraversed: 10,
        secondsPerFloor: 1
      },
      rating: {
        speed: 10,
        smoothness: 9,
        precision: 8,
        noise: 9,
        lighting: 8,
        ventilation: 7,
        spaciousness: 8,
        cleanliness: 9,
        maintenance: 10,
        design: 8,
        technology: 9,
        safety: 10,
        accessibility: 9
      },
      notes: "Test note with full ratings"
    });
    console.log('✅ Ascensor guardado con éxito:', newElevator);
  } catch (error) {
    console.error('❌ Error al guardar:', error);
  }
}

main();