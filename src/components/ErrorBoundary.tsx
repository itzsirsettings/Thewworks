import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            fontFamily: "'IBM Plex Sans', sans-serif",
            backgroundColor: '#faf6ef',
            color: '#111827',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: '#5a1a2a',
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: '#64748b',
              maxWidth: '480px',
              lineHeight: 1.6,
              marginBottom: '2rem',
            }}
          >
            We're sorry — an unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#5a1a2a',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
