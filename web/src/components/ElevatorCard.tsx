import type { Elevator } from '../types';

interface ElevatorCardProps {
  elevator: Elevator;
  onDelete: (id: string) => void;
}

export function ElevatorCard({ elevator, onDelete }: ElevatorCardProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">{elevator.location.name}</h3>
          <p className="text-sm text-gray-600">
            {elevator.location.city && `${elevator.location.city}, `}
            {elevator.location.country}
          </p>
          <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            {elevator.location.type}
          </span>
        </div>

        <div className={`text-center px-4 py-2 rounded-lg ${getScoreBgColor(elevator.overallScore)}`}>
          <div className={`text-3xl font-bold ${getScoreColor(elevator.overallScore)}`}>
            {elevator.overallScore.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600">Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Velocidad</p>
          <div className="flex items-baseline">
            <span className="text-lg font-semibold text-gray-800">
              {elevator.speedMeasurement.secondsPerFloor.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500 ml-1">s/piso</span>
          </div>
          <p className="text-xs text-gray-500">
            {elevator.speedMeasurement.floorsTraversed} pisos en {elevator.speedMeasurement.totalSeconds}s
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-gray-600">Suavidad</p>
            <p className="font-semibold text-gray-800">{elevator.rating.smoothness}/10</p>
          </div>
          <div>
            <p className="text-gray-600">Diseño</p>
            <p className="font-semibold text-gray-800">{elevator.rating.design}/10</p>
          </div>
          <div>
            <p className="text-gray-600">Velocidad</p>
            <p className="font-semibold text-gray-800">{elevator.rating.speed.toFixed(1)}/10</p>
          </div>
          <div>
            <p className="text-gray-600">Capacidad</p>
            <p className="font-semibold text-gray-800">{elevator.rating.capacity}/10</p>
          </div>
        </div>
      </div>

      {elevator.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-700 italic">&quot;{elevator.notes}&quot;</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <p className="text-xs text-gray-500">
          Visitado: {new Date(elevator.dateVisited).toLocaleDateString()}
        </p>
        <button
          onClick={() => onDelete(elevator.id)}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
