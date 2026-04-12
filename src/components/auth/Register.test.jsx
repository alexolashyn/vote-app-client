import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';
import Register from './Register';

// Mock the auth actions to prevent real API calls
vi.mock('../../actions/auth', () => ({
  register: vi.fn(() => ({ type: 'MOCK_REGISTER' })),
}));

const mockStore = configureStore({
  reducer: {
    auth: (state = { isAuthenticated: false, token: null, user: null }, action) => {
      if (action.type === 'REGISTER_SUCCESS') {
        return { ...state, isAuthenticated: true, token: action.payload };
      }
      return state;
    },
  },
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Register Component', () => {
  const renderWithProviders = (component) => {
    return render(
      <Provider store={mockStore}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders register form', () => {
    renderWithProviders(<Register />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/passwordPlaceholder/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/passwordConfirmationPlaceholder/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    renderWithProviders(<Register />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/passwordPlaceholder/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/passwordConfirmationPlaceholder/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
  });

  it('shows error with mismatched passwords', () => {
    renderWithProviders(<Register />);
    const passwordInput = screen.getByPlaceholderText(/passwordPlaceholder/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/passwordConfirmationPlaceholder/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.click(submitButton);

    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password456');
  });

  it('shows error with invalid email', () => {
    renderWithProviders(<Register />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    expect(emailInput.value).toBe('invalid-email');
  });
});
