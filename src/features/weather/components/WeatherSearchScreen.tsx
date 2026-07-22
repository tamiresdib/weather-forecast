import { useEffect, useState } from 'react';
import type { CityWeather } from '../../types/cityWeather';
import { searchCityWeatherList } from '../services/weatherService';
import { ApiErrorState } from './ApiErrorState';
import { CityNotFoundState } from './CityNotFoundState';
import { CityWeatherCard } from './CityWeatherCard';
import { WeatherSearchSkeleton } from './WeatherSkeletons';

type WeatherSearchScreenProps = {
  onSelectCity?: (weather: CityWeather) => void;
};

const DEFAULT_CITY_NAME = 'São Paulo';
const SEARCH_DEBOUNCE_IN_MS = 500;

export function WeatherSearchScreen({
  onSelectCity,
}: WeatherSearchScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [citiesWeather, setCitiesWeather] = useState<CityWeather[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApiError, setHasApiError] = useState(false);

  useEffect(() => {
    let isActive = true;

    const cityName = searchTerm.trim() || DEFAULT_CITY_NAME;
    const debounceTime = searchTerm.trim() ? SEARCH_DEBOUNCE_IN_MS : 0;

    const timeoutId = window.setTimeout(() => {
      async function loadCityWeather() {
        setIsLoading(true);
        setHasApiError(false);

        try {
          const weatherList = await searchCityWeatherList(cityName);

          if (isActive) {
            setCitiesWeather(weatherList);
          }
        } catch (error) {
          console.error('Weather search failed:', error);

          if (isActive) {
            setCitiesWeather([]);
            setHasApiError(true);
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      void loadCityWeather();
    }, debounceTime);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  function handleClearSearch() {
    setSearchTerm('');
  }

  async function handleRetryApiRequest() {
    const cityName = searchTerm.trim() || DEFAULT_CITY_NAME;

    setIsLoading(true);
    setHasApiError(false);

    try {
      const weatherList = await searchCityWeatherList(cityName);

      setCitiesWeather(weatherList);
    } catch (error) {
      console.error('Weather search failed:', error);

      setCitiesWeather([]);
      setHasApiError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app-background">
      <section
        aria-labelledby="weather-search-title"
        className="app-screen app-mobile-container"
      >
        {hasApiError ? (
          <ApiErrorState onRetry={handleRetryApiRequest} />
        ) : (
          <>
            <div role="search" className="relative">
              <label htmlFor="city-search" className="sr-only">
                Buscar cidade
              </label>

              <input
                id="city-search"
                name="city-search"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar cidade"
                autoComplete="off"
                className="h-[clamp(44px,7dvh,52px)] w-full rounded-full bg-white px-12 text-[clamp(14px,4vw,16px)] font-medium text-[#4596F0] placeholder:text-[#4596F0] focus:outline-none focus:ring-4 focus:ring-white/40"
              />

              <span
                aria-hidden="true"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl leading-none text-[#4596F0]"
              >
                ⌕
              </span>

              {searchTerm ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Limpar busca"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-[#4596F0]"
                >
                  ×
                </button>
              ) : null}
            </div>

            <h1
              id="weather-search-title"
              className="mt-[clamp(24px,5dvh,36px)] text-[clamp(24px,7vw,32px)] font-bold text-white"
            >
              Tempo
            </h1>

            {isLoading ? (
              <WeatherSearchSkeleton />
            ) : citiesWeather.length > 0 ? (
              <div className="mt-[clamp(16px,3dvh,24px)] grid gap-[clamp(12px,2dvh,16px)]">
                {citiesWeather.map((weather) => (
                  <CityWeatherCard
                    key={weather.id}
                    weather={weather}
                    onClick={onSelectCity}
                  />
                ))}
              </div>
            ) : searchTerm.trim() ? (
              <CityNotFoundState onRetry={handleClearSearch} />
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
