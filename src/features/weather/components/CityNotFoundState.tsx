import cityNotFoundImage from '../../../assets/images/city-not-found.svg';

type CityNotFoundStateProps = {
  onRetry: () => void;
};

export function CityNotFoundState({ onRetry }: CityNotFoundStateProps) {
  return (
    <section
      aria-labelledby="city-not-found-title"
      className="flex h-full min-h-0 w-full max-w-full flex-col items-center justify-center overflow-hidden text-center"
    >
      <img
        src={cityNotFoundImage}
        alt=""
        aria-hidden="true"
        className="max-h-[clamp(150px,34dvh,220px)] w-full max-w-[clamp(170px,54vw,230px)] object-contain"
      />

      <h2
        id="city-not-found-title"
        className="mt-2 max-w-full text-[clamp(19px,5.2vw,24px)] font-bold leading-tight text-white"
      >
        Nenhuma cidade encontrada
      </h2>

      <p className="mt-2 max-w-[280px] text-[clamp(12px,3.4vw,14px)] font-medium leading-5 text-white">
        Não encontramos nenhuma cidade com esse nome. Verifique a escrita e
        tente novamente.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 min-h-11 w-full max-w-[280px] shrink-0 rounded-full bg-white px-6 text-base font-bold text-[#4596F0]"
      >
        Tentar novamente
      </button>
    </section>
  );
}
