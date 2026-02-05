import { useState } from 'react';
import type { CreateElevatorDTO } from '../types';
import { ElevatorLocationType } from '../types';
import { elevatorService } from '../services/elevatorService';
import { CountrySelect } from './CountrySelect';
import { CitySelect } from './CitySelect';

interface ElevatorFormProps {
  onSuccess: () => void;
}

interface RatingCategory {
  key: keyof Omit<CreateElevatorDTO['rating'], 'speed'>;
  label: string;
  description: string;
  icon: string;
}

const ratingCategories: Record<string, RatingCategory[]> = {
  performance: [
    { key: 'smoothness', label: 'Suavidad', description: 'Viaje sin sacudidas ni movimientos bruscos', icon: '🌊' },
    { key: 'precision', label: 'Precisión', description: 'Precisión al detenerse al nivel del piso', icon: '🎯' },
  ],
  comfort: [
    { key: 'noise', label: 'Silencio', description: 'Ausencia de ruidos molestos (10 = silencioso)', icon: '🔇' },
    { key: 'lighting', label: 'Iluminación', description: 'Calidad y confort de la iluminación', icon: '💡' },
    { key: 'ventilation', label: 'Ventilación', description: 'Temperatura y ventilación adecuadas', icon: '🌡️' },
    { key: 'spaciousness', label: 'Amplitud', description: 'Sensación de espacio y comodidad', icon: '📐' },
  ],
  condition: [
    { key: 'cleanliness', label: 'Limpieza', description: 'Estado de limpieza general', icon: '✨' },
    { key: 'maintenance', label: 'Mantenimiento', description: 'Estado general y conservación', icon: '🔧' },
  ],
  design: [
    { key: 'design', label: 'Diseño', description: 'Estética y diseño interior', icon: '🎨' },
    { key: 'technology', label: 'Tecnología', description: 'Pantallas, botones e indicadores', icon: '📱' },
  ],
  safety: [
    { key: 'safety', label: 'Seguridad', description: 'Sensación de seguridad durante el viaje', icon: '🛡️' },
    { key: 'accessibility', label: 'Accesibilidad', description: 'Accesible para personas con movilidad reducida', icon: '♿' },
  ],
};

const RatingSlider = ({ category, value, onChange }: {
  category: RatingCategory;
  value: number;
  onChange: (value: number) => void;
}) => (
  <div className="space-y-1">
    <label className="flex justify-between items-center text-sm">
      <span className="font-medium text-gray-700">
        {category.icon} {category.label}
      </span>
      <span className={`font-bold px-2 py-0.5 rounded ${
        value >= 8 ? 'bg-green-100 text-green-700' :
        value >= 5 ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {value}
      </span>
    </label>
    <p className="text-xs text-gray-500">{category.description}</p>
    <input
      type="range"
      min="1"
      max="10"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
  </div>
);

export function ElevatorForm({ onSuccess }: ElevatorFormProps) {
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    technical: false,
    speed: true,
    ratings: true,
  });

  const [formData, setFormData] = useState({
    // Ubicación
    name: '',
    city: '',
    country: '',
    address: '',
    type: ElevatorLocationType.HOTEL,

    // Información técnica
    brand: '',
    model: '',
    year: '',
    maxLoad: '',
    maxPersons: '',
    floors: '',

    // Velocidad
    totalSeconds: '',
    floorsTraversed: '',

    // Calificaciones
    smoothness: 5,
    precision: 5,
    noise: 5,
    lighting: 5,
    ventilation: 5,
    spaciousness: 5,
    cleanliness: 5,
    maintenance: 5,
    design: 5,
    technology: 5,
    safety: 5,
    accessibility: 5,

    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
          address: formData.address || undefined,
          type: formData.type,
          technicalInfo: (formData.brand || formData.model || formData.year) ? {
            brand: formData.brand || undefined,
            model: formData.model || undefined,
            year: formData.year ? parseInt(formData.year) : undefined,
            maxLoad: formData.maxLoad ? parseFloat(formData.maxLoad) : undefined,
            maxPersons: formData.maxPersons ? parseInt(formData.maxPersons) : undefined,
            floors: formData.floors ? parseInt(formData.floors) : undefined,
          } : undefined
        },
        speedMeasurement: {
          totalSeconds,
          floorsTraversed,
          secondsPerFloor
        },
        rating: {
          speed: speedScore,
          smoothness: formData.smoothness,
          precision: formData.precision,
          noise: formData.noise,
          lighting: formData.lighting,
          ventilation: formData.ventilation,
          spaciousness: formData.spaciousness,
          cleanliness: formData.cleanliness,
          maintenance: formData.maintenance,
          design: formData.design,
          technology: formData.technology,
          safety: formData.safety,
          accessibility: formData.accessibility,
        },
        notes: formData.notes || undefined
      };

      await elevatorService.create(dto);

      // Reset form
      setFormData({
        name: '',
        city: '',
        country: '',
        address: '',
        type: ElevatorLocationType.HOTEL,
        brand: '',
        model: '',
        year: '',
        maxLoad: '',
        maxPersons: '',
        floors: '',
        totalSeconds: '',
        floorsTraversed: '',
        smoothness: 5,
        precision: 5,
        noise: 5,
        lighting: 5,
        ventilation: 5,
        spaciousness: 5,
        cleanliness: 5,
        maintenance: 5,
        design: 5,
        technology: 5,
        safety: 5,
        accessibility: 5,
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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <h2 className="text-2xl font-bold">Evaluación Profesional de Ascensor</h2>
        <p className="text-blue-100 mt-1">Complete todos los criterios para generar una calificación detallada</p>
      </div>

      <div className="p-6 space-y-4">
        {/* UBICACIÓN */}
        <section className="border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('location')}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
          >
            <span className="font-semibold text-gray-800">📍 Información del Lugar</span>
            <span className="text-gray-500">{expandedSections.location ? '▼' : '▶'}</span>
          </button>
          {expandedSections.location && (
            <div className="p-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del lugar <span className="text-red-500">*</span>
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
                    Tipo de edificio
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={ElevatorLocationType.HOTEL}>🏨 Hotel</option>
                    <option value={ElevatorLocationType.RESIDENTIAL}>🏢 Residencial</option>
                    <option value={ElevatorLocationType.SHOPPING}>🛍️ Shopping</option>
                    <option value={ElevatorLocationType.TOWER}>🏗️ Torre</option>
                    <option value={ElevatorLocationType.OFFICE}>💼 Oficina</option>
                    <option value={ElevatorLocationType.OTHER}>📦 Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <CountrySelect
                    value={formData.country}
                    onChange={(value) => setFormData({ ...formData, country: value })}
                    placeholder="Buscar país de América..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad
                  </label>
                  <CitySelect
                    value={formData.city}
                    countryName={formData.country}
                    onChange={(value) => setFormData({ ...formData, city: value })}
                    placeholder="Buscar ciudad..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Av. Corrientes 1234"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* INFORMACIÓN TÉCNICA */}
        <section className="border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('technical')}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
          >
            <span className="font-semibold text-gray-800">⚙️ Información Técnica (Opcional)</span>
            <span className="text-gray-500">{expandedSections.technical ? '▼' : '▶'}</span>
          </button>
          {expandedSections.technical && (
            <div className="p-4 space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Otis, Schindler"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modelo
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Gen2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Año
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2020"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carga máx. (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.maxLoad}
                    onChange={(e) => setFormData({ ...formData, maxLoad: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="630"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cap. personas
                  </label>
                  <input
                    type="number"
                    value={formData.maxPersons}
                    onChange={(e) => setFormData({ ...formData, maxPersons: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pisos totales
                  </label>
                  <input
                    type="number"
                    value={formData.floors}
                    onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="20"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* MEDICIÓN DE VELOCIDAD */}
        <section className="border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('speed')}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
          >
            <span className="font-semibold text-gray-800">⚡ Medición de Velocidad</span>
            <span className="text-gray-500">{expandedSections.speed ? '▼' : '▶'}</span>
          </button>
          {expandedSections.speed && (
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Use un cronómetro para medir el tiempo que tarda el ascensor en recorrer varios pisos
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiempo total (segundos) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.totalSeconds}
                    onChange={(e) => setFormData({ ...formData, totalSeconds: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="15.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pisos recorridos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={formData.floorsTraversed}
                    onChange={(e) => setFormData({ ...formData, floorsTraversed: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5"
                  />
                </div>
              </div>
              {formData.totalSeconds && formData.floorsTraversed && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    ⚡ Velocidad: <strong>{(parseFloat(formData.totalSeconds) / parseFloat(formData.floorsTraversed)).toFixed(2)}</strong> segundos por piso
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* CALIFICACIONES */}
        <section className="border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('ratings')}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
          >
            <span className="font-semibold text-gray-800">⭐ Calificaciones Detalladas (1-10)</span>
            <span className="text-gray-500">{expandedSections.ratings ? '▼' : '▶'}</span>
          </button>
          {expandedSections.ratings && (
            <div className="p-4 space-y-6">
              {/* Rendimiento */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b">🚀 Rendimiento</h4>
                <div className="space-y-4">
                  {ratingCategories.performance.map(cat => (
                    <RatingSlider
                      key={cat.key}
                      category={cat}
                      value={formData[cat.key]}
                      onChange={(val) => setFormData({ ...formData, [cat.key]: val })}
                    />
                  ))}
                </div>
              </div>

              {/* Confort */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b">😌 Confort</h4>
                <div className="space-y-4">
                  {ratingCategories.comfort.map(cat => (
                    <RatingSlider
                      key={cat.key}
                      category={cat}
                      value={formData[cat.key]}
                      onChange={(val) => setFormData({ ...formData, [cat.key]: val })}
                    />
                  ))}
                </div>
              </div>

              {/* Estado */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b">🔧 Estado y Mantenimiento</h4>
                <div className="space-y-4">
                  {ratingCategories.condition.map(cat => (
                    <RatingSlider
                      key={cat.key}
                      category={cat}
                      value={formData[cat.key]}
                      onChange={(val) => setFormData({ ...formData, [cat.key]: val })}
                    />
                  ))}
                </div>
              </div>

              {/* Diseño */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b">🎨 Diseño y Tecnología</h4>
                <div className="space-y-4">
                  {ratingCategories.design.map(cat => (
                    <RatingSlider
                      key={cat.key}
                      category={cat}
                      value={formData[cat.key]}
                      onChange={(val) => setFormData({ ...formData, [cat.key]: val })}
                    />
                  ))}
                </div>
              </div>

              {/* Seguridad */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b">🛡️ Seguridad y Accesibilidad</h4>
                <div className="space-y-4">
                  {ratingCategories.safety.map(cat => (
                    <RatingSlider
                      key={cat.key}
                      category={cat}
                      value={formData[cat.key]}
                      onChange={(val) => setFormData({ ...formData, [cat.key]: val })}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* NOTAS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            📝 Notas y Observaciones
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Describa cualquier detalle adicional sobre su experiencia..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '⏳ Guardando...' : '✅ Guardar Evaluación Completa'}
        </button>
      </div>
    </form>
  );
}
