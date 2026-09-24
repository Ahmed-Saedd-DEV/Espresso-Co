import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

type ToastTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastContextValue {
  push: (toast: Omit<ToastItem, 'id'>) => void;
}

interface ToneStyles {
  panel: string;
  icon: string;
  title: string;
  description: string;
  Icon: LucideIcon;
}

const toneStyles: Record<ToastTone, ToneStyles> = {
  success: {
    panel:
      'border-l-4 border-green-500 dark:border-green-700 bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800',
    icon: 'text-green-600 dark:text-green-300',
    title: 'text-green-900 dark:text-green-100',
    description: 'text-green-800 dark:text-green-200',
    Icon: CheckCircle2,
  },
  info: {
    panel:
      'border-l-4 border-blue-500 dark:border-blue-700 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800',
    icon: 'text-blue-600 dark:text-blue-300',
    title: 'text-blue-900 dark:text-blue-100',
    description: 'text-blue-800 dark:text-blue-200',
    Icon: Info,
  },
  neutral: {
    panel:
      'border-l-4 border-blue-500 dark:border-blue-700 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800',
    icon: 'text-blue-600 dark:text-blue-300',
    title: 'text-blue-900 dark:text-blue-100',
    description: 'text-blue-800 dark:text-blue-200',
    Icon: Info,
  },
  warning: {
    panel:
      'border-l-4 border-yellow-500 dark:border-yellow-700 bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-300',
    title: 'text-yellow-900 dark:text-yellow-100',
    description: 'text-yellow-800 dark:text-yellow-200',
    Icon: TriangleAlert,
  },
  danger: {
    panel:
      'border-l-4 border-red-500 dark:border-red-700 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800',
    icon: 'text-red-600 dark:text-red-300',
    title: 'text-red-900 dark:text-red-100',
    description: 'text-red-800 dark:text-red-200',
    Icon: XCircle,
  },
};

const ToastContext = createContext<ToastContextValue | null>(null);

function generateToastId(): string {
  if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
    try {
      return (crypto as any).randomUUID();
    } catch {
      // fall through to fallback
    }
  }
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Matches the "Interactive Toast Stack" from the global-ux-states screen: stacked, bottom-right, auto-dismiss. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = generateToastId();
    setToasts((t) => [...t, { ...toast, id }]);
    setTimeout(() => dismissToast(id), 5000);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-[60] flex w-80 flex-col gap-2">
          {toasts.map((toast) => {
            const style = toneStyles[toast.tone] ?? toneStyles.info;
            const Icon = style.Icon;

            return (
              <div
                key={toast.id}
                role="alert"
                className={`flex items-start gap-3 rounded-lg p-3 shadow-lg transition duration-300 ease-in-out hover:scale-[1.02] ${style.panel}`}
              >
                <div className="mt-0.5 shrink-0">
                  <Icon className={`h-5 w-5 ${style.icon}`} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs font-semibold ${style.title}`}>{toast.title}</p>
                    <button
                      type="button"
                      aria-label={`Dismiss ${toast.title} message`}
                      onClick={() => dismissToast(toast.id)}
                      className="ml-2 inline-flex shrink-0 rounded-full p-1 text-current/70 transition hover:bg-black/5 hover:text-current focus:outline-none focus:ring-2 focus:ring-current/30 dark:hover:bg-white/10"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                  {toast.description ? (
                    <p className={`mt-1 text-xs ${style.description}`}>{toast.description}</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
