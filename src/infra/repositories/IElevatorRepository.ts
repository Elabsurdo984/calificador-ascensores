import { Elevator, CreateElevatorDTO, UpdateElevatorDTO } from '../../domain';

/**
 * Contrato del repositorio de ascensores
 */
export interface IElevatorRepository {
  /**
   * Guarda un nuevo ascensor
   */
  save(dto: CreateElevatorDTO): Promise<Elevator>;

  /**
   * Busca un ascensor por ID
   */
  findById(id: string): Promise<Elevator | null>;

  /**
   * Obtiene todos los ascensores
   */
  findAll(): Promise<Elevator[]>;

  /**
   * Actualiza un ascensor existente
   */
  update(id: string, dto: UpdateElevatorDTO): Promise<Elevator | null>;

  /**
   * Elimina un ascensor por ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Busca ascensores por ciudad
   */
  findByCity(city: string): Promise<Elevator[]>;

  /**
   * Busca ascensores por tipo de ubicación
   */
  findByType(type: string): Promise<Elevator[]>;

  /**
   * Obtiene el top N de ascensores mejor calificados
   */
  findTopRated(limit: number): Promise<Elevator[]>;
}
