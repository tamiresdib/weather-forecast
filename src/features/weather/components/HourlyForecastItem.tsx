import type { HourlyForecast } from '../../../features/types/weatherDetails';

type HourlyForecastItemProps = {
  forecast: HourlyForecast;
};

export function HourlyForecastItem({ forecast }: HourlyForecastItemProps) {
  return (
    <li className="flex min-w-[52px] flex-col items-center text-center text-white">
      <span className="text-[10px] font-medium">{forecast.time}</span>

      <img
        src={forecast.icon}
        alt=""
        aria-hidden="true"
        className="mt-2 h-7 w-7 object-contain"
      />

      <span className="mt-1 text-[10px] font-semibold">
        {forecast.temperature}°
      </span>
    </li>
  );
}
