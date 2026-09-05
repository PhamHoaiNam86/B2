import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 border-[2.5px] border-[#1c1b1b] rounded-xl brutal-shadow flex items-start gap-3 transition-all animate-slide-in ${
            toast.type === 'success'
              ? 'bg-[#e2f7e9] text-[#0d5225]'
              : toast.type === 'warning'
              ? 'bg-[#fff3d6] text-[#734c00]'
              : 'bg-[#e8f1ff] text-[#003882]'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-[#0d5225]" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-[#734c00]" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#003882]" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black uppercase tracking-wider">{toast.title}</h4>
            <p className="text-xs mt-0.5 leading-relaxed font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded-lg hover:bg-black/10 text-current cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
