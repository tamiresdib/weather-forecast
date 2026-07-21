export type HourlyForecast = {
  id: string;
  time: string;
  temperature: number;
  condition: string;
  icon: string;
};

export type DailyForecast = {
  id: string;
  day: string;
  minTemperature: number;
  maxTemperature: number;
  condition: string;
  icon: string;
};

export type WeatherDetails = {
  city: string;
  locationLabel: string;
  currentTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  condition: string;
  time: string;
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
};
