import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CityWeather } from '../../types/cityWeather';
import type { WeatherDetails } from '../../types/weatherDetails';
import { useWeatherDetails } from '../hooks/useWeatherDetails';
import { WeatherDetailsScreen } from './WeatherDetailsScreen';

vi.mock('../hooks/useWeatherDetails', () => ({
  useWeatherDetails: vi.fn(),
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
      hourlyForecast: [],
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
      hourlyForecast: [],
    },
  ],
};

const defaultHookValue = {
  activeCondition: 'Chuva fraca',
  activeDailyForecast: weatherDetailsMock.dailyForecast[0],
  activeDailyForecastId: 'today',
  activeHourlyForecast: weatherDetailsMock.hourlyForecast,
  activeMaxTemperature: 25,
  activeMinTemperature: 18,
  activeTemperature: 20,
  hasApiError: false,
  isLoading: false,
  retryWeatherDetails: vi.fn(),
  selectedDailyForecastId: null,
  setSelectedDailyForecastId: vi.fn(),
  weatherDetails: weatherDetailsMock,
};

describe('WeatherDetailsScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useWeatherDetails).mockReturnValue(defaultHookValue);
  });

  it('renders weather details', () => {
    render(<WeatherDetailsScreen selectedCity={selectedCityMock} />);

    expect(screen.getByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.getByText('São Paulo, BR')).toBeInTheDocument();
    expect(screen.getAllByText('20°').length).toBeGreaterThan(0);
    expect(screen.getByText(/Max: 25°/)).toBeInTheDocument();
    expect(screen.getByText('Chuva fraca')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Condições' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Previsão para 5 dias' }),
    ).toBeInTheDocument();
  });

  it('calls back handler', () => {
    const onBack = vi.fn();

    render(
      <WeatherDetailsScreen selectedCity={selectedCityMock} onBack={onBack} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Voltar para busca' }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('selects a daily forecast', () => {
    const setSelectedDailyForecastId = vi.fn();

    vi.mocked(useWeatherDetails).mockReturnValue({
      ...defaultHookValue,
      setSelectedDailyForecastId,
    });

    render(<WeatherDetailsScreen selectedCity={selectedCityMock} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ver detalhes de Qua.' }));

    expect(setSelectedDailyForecastId).toHaveBeenCalledWith('tomorrow');
  });

  it('renders loading skeletons', () => {
    vi.mocked(useWeatherDetails).mockReturnValue({
      ...defaultHookValue,
      isLoading: true,
      weatherDetails: null,
    });

    render(<WeatherDetailsScreen selectedCity={selectedCityMock} />);

    expect(
      screen.getByRole('status', {
        name: 'Carregando detalhes da previsão',
      }),
    ).toBeInTheDocument();
  });

  it('renders API error state and retries details request', () => {
    const retryWeatherDetails = vi.fn();

    vi.mocked(useWeatherDetails).mockReturnValue({
      ...defaultHookValue,
      hasApiError: true,
      retryWeatherDetails,
      weatherDetails: null,
    });

    render(<WeatherDetailsScreen selectedCity={selectedCityMock} />);

    expect(
      screen.getByRole('heading', {
        name: 'Ops! Parece que algo deu errado',
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(retryWeatherDetails).toHaveBeenCalledTimes(1);
  });

  it('renders layout without details when data is not available after loading', () => {
    vi.mocked(useWeatherDetails).mockReturnValue({
      ...defaultHookValue,
      activeDailyForecast: null,
      activeDailyForecastId: undefined,
      activeHourlyForecast: undefined,
      weatherDetails: null,
    });

    render(<WeatherDetailsScreen selectedCity={selectedCityMock} />);

    expect(screen.getByRole('heading', { name: 'Condições' })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'São Paulo' }),
    ).not.toBeInTheDocument();
  });

  it('uses Hoje as hourly forecast title when there is no active daily forecast', () => {
    vi.mocked(useWeatherDetails).mockReturnValue({
      ...defaultHookValue,
      activeDailyForecast: null,
      activeDailyForecastId: undefined,
    });

    render(<WeatherDetailsScreen selectedCity={selectedCityMock} />);

    expect(
      screen.getByRole('heading', {
        name: 'Hoje',
      }),
    ).toBeInTheDocument();
  });
});
