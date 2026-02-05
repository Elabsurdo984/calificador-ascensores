import { useState } from 'react';
import { ElevatorForm } from './components/ElevatorForm';
import { ElevatorList } from './components/ElevatorList';
import { Statistics } from './components/Statistics';

type Tab = 'list' | 'form' | 'stats';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('list');

  const handleFormSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('list');
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

            <button
              onClick={() => setActiveTab('form')}
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

export default App;
