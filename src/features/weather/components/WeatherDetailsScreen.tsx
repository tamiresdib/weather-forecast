import type { CityWeather } from '../../types/cityWeather';
import { ANALYTICS_COLLECTION_EVENTS } from '../../../shared/analytics/analyticsParameters';
import {
  trackCollectionEvent,
  trackEvent,
} from '../../../shared/analytics/analyticsService';
import { useWeatherDetails } from '../hooks/useWeatherDetails';
import { ApiErrorState } from './ApiErrorState';
import { WeatherDetailsLayout } from './WeatherDetailsLayout';
import {
  WeatherConditionsSkeleton,
  WeatherDetailsSkeleton,
} from './WeatherSkeletons';

type WeatherDetailsScreenProps = {
  selectedCity: CityWeather;
  onBack?: () => void;
};

export function WeatherDetailsScreen({
  selectedCity,
  onBack,
}: WeatherDetailsScreenProps) {
  const {
    activeCondition,
    activeDailyForecast,
    activeDailyForecastId,
    activeHourlyForecast,
    activeMaxTemperature,
    activeMinTemperature,
    activeTemperature,
    hasApiError,
    isLoading,
    retryWeatherDetails,
    setSelectedDailyForecastId,
    weatherDetails,
  } = useWeatherDetails(selectedCity);

  if (hasApiError) {
    return (
      <WeatherDetailsLayout onBack={onBack}>
        <div className="app-screen app-mobile-container">
          <ApiErrorState onRetry={retryWeatherDetails} />
        </div>
      </WeatherDetailsLayout>
    );
  }

  return (
    <WeatherDetailsLayout labelledBy="weather-details-title" onBack={onBack}>
      <div className="app-mobile-container shrink-0 pt-[clamp(72px,11dvh,92px)]">
        {isLoading ? (
          <WeatherDetailsSkeleton />
        ) : weatherDetails ? (
          <header className="pb-[clamp(22px,4.5dvh,36px)] text-center text-white">
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

      <div className="min-h-0 flex-1 rounded-t-[44px] bg-white pt-3">
        <div className="app-mobile-container flex h-full min-h-0 flex-col px-[clamp(20px,6vw,32px)]">
          <h2 className="flex shrink-0 items-center justify-center gap-2 text-[17px] font-bold text-[#004990]">
            Condições
          </h2>

          {isLoading ? (
            <WeatherConditionsSkeleton />
          ) : weatherDetails ? (
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

                <div className="mt-2 grid grid-cols-5 gap-1">
                  {activeHourlyForecast?.map((forecast) => (
                    <article
                      key={forecast.id}
                      className="flex min-w-0 flex-col items-center text-center"
                    >
                      <p className="max-w-full truncate text-[clamp(8px,2.4vw,10px)] font-medium leading-tight">
                        {forecast.time}
                      </p>

                      <img
                        src={forecast.icon}
                        alt=""
                        aria-hidden="true"
                        className="mt-1.5 h-[clamp(18px,5vw,24px)] w-[clamp(18px,5vw,24px)] object-contain"
                      />

                      <p className="mt-1 text-[clamp(8px,2.4vw,10px)] font-semibold leading-tight">
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
                    .map((forecast, index, forecastList) => (
                      <div key={forecast.id} className="flex min-h-0 flex-col">
                        <button
                          type="button"
                          onClick={() => {
                            trackEvent('forecast_day_selected', {
                              city: weatherDetails.city,
                              forecast_day: forecast.day,
                            });
                            trackCollectionEvent(
                              ANALYTICS_COLLECTION_EVENTS.detailsNextDaysForecastViewed,
                              {
                                city: weatherDetails.city,
                                forecast_day: forecast.day,
                              },
                            );
                            setSelectedDailyForecastId(forecast.id);
                          }}
                          aria-label={`Ver detalhes de ${forecast.day}`}
                          aria-pressed={activeDailyForecastId === forecast.id}
                          className={`grid min-h-0 flex-1 grid-cols-[minmax(64px,1fr)_36px_minmax(82px,92px)] items-center rounded-xl px-2 py-0.5 text-left transition-colors focus:outline-none ${
                            activeDailyForecastId === forecast.id
                              ? 'bg-[#1F75D8]'
                              : 'bg-transparent hover:bg-[#2F86E8]'
                          }`}
                        >
                          <p className="min-w-0 truncate text-[clamp(14px,3.8vw,16px)] font-bold leading-none">
                            {forecast.day}
                          </p>

                          <div className="flex min-h-0 w-9 items-center justify-center justify-self-center">
                            <img
                              src={forecast.icon}
                              alt=""
                              aria-hidden="true"
                              className="block h-[clamp(16px,4.6vw,22px)] w-[clamp(16px,4.6vw,22px)] object-contain"
                            />
                          </div>

                          <p className="min-w-0 whitespace-nowrap text-right text-[clamp(14px,3.8vw,16px)] font-semibold leading-none">
                            {forecast.minTemperature}° /{' '}
                            {forecast.maxTemperature}°
                          </p>
                        </button>

                        {index < forecastList.length - 1 ? (
                          <div className="h-px w-full bg-white/40" />
                        ) : null}
                      </div>
                    ))}
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </WeatherDetailsLayout>
  );
}
