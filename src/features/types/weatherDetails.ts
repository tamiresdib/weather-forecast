export type HourlyForecast = {
  id: string;
  dateKey: string;
  time: string;
  temperature: number;
  condition: string;
  icon: string;
};

export type DailyForecast = {
  id: string;
  dateKey: string;
  day: string;
  temperature: number;
  minTemperature: number;
  maxTemperature: number;
  condition: string;
  icon: string;
  hourlyForecast: HourlyForecast[];
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
