import { useMemo, useState } from 'react';
import type { CityWeather } from '../../types/cityWeather';
import { getCityWeatherList } from '../services/weatherService';
import { CityNotFoundState } from './CityNotFoundState';
import { CityWeatherCard } from './CityWeatherCard';

export function WeatherSearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [citiesWeather, setCitiesWeather] =
    useState<CityWeather[]>(getCityWeatherList());

  const filteredCities = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return citiesWeather;
    }

    return citiesWeather
      .filter((weather) =>
        weather.city.toLowerCase().includes(normalizedSearch),
      )
      .sort((firstCity, secondCity) => {
        const firstCityName = firstCity.city.toLowerCase();
        const secondCityName = secondCity.city.toLowerCase();

        const firstStartsWithSearch =
          firstCityName.startsWith(normalizedSearch);
        const secondStartsWithSearch =
          secondCityName.startsWith(normalizedSearch);

        if (firstStartsWithSearch && !secondStartsWithSearch) {
          return -1;
        }

        if (!firstStartsWithSearch && secondStartsWithSearch) {
          return 1;
        }

        return firstCityName.localeCompare(secondCityName);
      });
  }, [citiesWeather, searchTerm]);

  function handleRetry() {
    setSearchTerm('');
    setCitiesWeather(getCityWeatherList());
  }

  return (
    <main className="app-background">
      <section
        aria-labelledby="weather-search-title"
        className="app-screen app-mobile-container"
      >
        <form role="search" className="relative">
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

          <span
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-[#4596F0]"
          >
            ⌕
          </span>
        </form>

        {filteredCities.length > 0 ? (
          <>
            <h1
              id="weather-search-title"
              className="mt-[clamp(24px,5dvh,36px)] text-[clamp(24px,7vw,32px)] font-bold text-white"
            >
              Tempo
            </h1>

            <div className="mt-[clamp(16px,3dvh,24px)] grid gap-[clamp(12px,2dvh,16px)]">
              {filteredCities.map((weather) => (
                <CityWeatherCard key={weather.id} weather={weather} />
              ))}
            </div>
          </>
        ) : (
          <CityNotFoundState onRetry={handleRetry} />
        )}
      </section>
    </main>
  );
}
