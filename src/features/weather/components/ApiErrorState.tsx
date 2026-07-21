import apiErrorImage from '../../../assets/images/erro-api-img.svg';

type ApiErrorStateProps = {
  onRetry: () => void;
};

export function ApiErrorState({ onRetry }: ApiErrorStateProps) {
  return (
    <section
      aria-label="Erro ao buscar informações do clima"
      className="flex min-h-[72dvh] flex-col items-center justify-center text-center"
    >
      <div className="flex w-full flex-col items-center">
        <img
          src={apiErrorImage}
          alt="Ops! Parece que algo deu errado. Não conseguimos buscar as informações do clima no momento. Tente novamente."
          className="w-full max-w-[329px]"
        />
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="mt-7 min-h-[45px] w-full max-w-[277px] rounded-[20px] bg-[#F5F5F5] px-6 text-[clamp(18px,5vw,20px)] font-bold text-[#4296F0] transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/40"
      >
        Tentar novamente
      </button>
    </section>
  );
}
