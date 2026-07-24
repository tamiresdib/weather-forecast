import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createRootMock, renderMock } = vi.hoisted(() => ({
  createRootMock: vi.fn(),
  renderMock: vi.fn(),
}));

vi.mock('react-dom/client', () => ({
  createRoot: createRootMock,
}));

vi.mock('./app/App', () => ({
  default: () => <div>App mocked</div>,
}));

describe('main', () => {
  beforeEach(() => {
    vi.resetModules();
    createRootMock.mockReturnValue({
      render: renderMock,
    });
    renderMock.mockClear();
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('renders the app inside the root element', async () => {
    await import('./main');

    expect(createRootMock).toHaveBeenCalledWith(document.getElementById('root'));
    expect(renderMock).toHaveBeenCalledTimes(1);
  });
});
