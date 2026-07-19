import sunIcon from '../../../assets/images/sun-icon1.svg';

type WelcomeScreenProps = {
  onStart?: () => void;
};

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <main className="app-background">
      <section
        aria-labelledby="welcome-title"
        className="app-screen flex flex-col items-center justify-center"
      >
        <img
          src={sunIcon}
          alt=""
          aria-hidden="true"
          className="w-full max-w-[min(340px,82vw)]"
        />

        <div className="mt-[clamp(32px,6dvh,48px)] w-full max-w-[304px] rounded-[38px] bg-white px-8 pb-8 pt-9 text-center shadow-[0_18px_40px_rgba(18,57,95,0.12)]">
          <h1
            id="welcome-title"
            className="text-[clamp(28px,8vw,32px)] font-extrabold leading-none text-[#4596F0]"
          >
            Boas vindas!
          </h1>

          <p className="mx-auto mt-3 max-w-[215px] text-[13px] font-light leading-4 text-[#C6C6C6]">
            Aqui você encontra a previsão do tempo das suas cidades
          </p>

          <button
            type="button"
            onClick={onStart}
            aria-label="Consultar previsão"
            className="mx-auto mt-5 grid h-14 w-14 place-items-center rounded-full bg-[#4596F0] text-3xl font-semibold leading-none text-white shadow-[0_8px_20px_rgba(69,150,240,0.35)] outline outline-2 outline-offset-4 outline-[#4596F0]/25 transition hover:bg-[#2f80e7] focus:outline-[#0B4F95]"
          >
            →
          </button>
        </div>
      </section>
    </main>
  );
}
