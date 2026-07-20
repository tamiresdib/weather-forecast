import cityNotFoundImage from '../../../assets/images/city-not-found.svg';

type CityNotFoundStateProps = {
  onRetry: () => void;
};

export function CityNotFoundState({ onRetry }: CityNotFoundStateProps) {
  return (
    <section
      aria-labelledby="city-not-found-title"
      className="flex min-h-[60dvh] flex-col items-center justify-center text-center"
    >
      <img
        src={cityNotFoundImage}
        alt=""
        aria-hidden="true"
        className="mt-4 w-full max-w-[260px]"
      />

      <h2
        id="city-not-found-title"
        className="text-[clamp(22px,6vw,28px)] font-bold leading-tight text-white"
      >
        Nenhuma cidade encontrada
      </h2>

      <p className="mt-3 max-w-[280px] text-[clamp(13px,3.5vw,15px)] font-medium leading-5 text-white">
        Não encontramos nenhuma cidade com esse nome. Verifique a escrita e
        tente novamente.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-8 min-h-12 w-full max-w-[280px] rounded-full bg-white px-6 text-base font-bold text-[#4596F0]"
      >
        Tentar novamente
      </button>
    </section>
  );
}
