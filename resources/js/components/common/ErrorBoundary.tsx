import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  public handleReset = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 text-[#111827]">
          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-8 brutal-shadow max-w-md w-full text-center space-y-4">
            <div className="w-14 h-14 bg-amber-100 border-2 border-[#111827] rounded-2xl flex items-center justify-center mx-auto text-amber-700">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black font-heading text-[#111827]">
              Hệ thống vừa phát hiện thông báo lỗi!
            </h2>
            <p className="text-xs text-[#4b5563] leading-relaxed font-medium">
              Vui lòng xem thông tin chi tiết bên dưới để khắc phục:
            </p>

            {this.state.error && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl text-left text-xs text-red-700 font-mono space-y-1 max-h-48 overflow-auto select-text">
                <div className="font-bold text-red-900">{this.state.error.name}: {this.state.error.message}</div>
                <pre className="text-[10px] text-red-600 whitespace-pre-wrap">{this.state.error.stack}</pre>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-[#2563EB] text-white border-2 border-[#111827] rounded-xl text-xs font-black brutal-shadow hover:bg-[#1d4ed8] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase font-heading"
            >
              <RefreshCw className="w-4 h-4" /> Tải Lại & Làm Sạch Phiên
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
