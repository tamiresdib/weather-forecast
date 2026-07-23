import type { CityWeather } from '../../types/cityWeather';
import type { WeatherDetails } from '../../types/weatherDetails';
import {
  mapCurrentWeatherToCityWeather,
  mapForecastToWeatherDetails,
} from '../mappers/weatherMapper';
import {
  fetchCityLocation,
  fetchCurrentWeatherByCoordinates,
  fetchForecastByCoordinates,
} from './openWeatherClient';

export async function searchCityWeatherList(
  cityName: string,
): Promise<CityWeather[]> {
  const location = await fetchCityLocation(cityName);

  if (!location) {
    return [];
  }

  const currentWeather = await fetchCurrentWeatherByCoordinates(
    location.lat,
    location.lon,
  );

  return [mapCurrentWeatherToCityWeather(location, currentWeather)];
}

export async function getWeatherDetailsByCoordinates(
  selectedCity: CityWeather,
): Promise<WeatherDetails> {
  const forecast = await fetchForecastByCoordinates(
    selectedCity.lat,
    selectedCity.lon,
  );

  return mapForecastToWeatherDetails(forecast, selectedCity);
}
