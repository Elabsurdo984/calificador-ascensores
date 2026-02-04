import { useState, useEffect } from 'react';
import type { Elevator } from '../types';
import { elevatorService } from '../services/elevatorService';
import { ElevatorCard } from './ElevatorCard';

interface ElevatorListProps {
  refresh: number;
}

export function ElevatorList({ refresh }: ElevatorListProps) {
  const [elevators, setElevators] = useState<Elevator[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'top'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('score');

  useEffect(() => {
    loadElevators();
  }, [refresh, filter, sortBy]);

  const loadElevators = async () => {
    setLoading(true);
    try {
      let data: Elevator[];

      if (filter === 'top') {
        data = await elevatorService.getTopRated(10);
      } else {
        data = await elevatorService.getAll();
      }

      // Ordenar
      if (sortBy === 'score') {
        data.sort((a, b) => b.overallScore - a.overallScore);
      } else {
        data.sort((a, b) => new Date(b.dateVisited).getTime() - new Date(a.dateVisited).getTime());
      }

      setElevators(data);
    } catch (error) {
      console.error('Error loading elevators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este ascensor?')) return;

    try {
      await elevatorService.delete(id);
      loadElevators();
    } catch (error) {
      console.error('Error deleting elevator:', error);
      alert('Error al eliminar el ascensor');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Cargando ascensores...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {filter === 'top' ? 'Top 10 Ascensores' : 'Todos los Ascensores'}
          <span className="ml-2 text-sm font-normal text-gray-600">
            ({elevators.length})
          </span>
        </h2>

        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'top')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">Todos</option>
            <option value="top">Top 10</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="score">Por Score</option>
            <option value="date">Por Fecha</option>
          </select>
        </div>
      </div>

      {elevators.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay ascensores</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza calificando tu primer ascensor.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elevators.map((elevator) => (
            <ElevatorCard
              key={elevator.id}
              elevator={elevator}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
