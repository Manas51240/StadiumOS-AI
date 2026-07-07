'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '2px solid rgb(239, 68, 68)',
          borderRadius: '12px',
          color: '#ffffff',
          margin: '20px auto',
          maxWidth: '600px',
          textAlign: 'center'
        }} role="alert">
          <h2 style={{ marginBottom: '16px' }}>Operational View Restored</h2>
          <p style={{ color: '#ccc', marginBottom: '20px' }}>
            A temporary layout parsing error occurred. The StadiumOS AI interface was protected.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Reset Operations View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
