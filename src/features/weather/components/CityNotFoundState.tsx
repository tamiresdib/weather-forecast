import cityNotFoundImage from '../../../assets/images/city-not-found.svg';

type CityNotFoundStateProps = {
  onRetry: () => void;
};

export function CityNotFoundState({ onRetry }: CityNotFoundStateProps) {
  return (
    <section
      aria-labelledby="city-not-found-title"
      className="flex h-full min-h-0 flex-col items-center justify-center text-center"
    >
      <img
        src={cityNotFoundImage}
        alt=""
        aria-hidden="true"
        className="w-full max-w-[clamp(180px,58vw,240px)]"
      />

      <h2
        id="city-not-found-title"
        className="mt-3 text-[clamp(20px,5.6vw,26px)] font-bold leading-tight text-white"
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
        className="mt-6 min-h-11 w-full max-w-[280px] rounded-full bg-white px-6 text-base font-bold text-[#4596F0]"
      >
        Tentar novamente
      </button>
    </section>
  );
}
