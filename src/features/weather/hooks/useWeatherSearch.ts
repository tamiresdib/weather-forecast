import { useCallback, useEffect, useState } from 'react';
import type { CityWeather } from '../../types/cityWeather';
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
        }
      } catch {
        if (shouldUpdate()) {
          setCitiesWeather([]);
          setHasApiError(true);
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
    setSearchTerm('');
  }

  async function retrySearch() {
    const cityName = getCityNameForSearch(searchTerm);

    await loadCitiesWeather(cityName);
  }

  return {
    citiesWeather,
    clearSearch,
    hasApiError,
    isLoading,
    retrySearch,
    searchTerm,
    setSearchTerm,
  };
}

function getCityNameForSearch(searchTerm: string) {
  return searchTerm.trim() || DEFAULT_CITY_NAME;
}
