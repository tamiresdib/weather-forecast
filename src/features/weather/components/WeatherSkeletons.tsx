export function WeatherSearchSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando previsão"
      className="mt-[clamp(16px,3dvh,24px)] grid gap-[clamp(12px,2dvh,16px)]"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex min-h-[clamp(72px,11dvh,92px)] w-full animate-pulse items-center justify-between gap-4 rounded-[clamp(18px,5vw,24px)] bg-white/80 px-[clamp(20px,6vw,28px)] py-[clamp(14px,3dvh,18px)]"
        >
          <div className="min-w-0 flex-1">
            <div className="h-5 w-32 rounded-full bg-[#4596F0]/20" />
            <div className="mt-2 h-3 w-24 rounded-full bg-[#4596F0]/15" />
            <div className="mt-2 h-3 w-14 rounded-full bg-[#4596F0]/15" />
          </div>

          <div className="w-[92px] shrink-0">
            <div className="h-11 w-20 rounded-full bg-[#F15A3B]/20" />
            <div className="mt-2 h-3 w-16 rounded-full bg-[#4596F0]/15" />
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
      <div className="mx-auto mt-5 h-20 w-32 rounded-[28px] bg-white/35" />
      <div className="mx-auto mt-4 h-5 w-40 rounded-full bg-white/40" />
      <div className="mx-auto mt-3 h-4 w-28 rounded-full bg-white/35" />
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
          <div className="h-4 w-14 rounded-full bg-white/35" />
          <div className="h-4 w-16 rounded-full bg-white/35" />
        </div>

        <div className="mt-2 grid grid-cols-5 gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex min-w-0 flex-col items-center">
              <div className="h-2.5 w-6 rounded-full bg-white/35" />
              <div className="mt-1.5 h-[clamp(18px,5vw,24px)] w-[clamp(18px,5vw,24px)] rounded-full bg-white/30" />
              <div className="mt-1 h-2.5 w-5 rounded-full bg-white/35" />
            </div>
          ))}
        </div>
      </section>

      <section className="min-h-0 flex-1 rounded-[20px] bg-[#4296F0] px-4 py-2">
        <div className="mx-auto h-3.5 w-36 rounded-full bg-white/35" />

        <div className="mt-2 grid h-[calc(100%-22px)] grid-rows-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex min-h-0 flex-col">
              <div className="grid min-h-0 flex-1 grid-cols-[minmax(64px,1fr)_36px_minmax(82px,92px)] items-center px-2 py-0.5">
                <div className="h-4 w-12 rounded-full bg-white/35" />
                <div className="mx-auto h-[clamp(16px,4.6vw,22px)] w-[clamp(16px,4.6vw,22px)] rounded-full bg-white/30" />
                <div className="ml-auto h-4 w-16 rounded-full bg-white/35" />
              </div>

              {index < 5 ? <div className="h-px w-full bg-white/30" /> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
