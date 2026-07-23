import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CityWeather } from '../../types/cityWeather';
import { searchCityWeatherList } from '../services/weatherService';
import { useWeatherSearch } from './useWeatherSearch';

vi.mock('../services/weatherService', () => ({
  searchCityWeatherList: vi.fn(),
}));

const saoPauloWeatherMock: CityWeather = {
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

const rioWeatherMock: CityWeather = {
  id: 'rio-de-janeiro-BR',
  city: 'Rio de Janeiro',
  locationLabel: 'Rio de Janeiro, BR',
  temperature: 28,
  minTemperature: 24,
  maxTemperature: 31,
  condition: 'Ensolarado',
  icon: '/ensolarado.svg',
  time: '12:00',
  lat: -22.9068,
  lon: -43.1729,
};

async function runScheduledEffects() {
  await act(async () => {
    await vi.runOnlyPendingTimersAsync();
  });
}

describe('useWeatherSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(searchCityWeatherList).mockResolvedValue([saoPauloWeatherMock]);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('loads São Paulo as the default city on mount', async () => {
    const { result } = renderHook(() => useWeatherSearch());

    expect(result.current.isLoading).toBe(true);

    await runScheduledEffects();

    expect(result.current.isLoading).toBe(false);
    expect(searchCityWeatherList).toHaveBeenCalledWith('São Paulo');
    expect(result.current.citiesWeather).toEqual([saoPauloWeatherMock]);
    expect(result.current.hasApiError).toBe(false);
  });

  it('searches a city after the debounce delay', async () => {
    const { result } = renderHook(() => useWeatherSearch());

    await runScheduledEffects();
    expect(result.current.isLoading).toBe(false);

    vi.mocked(searchCityWeatherList).mockClear();
    vi.mocked(searchCityWeatherList).mockResolvedValue([rioWeatherMock]);

    act(() => {
      result.current.setSearchTerm('Rio');
    });

    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(searchCityWeatherList).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(searchCityWeatherList).toHaveBeenCalledWith('Rio');
    expect(result.current.citiesWeather).toEqual([rioWeatherMock]);
  });

  it('returns to the default city when the search is cleared', async () => {
    const { result } = renderHook(() => useWeatherSearch());

    await runScheduledEffects();
    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.setSearchTerm('Rio');
      result.current.clearSearch();
    });

    await runScheduledEffects();

    expect(searchCityWeatherList).toHaveBeenLastCalledWith('São Paulo');
    expect(result.current.searchTerm).toBe('');
  });

  it('sets the API error state when the search request fails', async () => {
    vi.mocked(searchCityWeatherList).mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useWeatherSearch());

    await runScheduledEffects();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.citiesWeather).toEqual([]);
    expect(result.current.hasApiError).toBe(true);
  });

  it('retries the current search term', async () => {
    const { result } = renderHook(() => useWeatherSearch());

    await runScheduledEffects();
    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.setSearchTerm('Manaus');
    });

    vi.mocked(searchCityWeatherList).mockClear();
    vi.mocked(searchCityWeatherList).mockResolvedValue([
      {
        ...saoPauloWeatherMock,
        id: 'manaus-BR',
        city: 'Manaus',
        locationLabel: 'Manaus, BR',
      },
    ]);

    await act(async () => {
      await result.current.retrySearch();
    });

    expect(searchCityWeatherList).toHaveBeenCalledWith('Manaus');
    expect(result.current.hasApiError).toBe(false);
  });
});
