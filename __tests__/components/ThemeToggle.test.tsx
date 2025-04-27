import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ThemeToggle from '@/components/ThemeToggle';


const setDocumentCookie = (value: string) => {
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value,
    configurable: true,
  });
};

const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe('ThemeToggle', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // стара версія
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.cookie = '';
  });
  it('should render the toggle after mounted', async () => {
    render(<ThemeToggle />);

    const toggle = await screen.findByRole('switch');
    expect(toggle).toBeInTheDocument();
  });

  it('should set theme from cookie if available', async () => {
    setDocumentCookie('theme=dark');
    render(<ThemeToggle />);

    await waitFor(() => {
      const switchInput = screen.getByRole('switch');
      expect(switchInput).toHaveAttribute('aria-checked', 'true');
    });
  });

  it('should fallback to dark theme if no cookie and prefers dark', async () => {
    mockMatchMedia(true);
    render(<ThemeToggle />);

    await waitFor(() => {
      const switchInput = screen.getByRole('switch');
      expect(switchInput).toHaveAttribute('aria-checked', 'true');
    });
  });

  it('should fallback to light theme if no cookie and prefers light', async () => {
    mockMatchMedia(false);
    render(<ThemeToggle />);

    await waitFor(() => {
      const switchInput = screen.getByRole('switch');
      expect(switchInput).toHaveAttribute('aria-checked', 'false');
    });
  });

  it('should toggle theme when switch is clicked', async () => {
    setDocumentCookie('theme=light');
    render(<ThemeToggle />);

    const switchInput = await screen.findByRole('switch');

    expect(switchInput).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(switchInput);

    await waitFor(() => {
      expect(switchInput).toBeChecked();
    });

    expect(document.cookie).toContain('theme=dark');
  });
});
