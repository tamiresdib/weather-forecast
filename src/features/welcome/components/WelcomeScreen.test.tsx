import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WelcomeScreen } from './WelcomeScreen';

describe('WelcomeScreen', () => {
  it('renders welcome content and starts the flow', () => {
    const onStart = vi.fn();

    render(<WelcomeScreen onStart={onStart} />);

    expect(
      screen.getByRole('heading', { name: 'Boas vindas!' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Aqui você encontra a previsão do tempo das suas cidades'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Consultar previsão' }));

    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
