import type { CityWeather } from '../../types/cityWeather';
import type {
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse,
  OpenWeatherLocation,
} from '../../types/openWeather';
import type {
  DailyForecast,
  HourlyForecast,
  WeatherDetails,
} from '../../types/weatherDetails';
import {
  capitalizeFirstLetter,
  formatDateKey,
  formatDayLabel,
  formatTime,
  isTodayForecast,
} from '../utils/dateUtils';
import { getWeatherIcon } from './weatherIconMapper';

const HOURLY_FORECAST_LIMIT = 5;
const DAILY_FORECAST_LIMIT = 6;

type ForecastItem = OpenWeatherForecastResponse['list'][number];

export function mapCurrentWeatherToCityWeather(
  location: OpenWeatherLocation,
  currentWeather: OpenWeatherCurrentResponse,
): CityWeather {
  const weather = currentWeather.weather[0];

  return {
    id: `${location.name}-${location.state ?? location.country}`,
    city: location.name,
    locationLabel: location.country
      ? `${location.name}, ${location.country}`
      : location.name,
    temperature: Math.round(currentWeather.main.temp),
    minTemperature: Math.round(currentWeather.main.temp_min),
    maxTemperature: Math.round(currentWeather.main.temp_max),
    condition: capitalizeFirstLetter(weather.description),
    icon: getWeatherIcon(weather.main, weather.icon),
    time: formatTime(currentWeather.dt, currentWeather.timezone),
    lat: location.lat,
    lon: location.lon,
  };
}

export function mapForecastToWeatherDetails(
  forecast: OpenWeatherForecastResponse,
  selectedCity: CityWeather,
): WeatherDetails {
  return {
    city: selectedCity.city,
    locationLabel: selectedCity.locationLabel,
    currentTemperature: selectedCity.temperature,
    maxTemperature: selectedCity.maxTemperature,
    minTemperature: selectedCity.minTemperature,
    condition: selectedCity.condition,
    time: selectedCity.time,
    hourlyForecast: mapHourlyForecast(forecast),
    dailyForecast: mapDailyForecast(forecast, selectedCity),
  };
}

function mapForecastItemToHourlyForecast(
  item: ForecastItem,
  timezone: number,
  index: number,
  shouldShowNowLabel: boolean,
): HourlyForecast {
  const weather = item.weather[0];

  return {
    id: `${item.dt}-${index}`,
    dateKey: formatDateKey(item.dt, timezone),
    time:
      index === 0 && shouldShowNowLabel
        ? 'Agora'
        : formatTime(item.dt, timezone),
    temperature: Math.round(item.main.temp),
    condition: capitalizeFirstLetter(weather.description),
    icon: getWeatherIcon(weather.main, weather.icon),
  };
}

function mapHourlyForecast(
  forecast: OpenWeatherForecastResponse,
): HourlyForecast[] {
  const shouldShowNowLabel = forecast.list[0]
    ? isTodayForecast(forecast.list[0].dt, forecast.city.timezone)
    : false;

  return forecast.list
    .slice(0, HOURLY_FORECAST_LIMIT)
    .map((item, index) =>
      mapForecastItemToHourlyForecast(
        item,
        forecast.city.timezone,
        index,
        shouldShowNowLabel,
      ),
    );
}

function getRepresentativeForecastItem(items: ForecastItem[], timezone: number) {
  return (
    items.find((item) => formatTime(item.dt, timezone).startsWith('12')) ??
    items[Math.floor(items.length / 2)]
  );
}

function getDailyTemperatureForecastItem(
  items: ForecastItem[],
  timezone: number,
) {
  return (
    items.find((item) => formatTime(item.dt, timezone).startsWith('00')) ??
    items[0]
  );
}

function mapCurrentWeatherToTodayForecast(
  selectedCity: CityWeather,
  todayKey: string,
): DailyForecast {
  const currentHourlyForecast = [
    {
      id: `${todayKey}-now`,
      dateKey: todayKey,
      time: 'Agora',
      temperature: selectedCity.temperature,
      condition: selectedCity.condition,
      icon: selectedCity.icon,
    },
  ];

  return {
    id: todayKey,
    dateKey: todayKey,
    day: 'Hoje',
    temperature: selectedCity.temperature,
    minTemperature: selectedCity.minTemperature,
    maxTemperature: selectedCity.maxTemperature,
    condition: selectedCity.condition,
    icon: selectedCity.icon,
    hourlyForecast: currentHourlyForecast,
  };
}

function mapDailyForecast(
  forecast: OpenWeatherForecastResponse,
  selectedCity: CityWeather,
): DailyForecast[] {
  const groupedForecast = new Map<string, ForecastItem[]>();

  forecast.list.forEach((item) => {
    const dateKey = formatDateKey(item.dt, forecast.city.timezone);
    const currentItems = groupedForecast.get(dateKey) ?? [];

    groupedForecast.set(dateKey, [...currentItems, item]);
  });

  const todayKey = formatDateKey(Date.now() / 1000, forecast.city.timezone);

  const dailyForecast = Array.from(groupedForecast.entries()).map(
    ([dateKey, items]) => {
      const representativeItem = getRepresentativeForecastItem(
        items,
        forecast.city.timezone,
      );

      const dailyTemperatureItem = getDailyTemperatureForecastItem(
        items,
        forecast.city.timezone,
      );

      const weather = representativeItem.weather[0];

      const minTemperature = Math.min(
        ...items.map((item) => item.main.temp_min),
      );

      const maxTemperature = Math.max(
        ...items.map((item) => item.main.temp_max),
      );

      const shouldShowNowLabel = isTodayForecast(
        items[0].dt,
        forecast.city.timezone,
      );

      return {
        id: dateKey,
        dateKey,
        day: formatDayLabel(representativeItem.dt, forecast.city.timezone),
        temperature: Math.round(dailyTemperatureItem.main.temp),
        minTemperature: Math.round(minTemperature),
        maxTemperature: Math.round(maxTemperature),
        condition: capitalizeFirstLetter(weather.description),
        icon: getWeatherIcon(weather.main, weather.icon),
        hourlyForecast: items
          .slice(0, HOURLY_FORECAST_LIMIT)
          .map((item, index) =>
            mapForecastItemToHourlyForecast(
              item,
              forecast.city.timezone,
              index,
              shouldShowNowLabel,
            ),
          ),
      };
    },
  );

  const hasTodayForecast = dailyForecast.some(
    (forecastItem) => forecastItem.dateKey === todayKey,
  );

  if (hasTodayForecast) {
    return dailyForecast.slice(0, DAILY_FORECAST_LIMIT);
  }

  return [
    mapCurrentWeatherToTodayForecast(selectedCity, todayKey),
    ...dailyForecast,
  ].slice(0, DAILY_FORECAST_LIMIT);
}
