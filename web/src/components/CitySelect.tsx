import { useState, useRef, useEffect } from 'react';
import { City } from 'country-state-city';

interface CitySelectProps {
  value: string;
  countryName: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Mapeo de nombres de países en español a códigos ISO
const COUNTRY_NAME_TO_ISO: Record<string, string> = {
  // América del Norte
  'Canadá': 'CA',
  'Estados Unidos': 'US',
  'México': 'MX',

  // América Central
  'Belice': 'BZ',
  'Costa Rica': 'CR',
  'El Salvador': 'SV',
  'Guatemala': 'GT',
  'Honduras': 'HN',
  'Nicaragua': 'NI',
  'Panamá': 'PA',

  // América del Sur
  'Argentina': 'AR',
  'Bolivia': 'BO',
  'Brasil': 'BR',
  'Chile': 'CL',
  'Colombia': 'CO',
  'Ecuador': 'EC',
  'Guyana': 'GY',
  'Paraguay': 'PY',
  'Perú': 'PE',
  'Surinam': 'SR',
  'Uruguay': 'UY',
  'Venezuela': 'VE',

  // Caribe
  'Antigua y Barbuda': 'AG',
  'Bahamas': 'BS',
  'Barbados': 'BB',
  'Cuba': 'CU',
  'Dominica': 'DM',
  'Granada': 'GD',
  'Haití': 'HT',
  'Jamaica': 'JM',
  'República Dominicana': 'DO',
  'San Cristóbal y Nieves': 'KN',
  'San Vicente y las Granadinas': 'VC',
  'Santa Lucía': 'LC',
  'Trinidad y Tobago': 'TT',
};

// Función para normalizar texto removiendo acentos/tildes
const normalizeText = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

export function CitySelect({ value, countryName, onChange, placeholder = 'Buscar ciudad...' }: CitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const [cities, setCities] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Cargar ciudades cuando cambia el país
  useEffect(() => {
    if (!countryName) {
      setCities([]);
      setFilteredCities([]);
      return;
    }

    const countryCode = COUNTRY_NAME_TO_ISO[countryName];
    if (!countryCode) {
      setCities([]);
      setFilteredCities([]);
      return;
    }

    // Obtener ciudades del país
    const countryCities = City.getCitiesOfCountry(countryCode);
    if (countryCities) {
      // Extraer nombres y ordenar
      const cityNames = countryCities
        .map(city => city.name)
        .filter((name, index, self) => self.indexOf(name) === index) // Eliminar duplicados
        .sort();

      setCities(cityNames);
      setFilteredCities(cityNames);
    } else {
      setCities([]);
      setFilteredCities([]);
    }
  }, [countryName]);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch(value);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  useEffect(() => {
    if (search === '') {
      setFilteredCities(cities);
    } else {
      const normalizedSearch = normalizeText(search);
      const filtered = cities.filter(city =>
        normalizeText(city).includes(normalizedSearch)
      );
      setFilteredCities(filtered);
    }
    setHighlightedIndex(-1);
  }, [search, cities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    setIsOpen(true);

    // Si el valor coincide exactamente con una ciudad (ignorando acentos), actualizar
    const normalizedValue = normalizeText(newValue);
    const exactMatch = cities.find(
      city => normalizeText(city) === normalizedValue
    );
    if (exactMatch) {
      onChange(exactMatch);
    } else {
      onChange(newValue); // Permitir valores personalizados
    }
  };

  const handleSelectCity = (city: string) => {
    setSearch(city);
    onChange(city);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    if (cities.length > 0) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      if (cities.length > 0) {
        setIsOpen(true);
      }
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredCities.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredCities.length) {
          handleSelectCity(filteredCities[highlightedIndex]);
        } else if (filteredCities.length === 1) {
          handleSelectCity(filteredCities[0]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearch(value);
        inputRef.current?.blur();
        break;
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const isDisabled = !countryName || cities.length === 0;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
            isDisabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''
          }`}
          placeholder={
            !countryName
              ? 'Primero selecciona un país'
              : cities.length === 0
              ? 'No hay ciudades disponibles'
              : placeholder
          }
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {!isDisabled && (
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      {isOpen && filteredCities.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredCities.map((city, index) => (
            <li
              key={city}
              onClick={() => handleSelectCity(city)}
              className={`px-3 py-2 cursor-pointer transition-colors ${
                index === highlightedIndex
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-blue-50'
              } ${
                city === value ? 'bg-blue-100 font-semibold' : ''
              }`}
            >
              {city}
            </li>
          ))}
        </ul>
      )}

      {isOpen && filteredCities.length === 0 && search !== '' && cities.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-sm text-gray-500 text-center">
          No se encontraron ciudades con &quot;{search}&quot;
        </div>
      )}

      {!countryName && (
        <p className="text-xs text-gray-500 mt-1">
          💡 Selecciona un país primero para ver las ciudades
        </p>
      )}

      {countryName && cities.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          📍 {cities.length} ciudades disponibles en {countryName}
        </p>
      )}
    </div>
  );
}
