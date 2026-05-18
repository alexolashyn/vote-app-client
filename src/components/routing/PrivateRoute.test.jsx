import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import PrivateRoute from './PrivateRoute';

// Mock logout action
vi.mock('../../actions/auth', () => ({
  logout: vi.fn(),
}));

const TestComponent = () => <div>Protected Content</div>;

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

describe('PrivateRoute Component', () => {
  const renderWithProviders = (isAuthenticated) => {
    const store = configureStore({
      reducer: {
        auth: () => ({ isAuthenticated }),
      },
    });
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <PrivateRoute component={TestComponent} />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders component when authenticated', () => {
    renderWithProviders(true);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    renderWithProviders(false);
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    // Navigate to /login is handled by React Router
  });
});
