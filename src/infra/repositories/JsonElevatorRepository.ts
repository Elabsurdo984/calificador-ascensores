import { randomUUID } from 'crypto';
import { Elevator, CreateElevatorDTO, UpdateElevatorDTO } from '../../domain';
import { calculateOverallScore } from '../../core';
import { IElevatorRepository } from './IElevatorRepository';
import { readJsonFileOrDefault, writeJsonFile } from '../storage/fileStorage';

/**
 * Estructura del archivo JSON
 */
interface ElevatorsData {
  elevators: Elevator[];
}

/**
 * Repositorio que persiste ascensores en un archivo JSON
 */
export class JsonElevatorRepository implements IElevatorRepository {
  private filePath: string;

  constructor(filePath: string = './data/elevators.json') {
    this.filePath = filePath;
  }

  /**
   * Lee todos los ascensores del archivo
   */
  private async readData(): Promise<ElevatorsData> {
    const data = await readJsonFileOrDefault<ElevatorsData>(this.filePath, {
      elevators: []
    });

    // Convertir strings de fecha a objetos Date
    data.elevators = data.elevators.map(elevator => ({
      ...elevator,
      dateVisited: new Date(elevator.dateVisited),
      createdAt: new Date(elevator.createdAt),
      updatedAt: new Date(elevator.updatedAt)
    }));

    return data;
  }

  /**
   * Escribe todos los ascensores al archivo
   */
  private async writeData(data: ElevatorsData): Promise<void> {
    await writeJsonFile(this.filePath, data);
  }

  /**
   * Guarda un nuevo ascensor
   * Nota: JsonElevatorRepository no maneja usuarios, el userId se ignora
   */
  async save(dto: CreateElevatorDTO, userId: string): Promise<Elevator> {
    const data = await this.readData();

    const now = new Date();
    const newElevator: Elevator = {
      id: randomUUID(),
      location: dto.location,
      speedMeasurement: dto.speedMeasurement,
      rating: dto.rating,
      overallScore: calculateOverallScore(dto.rating),
      notes: dto.notes,
      dateVisited: dto.dateVisited || now,
      createdAt: now,
      updatedAt: now
    };

    data.elevators.push(newElevator);
    await this.writeData(data);

    return newElevator;
  }

  /**
   * Busca un ascensor por ID
   */
  async findById(id: string): Promise<Elevator | null> {
    const data = await this.readData();
    return data.elevators.find(e => e.id === id) || null;
  }

  /**
   * Obtiene todos los ascensores
   */
  async findAll(): Promise<Elevator[]> {
    const data = await this.readData();
    return data.elevators;
  }

  /**
   * Actualiza un ascensor existente
   */
  async update(id: string, dto: UpdateElevatorDTO): Promise<Elevator | null> {
    const data = await this.readData();
    const index = data.elevators.findIndex(e => e.id === id);

    if (index === -1) {
      return null;
    }

    const existing = data.elevators[index];

    // Merge de los datos
    const updated: Elevator = {
      ...existing,
      location: dto.location ? { ...existing.location, ...dto.location } : existing.location,
      speedMeasurement: dto.speedMeasurement
        ? { ...existing.speedMeasurement, ...dto.speedMeasurement }
        : existing.speedMeasurement,
      rating: dto.rating ? { ...existing.rating, ...dto.rating } : existing.rating,
      notes: dto.notes !== undefined ? dto.notes : existing.notes,
      dateVisited: dto.dateVisited || existing.dateVisited,
      updatedAt: new Date()
    };

    // Recalcular score si cambió el rating
    if (dto.rating) {
      updated.overallScore = calculateOverallScore(updated.rating);
    }

    data.elevators[index] = updated;
    await this.writeData(data);

    return updated;
  }

  /**
   * Elimina un ascensor por ID
   */
  async delete(id: string): Promise<boolean> {
    const data = await this.readData();
    const initialLength = data.elevators.length;

    data.elevators = data.elevators.filter(e => e.id !== id);

    if (data.elevators.length === initialLength) {
      return false; // No se encontró el ascensor
    }

    await this.writeData(data);
    return true;
  }

  /**
   * Busca ascensores por ciudad
   */
  async findByCity(city: string): Promise<Elevator[]> {
    const data = await this.readData();
    return data.elevators.filter(
      e => e.location.city?.toLowerCase() === city.toLowerCase()
    );
  }

  /**
   * Busca ascensores por tipo de ubicación
   */
  async findByType(type: string): Promise<Elevator[]> {
    const data = await this.readData();
    return data.elevators.filter(
      e => e.location.type.toLowerCase() === type.toLowerCase()
    );
  }

  /**
   * Obtiene el top N de ascensores mejor calificados
   */
  async findTopRated(limit: number): Promise<Elevator[]> {
    const data = await this.readData();
    return data.elevators
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, limit);
  }

  /**
   * Busca ascensores por usuario
   * Nota: JsonElevatorRepository no maneja usuarios, retorna todos los ascensores
   */
  async findByUserId(userId: string): Promise<Elevator[]> {
    return this.findAll();
  }

  /**
   * Verifica si un usuario es el dueño de un ascensor
   * Nota: JsonElevatorRepository no maneja usuarios, siempre retorna true
   */
  async isOwner(elevatorId: string, userId: string): Promise<boolean> {
    const elevator = await this.findById(elevatorId);
    return elevator !== null;
  }
}
