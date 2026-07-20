import type { CityWeather } from '../../types/cityWeather';
import type {
  OpenWeatherCurrentResponse,
  OpenWeatherGeoLocation,
} from '../../types/openWeather';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org';
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function getApiKey() {
  if (!OPENWEATHER_API_KEY) {
    throw new Error('OpenWeather API key is missing.');
  }

  return OPENWEATHER_API_KEY;
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

function mapCurrentWeatherToCityWeather(
  location: OpenWeatherGeoLocation,
  currentWeather: OpenWeatherCurrentResponse,
): CityWeather {
  const weatherDescription =
    currentWeather.weather[0]?.description ?? 'Tempo indisponível';

  return {
    id: `${location.name}-${location.country}-${location.lat}-${location.lon}`,
    city: location.local_names?.pt ?? location.name,
    temperature: Math.round(currentWeather.main.temp),
    condition: capitalizeFirstLetter(weatherDescription),
    time: formatTime(currentWeather.dt, currentWeather.timezone),
  };
}

async function fetchCurrentWeatherByCoordinates(
  latitude: number,
  longitude: number,
) {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    appid: getApiKey(),
    units: 'metric',
    lang: 'pt_br',
  });

  const response = await fetch(
    `${OPENWEATHER_BASE_URL}/data/2.5/weather?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error('Unable to fetch current weather.');
  }

  return response.json() as Promise<OpenWeatherCurrentResponse>;
}

export async function searchCityWeatherList(
  cityName: string,
): Promise<CityWeather[]> {
  const normalizedCityName = cityName.trim();

  if (!normalizedCityName) {
    return [];
  }

  const params = new URLSearchParams({
    q: `${normalizedCityName},BR`,
    limit: '1',
    appid: getApiKey(),
  });

  const response = await fetch(
    `${OPENWEATHER_BASE_URL}/geo/1.0/direct?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error('Unable to fetch city list.');
  }

  const locations = (await response.json()) as OpenWeatherGeoLocation[];
  const locationsToFetch = locations.slice(0, 1);

  const weatherList = await Promise.all(
    locationsToFetch.map(async (location) => {
      const currentWeather = await fetchCurrentWeatherByCoordinates(
        location.lat,
        location.lon,
      );

      return mapCurrentWeatherToCityWeather(location, currentWeather);
    }),
  );

  return weatherList;
}
