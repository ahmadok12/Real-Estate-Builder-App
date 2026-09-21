import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Uncaught Error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-sm w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">Reload Burj Accounts</h2>
              <p className="text-xs text-slate-500 mt-1">
                A rendering refresh is required. Tap below to clear cached state and reload the app.
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-slate-900 text-amber-400 rounded-xl font-extrabold text-xs shadow-md flex items-center justify-center gap-2 pressable"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset & Reload App</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
