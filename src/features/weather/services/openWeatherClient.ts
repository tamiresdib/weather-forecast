import type {
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse,
  OpenWeatherLocation,
} from '../../types/openWeather';

const OPEN_WEATHER_BASE_URL = 'https://api.openweathermap.org';

function getOpenWeatherApiKey() {
  return import.meta.env.VITE_OPENWEATHER_API_KEY as string;
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

export async function fetchCityLocation(cityName: string) {
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

export async function fetchCurrentWeatherByCoordinates(
  lat: number,
  lon: number,
) {
  return fetchOpenWeather<OpenWeatherCurrentResponse>('/data/2.5/weather', {
    lat: String(lat),
    lon: String(lon),
  });
}

export async function fetchForecastByCoordinates(lat: number, lon: number) {
  return fetchOpenWeather<OpenWeatherForecastResponse>('/data/2.5/forecast', {
    lat: String(lat),
    lon: String(lon),
  });
}
