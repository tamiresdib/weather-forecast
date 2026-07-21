import rainIcon from '../../../assets/images/Chuva.svg';
import sunnyIcon from '../../../assets/images/Ensolarado.svg';
import partlyCloudyIcon from '../../../assets/images/Inicio da Noite.svg';
import cloudyIcon from '../../../assets/images/Nublado.svg';
import nightIcon from '../../../assets/images/Noite.svg';
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

const OPEN_WEATHER_BASE_URL = 'https://api.openweathermap.org';

function getOpenWeatherApiKey() {
  return import.meta.env.VITE_OPENWEATHER_API_KEY as string;
}

function capitalizeFirstLetter(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatTime(timestamp: number, timezone: number) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date((timestamp + timezone) * 1000));
}

function formatDateKey(timestamp: number, timezone: number) {
  return new Date((timestamp + timezone) * 1000).toISOString().slice(0, 10);
}

function formatDayLabel(timestamp: number, timezone: number) {
  const todayKey = formatDateKey(Date.now() / 1000, timezone);
  const forecastKey = formatDateKey(timestamp, timezone);

  if (forecastKey === todayKey) {
    return 'Hoje';
  }

  const day = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    timeZone: 'UTC',
  }).format(new Date((timestamp + timezone) * 1000));

  return capitalizeFirstLetter(day.replace('.', '')) + '.';
}

function isTodayForecast(timestamp: number, timezone: number) {
  const todayKey = formatDateKey(Date.now() / 1000, timezone);
  const forecastKey = formatDateKey(timestamp, timezone);

  return forecastKey === todayKey;
}

function getWeatherIcon(weatherMain: string, openWeatherIcon: string) {
  const normalizedWeather = weatherMain.toLowerCase();
  const isNight = openWeatherIcon.endsWith('n');

  if (normalizedWeather.includes('rain')) {
    return rainIcon;
  }

  if (normalizedWeather.includes('drizzle')) {
    return rainIcon;
  }

  if (normalizedWeather.includes('thunderstorm')) {
    return rainIcon;
  }

  if (normalizedWeather.includes('clear')) {
    return isNight ? nightIcon : sunnyIcon;
  }

  if (normalizedWeather.includes('clouds')) {
    return isNight ? partlyCloudyIcon : cloudyIcon;
  }

  return isNight ? nightIcon : cloudyIcon;
}

async function fetchOpenWeather<T>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  const apiKey = getOpenWeatherApiKey();

  if (!apiKey) {
    throw new Error('OpenWeather API key is missing.');
  }

  const url = new URL(path, OPEN_WEATHER_BASE_URL);

  Object.entries({
    ...params,
    appid: apiKey,
    units: 'metric',
    lang: 'pt_br',
  }).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('OpenWeather request failed.');
  }

  return response.json() as Promise<T>;
}

async function fetchCityLocation(cityName: string) {
  const normalizedCityName = cityName.trim();

  const locations = await fetchOpenWeather<OpenWeatherLocation[]>(
    '/geo/1.0/direct',
    {
      q: normalizedCityName,
      limit: '1',
    },
  );

  return locations[0];
}

async function fetchCurrentWeatherByCoordinates(lat: number, lon: number) {
  return fetchOpenWeather<OpenWeatherCurrentResponse>('/data/2.5/weather', {
    lat: String(lat),
    lon: String(lon),
  });
}

async function fetchForecastByCoordinates(lat: number, lon: number) {
  return fetchOpenWeather<OpenWeatherForecastResponse>('/data/2.5/forecast', {
    lat: String(lat),
    lon: String(lon),
  });
}

function mapCurrentWeatherToCityWeather(
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
    time: formatTime(currentWeather.dt, currentWeather.timezone),
    lat: location.lat,
    lon: location.lon,
  };
}

function mapForecastItemToHourlyForecast(
  item: OpenWeatherForecastResponse['list'][number],
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
    .slice(0, 5)
    .map((item, index) =>
      mapForecastItemToHourlyForecast(
        item,
        forecast.city.timezone,
        index,
        shouldShowNowLabel,
      ),
    );
}

function getRepresentativeForecastItem(
  items: OpenWeatherForecastResponse['list'],
  timezone: number,
) {
  return (
    items.find((item) => formatTime(item.dt, timezone).startsWith('12')) ??
    items[Math.floor(items.length / 2)]
  );
}

function getDailyTemperatureForecastItem(
  items: OpenWeatherForecastResponse['list'],
  timezone: number,
) {
  return (
    items.find((item) => formatTime(item.dt, timezone).startsWith('00')) ??
    items[0]
  );
}

function mapDailyForecast(
  forecast: OpenWeatherForecastResponse,
): DailyForecast[] {
  const groupedForecast = new Map<
    string,
    OpenWeatherForecastResponse['list']
  >();

  forecast.list.forEach((item) => {
    const dateKey = formatDateKey(item.dt, forecast.city.timezone);
    const currentItems = groupedForecast.get(dateKey) ?? [];

    groupedForecast.set(dateKey, [...currentItems, item]);
  });

  return Array.from(groupedForecast.entries())
    .slice(0, 6)
    .map(([dateKey, items]) => {
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
          .slice(0, 5)
          .map((item, index) =>
            mapForecastItemToHourlyForecast(
              item,
              forecast.city.timezone,
              index,
              shouldShowNowLabel,
            ),
          ),
      };
    });
}

export async function searchCityWeatherList(
  cityName: string,
): Promise<CityWeather[]> {
  const location = await fetchCityLocation(cityName);

  if (!location) {
    return [];
  }

  const currentWeather = await fetchCurrentWeatherByCoordinates(
    location.lat,
    location.lon,
  );

  return [mapCurrentWeatherToCityWeather(location, currentWeather)];
}

export async function getWeatherDetailsByCoordinates(
  selectedCity: CityWeather,
): Promise<WeatherDetails> {
  const forecast = await fetchForecastByCoordinates(
    selectedCity.lat,
    selectedCity.lon,
  );

  return {
    city: selectedCity.city,
    locationLabel: selectedCity.locationLabel,
    currentTemperature: selectedCity.temperature,
    maxTemperature: selectedCity.maxTemperature,
    minTemperature: selectedCity.minTemperature,
    condition: selectedCity.condition,
    time: selectedCity.time,
    hourlyForecast: mapHourlyForecast(forecast),
    dailyForecast: mapDailyForecast(forecast),
  };
}
