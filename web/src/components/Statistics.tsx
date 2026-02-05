import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { Elevator } from '../types';
import { elevatorService } from '../services/elevatorService';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function Statistics() {
  const [elevators, setElevators] = useState<Elevator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await elevatorService.getAll();
      setElevators(data);
    } catch (error) {
      console.error('Error loading elevators:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
      </div>
    );
  }

  if (elevators.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No hay datos suficientes para mostrar estadísticas.</p>
        <p className="text-sm text-gray-500 mt-2">Califica algunos ascensores primero.</p>
      </div>
    );
  }

  // Métricas generales
  const totalElevators = elevators.length;
  const avgScore = elevators.reduce((sum, e) => sum + e.overallScore, 0) / totalElevators;
  const bestElevator = elevators.reduce((best, e) => e.overallScore > best.overallScore ? e : best);
  const avgSpeed = elevators.reduce((sum, e) => sum + e.speedMeasurement.secondsPerFloor, 0) / totalElevators;

  // Distribución de scores
  const scoreDistribution = [
    { range: '0-2', count: elevators.filter(e => e.overallScore < 2).length },
    { range: '2-4', count: elevators.filter(e => e.overallScore >= 2 && e.overallScore < 4).length },
    { range: '4-6', count: elevators.filter(e => e.overallScore >= 4 && e.overallScore < 6).length },
    { range: '6-8', count: elevators.filter(e => e.overallScore >= 6 && e.overallScore < 8).length },
    { range: '8-10', count: elevators.filter(e => e.overallScore >= 8).length },
  ];

  // Por tipo
  const byType = Object.entries(
    elevators.reduce((acc, e) => {
      acc[e.location.type] = (acc[e.location.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count]) => ({ type, count }));

  // Por ciudad (top 5)
  const byCity = Object.entries(
    elevators.reduce((acc, e) => {
      const city = e.location.city || 'Sin ciudad';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([city, count]) => ({ city, count }));

  // Velocidad promedio por tipo
  const speedByType = Object.entries(
    elevators.reduce((acc, e) => {
      if (!acc[e.location.type]) {
        acc[e.location.type] = { total: 0, count: 0 };
      }
      acc[e.location.type].total += e.speedMeasurement.secondsPerFloor;
      acc[e.location.type].count++;
      return acc;
    }, {} as Record<string, { total: number; count: number }>)
  ).map(([type, data]) => ({
    type,
    avg: Number((data.total / data.count).toFixed(2))
  }));

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Total Ascensores</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">{totalElevators}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Score Promedio</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{avgScore.toFixed(2)}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Mejor Calificado</div>
          <div className="text-lg font-bold text-purple-600 mt-2 truncate">
            {bestElevator.location.name}
          </div>
          <div className="text-sm text-gray-500">{bestElevator.overallScore.toFixed(1)}/10</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Velocidad Promedio</div>
          <div className="text-3xl font-bold text-orange-600 mt-2">{avgSpeed.toFixed(1)}</div>
          <div className="text-sm text-gray-500">s/piso</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribución de scores */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribución de Scores</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Por tipo */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ascensores por Tipo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={byType}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry: any) => `${entry.type}: ${entry.count}`}
              >
                {byType.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top ciudades */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Ciudades</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byCity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="city" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Velocidad por tipo */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Velocidad Promedio por Tipo (s/piso)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={speedByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Análisis de calificaciones por categoría */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Análisis de Calificaciones Promedio por Categoría
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={[
              { categoria: 'Velocidad', promedio: elevators.reduce((sum, e) => sum + e.rating.speed, 0) / totalElevators },
              { categoria: 'Suavidad', promedio: elevators.reduce((sum, e) => sum + e.rating.smoothness, 0) / totalElevators },
              { categoria: 'Precisión', promedio: elevators.reduce((sum, e) => sum + e.rating.precision, 0) / totalElevators },
              { categoria: 'Silencio', promedio: elevators.reduce((sum, e) => sum + e.rating.noise, 0) / totalElevators },
              { categoria: 'Iluminación', promedio: elevators.reduce((sum, e) => sum + e.rating.lighting, 0) / totalElevators },
              { categoria: 'Ventilación', promedio: elevators.reduce((sum, e) => sum + e.rating.ventilation, 0) / totalElevators },
              { categoria: 'Amplitud', promedio: elevators.reduce((sum, e) => sum + e.rating.spaciousness, 0) / totalElevators },
              { categoria: 'Limpieza', promedio: elevators.reduce((sum, e) => sum + e.rating.cleanliness, 0) / totalElevators },
              { categoria: 'Mantenimiento', promedio: elevators.reduce((sum, e) => sum + e.rating.maintenance, 0) / totalElevators },
              { categoria: 'Diseño', promedio: elevators.reduce((sum, e) => sum + e.rating.design, 0) / totalElevators },
              { categoria: 'Tecnología', promedio: elevators.reduce((sum, e) => sum + e.rating.technology, 0) / totalElevators },
              { categoria: 'Seguridad', promedio: elevators.reduce((sum, e) => sum + e.rating.safety, 0) / totalElevators },
              { categoria: 'Accesibilidad', promedio: elevators.reduce((sum, e) => sum + e.rating.accessibility, 0) / totalElevators },
            ]}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" angle={-45} textAnchor="end" height={100} fontSize={12} />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Bar dataKey="promedio" name="Promedio">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparación por áreas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🚀 Rendimiento Promedio
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Velocidad', value: elevators.reduce((sum, e) => sum + e.rating.speed, 0) / totalElevators },
              { label: 'Suavidad', value: elevators.reduce((sum, e) => sum + e.rating.smoothness, 0) / totalElevators },
              { label: 'Precisión', value: elevators.reduce((sum, e) => sum + e.rating.precision, 0) / totalElevators },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-semibold">{item.value.toFixed(2)}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(item.value / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            😌 Confort Promedio
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Silencio', value: elevators.reduce((sum, e) => sum + e.rating.noise, 0) / totalElevators },
              { label: 'Iluminación', value: elevators.reduce((sum, e) => sum + e.rating.lighting, 0) / totalElevators },
              { label: 'Ventilación', value: elevators.reduce((sum, e) => sum + e.rating.ventilation, 0) / totalElevators },
              { label: 'Amplitud', value: elevators.reduce((sum, e) => sum + e.rating.spaciousness, 0) / totalElevators },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-semibold">{item.value.toFixed(2)}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(item.value / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🔧 Estado Promedio
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Limpieza', value: elevators.reduce((sum, e) => sum + e.rating.cleanliness, 0) / totalElevators },
              { label: 'Mantenimiento', value: elevators.reduce((sum, e) => sum + e.rating.maintenance, 0) / totalElevators },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-semibold">{item.value.toFixed(2)}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: `${(item.value / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🛡️ Seguridad y Diseño
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Diseño', value: elevators.reduce((sum, e) => sum + e.rating.design, 0) / totalElevators },
              { label: 'Tecnología', value: elevators.reduce((sum, e) => sum + e.rating.technology, 0) / totalElevators },
              { label: 'Seguridad', value: elevators.reduce((sum, e) => sum + e.rating.safety, 0) / totalElevators },
              { label: 'Accesibilidad', value: elevators.reduce((sum, e) => sum + e.rating.accessibility, 0) / totalElevators },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-semibold">{item.value.toFixed(2)}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(item.value / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
