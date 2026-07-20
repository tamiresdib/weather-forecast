import { useState } from 'react';
import type { CityWeather } from '../../types/cityWeather';
import { searchCityWeatherList } from '../services/weatherService';
import { CityNotFoundState } from './CityNotFoundState';
import { CityWeatherCard } from './CityWeatherCard';

type WeatherSearchScreenProps = {
  onSelectCity?: () => void;
};

export function WeatherSearchScreen({
  onSelectCity,
}: WeatherSearchScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [citiesWeather, setCitiesWeather] = useState<CityWeather[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    if (!searchTerm.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      setHasSearched(true);

      const weatherList = await searchCityWeatherList(searchTerm);
      setCitiesWeather(weatherList);
    } catch {
      setCitiesWeather([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRetry() {
    await handleSearch();
  }

  return (
    <main className="app-background">
      <section
        aria-labelledby="weather-search-title"
        className="app-screen app-mobile-container"
      >
        <form role="search" className="relative" onSubmit={handleSearch}>
          <label htmlFor="city-search" className="sr-only">
            Buscar cidade
          </label>

          <input
            id="city-search"
            name="city-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar cidade"
            className="h-[clamp(44px,7dvh,52px)] w-full rounded-full bg-white px-12 text-[clamp(14px,4vw,16px)] font-medium text-[#4596F0] placeholder:text-[#4596F0] focus:outline-none focus:ring-4 focus:ring-white/40"
          />

          <button
            type="submit"
            aria-label="Buscar cidade"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-[#4596F0]"
          >
            ⌕
          </button>
        </form>

        <h1
          id="weather-search-title"
          className="mt-[clamp(24px,5dvh,36px)] text-[clamp(24px,7vw,32px)] font-bold text-white"
        >
          Tempo
        </h1>

        {isLoading ? (
          <p className="mt-6 rounded-2xl bg-white/90 px-5 py-4 text-center text-sm font-medium text-[#4596F0]">
            Buscando previsão...
          </p>
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
        ) : hasSearched ? (
          <CityNotFoundState onRetry={handleRetry} />
        ) : null}
      </section>
    </main>
  );
}
