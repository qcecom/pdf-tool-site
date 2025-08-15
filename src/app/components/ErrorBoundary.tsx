import React from "react";

interface Props {
  children: React.ReactNode;
}
interface State {
  hasError: boolean;
  error: unknown;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  override state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error(error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return <pre>{String(this.state.error)}</pre>;
    }
    return this.props.children;
  }
}
