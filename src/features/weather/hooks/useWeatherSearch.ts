import { useCallback, useEffect, useState } from 'react';
import type { CityWeather } from '../../types/cityWeather';
import { ANALYTICS_COLLECTION_EVENTS } from '../../../shared/analytics/analyticsParameters';
import {
  trackCollectionEvent,
  trackEvent,
} from '../../../shared/analytics/analyticsService';
import { searchCityWeatherList } from '../services/weatherService';

const DEFAULT_CITY_NAME = 'São Paulo';
const SEARCH_DEBOUNCE_IN_MS = 500;

export function useWeatherSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [citiesWeather, setCitiesWeather] = useState<CityWeather[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApiError, setHasApiError] = useState(false);

  const loadCitiesWeather = useCallback(
    async (cityName: string, shouldUpdate: () => boolean = () => true) => {
      setIsLoading(true);
      setHasApiError(false);

      try {
        const weatherList = await searchCityWeatherList(cityName);

        if (shouldUpdate()) {
          setCitiesWeather(weatherList);
          trackEvent('city_search_completed', {
            city: cityName,
            result_count: weatherList.length,
          });
          trackCollectionEvent(
            ANALYTICS_COLLECTION_EVENTS.homeSearchButtonClicked,
            {
              city: cityName,
              result_count: weatherList.length,
            },
          );
        }
      } catch {
        if (shouldUpdate()) {
          setCitiesWeather([]);
          setHasApiError(true);
          trackEvent('api_error', {
            context: 'weather_search',
          });
        }
      } finally {
        if (shouldUpdate()) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    let isActive = true;

    const cityName = getCityNameForSearch(searchTerm);
    const debounceTime = searchTerm.trim() ? SEARCH_DEBOUNCE_IN_MS : 0;

    const timeoutId = window.setTimeout(() => {
      void loadCitiesWeather(cityName, () => isActive);
    }, debounceTime);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [loadCitiesWeather, searchTerm]);

  function clearSearch() {
    trackEvent('city_search_cleared');
    setSearchTerm('');
  }

  function handleSearchTermChange(searchValue: string) {
    if (!searchTerm.trim() && searchValue.trim()) {
      trackCollectionEvent(ANALYTICS_COLLECTION_EVENTS.homeSearchFieldFilled);
    }

    setSearchTerm(searchValue);
  }

  async function retrySearch() {
    const cityName = getCityNameForSearch(searchTerm);

    trackEvent('city_search_retried', {
      city: cityName,
    });
    trackCollectionEvent(ANALYTICS_COLLECTION_EVENTS.apiErrorRetryClicked, {
      city: cityName,
    });

    await loadCitiesWeather(cityName);
  }

  return {
    citiesWeather,
    clearSearch,
    hasApiError,
    isLoading,
    retrySearch,
    searchTerm,
    setSearchTerm: handleSearchTermChange,
  };
}

function getCityNameForSearch(searchTerm: string) {
  return searchTerm.trim() || DEFAULT_CITY_NAME;
}
