import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CityWeather } from '../../types/cityWeather';
import { useWeatherSearch } from '../hooks/useWeatherSearch';
import { WeatherSearchScreen } from './WeatherSearchScreen';

vi.mock('../hooks/useWeatherSearch', () => ({
  useWeatherSearch: vi.fn(),
}));

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

const defaultHookValue = {
  citiesWeather: [cityWeatherMock],
  clearSearch: vi.fn(),
  hasApiError: false,
  isLoading: false,
  retrySearch: vi.fn(),
  searchTerm: '',
  setSearchTerm: vi.fn(),
};

describe('WeatherSearchScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useWeatherSearch).mockReturnValue(defaultHookValue);
  });

  it('renders city list and selects a city', () => {
    const onSelectCity = vi.fn();

    render(<WeatherSearchScreen onSelectCity={onSelectCity} />);

    expect(screen.getByRole('heading', { name: 'Tempo' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /São Paulo/i }));

    expect(onSelectCity).toHaveBeenCalledWith(cityWeatherMock);
  });

  it('updates search term when the input changes', () => {
    const setSearchTerm = vi.fn();

    vi.mocked(useWeatherSearch).mockReturnValue({
      ...defaultHookValue,
      setSearchTerm,
    });

    render(<WeatherSearchScreen />);

    fireEvent.change(screen.getByLabelText('Buscar cidade'), {
      target: {
        value: 'Rio',
      },
    });

    expect(setSearchTerm).toHaveBeenCalledWith('Rio');
  });

  it('renders clear button when there is a search term', () => {
    const clearSearch = vi.fn();

    vi.mocked(useWeatherSearch).mockReturnValue({
      ...defaultHookValue,
      clearSearch,
      searchTerm: 'Rio',
    });

    render(<WeatherSearchScreen />);

    fireEvent.click(screen.getByRole('button', { name: 'Limpar busca' }));

    expect(clearSearch).toHaveBeenCalledTimes(1);
  });

  it('renders loading skeleton', () => {
    vi.mocked(useWeatherSearch).mockReturnValue({
      ...defaultHookValue,
      citiesWeather: [],
      isLoading: true,
    });

    render(<WeatherSearchScreen />);

    expect(
      screen.getByRole('status', { name: 'Carregando previsão' }),
    ).toBeInTheDocument();
  });

  it('renders city not found state when search has no results', () => {
    const clearSearch = vi.fn();

    vi.mocked(useWeatherSearch).mockReturnValue({
      ...defaultHookValue,
      citiesWeather: [],
      clearSearch,
      searchTerm: 'Cidade inexistente',
    });

    render(<WeatherSearchScreen />);

    expect(
      screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(clearSearch).toHaveBeenCalledTimes(1);
  });

  it('renders API error state and retries search', () => {
    const retrySearch = vi.fn();

    vi.mocked(useWeatherSearch).mockReturnValue({
      ...defaultHookValue,
      hasApiError: true,
      retrySearch,
    });

    render(<WeatherSearchScreen />);

    expect(
      screen.getByRole('heading', {
        name: 'Ops! Parece que algo deu errado',
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(retrySearch).toHaveBeenCalledTimes(1);
  });

  it('renders no state when there are no cities and no search term', () => {
    vi.mocked(useWeatherSearch).mockReturnValue({
      ...defaultHookValue,
      citiesWeather: [],
      searchTerm: '',
    });

    render(<WeatherSearchScreen />);

    expect(screen.getByRole('heading', { name: 'Tempo' })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Nenhuma cidade encontrada' }),
    ).not.toBeInTheDocument();
  });
});
