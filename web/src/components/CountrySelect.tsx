import { useState, useRef, useEffect } from 'react';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const AMERICAN_COUNTRIES = [
  // América del Norte
  'Canadá',
  'Estados Unidos',
  'México',

  // América Central
  'Belice',
  'Costa Rica',
  'El Salvador',
  'Guatemala',
  'Honduras',
  'Nicaragua',
  'Panamá',

  // América del Sur
  'Argentina',
  'Bolivia',
  'Brasil',
  'Chile',
  'Colombia',
  'Ecuador',
  'Guyana',
  'Paraguay',
  'Perú',
  'Surinam',
  'Uruguay',
  'Venezuela',

  // Caribe
  'Antigua y Barbuda',
  'Bahamas',
  'Barbados',
  'Cuba',
  'Dominica',
  'Granada',
  'Haití',
  'Jamaica',
  'República Dominicana',
  'San Cristóbal y Nieves',
  'San Vicente y las Granadinas',
  'Santa Lucía',
  'Trinidad y Tobago',
].sort();

// Función para normalizar texto removiendo acentos/tildes
const normalizeText = (text: string): string => {
  return text
    .normalize('NFD') // Descompone caracteres con acentos
    .replace(/[\u0300-\u036f]/g, '') // Remueve los diacríticos
    .toLowerCase();
};

export function CountrySelect({ value, onChange, placeholder = 'Buscar país...' }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const [filteredCountries, setFilteredCountries] = useState(AMERICAN_COUNTRIES);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch(value); // Restaurar al valor actual si se cierra sin seleccionar
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  useEffect(() => {
    if (search === '') {
      setFilteredCountries(AMERICAN_COUNTRIES);
    } else {
      const normalizedSearch = normalizeText(search);
      const filtered = AMERICAN_COUNTRIES.filter(country =>
        normalizeText(country).includes(normalizedSearch)
      );
      setFilteredCountries(filtered);
    }
    setHighlightedIndex(-1);
  }, [search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    setIsOpen(true);

    // Si el valor coincide exactamente con un país (ignorando acentos), actualizar
    const normalizedValue = normalizeText(newValue);
    const exactMatch = AMERICAN_COUNTRIES.find(
      country => normalizeText(country) === normalizedValue
    );
    if (exactMatch) {
      onChange(exactMatch);
    } else {
      onChange(newValue); // Permitir valores personalizados
    }
  };

  const handleSelectCountry = (country: string) => {
    setSearch(country);
    onChange(country);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredCountries.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredCountries.length) {
          handleSelectCountry(filteredCountries[highlightedIndex]);
        } else if (filteredCountries.length === 1) {
          handleSelectCountry(filteredCountries[0]);
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          placeholder={placeholder}
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && filteredCountries.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredCountries.map((country, index) => (
            <li
              key={country}
              onClick={() => handleSelectCountry(country)}
              className={`px-3 py-2 cursor-pointer transition-colors ${
                index === highlightedIndex
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-blue-50'
              } ${
                country === value ? 'bg-blue-100 font-semibold' : ''
              }`}
            >
              {country}
            </li>
          ))}
        </ul>
      )}

      {isOpen && filteredCountries.length === 0 && search !== '' && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-sm text-gray-500 text-center">
          No se encontraron países con &quot;{search}&quot;
        </div>
      )}
    </div>
  );
}
