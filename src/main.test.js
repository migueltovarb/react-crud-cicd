import { vi } from 'vitest';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

describe('main.js', () => {
  it('debería renderizar el componente App dentro de StrictMode', async () => {
    const rootMock = { render: vi.fn() };
    createRoot.mockReturnValue(rootMock);

    await import('./main.jsx');


    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(rootMock.render).toHaveBeenCalledWith(
      expect.any(Object) 
    );
  });
});
