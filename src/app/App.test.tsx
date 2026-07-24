import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CityWeather } from '../features/types/cityWeather';
import App from './App';

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

vi.mock('../features/welcome/components/WelcomeScreen', () => ({
  WelcomeScreen: ({ onStart }: { onStart: () => void }) => (
    <button type="button" onClick={onStart}>
      Start mocked app
    </button>
  ),
}));

vi.mock('../features/weather/components/WeatherSearchScreen', () => ({
  WeatherSearchScreen: ({
    onSelectCity,
  }: {
    onSelectCity: (weather: CityWeather) => void;
  }) => (
    <button type="button" onClick={() => onSelectCity(cityWeatherMock)}>
      Select mocked city
    </button>
  ),
}));

vi.mock('../features/weather/components/WeatherDetailsScreen', () => ({
  WeatherDetailsScreen: ({
    onBack,
    selectedCity,
  }: {
    onBack: () => void;
    selectedCity: CityWeather;
  }) => (
    <div>
      <p>Details mocked city: {selectedCity.city}</p>
      <button type="button" onClick={onBack}>
        Back mocked app
      </button>
    </div>
  ),
}));

describe('App', () => {
  it('navigates from welcome to search, details, and back to search', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Start mocked app' }));

    expect(
      screen.getByRole('button', { name: 'Select mocked city' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Select mocked city' }));

    expect(screen.getByText('Details mocked city: São Paulo')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Back mocked app' }));

    expect(
      screen.getByRole('button', { name: 'Select mocked city' }),
    ).toBeInTheDocument();
  });
});
