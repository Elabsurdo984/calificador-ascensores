import { useState } from 'react';
import type { Elevator } from '../types';

interface ElevatorCardProps {
  elevator: Elevator;
  onDelete: (id: string) => void;
}

export function ElevatorCard({ elevator, onDelete }: ElevatorCardProps) {
  const [showDetails, setShowDetails] = useState(false);

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

  const getRatingColor = (rating: number): string => {
    if (rating >= 8) return 'text-green-600 bg-green-50';
    if (rating >= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">{elevator.location.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {elevator.location.city && `${elevator.location.city}, `}
              {elevator.location.country}
            </p>
            <div className="flex gap-2 mt-2">
              <span className="inline-block px-3 py-1 bg-white text-gray-700 text-xs font-medium rounded-full shadow-sm">
                {elevator.location.type}
              </span>
              {elevator.location.technicalInfo?.brand && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {elevator.location.technicalInfo.brand}
                </span>
              )}
            </div>
          </div>

          <div className={`text-center px-4 py-2 rounded-lg ${getScoreBgColor(elevator.overallScore)} shadow-md`}>
            <div className={`text-3xl font-bold ${getScoreColor(elevator.overallScore)}`}>
              {elevator.overallScore.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600 font-medium">SCORE</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Velocidad destacada */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase">Velocidad</p>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-bold text-blue-700">
                  {elevator.speedMeasurement.secondsPerFloor.toFixed(1)}
                </span>
                <span className="text-sm text-blue-600 ml-1">s/piso</span>
              </div>
            </div>
            <div className="text-right text-xs text-blue-600">
              <p>{elevator.speedMeasurement.floorsTraversed} pisos</p>
              <p>{elevator.speedMeasurement.totalSeconds}s total</p>
            </div>
          </div>
        </div>

        {/* Calificaciones principales */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: '🌊', name: 'Suavidad', value: elevator.rating.smoothness },
            { label: '🎯', name: 'Precisión', value: elevator.rating.precision },
            { label: '🔇', name: 'Silencio', value: elevator.rating.noise },
          ].map((item, idx) => (
            <div key={idx} className={`text-center p-2 rounded-lg ${getRatingColor(item.value)}`}>
              <div className="text-lg">{item.label}</div>
              <div className="text-xs font-medium mt-1">{item.name}</div>
              <div className="text-lg font-bold">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Información técnica */}
        {elevator.location.technicalInfo && (
          <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
            {elevator.location.technicalInfo.model && (
              <span className="mr-3">📋 {elevator.location.technicalInfo.model}</span>
            )}
            {elevator.location.technicalInfo.year && (
              <span className="mr-3">📅 {elevator.location.technicalInfo.year}</span>
            )}
            {elevator.location.technicalInfo.maxPersons && (
              <span>👥 {elevator.location.technicalInfo.maxPersons} pers.</span>
            )}
          </div>
        )}

        {/* Toggle detalles */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium mb-2"
        >
          {showDetails ? '▲ Ocultar detalles' : '▼ Ver más detalles'}
        </button>

        {/* Detalles expandidos */}
        {showDetails && (
          <div className="space-y-2 pt-2 border-t">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">💡 Iluminación</span>
                <span className="font-semibold">{elevator.rating.lighting}/10</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">🌡️ Ventilación</span>
                <span className="font-semibold">{elevator.rating.ventilation}/10</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">📐 Amplitud</span>
                <span className="font-semibold">{elevator.rating.spaciousness}/10</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">✨ Limpieza</span>
                <span className="font-semibold">{elevator.rating.cleanliness}/10</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">🔧 Mantenimiento</span>
                <span className="font-semibold">{elevator.rating.maintenance}/10</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">🎨 Diseño</span>
                <span className="font-semibold">{elevator.rating.design}/10</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">📱 Tecnología</span>
                <span className="font-semibold">{elevator.rating.technology}/10</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">🛡️ Seguridad</span>
                <span className="font-semibold">{elevator.rating.safety}/10</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded col-span-2">
                <span className="text-gray-600">♿ Accesibilidad</span>
                <span className="font-semibold">{elevator.rating.accessibility}/10</span>
              </div>
            </div>
          </div>
        )}

        {/* Notas */}
        {elevator.notes && (
          <div className="mt-3 p-3 bg-amber-50 rounded-md border border-amber-200">
            <p className="text-xs text-amber-800 italic">&quot;{elevator.notes}&quot;</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
        <p className="text-xs text-gray-500">
          📅 {new Date(elevator.dateVisited).toLocaleDateString()}
        </p>
        <button
          onClick={() => onDelete(elevator.id)}
          className="text-red-600 hover:text-red-800 text-sm font-medium hover:underline"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
}
