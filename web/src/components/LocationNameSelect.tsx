import { useState, useRef, useEffect } from 'react';

interface LocationNameSelectProps {
  value: string;
  city: string;
  country: string;
  locationType: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  name: string;
  type: string;
  class: string;
}

export function LocationNameSelect({
  value,
  city,
  country,
  locationType,
  onChange,
  placeholder = 'Ej: Hotel Marriott, Torre Eiffel...'
}: LocationNameSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar lugares de forma simple
  const searchPlaces = async (query: string) => {
    if (!city || !country || query.length < 3) {
      return;
    }

    setIsLoading(true);

    try {
      // Búsqueda simple: nombre + ciudad + país
      const params = new URLSearchParams({
        q: `${query}, ${city}, ${country}`,
        format: 'json',
        limit: '10',
        addressdetails: '1',
        'accept-language': 'es',
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        {
          headers: {
            'User-Agent': 'ElevatorRatingApp/1.0'
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }

      const data: NominatimResult[] = await response.json();

      // Filtrar resultados con nombre
      const filtered = data
        .filter(result => result.name && result.name.length > 0)
        .slice(0, 8);

      setSuggestions(filtered);

      if (filtered.length > 0) {
        setIsOpen(true);
      }
    } catch (error) {
      // Silenciar errores - el usuario puede escribir manualmente
      console.log('Búsqueda no disponible, escribe manualmente');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    onChange(newValue);

    // Limpiar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Buscar solo si hay ciudad, país y más de 3 caracteres
    if (newValue.length >= 3 && city && country) {
      searchTimeoutRef.current = setTimeout(() => {
        searchPlaces(newValue);
      }, 800) as unknown as number; // Más tiempo para evitar muchas llamadas
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelectPlace = (place: NominatimResult) => {
    const placeName = place.name || place.display_name.split(',')[0];
    setSearch(placeName);
    onChange(placeName);
    setIsOpen(false);
    setSuggestions([]);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelectPlace(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSuggestions([]);
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
          onKeyDown={handleKeyDown}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          placeholder={placeholder}
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21l-2-2m0 0l-7-7m7 7l-7-7m0 0L5 9m7 7l7-7M5 9l7 7M5 9l7-7"
              />
            </svg>
          )}
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((place, index) => {
            const displayName = place.name || place.display_name.split(',')[0];
            const address = place.display_name.split(',').slice(1, 3).join(',').trim();

            return (
              <li
                key={place.place_id}
                onClick={() => handleSelectPlace(place)}
                className={`px-3 py-2 cursor-pointer transition-colors ${
                  index === highlightedIndex
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-blue-50'
                }`}
              >
                <div className="font-medium">{displayName}</div>
                {address && (
                  <div className={`text-xs ${
                    index === highlightedIndex ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {address}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-xs text-gray-500 mt-1">
        {city && country ? (
          <>💡 Escribe libremente o espera sugerencias (opcional)</>
        ) : (
          <>⚠️ Selecciona país y ciudad primero</>
        )}
      </p>
    </div>
  );
}
