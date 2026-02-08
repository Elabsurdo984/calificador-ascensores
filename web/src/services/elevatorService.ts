import type { Elevator, CreateElevatorDTO } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Servicio para comunicarse con la API REST del backend
 */
class ElevatorService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers as Record<string, string>,
    };

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    // Para respuestas 204 (No Content)
    if (response.status === 204) {
      return null as T;
    }

    const data = await response.json();

    // Convertir strings de fecha a objetos Date
    if (Array.isArray(data)) {
      return data.map(this.parseDates) as T;
    } else if (data && typeof data === 'object') {
      return this.parseDates(data) as T;
    }

    return data;
  }

  private parseDates(item: any): any {
    if (!item) return item;
    return {
      ...item,
      dateVisited: item.dateVisited ? new Date(item.dateVisited) : undefined,
      createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
    };
  }

  async getAll(): Promise<Elevator[]> {
    return this.request<Elevator[]>('/elevators');
  }

  async getMyElevators(): Promise<Elevator[]> {
    return this.request<Elevator[]>('/elevators/my');
  }

  async getById(id: string): Promise<Elevator | null> {
    try {
      return await this.request<Elevator>(`/elevators/${id}`);
    } catch (error) {
      return null;
    }
  }

  async create(dto: CreateElevatorDTO): Promise<Elevator> {
    return this.request<Elevator>('/elevators', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.request<void>(`/elevators/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findByCity(city: string): Promise<Elevator[]> {
    return this.request<Elevator[]>(`/elevators/city/${encodeURIComponent(city)}`);
  }

  async getTopRated(limit: number = 10): Promise<Elevator[]> {
    return this.request<Elevator[]>(`/elevators/top/${limit}`);
  }

  // Helpers (mantienen la lógica del lado del cliente para el formulario)
  calculateSecondsPerFloor(totalSeconds: number, floorsTraversed: number): number {
    if (floorsTraversed === 0) throw new Error('floorsTraversed cannot be zero');
    return totalSeconds / floorsTraversed;
  }

  calculateSpeedScore(secondsPerFloor: number): number {
    const score = 10 / secondsPerFloor;
    return Math.max(1, Math.min(10, score));
  }
}

export const elevatorService = new ElevatorService();
