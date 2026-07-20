import { weatherDetailsMock } from '../data/weatherDetailsMock';
import { DailyForecastItem } from './DailyForecastItem';
import { HourlyForecastItem } from './HourlyForecastItem';

type WeatherDetailsScreenProps = {
  onBack?: () => void;
};

export function WeatherDetailsScreen({ onBack }: WeatherDetailsScreenProps) {
  const weather = weatherDetailsMock;

  return (
    <main className="app-background">
      <section
        aria-labelledby="weather-details-title"
        className="app-screen app-mobile-container relative flex flex-col"
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar para busca"
          className="grid h-9 w-9 place-items-center rounded-full bg-white text-2xl font-bold text-[#0B4F95] shadow-[0_8px_18px_rgba(18,57,95,0.16)]"
        >
          ‹
        </button>

        <header className="mt-4 text-center text-white">
          <p className="text-sm font-medium">{weather.locationLabel}</p>

          <h1
            id="weather-details-title"
            className="text-[clamp(32px,9vw,40px)] font-extrabold leading-none"
          >
            {weather.city}
          </h1>

          <p className="mt-2 text-[clamp(72px,22vw,96px)] font-light leading-none">
            {weather.currentTemperature}°
          </p>

          <p className="mt-2 text-base font-bold">
            Max: {weather.maxTemperature}° Min: {weather.minTemperature}°
          </p>
        </header>

        <section className="mt-6 flex-1 rounded-t-[42px] bg-white px-5 pb-6 pt-5">
          <h2 className="text-center text-lg font-bold text-[#0B4F95]">
            Condições
          </h2>

          <div className="mt-4 rounded-2xl bg-[#4596F0] px-4 py-4">
            <div className="flex items-center justify-between text-white">
              <h3 className="text-base font-medium">Hoje</h3>
              <span className="text-sm font-medium">Julho</span>
            </div>

            <ul className="mt-4 flex justify-between gap-3 overflow-x-auto pb-1">
              {weather.hourlyForecast.map((forecast) => (
                <HourlyForecastItem key={forecast.id} forecast={forecast} />
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-2xl bg-[#4596F0] px-4 py-4">
            <h3 className="text-center text-sm font-medium text-white">
              Previsão para 5 dias
            </h3>

            <ul className="mt-4 grid gap-3">
              {weather.dailyForecast.map((forecast) => (
                <DailyForecastItem key={forecast.id} forecast={forecast} />
              ))}
            </ul>
          </div>
        </section>
      </section>
    </main>
  );
}
