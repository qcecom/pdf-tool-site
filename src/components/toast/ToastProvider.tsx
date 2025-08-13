'use client';
import { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

export interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
}

const Ctx = createContext<(t: Omit<Toast, 'id'>) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = (t: Omit<Toast, 'id'>) => {
    const toast: Toast = { id: Date.now(), ...t };
    setToasts((s) => [...s, toast]);
    setTimeout(() =>
      setToasts((s) => s.filter((x) => x.id !== toast.id)),
    4000);
  };

  return (
    <Ctx.Provider value={add}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed top-4 right-4 space-y-2 z-50">
            {toasts.map((t) => (
              <div
                key={t.id}
                className={`px-3 py-2 rounded shadow text-white ${
                  t.type === 'error'
                    ? 'bg-red-600'
                    : t.type === 'success'
                    ? 'bg-green-600'
                    : 'bg-gray-800'
                }`}
              >
                {t.message}
              </div>
            ))}
          </div>,
          document.body
        )}
      </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
