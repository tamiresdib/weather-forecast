import { useState } from 'react';
import apiErrorImage from '../../../assets/images/error-api-img.webp';

type ApiErrorStateProps = {
  onRetry: () => void | Promise<void>;
};

export function ApiErrorState({ onRetry }: ApiErrorStateProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  async function handleRetry() {
    setIsRetrying(true);

    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  }

  return (
    <section
      aria-labelledby="api-error-title"
      className="flex min-h-[72dvh] flex-col items-center justify-center text-center text-white"
    >
      {!hasImageError ? (
        <img
          src={apiErrorImage}
          alt=""
          aria-hidden="true"
          onError={() => setHasImageError(true)}
          className="w-full max-w-[329px]"
        />
      ) : null}

      <h2
        id="api-error-title"
        className="mt-4 max-w-[290px] text-[clamp(24px,6vw,28px)] font-extrabold leading-tight"
      >
        Ops! Parece que algo deu errado
      </h2>

      <p className="mt-4 max-w-[310px] text-[clamp(14px,3.8vw,16px)] font-medium leading-5">
        Não conseguimos buscar as informações do clima no momento. Tente
        novamente.
      </p>

      <button
        type="button"
        onClick={handleRetry}
        disabled={isRetrying}
        className="mt-7 min-h-[45px] w-full max-w-[277px] rounded-[20px] bg-[#F5F5F5] px-6 text-[clamp(18px,5vw,20px)] font-bold text-[#4296F0] transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/40 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isRetrying ? 'Tentando...' : 'Tentar novamente'}
      </button>
    </section>
  );
}
