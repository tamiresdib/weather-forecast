const SEARCH_SKELETON_ITEMS = 3;
const HOURLY_FORECAST_ITEMS = 5;
const DAILY_FORECAST_ITEMS = 6;
const LAST_DAILY_FORECAST_INDEX = DAILY_FORECAST_ITEMS - 1;

const SEARCH_CARD_TEMPERATURE_WIDTH = 'w-[92px]';
const DAILY_FORECAST_GRID_COLUMNS =
  'grid-cols-[minmax(64px,1fr)_36px_minmax(82px,92px)]';
const HOURLY_FORECAST_ICON_SIZE =
  'h-[clamp(18px,5vw,24px)] w-[clamp(18px,5vw,24px)]';
const DAILY_FORECAST_ICON_SIZE =
  'h-[clamp(16px,4.6vw,22px)] w-[clamp(16px,4.6vw,22px)]';

const BLUE_SKELETON_BACKGROUND = 'bg-[#4596F0]/15';
const BLUE_SKELETON_BACKGROUND_STRONG = 'bg-[#4596F0]/20';
const ORANGE_SKELETON_BACKGROUND = 'bg-[#F15A3B]/20';
const WHITE_SKELETON_BACKGROUND = 'bg-white/35';
const WHITE_SKELETON_BACKGROUND_SOFT = 'bg-white/30';

export function WeatherSearchSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando previsão"
      className="mt-[clamp(16px,3dvh,24px)] grid gap-[clamp(12px,2dvh,16px)]"
    >
      {Array.from({ length: SEARCH_SKELETON_ITEMS }).map((_, index) => (
        <div
          key={index}
          className="flex min-h-[clamp(72px,11dvh,92px)] w-full animate-pulse items-center justify-between gap-4 rounded-[clamp(18px,5vw,24px)] bg-white/80 px-[clamp(20px,6vw,28px)] py-[clamp(14px,3dvh,18px)]"
        >
          <div className="min-w-0 flex-1">
            <div
              className={`h-5 w-32 rounded-full ${BLUE_SKELETON_BACKGROUND_STRONG}`}
            />
            <div
              className={`mt-2 h-3 w-24 rounded-full ${BLUE_SKELETON_BACKGROUND}`}
            />
            <div
              className={`mt-2 h-3 w-14 rounded-full ${BLUE_SKELETON_BACKGROUND}`}
            />
          </div>

          <div className={`${SEARCH_CARD_TEMPERATURE_WIDTH} shrink-0`}>
            <div
              className={`h-11 w-20 rounded-full ${ORANGE_SKELETON_BACKGROUND}`}
            />
            <div
              className={`mt-2 h-3 w-16 rounded-full ${BLUE_SKELETON_BACKGROUND}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function WeatherDetailsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando detalhes da previsão"
      className="animate-pulse pb-[clamp(22px,4.5dvh,36px)] text-center"
    >
      <div className="mx-auto h-4 w-32 rounded-full bg-white/40" />
      <div className="mx-auto mt-3 h-8 w-44 rounded-full bg-white/45" />
      <div
        className={`mx-auto mt-5 h-20 w-32 rounded-[28px] ${WHITE_SKELETON_BACKGROUND}`}
      />
      <div className="mx-auto mt-4 h-5 w-40 rounded-full bg-white/40" />
      <div
        className={`mx-auto mt-3 h-4 w-28 rounded-full ${WHITE_SKELETON_BACKGROUND}`}
      />
    </div>
  );
}

export function WeatherConditionsSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mt-3 flex min-h-0 flex-1 animate-pulse flex-col gap-3"
    >
      <section className="shrink-0 rounded-[20px] bg-[#4296F0] px-4 py-3">
        <div className="flex items-center justify-between border-b border-white/50 pb-2">
          <div className={`h-4 w-14 rounded-full ${WHITE_SKELETON_BACKGROUND}`} />
          <div className={`h-4 w-16 rounded-full ${WHITE_SKELETON_BACKGROUND}`} />
        </div>

        <div className="mt-2 grid grid-cols-5 gap-1">
          {Array.from({ length: HOURLY_FORECAST_ITEMS }).map((_, index) => (
            <div key={index} className="flex min-w-0 flex-col items-center">
              <div
                className={`h-2.5 w-6 rounded-full ${WHITE_SKELETON_BACKGROUND}`}
              />
              <div
                className={`mt-1.5 ${HOURLY_FORECAST_ICON_SIZE} rounded-full ${WHITE_SKELETON_BACKGROUND_SOFT}`}
              />
              <div
                className={`mt-1 h-2.5 w-5 rounded-full ${WHITE_SKELETON_BACKGROUND}`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="min-h-0 flex-1 rounded-[20px] bg-[#4296F0] px-4 py-2">
        <div
          className={`mx-auto h-3.5 w-36 rounded-full ${WHITE_SKELETON_BACKGROUND}`}
        />

        <div className="mt-2 grid h-[calc(100%-22px)] grid-rows-6">
          {Array.from({ length: DAILY_FORECAST_ITEMS }).map((_, index) => (
            <div key={index} className="flex min-h-0 flex-col">
              <div
                className={`grid min-h-0 flex-1 ${DAILY_FORECAST_GRID_COLUMNS} items-center px-2 py-0.5`}
              >
                <div
                  className={`h-4 w-12 rounded-full ${WHITE_SKELETON_BACKGROUND}`}
                />
                <div
                  className={`mx-auto ${DAILY_FORECAST_ICON_SIZE} rounded-full ${WHITE_SKELETON_BACKGROUND_SOFT}`}
                />
                <div
                  className={`ml-auto h-4 w-16 rounded-full ${WHITE_SKELETON_BACKGROUND}`}
                />
              </div>

              {index < LAST_DAILY_FORECAST_INDEX ? (
                <div className="h-px w-full bg-white/30" />
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
