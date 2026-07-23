import { describe, expect, it, vi } from 'vitest';
import rainIcon from '../../../assets/images/Chuva.svg';
import sunnyIcon from '../../../assets/images/Ensolarado.svg';
import cloudyIcon from '../../../assets/images/Nublado.svg';
import type { CityWeather } from '../../types/cityWeather';
import type {
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse,
  OpenWeatherLocation,
} from '../../types/openWeather';
import {
  mapCurrentWeatherToCityWeather,
  mapForecastToWeatherDetails,
} from './weatherMapper';

const SAO_PAULO_TIMEZONE = -3 * 60 * 60;

const locationMock: OpenWeatherLocation = {
  name: 'São Paulo',
  lat: -23.5505,
  lon: -46.6333,
  country: 'BR',
  state: 'São Paulo',
};

const selectedCityMock: CityWeather = {
  id: 'sao-paulo-BR',
  city: 'São Paulo',
  locationLabel: 'São Paulo, BR',
  temperature: 20,
  minTemperature: 18,
  maxTemperature: 25,
  condition: 'Chuva fraca',
  icon: rainIcon,
  time: '12:00',
  lat: -23.5505,
  lon: -46.6333,
};

function createTimestamp(year: number, month: number, day: number, hour: number) {
  return Date.UTC(year, month - 1, day, hour, 0) / 1000;
}

function createForecastItem({
  day,
  hour,
  temp,
  min,
  max,
  main,
  description,
  icon,
}: {
  day: number;
  hour: number;
  temp: number;
  min: number;
  max: number;
  main: string;
  description: string;
  icon: string;
}): OpenWeatherForecastResponse['list'][number] {
  return {
    dt: createTimestamp(2026, 7, day, hour),
    main: {
      temp,
      temp_min: min,
      temp_max: max,
    },
    weather: [
      {
        main,
        description,
        icon,
      },
    ],
  };
}

describe('weatherMapper', () => {
  it('maps the current weather response to a city weather card model', () => {
    const currentWeather: OpenWeatherCurrentResponse = {
      dt: createTimestamp(2026, 7, 21, 15),
      timezone: SAO_PAULO_TIMEZONE,
      name: 'São Paulo',
      main: {
        temp: 20.4,
        temp_min: 18.2,
        temp_max: 25.1,
      },
      weather: [
        {
          main: 'Rain',
          description: 'chuva fraca',
          icon: '10d',
        },
      ],
    };

    expect(mapCurrentWeatherToCityWeather(locationMock, currentWeather)).toEqual(
      {
        id: 'São Paulo-São Paulo',
        city: 'São Paulo',
        locationLabel: 'São Paulo, BR',
        temperature: 20,
        minTemperature: 18,
        maxTemperature: 25,
        condition: 'Chuva fraca',
        icon: rainIcon,
        time: '12:00',
        lat: -23.5505,
        lon: -46.6333,
      },
    );
  });

  it('uses the city name as location label when the country is not available', () => {
    const locationWithoutCountry: OpenWeatherLocation = {
      ...locationMock,
      country: '',
      state: undefined,
    };

    const currentWeather: OpenWeatherCurrentResponse = {
      dt: createTimestamp(2026, 7, 21, 15),
      timezone: SAO_PAULO_TIMEZONE,
      name: 'São Paulo',
      main: {
        temp: 20.4,
        temp_min: 18.2,
        temp_max: 25.1,
      },
      weather: [
        {
          main: 'Rain',
          description: 'chuva fraca',
          icon: '10d',
        },
      ],
    };

    expect(
      mapCurrentWeatherToCityWeather(locationWithoutCountry, currentWeather),
    ).toMatchObject({
      id: 'São Paulo-',
      locationLabel: 'São Paulo',
    });
  });

  it('maps the forecast response to weather details grouped by day', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-21T15:00:00.000Z'));

    const forecast: OpenWeatherForecastResponse = {
      city: {
        name: 'São Paulo',
        country: 'BR',
        timezone: SAO_PAULO_TIMEZONE,
      },
      list: [
        createForecastItem({
          day: 21,
          hour: 15,
          temp: 20.4,
          min: 18.2,
          max: 22.1,
          main: 'Rain',
          description: 'chuva fraca',
          icon: '10d',
        }),
        createForecastItem({
          day: 21,
          hour: 18,
          temp: 24.2,
          min: 20.3,
          max: 25.4,
          main: 'Clear',
          description: 'céu limpo',
          icon: '01d',
        }),
        createForecastItem({
          day: 22,
          hour: 3,
          temp: 15.2,
          min: 14.8,
          max: 17.4,
          main: 'Clear',
          description: 'céu limpo',
          icon: '01n',
        }),
        createForecastItem({
          day: 22,
          hour: 15,
          temp: 27.2,
          min: 22.1,
          max: 28.4,
          main: 'Clouds',
          description: 'nublado',
          icon: '03d',
        }),
      ],
    };

    const weatherDetails = mapForecastToWeatherDetails(
      forecast,
      selectedCityMock,
    );

    expect(weatherDetails.city).toBe('São Paulo');
    expect(weatherDetails.currentTemperature).toBe(20);
    expect(weatherDetails.hourlyForecast[0]).toMatchObject({
      time: 'Agora',
      temperature: 20,
      condition: 'Chuva fraca',
      icon: rainIcon,
    });

    expect(weatherDetails.dailyForecast).toHaveLength(2);
    expect(weatherDetails.dailyForecast[0]).toMatchObject({
      day: 'Hoje',
      temperature: 20,
      minTemperature: 18,
      maxTemperature: 25,
      condition: 'Chuva fraca',
      icon: rainIcon,
    });
    expect(weatherDetails.dailyForecast[1]).toMatchObject({
      day: 'Qua.',
      temperature: 15,
      minTemperature: 15,
      maxTemperature: 28,
      condition: 'Nublado',
      icon: cloudyIcon,
    });
    expect(weatherDetails.dailyForecast[1].hourlyForecast[0].time).toBe(
      '00:00',
    );

    vi.useRealTimers();
  });

  it('adds the selected city as today when the forecast response starts tomorrow', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-21T15:00:00.000Z'));

    const forecast: OpenWeatherForecastResponse = {
      city: {
        name: 'São Paulo',
        country: 'BR',
        timezone: SAO_PAULO_TIMEZONE,
      },
      list: [
        createForecastItem({
          day: 22,
          hour: 3,
          temp: 15.2,
          min: 14.8,
          max: 17.4,
          main: 'Clear',
          description: 'céu limpo',
          icon: '01d',
        }),
      ],
    };

    const weatherDetails = mapForecastToWeatherDetails(
      forecast,
      selectedCityMock,
    );

    expect(weatherDetails.dailyForecast[0]).toMatchObject({
      day: 'Hoje',
      temperature: selectedCityMock.temperature,
      icon: selectedCityMock.icon,
    });
    expect(weatherDetails.dailyForecast[1]).toMatchObject({
      day: 'Qua.',
      temperature: 15,
      icon: sunnyIcon,
    });

    vi.useRealTimers();
  });

  it('maps an empty forecast list without hourly or daily forecast items', () => {
    const forecast: OpenWeatherForecastResponse = {
      city: {
        name: 'São Paulo',
        country: 'BR',
        timezone: SAO_PAULO_TIMEZONE,
      },
      list: [],
    };

    const weatherDetails = mapForecastToWeatherDetails(
      forecast,
      selectedCityMock,
    );

    expect(weatherDetails.hourlyForecast).toEqual([]);
    expect(weatherDetails.dailyForecast).toEqual([
      expect.objectContaining({
        day: 'Hoje',
        temperature: selectedCityMock.temperature,
      }),
    ]);
  });

  it('uses fallback forecast items when a day does not have 00:00 or 12:00 entries', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-21T15:00:00.000Z'));

    const forecast: OpenWeatherForecastResponse = {
      city: {
        name: 'São Paulo',
        country: 'BR',
        timezone: SAO_PAULO_TIMEZONE,
      },
      list: [
        createForecastItem({
          day: 21,
          hour: 15,
          temp: 20.4,
          min: 18.2,
          max: 22.1,
          main: 'Rain',
          description: 'chuva fraca',
          icon: '10d',
        }),
        createForecastItem({
          day: 22,
          hour: 9,
          temp: 21.2,
          min: 19.4,
          max: 23.1,
          main: 'Clear',
          description: 'céu limpo',
          icon: '01d',
        }),
        createForecastItem({
          day: 22,
          hour: 18,
          temp: 27.6,
          min: 24.2,
          max: 29.4,
          main: 'Clouds',
          description: 'nublado',
          icon: '03d',
        }),
        createForecastItem({
          day: 22,
          hour: 21,
          temp: 22.1,
          min: 20.1,
          max: 24.3,
          main: 'Rain',
          description: 'chuva moderada',
          icon: '10n',
        }),
      ],
    };

    const weatherDetails = mapForecastToWeatherDetails(
      forecast,
      selectedCityMock,
    );

    expect(weatherDetails.dailyForecast[1]).toMatchObject({
      day: 'Qua.',
      temperature: 21,
      condition: 'Nublado',
      icon: cloudyIcon,
    });

    vi.useRealTimers();
  });
});
