'use client';
import { Component, ErrorInfo, ReactNode } from 'react';

interface State { hasError: boolean; }

export default class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center" role="alert">
          Something went wrong.{' '}
          <button
            className="text-blue-600 underline"
            onClick={() => (this.setState({ hasError: false }), location.reload())}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
