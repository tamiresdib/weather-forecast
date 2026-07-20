import type { CityWeather } from '../../types/cityWeather';

type CityWeatherCardProps = {
  weather: CityWeather;
  onClick?: () => void;
};

export function CityWeatherCard({ weather, onClick }: CityWeatherCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[clamp(72px,11dvh,92px)] w-full items-center justify-between gap-4 rounded-[clamp(18px,5vw,24px)] bg-white px-[clamp(20px,6vw,28px)] py-[clamp(14px,3dvh,18px)] text-left shadow-[0_12px_28px_rgba(18,57,95,0.08)] transition hover:bg-white/95 focus:outline-none focus:ring-4 focus:ring-white/40"
    >
      <div className="min-w-0">
        <h2 className="truncate text-[clamp(16px,5vw,20px)] font-bold leading-none text-[#4596F0]">
          {weather.city}
        </h2>

        <p className="mt-1 text-[clamp(10px,2.8vw,12px)] font-light leading-none text-[#4596F0]">
          {weather.time}
        </p>
      </div>

      <div className="flex w-[92px] shrink-0 flex-col items-start justify-center">
        <p className="w-full text-left text-[clamp(34px,11vw,48px)] font-light leading-none text-[#F15A3B]">
          {weather.temperature}°
        </p>

        <p className="mt-1 w-full text-left text-[clamp(10px,2.8vw,12px)] font-light leading-none text-[#4596F0]">
          {weather.condition}
        </p>
      </div>
    </button>
  );
}
