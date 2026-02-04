import { useState } from 'react';
import type { CreateElevatorDTO } from '../types';
import { ElevatorLocationType } from '../types';
import { elevatorService } from '../services/elevatorService';

interface ElevatorFormProps {
  onSuccess: () => void;
}

export function ElevatorForm({ onSuccess }: ElevatorFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: '',
    type: ElevatorLocationType.HOTEL,
    totalSeconds: '',
    floorsTraversed: '',
    smoothness: 5,
    design: 5,
    capacity: 5,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const totalSeconds = parseFloat(formData.totalSeconds);
      const floorsTraversed = parseFloat(formData.floorsTraversed);
      const secondsPerFloor = elevatorService.calculateSecondsPerFloor(totalSeconds, floorsTraversed);
      const speedScore = elevatorService.calculateSpeedScore(secondsPerFloor);

      const dto: CreateElevatorDTO = {
        location: {
          name: formData.name,
          city: formData.city || undefined,
          country: formData.country || undefined,
          type: formData.type
        },
        speedMeasurement: {
          totalSeconds,
          floorsTraversed,
          secondsPerFloor
        },
        rating: {
          speed: speedScore,
          smoothness: formData.smoothness,
          design: formData.design,
          capacity: formData.capacity
        },
        notes: formData.notes || undefined
      };

      await elevatorService.create(dto);

      // Reset form
      setFormData({
        name: '',
        city: '',
        country: '',
        type: ElevatorLocationType.HOTEL,
        totalSeconds: '',
        floorsTraversed: '',
        smoothness: 5,
        design: 5,
        capacity: 5,
        notes: ''
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating elevator:', error);
      alert('Error al guardar el ascensor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Calificar Ascensor</h2>

      {/* Ubicación */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del lugar *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Hotel Marriott Plaza"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as ElevatorLocationType })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={ElevatorLocationType.HOTEL}>Hotel</option>
            <option value={ElevatorLocationType.RESIDENTIAL}>Residencial</option>
            <option value={ElevatorLocationType.SHOPPING}>Shopping</option>
            <option value={ElevatorLocationType.TOWER}>Torre</option>
            <option value={ElevatorLocationType.OFFICE}>Oficina</option>
            <option value={ElevatorLocationType.OTHER}>Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Buenos Aires"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            País
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Argentina"
          />
        </div>
      </div>

      {/* Medición de velocidad */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-800 mb-3">Medición de velocidad</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiempo total (segundos) *
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={formData.totalSeconds}
              onChange={(e) => setFormData({ ...formData, totalSeconds: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pisos recorridos *
            </label>
            <input
              type="number"
              step="1"
              required
              value={formData.floorsTraversed}
              onChange={(e) => setFormData({ ...formData, floorsTraversed: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 5"
            />
          </div>
        </div>
      </div>

      {/* Calificaciones */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-800 mb-3">Calificaciones (1-10)</h3>
        <div className="space-y-3">
          <div>
            <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>Suavidad</span>
              <span className="text-blue-600">{formData.smoothness}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.smoothness}
              onChange={(e) => setFormData({ ...formData, smoothness: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>Diseño</span>
              <span className="text-blue-600">{formData.design}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.design}
              onChange={(e) => setFormData({ ...formData, design: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>Capacidad</span>
              <span className="text-blue-600">{formData.capacity}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Observaciones adicionales..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        {isSubmitting ? 'Guardando...' : 'Guardar Calificación'}
      </button>
    </form>
  );
}
