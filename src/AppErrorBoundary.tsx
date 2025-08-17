import React from "react";
import { isBrowser } from "@/utils/env";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: unknown;
}

export default class AppErrorBoundary extends React.Component<Props, State> {
  override state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: unknown, errorInfo: unknown) {
    if (import.meta.env.VITE_DEBUG && isBrowser)
      console.error("error", window.location.pathname, error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return <pre>{String(this.state.error)}</pre>;
    }
    return this.props.children;
  }
}
