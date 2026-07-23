type BackButtonProps = {
  onClick?: () => void;
};

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Voltar para busca"
      className="absolute left-[clamp(20px,6vw,52px)] top-[clamp(18px,5dvh,42px)] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#004990] transition hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/40"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none">
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      </svg>
    </button>
  );
}
