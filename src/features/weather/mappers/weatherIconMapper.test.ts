import { describe, expect, it } from 'vitest';
import rainIcon from '../../../assets/images/Chuva.svg';
import sunnyIcon from '../../../assets/images/Ensolarado.svg';
import partlyCloudyIcon from '../../../assets/images/Inicio da Noite.svg';
import cloudyIcon from '../../../assets/images/Nublado.svg';
import nightIcon from '../../../assets/images/Noite.svg';
import { getWeatherIcon } from './weatherIconMapper';

describe('weatherIconMapper', () => {
  it.each([
    ['Rain', '10d'],
    ['Drizzle', '09d'],
    ['Thunderstorm', '11d'],
  ])('returns the rain icon for %s conditions', (weatherMain, iconCode) => {
    expect(getWeatherIcon(weatherMain, iconCode)).toBe(rainIcon);
  });

  it('returns the sunny icon for clear day weather', () => {
    expect(getWeatherIcon('Clear', '01d')).toBe(sunnyIcon);
  });

  it('returns the night icon for clear night weather', () => {
    expect(getWeatherIcon('Clear', '01n')).toBe(nightIcon);
  });

  it('returns the cloudy icon for cloudy day weather', () => {
    expect(getWeatherIcon('Clouds', '03d')).toBe(cloudyIcon);
  });

  it('returns the partly cloudy icon for cloudy night weather', () => {
    expect(getWeatherIcon('Clouds', '03n')).toBe(partlyCloudyIcon);
  });

  it('returns a day period fallback when the weather condition is unknown', () => {
    expect(getWeatherIcon('Mist', '50d')).toBe(cloudyIcon);
    expect(getWeatherIcon('Mist', '50n')).toBe(nightIcon);
  });
});
