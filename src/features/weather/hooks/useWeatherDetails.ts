import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CityWeather } from '../../types/cityWeather';
import type { WeatherDetails } from '../../types/weatherDetails';
import { getWeatherDetailsByCoordinates } from '../services/weatherService';

export function useWeatherDetails(selectedCity: CityWeather) {
  const [weatherDetails, setWeatherDetails] = useState<WeatherDetails | null>(
    null,
  );
  const [selectedDailyForecastId, setSelectedDailyForecastId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApiError, setHasApiError] = useState(false);

  const loadWeatherDetails = useCallback(
    async (shouldUpdate: () => boolean = () => true) => {
      setIsLoading(true);
      setHasApiError(false);

      try {
        const details = await getWeatherDetailsByCoordinates(selectedCity);

        if (shouldUpdate()) {
          setWeatherDetails(details);
          setSelectedDailyForecastId(null);
        }
      } catch {
        if (shouldUpdate()) {
          setWeatherDetails(null);
          setHasApiError(true);
        }
      } finally {
        if (shouldUpdate()) {
          setIsLoading(false);
        }
      }
    },
    [selectedCity],
  );

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      void loadWeatherDetails(() => isMounted);
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [loadWeatherDetails]);

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

  return {
    activeCondition: activeDailyForecast?.condition ?? weatherDetails?.condition,
    activeDailyForecast,
    activeDailyForecastId: activeDailyForecast?.id,
    activeHourlyForecast:
      activeDailyForecast?.hourlyForecast ?? weatherDetails?.hourlyForecast,
    activeMaxTemperature:
      activeDailyForecast?.maxTemperature ?? weatherDetails?.maxTemperature,
    activeMinTemperature:
      activeDailyForecast?.minTemperature ?? weatherDetails?.minTemperature,
    activeTemperature:
      activeDailyForecast?.temperature ?? weatherDetails?.currentTemperature,
    hasApiError,
    isLoading,
    retryWeatherDetails: loadWeatherDetails,
    selectedDailyForecastId,
    setSelectedDailyForecastId,
    weatherDetails,
  };
}
