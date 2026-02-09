import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ElevatorForm } from './ElevatorForm';
import { ElevatorList } from './ElevatorList';
import { Statistics } from './Statistics';

type Tab = 'list' | 'form' | 'stats';

export function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleFormSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('list');
  };

  const handleNewElevatorClick = () => {
    if (!isAuthenticated) {
      if (confirm('Necesitas crear una cuenta para guardar ascensores. ¿Quieres registrarte ahora?')) {
        navigate('/register');
      }
    } else {
      setActiveTab('form');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏢 Calificador de Ascensores
              </h1>
              <p className="text-gray-600 mt-1">
                Evalúa y compara ascensores de todo el mundo
              </p>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Bienvenido,</p>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4">
            <button
              onClick={handleNewElevatorClick}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              + Nuevo Ascensor
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-6 border-b">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'list'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Lista
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Estadísticas
            </button>
          </div>
        </div>
      </header>

      {/* Info Banner for Non-Authenticated Users */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border-l-4 border-blue-600">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-blue-800">
                  <strong className="font-semibold">¡Crea una cuenta gratis!</strong> Regístrate para guardar tus calificaciones de ascensores y acceder a tus datos desde cualquier dispositivo.
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'form' ? (
          <div className="max-w-2xl mx-auto">
            <div className="mb-4">
              <button
                onClick={() => setActiveTab('list')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Volver a la lista
              </button>
            </div>
            <ElevatorForm onSuccess={handleFormSuccess} />
          </div>
        ) : activeTab === 'stats' ? (
          <Statistics />
        ) : (
          <ElevatorList refresh={refreshKey} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>Calificador de Ascensores - Evalúa velocidad, diseño y experiencia</p>
        </div>
      </footer>
    </div>
  );
}
