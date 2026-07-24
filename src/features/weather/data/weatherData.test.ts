import { describe, expect, it } from 'vitest';
import { cityWeatherMock } from './cityWeatherMock';
import { weatherDetailsMock } from './weatherDetailsMock';

describe('weather mock data', () => {
  it('provides city weather mock items with required fields', () => {
    expect(cityWeatherMock.length).toBeGreaterThan(0);

    cityWeatherMock.forEach((weather) => {
      expect(weather.id).toBeTruthy();
      expect(weather.city).toBeTruthy();
      expect(weather.locationLabel).toBeTruthy();
      expect(weather.icon).toBeTruthy();
      expect(typeof weather.lat).toBe('number');
      expect(typeof weather.lon).toBe('number');
    });
  });

  it('provides weather details mock with hourly and daily forecasts', () => {
    expect(weatherDetailsMock.city).toBe('São Paulo');
    expect(weatherDetailsMock.hourlyForecast.length).toBeGreaterThan(0);
    expect(weatherDetailsMock.dailyForecast).toHaveLength(6);

    weatherDetailsMock.dailyForecast.forEach((forecast) => {
      expect(forecast.hourlyForecast.length).toBeGreaterThan(0);
      expect(forecast.icon).toBeTruthy();
    });
  });
});
