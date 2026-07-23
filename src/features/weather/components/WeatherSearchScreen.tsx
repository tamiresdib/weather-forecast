import type { CityWeather } from '../../types/cityWeather';
import { useWeatherSearch } from '../hooks/useWeatherSearch';
import { ApiErrorState } from './ApiErrorState';
import { CityNotFoundState } from './CityNotFoundState';
import { CityWeatherCard } from './CityWeatherCard';
import { WeatherSearchSkeleton } from './WeatherSkeletons';

type WeatherSearchScreenProps = {
  onSelectCity?: (weather: CityWeather) => void;
};

export function WeatherSearchScreen({
  onSelectCity,
}: WeatherSearchScreenProps) {
  const {
    citiesWeather,
    clearSearch,
    hasApiError,
    isLoading,
    retrySearch,
    searchTerm,
    setSearchTerm,
  } = useWeatherSearch();

  return (
    <main className="app-background">
      <section
        aria-labelledby="weather-search-title"
        className="app-screen app-mobile-container"
      >
        {hasApiError ? (
          <ApiErrorState onRetry={retrySearch} />
        ) : (
          <div className="flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden">
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
                  onClick={clearSearch}
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

            <div className="min-h-0 flex-1 overflow-hidden">
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
                <CityNotFoundState onRetry={clearSearch} />
              ) : null}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
