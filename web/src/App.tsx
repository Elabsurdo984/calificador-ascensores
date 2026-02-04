import { useState } from 'react';
import { ElevatorForm } from './components/ElevatorForm';
import { ElevatorList } from './components/ElevatorList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');

  const handleFormSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏢 Calificador de Ascensores
              </h1>
              <p className="text-gray-600 mt-1">
                Evalúa y compara ascensores de todo el mundo
              </p>
            </div>

            <button
              onClick={() => setActiveTab(activeTab === 'list' ? 'form' : 'list')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              {activeTab === 'list' ? '+ Nuevo Ascensor' : '← Ver Lista'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'form' ? (
          <div className="max-w-2xl mx-auto">
            <ElevatorForm onSuccess={handleFormSuccess} />
          </div>
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
