import { Component, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error("PitchPass crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-xl font-bold text-ink mb-2">Something went wrong</h2>
          <p className="text-muted text-sm mb-4 max-w-sm">
            This part of the page hit an error. Try refreshing — if it keeps
            happening, the fixtures data may be temporarily unavailable.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-brand text-white text-sm font-semibold px-5 py-2 hover:brightness-110 transition-all"
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
