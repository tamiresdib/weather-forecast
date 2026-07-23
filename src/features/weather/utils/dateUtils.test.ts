import { describe, expect, it, vi } from 'vitest';
import {
  capitalizeFirstLetter,
  formatDateKey,
  formatDayLabel,
  formatTime,
  isTodayForecast,
} from './dateUtils';

describe('dateUtils', () => {
  it('capitalizes only the first letter', () => {
    expect(capitalizeFirstLetter('chuva fraca')).toBe('Chuva fraca');
    expect(capitalizeFirstLetter('')).toBe('');
  });

  it('formats time using the OpenWeather timezone offset', () => {
    const timestamp = Date.UTC(2026, 6, 21, 15, 0) / 1000;
    const saoPauloTimezone = -3 * 60 * 60;

    expect(formatTime(timestamp, saoPauloTimezone)).toBe('12:00');
  });

  it('formats a date key using the OpenWeather timezone offset', () => {
    const timestamp = Date.UTC(2026, 6, 22, 2, 0) / 1000;
    const saoPauloTimezone = -3 * 60 * 60;

    expect(formatDateKey(timestamp, saoPauloTimezone)).toBe('2026-07-21');
  });

  it('returns Hoje when the forecast date matches today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-21T15:00:00.000Z'));

    const timestamp = Date.UTC(2026, 6, 21, 15, 0) / 1000;
    const saoPauloTimezone = -3 * 60 * 60;

    expect(formatDayLabel(timestamp, saoPauloTimezone)).toBe('Hoje');
    expect(isTodayForecast(timestamp, saoPauloTimezone)).toBe(true);

    vi.useRealTimers();
  });

  it('returns the weekday abbreviation when the forecast is not today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-21T15:00:00.000Z'));

    const timestamp = Date.UTC(2026, 6, 22, 15, 0) / 1000;
    const saoPauloTimezone = -3 * 60 * 60;

    expect(formatDayLabel(timestamp, saoPauloTimezone)).toBe('Qua.');
    expect(isTodayForecast(timestamp, saoPauloTimezone)).toBe(false);

    vi.useRealTimers();
  });
});
