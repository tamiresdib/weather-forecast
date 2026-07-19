import type { CityWeather } from '../../types/cityWeather';

type CityWeatherCardProps = {
  weather: CityWeather;
};

export function CityWeatherCard({ weather }: CityWeatherCardProps) {
  return (
    <article className="flex min-h-[clamp(72px,11dvh,92px)] items-center justify-between gap-4 rounded-[clamp(18px,5vw,24px)] bg-white px-[clamp(20px,6vw,28px)] py-[clamp(14px,3dvh,18px)] shadow-[0_12px_28px_rgba(18,57,95,0.08)]">
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
    </article>
  );
}
