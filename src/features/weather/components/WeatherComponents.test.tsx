import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CityWeather } from '../../types/cityWeather';
import type {
  DailyForecast,
  HourlyForecast,
} from '../../types/weatherDetails';
import { ApiErrorState } from './ApiErrorState';
import { BackButton } from './BackButton';
import { CityNotFoundState } from './CityNotFoundState';
import { CityWeatherCard } from './CityWeatherCard';
import { DailyForecastItem } from './DailyForecastItem';
import { HourlyForecastItem } from './HourlyForecastItem';
import { WeatherDetailsLayout } from './WeatherDetailsLayout';
import {
  WeatherConditionsSkeleton,
  WeatherDetailsSkeleton,
  WeatherSearchSkeleton,
} from './WeatherSkeletons';

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

const hourlyForecastMock: HourlyForecast = {
  id: 'today-now',
  dateKey: '2026-07-21',
  time: 'Agora',
  temperature: 20,
  condition: 'Chuva fraca',
  icon: '/chuva.svg',
};

const dailyForecastMock: DailyForecast = {
  id: 'today',
  dateKey: '2026-07-21',
  day: 'Hoje',
  temperature: 20,
  minTemperature: 18,
  maxTemperature: 25,
  condition: 'Chuva fraca',
  icon: '/chuva.svg',
  hourlyForecast: [hourlyForecastMock],
};

describe('weather components', () => {
  it('renders API error state and calls retry', async () => {
    const onRetry = vi.fn().mockResolvedValue(undefined);

    render(<ApiErrorState onRetry={onRetry} />);

    expect(
      screen.getByRole('heading', {
        name: 'Ops! Parece que algo deu errado',
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(screen.getByRole('button')).toHaveTextContent('Tentando...');

    await waitFor(() => expect(onRetry).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getByRole('button')).toHaveTextContent('Tentar novamente'),
    );
  });

  it('hides API error illustration when the image fails to load', () => {
    const { container } = render(<ApiErrorState onRetry={vi.fn()} />);

    const image = container.querySelector('img');

    expect(image).toBeInTheDocument();

    fireEvent.error(image as HTMLImageElement);

    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('calls back button click handler', () => {
    const onClick = vi.fn();

    render(<BackButton onClick={onClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Voltar para busca' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders city not found state and calls retry', () => {
    const onRetry = vi.fn();

    render(<CityNotFoundState onRetry={onRetry} />);

    expect(
      screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders city weather card and sends the selected city on click', () => {
    const onClick = vi.fn();

    render(<CityWeatherCard weather={cityWeatherMock} onClick={onClick} />);

    expect(screen.getByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.getByText('São Paulo, BR')).toBeInTheDocument();
    expect(screen.getByText('20°')).toBeInTheDocument();
    expect(screen.getByText('Chuva fraca')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledWith(cityWeatherMock);
  });

  it('renders city weather card without location label', () => {
    render(
      <CityWeatherCard
        weather={{
          ...cityWeatherMock,
          locationLabel: '',
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.queryByText('São Paulo, BR')).not.toBeInTheDocument();
  });

  it('renders daily forecast item', () => {
    render(<DailyForecastItem forecast={dailyForecastMock} />);

    expect(screen.getByText('Hoje')).toBeInTheDocument();
    expect(screen.getByAltText('Chuva fraca')).toBeInTheDocument();
    expect(screen.getByText('18° 25°')).toBeInTheDocument();
  });

  it('renders hourly forecast item', () => {
    render(<HourlyForecastItem forecast={hourlyForecastMock} />);

    expect(screen.getByText('Agora')).toBeInTheDocument();
    expect(screen.getByText('20°')).toBeInTheDocument();
  });

  it('renders weather details layout with back button and labelled section', () => {
    const onBack = vi.fn();

    render(
      <WeatherDetailsLayout labelledBy="details-title" onBack={onBack}>
        <h1 id="details-title">Detalhes</h1>
      </WeatherDetailsLayout>,
    );

    expect(screen.getByRole('heading', { name: 'Detalhes' })).toBeInTheDocument();
    expect(screen.getByLabelText('Voltar para busca')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Voltar para busca'));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders skeleton states', () => {
    render(
      <>
        <WeatherSearchSkeleton />
        <WeatherDetailsSkeleton />
        <WeatherConditionsSkeleton />
      </>,
    );

    expect(screen.getByRole('status', { name: 'Carregando previsão' })).toBeInTheDocument();
    expect(
      screen.getByRole('status', {
        name: 'Carregando detalhes da previsão',
      }),
    ).toBeInTheDocument();
  });
});
