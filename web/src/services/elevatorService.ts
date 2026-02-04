import type { Elevator, CreateElevatorDTO } from '../types';

/**
 * Servicio para comunicarse con el backend
 * Por ahora usaremos localStorage como mock hasta tener una API
 */
class ElevatorService {
  private readonly STORAGE_KEY = 'elevators';

  private loadFromStorage(): Elevator[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];

    const elevators = JSON.parse(data);
    // Convertir strings de fecha a objetos Date
    return elevators.map((e: any) => ({
      ...e,
      dateVisited: new Date(e.dateVisited),
      createdAt: new Date(e.createdAt),
      updatedAt: new Date(e.updatedAt)
    }));
  }

  private saveToStorage(elevators: Elevator[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(elevators));
  }

  async getAll(): Promise<Elevator[]> {
    return this.loadFromStorage();
  }

  async getById(id: string): Promise<Elevator | null> {
    const elevators = this.loadFromStorage();
    return elevators.find(e => e.id === id) || null;
  }

  async create(dto: CreateElevatorDTO): Promise<Elevator> {
    const elevators = this.loadFromStorage();

    const now = new Date();
    const newElevator: Elevator = {
      id: crypto.randomUUID(),
      location: dto.location,
      speedMeasurement: dto.speedMeasurement,
      rating: dto.rating,
      overallScore: this.calculateOverallScore(dto.rating),
      notes: dto.notes,
      dateVisited: dto.dateVisited || now,
      createdAt: now,
      updatedAt: now
    };

    elevators.push(newElevator);
    this.saveToStorage(elevators);

    return newElevator;
  }

  async delete(id: string): Promise<boolean> {
    const elevators = this.loadFromStorage();
    const filtered = elevators.filter(e => e.id !== id);

    if (filtered.length === elevators.length) {
      return false;
    }

    this.saveToStorage(filtered);
    return true;
  }

  async findByCity(city: string): Promise<Elevator[]> {
    const elevators = this.loadFromStorage();
    return elevators.filter(
      e => e.location.city?.toLowerCase() === city.toLowerCase()
    );
  }

  async getTopRated(limit: number = 10): Promise<Elevator[]> {
    const elevators = this.loadFromStorage();
    return elevators
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, limit);
  }

  // Helpers
  calculateSecondsPerFloor(totalSeconds: number, floorsTraversed: number): number {
    if (floorsTraversed === 0) throw new Error('floorsTraversed cannot be zero');
    return totalSeconds / floorsTraversed;
  }

  calculateSpeedScore(secondsPerFloor: number): number {
    const score = 10 / secondsPerFloor;
    return Math.max(1, Math.min(10, score));
  }

  private calculateOverallScore(rating: any): number {
    const { speed, smoothness, design, capacity } = rating;
    const sum = speed + smoothness + design + capacity;
    const average = sum / 4;
    return Math.round(average * 100) / 100;
  }
}

export const elevatorService = new ElevatorService();
