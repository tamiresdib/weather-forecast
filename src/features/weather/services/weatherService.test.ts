import { beforeEach, describe, expect, it, vi } from 'vitest';
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
import {
  getWeatherDetailsByCoordinates,
  searchCityWeatherList,
} from './weatherService';

vi.mock('./openWeatherClient', () => ({
  fetchCityLocation: vi.fn(),
  fetchCurrentWeatherByCoordinates: vi.fn(),
  fetchForecastByCoordinates: vi.fn(),
}));

vi.mock('../mappers/weatherMapper', () => ({
  mapCurrentWeatherToCityWeather: vi.fn(),
  mapForecastToWeatherDetails: vi.fn(),
}));

const locationMock = {
  name: 'São Paulo',
  lat: -23.5505,
  lon: -46.6333,
  country: 'BR',
  state: 'São Paulo',
};

const currentWeatherResponseMock = {
  dt: 1784646000,
  timezone: -10800,
  name: 'São Paulo',
  main: {
    temp: 20,
    temp_min: 18,
    temp_max: 25,
  },
  weather: [
    {
      main: 'Rain',
      description: 'chuva fraca',
      icon: '10d',
    },
  ],
};

const cityWeatherMock: CityWeather = {
  id: 'sao-paulo-BR',
  city: 'São Paulo',
  locationLabel: 'São Paulo, BR',
  temperature: 20,
  minTemperature: 18,
  maxTemperature: 25,
  condition: 'Chuva fraca',
  icon: '/chuva.svg',
  time: '12:00',
  lat: -23.5505,
  lon: -46.6333,
};

const forecastResponseMock = {
  city: {
    name: 'São Paulo',
    country: 'BR',
    timezone: -10800,
  },
  list: [],
};

const weatherDetailsMock: WeatherDetails = {
  city: 'São Paulo',
  locationLabel: 'São Paulo, BR',
  currentTemperature: 20,
  maxTemperature: 25,
  minTemperature: 18,
  condition: 'Chuva fraca',
  time: '12:00',
  hourlyForecast: [],
  dailyForecast: [],
};

describe('weatherService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns an empty list when the city location is not found', async () => {
    vi.mocked(fetchCityLocation).mockResolvedValue(undefined);

    await expect(searchCityWeatherList('Unknown city')).resolves.toEqual([]);

    expect(fetchCityLocation).toHaveBeenCalledWith('Unknown city');
    expect(fetchCurrentWeatherByCoordinates).not.toHaveBeenCalled();
    expect(mapCurrentWeatherToCityWeather).not.toHaveBeenCalled();
  });

  it('fetches current weather by coordinates and maps the response', async () => {
    vi.mocked(fetchCityLocation).mockResolvedValue(locationMock);
    vi.mocked(fetchCurrentWeatherByCoordinates).mockResolvedValue(
      currentWeatherResponseMock,
    );
    vi.mocked(mapCurrentWeatherToCityWeather).mockReturnValue(cityWeatherMock);

    await expect(searchCityWeatherList('São Paulo')).resolves.toEqual([
      cityWeatherMock,
    ]);

    expect(fetchCurrentWeatherByCoordinates).toHaveBeenCalledWith(
      locationMock.lat,
      locationMock.lon,
    );
    expect(mapCurrentWeatherToCityWeather).toHaveBeenCalledWith(
      locationMock,
      currentWeatherResponseMock,
    );
  });

  it('fetches forecast by coordinates and maps weather details', async () => {
    vi.mocked(fetchForecastByCoordinates).mockResolvedValue(forecastResponseMock);
    vi.mocked(mapForecastToWeatherDetails).mockReturnValue(weatherDetailsMock);

    await expect(getWeatherDetailsByCoordinates(cityWeatherMock)).resolves.toBe(
      weatherDetailsMock,
    );

    expect(fetchForecastByCoordinates).toHaveBeenCalledWith(
      cityWeatherMock.lat,
      cityWeatherMock.lon,
    );
    expect(mapForecastToWeatherDetails).toHaveBeenCalledWith(
      forecastResponseMock,
      cityWeatherMock,
    );
  });
});
