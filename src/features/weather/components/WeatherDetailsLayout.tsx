import type { ReactNode } from 'react';
import { BackButton } from './BackButton';

type WeatherDetailsLayoutProps = {
  children: ReactNode;
  labelledBy?: string;
  onBack?: () => void;
};

export function WeatherDetailsLayout({
  children,
  labelledBy,
  onBack,
}: WeatherDetailsLayoutProps) {
  return (
    <main className="app-background h-dvh overflow-hidden">
      <section
        aria-labelledby={labelledBy}
        className="relative flex h-dvh w-full flex-col overflow-hidden"
      >
        <BackButton onClick={onBack} />
        {children}
      </section>
    </main>
  );
}
