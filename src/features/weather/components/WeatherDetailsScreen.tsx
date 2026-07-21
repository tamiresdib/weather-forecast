import { useEffect, useMemo, useState } from 'react';
import type { CityWeather } from '../../types/cityWeather';
import type { WeatherDetails } from '../../types/weatherDetails';
import { getWeatherDetailsByCoordinates } from '../services/weatherService';
import { ApiErrorState } from './ApiErrorState';

type WeatherDetailsScreenProps = {
  selectedCity: CityWeather;
  onBack?: () => void;
};

export function WeatherDetailsScreen({
  selectedCity,
  onBack,
}: WeatherDetailsScreenProps) {
  const [weatherDetails, setWeatherDetails] = useState<WeatherDetails | null>(
    null,
  );
  const [selectedDailyForecastId, setSelectedDailyForecastId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApiError, setHasApiError] = useState(false);

  async function loadWeatherDetails() {
    setIsLoading(true);
    setHasApiError(false);

    try {
      const details = await getWeatherDetailsByCoordinates(selectedCity);

      setWeatherDetails(details);
    } catch (error) {
      console.error('Weather details request failed:', error);

      setWeatherDetails(null);
      setHasApiError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    void getWeatherDetailsByCoordinates(selectedCity)
      .then((details) => {
        if (isMounted) {
          setWeatherDetails(details);
          setHasApiError(false);
        }
      })
      .catch((error) => {
        console.error('Weather details request failed:', error);

        if (isMounted) {
          setWeatherDetails(null);
          setHasApiError(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  const activeDailyForecast = useMemo(() => {
    if (!weatherDetails) {
      return null;
    }

    if (!selectedDailyForecastId) {
      return weatherDetails.dailyForecast[0] ?? null;
    }

    return (
      weatherDetails.dailyForecast.find(
        (forecast) => forecast.id === selectedDailyForecastId,
      ) ??
      weatherDetails.dailyForecast[0] ??
      null
    );
  }, [selectedDailyForecastId, weatherDetails]);

  const activeDailyForecastId = activeDailyForecast?.id;

  const activeHourlyForecast =
    activeDailyForecast?.hourlyForecast ?? weatherDetails?.hourlyForecast;

  const activeTemperature =
    activeDailyForecast?.temperature ?? weatherDetails?.currentTemperature;

  const activeMaxTemperature =
    activeDailyForecast?.maxTemperature ?? weatherDetails?.maxTemperature;

  const activeMinTemperature =
    activeDailyForecast?.minTemperature ?? weatherDetails?.minTemperature;

  const activeCondition =
    activeDailyForecast?.condition ?? weatherDetails?.condition;

  if (hasApiError) {
    return (
      <main className="app-background">
        <section className="relative app-screen app-mobile-container">
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar para busca"
            className="absolute left-[clamp(20px,6vw,52px)] top-[clamp(18px,5dvh,42px)] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#004990] transition hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/40"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
            </svg>
          </button>

          <ApiErrorState onRetry={loadWeatherDetails} />
        </section>
      </main>
    );
  }

  return (
    <main className="app-background h-dvh overflow-hidden">
      <section
        aria-labelledby="weather-details-title"
        className="relative flex h-dvh w-full flex-col overflow-hidden"
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar para busca"
          className="absolute left-[clamp(20px,6vw,52px)] top-[clamp(18px,5dvh,42px)] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#004990] transition hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/40"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          </svg>
        </button>

        <div className="app-mobile-container shrink-0 pt-[clamp(72px,11dvh,92px)]">
          {isLoading ? (
            <p
              role="status"
              aria-live="polite"
              className="mt-8 rounded-2xl bg-white/90 px-5 py-4 text-center text-sm font-medium text-[#4596F0]"
            >
              Buscando detalhes da previsão...
            </p>
          ) : weatherDetails ? (
            <header className="pb-[clamp(14px,3dvh,24px)] text-center text-white">
              <p className="text-[clamp(14px,3.8vw,17px)] font-medium">
                {weatherDetails.locationLabel}
              </p>

              <h1
                id="weather-details-title"
                className="text-[clamp(32px,9vw,40px)] font-extrabold leading-tight"
              >
                {weatherDetails.city}
              </h1>

              <p className="mt-1 text-[clamp(68px,21vw,96px)] font-normal leading-none">
                {activeTemperature}°
              </p>

              <p className="mt-2 text-[clamp(16px,4.6vw,20px)] font-bold">
                Max: {activeMaxTemperature}° &nbsp; Min: {activeMinTemperature}°
              </p>

              <p className="mt-1 text-sm font-semibold text-white/90">
                {activeCondition}
              </p>
            </header>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 rounded-t-[44px] bg-white pt-4">
          <div className="app-mobile-container flex h-full min-h-0 flex-col">
            <h2 className="flex shrink-0 items-center justify-center gap-2 text-[17px] font-bold text-[#004990]">
              Condições
            </h2>

            {weatherDetails ? (
              <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3">
                <section
                  aria-labelledby="hourly-forecast-title"
                  className="shrink-0 rounded-[20px] bg-[#4296F0] px-4 py-3 text-white"
                >
                  <div className="flex items-center justify-between border-b border-white/70 pb-2">
                    <h3
                      id="hourly-forecast-title"
                      className="text-base font-medium"
                    >
                      {activeDailyForecast?.day ?? 'Hoje'}
                    </h3>

                    <p className="text-base font-medium">Julho</p>
                  </div>

                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {activeHourlyForecast?.map((forecast) => (
                      <article
                        key={forecast.id}
                        className="flex min-w-0 flex-col items-center text-center"
                      >
                        <p className="text-[10px] font-medium leading-tight">
                          {forecast.time}
                        </p>

                        <img
                          src={forecast.icon}
                          alt=""
                          aria-hidden="true"
                          className="mt-2 h-7 w-7 object-contain"
                        />

                        <p className="mt-1 text-[10px] font-semibold leading-tight">
                          {forecast.temperature}°
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                <section
                  aria-labelledby="daily-forecast-title"
                  className="min-h-0 flex-1 rounded-[20px] bg-[#4296F0] px-4 py-2 text-white"
                >
                  <h3
                    id="daily-forecast-title"
                    className="text-center text-[clamp(12px,3.4vw,14px)] font-semibold leading-none"
                  >
                    Previsão para 5 dias
                  </h3>

                  <div className="mt-2 grid h-[calc(100%-22px)] grid-rows-6">
                    {weatherDetails.dailyForecast
                      .slice(0, 6)
                      .map((forecast) => (
                        <button
                          key={forecast.id}
                          type="button"
                          onClick={() =>
                            setSelectedDailyForecastId(forecast.id)
                          }
                          aria-label={`Ver detalhes de ${forecast.day}`}
                          aria-pressed={activeDailyForecastId === forecast.id}
                          className={`-mx-2 grid min-h-0 grid-cols-[1fr_36px_88px] items-center overflow-hidden rounded-xl border-b border-white/40 px-2 text-left transition-colors last:border-b-0 focus:outline-none ${
                            activeDailyForecastId === forecast.id
                              ? 'bg-[#1F75D8]'
                              : 'bg-transparent hover:bg-[#2F86E8]'
                          }`}
                        >
                          <p className="min-w-0 truncate text-[clamp(14px,3.8vw,16px)] font-bold leading-none">
                            {forecast.day}
                          </p>

                          <div className="flex h-full max-h-[24px] min-h-0 w-9 items-center justify-center overflow-hidden">
                            <img
                              src={forecast.icon}
                              alt=""
                              aria-hidden="true"
                              className="block max-h-[22px] w-7 object-contain"
                            />
                          </div>

                          <p className="min-w-0 whitespace-nowrap text-right text-[clamp(14px,3.8vw,16px)] font-semibold leading-none">
                            {forecast.minTemperature}° /{' '}
                            {forecast.maxTemperature}°
                          </p>
                        </button>
                      ))}
                  </div>
                </section>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
