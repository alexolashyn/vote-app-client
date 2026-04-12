import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Navbar from './Navbar';

// Mock logout action
vi.mock('../../actions/auth', () => ({
  logout: vi.fn(),
}));

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key) => key),
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}));

const mockStore = configureStore({
  reducer: {
    auth: (state = { isAuthenticated: false }, action) => {
      if (action.type === 'LOGIN_SUCCESS') {
        return { ...state, isAuthenticated: true };
      }
      return state;
    },
  },
});

describe('Navbar Component', () => {
  const renderWithProviders = (isAuthenticated) => {
    const store = configureStore({
      reducer: {
        auth: () => ({ isAuthenticated }),
      },
    });
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar isAuthenticated={isAuthenticated} logout={vi.fn()} />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders navbar', () => {
    renderWithProviders(false);
    expect(screen.getByText('appName')).toBeInTheDocument();
  });

  it('shows guest links when not authenticated', () => {
    renderWithProviders(false);
    expect(screen.getByText('register')).toBeInTheDocument();
    expect(screen.getByText('login')).toBeInTheDocument();
  });

  it('shows auth links when authenticated', () => {
    renderWithProviders(true);
    expect(screen.getByText('dashboard')).toBeInTheDocument();
    expect(screen.getByText('logout')).toBeInTheDocument();
  });

  it('does not show guest links when authenticated', () => {
    renderWithProviders(true);
    expect(screen.queryByText('register')).not.toBeInTheDocument();
    expect(screen.queryByText('login')).not.toBeInTheDocument();
  });

  it('has language switch buttons', () => {
    renderWithProviders(false);
    expect(screen.getByText('en')).toBeInTheDocument();
    expect(screen.getByText('uk')).toBeInTheDocument();
  });
});
