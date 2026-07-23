import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CityWeather } from '../../types/cityWeather';
import type { WeatherDetails } from '../../types/weatherDetails';
import { getWeatherDetailsByCoordinates } from '../services/weatherService';
import { useWeatherDetails } from './useWeatherDetails';

vi.mock('../services/weatherService', () => ({
  getWeatherDetailsByCoordinates: vi.fn(),
}));

const selectedCityMock: CityWeather = {
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

const weatherDetailsMock: WeatherDetails = {
  city: 'São Paulo',
  locationLabel: 'São Paulo, BR',
  currentTemperature: 20,
  maxTemperature: 25,
  minTemperature: 18,
  condition: 'Chuva fraca',
  time: '12:00',
  hourlyForecast: [
    {
      id: 'today-now',
      dateKey: '2026-07-21',
      time: 'Agora',
      temperature: 20,
      condition: 'Chuva fraca',
      icon: '/chuva.svg',
    },
  ],
  dailyForecast: [
    {
      id: 'today',
      dateKey: '2026-07-21',
      day: 'Hoje',
      temperature: 20,
      minTemperature: 18,
      maxTemperature: 25,
      condition: 'Chuva fraca',
      icon: '/chuva.svg',
      hourlyForecast: [
        {
          id: 'today-now',
          dateKey: '2026-07-21',
          time: 'Agora',
          temperature: 20,
          condition: 'Chuva fraca',
          icon: '/chuva.svg',
        },
      ],
    },
    {
      id: 'tomorrow',
      dateKey: '2026-07-22',
      day: 'Qua.',
      temperature: 15,
      minTemperature: 15,
      maxTemperature: 28,
      condition: 'Nublado',
      icon: '/nublado.svg',
      hourlyForecast: [
        {
          id: 'tomorrow-00',
          dateKey: '2026-07-22',
          time: '00:00',
          temperature: 15,
          condition: 'Céu limpo',
          icon: '/noite.svg',
        },
      ],
    },
  ],
};

async function runScheduledEffects() {
  await act(async () => {
    await vi.runOnlyPendingTimersAsync();
  });
}

function createDeferredPromise<T>() {
  let resolvePromise!: (value: T) => void;
  let rejectPromise!: (reason?: unknown) => void;

  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  return {
    promise,
    reject: rejectPromise,
    resolve: resolvePromise,
  };
}

describe('useWeatherDetails', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(getWeatherDetailsByCoordinates).mockResolvedValue(
      weatherDetailsMock,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('loads the selected city weather details on mount', async () => {
    const { result } = renderHook(() => useWeatherDetails(selectedCityMock));

    expect(result.current.isLoading).toBe(true);

    await runScheduledEffects();

    expect(result.current.isLoading).toBe(false);
    expect(getWeatherDetailsByCoordinates).toHaveBeenCalledWith(
      selectedCityMock,
    );
    expect(result.current.weatherDetails).toEqual(weatherDetailsMock);
    expect(result.current.activeDailyForecastId).toBe('today');
    expect(result.current.activeTemperature).toBe(20);
  });

  it('updates active weather values when a daily forecast is selected', async () => {
    const { result } = renderHook(() => useWeatherDetails(selectedCityMock));

    await runScheduledEffects();
    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.setSelectedDailyForecastId('tomorrow');
    });

    expect(result.current.activeDailyForecastId).toBe('tomorrow');
    expect(result.current.activeTemperature).toBe(15);
    expect(result.current.activeMinTemperature).toBe(15);
    expect(result.current.activeMaxTemperature).toBe(28);
    expect(result.current.activeHourlyForecast).toEqual(
      weatherDetailsMock.dailyForecast[1].hourlyForecast,
    );
  });

  it('falls back to the first daily forecast when the selected daily forecast does not exist', async () => {
    const { result } = renderHook(() => useWeatherDetails(selectedCityMock));

    await runScheduledEffects();

    act(() => {
      result.current.setSelectedDailyForecastId('unknown-day');
    });

    expect(result.current.activeDailyForecastId).toBe('today');
    expect(result.current.activeDailyForecast).toEqual(
      weatherDetailsMock.dailyForecast[0],
    );
  });

  it('returns null active daily forecast when the selected forecast does not exist and the daily list is empty', async () => {
    const weatherDetailsWithoutDailyForecast: WeatherDetails = {
      ...weatherDetailsMock,
      dailyForecast: [],
    };

    vi.mocked(getWeatherDetailsByCoordinates).mockResolvedValue(
      weatherDetailsWithoutDailyForecast,
    );

    const { result } = renderHook(() => useWeatherDetails(selectedCityMock));

    await runScheduledEffects();

    act(() => {
      result.current.setSelectedDailyForecastId('unknown-day');
    });

    expect(result.current.activeDailyForecast).toBeNull();
    expect(result.current.activeDailyForecastId).toBeUndefined();
    expect(result.current.activeTemperature).toBe(
      weatherDetailsWithoutDailyForecast.currentTemperature,
    );
  });

  it('sets the API error state when details request fails', async () => {
    vi.mocked(getWeatherDetailsByCoordinates).mockRejectedValue(
      new Error('API error'),
    );

    const { result } = renderHook(() => useWeatherDetails(selectedCityMock));

    await runScheduledEffects();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.weatherDetails).toBeNull();
    expect(result.current.hasApiError).toBe(true);
  });

  it('retries the weather details request', async () => {
    vi.mocked(getWeatherDetailsByCoordinates)
      .mockRejectedValueOnce(new Error('API error'))
      .mockResolvedValueOnce(weatherDetailsMock);

    const { result } = renderHook(() => useWeatherDetails(selectedCityMock));

    await runScheduledEffects();
    expect(result.current.hasApiError).toBe(true);

    await act(async () => {
      await result.current.retryWeatherDetails();
    });

    expect(result.current.hasApiError).toBe(false);
    expect(result.current.weatherDetails).toEqual(weatherDetailsMock);
  });

  it('does not update weather details when the request resolves after unmount', async () => {
    const deferredWeatherDetails = createDeferredPromise<WeatherDetails>();

    vi.mocked(getWeatherDetailsByCoordinates).mockReturnValue(
      deferredWeatherDetails.promise,
    );

    const { unmount } = renderHook(() => useWeatherDetails(selectedCityMock));

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    unmount();

    await act(async () => {
      deferredWeatherDetails.resolve(weatherDetailsMock);
      await deferredWeatherDetails.promise;
    });

    expect(getWeatherDetailsByCoordinates).toHaveBeenCalledWith(
      selectedCityMock,
    );
  });

  it('does not update API error state when the request rejects after unmount', async () => {
    const deferredWeatherDetails = createDeferredPromise<WeatherDetails>();

    vi.mocked(getWeatherDetailsByCoordinates).mockReturnValue(
      deferredWeatherDetails.promise,
    );

    const { unmount } = renderHook(() => useWeatherDetails(selectedCityMock));

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    unmount();

    await act(async () => {
      deferredWeatherDetails.reject(new Error('API error'));

      await expect(deferredWeatherDetails.promise).rejects.toThrow('API error');
    });

    expect(getWeatherDetailsByCoordinates).toHaveBeenCalledWith(
      selectedCityMock,
    );
  });
});
