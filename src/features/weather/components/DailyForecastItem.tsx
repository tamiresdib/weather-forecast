import type { DailyForecast } from '../../../features/types/weatherDetails';

type DailyForecastItemProps = {
  forecast: DailyForecast;
};

export function DailyForecastItem({ forecast }: DailyForecastItemProps) {
  return (
    <li className="grid grid-cols-[64px_1fr_64px] items-center gap-3 text-white">
      <span className="text-base font-bold">{forecast.day}</span>

      <img
        src={forecast.icon}
        alt={forecast.condition}
        className="mx-auto h-7 w-7 object-contain"
      />

      <span className="text-right text-sm font-bold">
        {forecast.minTemperature}° {forecast.maxTemperature}°
      </span>
    </li>
  );
}
