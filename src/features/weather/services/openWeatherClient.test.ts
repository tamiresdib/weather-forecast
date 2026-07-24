import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchCityLocation,
  fetchCurrentWeatherByCoordinates,
  fetchForecastByCoordinates,
} from './openWeatherClient';

const fetchMock = vi.fn();

function createFetchResponse<T>(data: T, ok = true) {
  return {
    json: vi.fn().mockResolvedValue(data),
    ok,
  } as unknown as Response;
}

describe('openWeatherClient', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'open-weather-key');
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockResolvedValue(createFetchResponse({}));
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('throws when the OpenWeather API key is missing', async () => {
    vi.stubEnv('VITE_OPENWEATHER_API_KEY', '');

    await expect(fetchCityLocation('São Paulo')).rejects.toThrow(
      'OpenWeather API key is missing.',
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('throws when OpenWeather returns a non-ok response', async () => {
    fetchMock.mockResolvedValue(createFetchResponse({}, false));

    await expect(fetchCityLocation('São Paulo')).rejects.toThrow(
      'OpenWeather request failed.',
    );
  });

  it('fetches the first city location', async () => {
    const location = {
      name: 'São Paulo',
      lat: -23.5505,
      lon: -46.6333,
      country: 'BR',
      state: 'São Paulo',
    };

    fetchMock.mockResolvedValue(createFetchResponse([location]));

    await expect(fetchCityLocation(' São Paulo ')).resolves.toEqual(location);

    const requestedUrl = new URL(fetchMock.mock.calls[0][0] as string);

    expect(requestedUrl.pathname).toBe('/geo/1.0/direct');
    expect(requestedUrl.searchParams.get('q')).toBe('São Paulo');
    expect(requestedUrl.searchParams.get('limit')).toBe('1');
    expect(requestedUrl.searchParams.get('appid')).toBe('open-weather-key');
    expect(requestedUrl.searchParams.get('units')).toBe('metric');
    expect(requestedUrl.searchParams.get('lang')).toBe('pt_br');
  });

  it('returns undefined when city location is not found', async () => {
    fetchMock.mockResolvedValue(createFetchResponse([]));

    await expect(fetchCityLocation('Unknown city')).resolves.toBeUndefined();
  });

  it('fetches current weather by coordinates', async () => {
    const currentWeather = {
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

    fetchMock.mockResolvedValue(createFetchResponse(currentWeather));

    await expect(
      fetchCurrentWeatherByCoordinates(-23.5505, -46.6333),
    ).resolves.toEqual(currentWeather);

    const requestedUrl = new URL(fetchMock.mock.calls[0][0] as string);

    expect(requestedUrl.pathname).toBe('/data/2.5/weather');
    expect(requestedUrl.searchParams.get('lat')).toBe('-23.5505');
    expect(requestedUrl.searchParams.get('lon')).toBe('-46.6333');
  });

  it('fetches forecast by coordinates', async () => {
    const forecast = {
      city: {
        name: 'São Paulo',
        country: 'BR',
        timezone: -10800,
      },
      list: [],
    };

    fetchMock.mockResolvedValue(createFetchResponse(forecast));

    await expect(
      fetchForecastByCoordinates(-23.5505, -46.6333),
    ).resolves.toEqual(forecast);

    const requestedUrl = new URL(fetchMock.mock.calls[0][0] as string);

    expect(requestedUrl.pathname).toBe('/data/2.5/forecast');
    expect(requestedUrl.searchParams.get('lat')).toBe('-23.5505');
    expect(requestedUrl.searchParams.get('lon')).toBe('-46.6333');
  });
});
