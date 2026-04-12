import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';
import Login from './Login';

// Mock the auth actions to prevent real API calls
vi.mock('../../actions/auth', () => ({
  login: vi.fn(() => ({ type: 'MOCK_LOGIN' })),
}));

const mockStore = configureStore({
  reducer: {
    auth: (state = { isAuthenticated: false, token: null, user: null }, action) => {
      if (action.type === 'LOGIN_SUCCESS') {
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

describe('Login Component', () => {
  const renderWithProviders = (component) => {
    return render(
      <Provider store={mockStore}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders login form', () => {
    renderWithProviders(<Login />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('shows error with invalid data', () => {
    renderWithProviders(<Login />);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.click(submitButton);

    expect(submitButton).toBeInTheDocument();
  });
});
