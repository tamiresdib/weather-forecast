import { cityWeatherMock } from '../data/cityWeatherMock';
import { CityWeatherCard } from './CityWeatherCard';

export function WeatherSearchScreen() {
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
            placeholder="Buscar cidade"
            className="h-12 w-full rounded-full bg-white px-12 text-base font-medium text-[#4596F0] placeholder:text-[#4596F0] focus:outline-none focus:ring-4 focus:ring-white/40"
          />

          <span
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-[#4596F0]"
          >
            ⌕
          </span>
        </form>

        <h1
          id="weather-search-title"
          className="mt-8 text-2xl font-bold text-white"
        >
          Tempo
        </h1>

        <div className="mt-4 grid gap-4">
          {cityWeatherMock.map((weather) => (
            <CityWeatherCard key={weather.id} weather={weather} />
          ))}
        </div>
      </section>
    </main>
  );
}
