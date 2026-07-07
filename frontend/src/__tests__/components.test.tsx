import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';

describe('ErrorBoundary Component', () => {
  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Happy Path</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('Happy Path');
  });

  it('should render fallback error UI when child throws', () => {
    const CrackComponent = () => {
      throw new Error('Test Error');
    };

    // Prevent Jest from flooding logs with console.error for expected failures
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <CrackComponent />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Operational View Restored/i)).toBeInTheDocument();
    
    spy.mockRestore();
  });
});
