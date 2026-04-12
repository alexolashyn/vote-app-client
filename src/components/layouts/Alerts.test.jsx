import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';
import Alerts from './Alerts';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key) => key),
  }),
}));

describe('Alerts Component', () => {
  const renderWithProviders = (initialAlerts) => {
    const store = configureStore({
      reducer: {
        alert: () => initialAlerts || [],
      },
    });
    return render(
      <Provider store={store}>
        <Alerts />
      </Provider>
    );
  };

  it('renders nothing when alerts is null', () => {
    renderWithProviders(null);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders nothing when alerts is empty array', () => {
    renderWithProviders([]);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders alert when alerts array has items', () => {
    const alerts = [
      { id: 1, alertType: 'danger', message: 'Error message' },
    ];
    renderWithProviders(alerts);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('renders multiple alerts', () => {
    const alerts = [
      { id: 1, alertType: 'danger', message: 'Error message' },
      { id: 2, alertType: 'success', message: 'Success message' },
    ];
    renderWithProviders(alerts);
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('applies correct alert type class', () => {
    const alerts = [
      { id: 1, alertType: 'danger', message: 'Error' },
    ];
    const { container } = renderWithProviders(alerts);
    const alertElement = container.querySelector('.alert-danger');
    expect(alertElement).toBeInTheDocument();
  });
});
