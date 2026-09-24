import { ReactNode } from 'react';

type Tone = 'success' | 'warning' | 'danger' | 'neutral';

const toneClasses: Record<Tone, string> = {
  success: 'bg-success-bg text-success-text',
  warning: 'bg-warning-bg text-warning-text',
  danger: 'bg-danger-bg text-danger-text',
  neutral: 'bg-cream-parchment text-on-surface-variant',
};

/**
 * Pill badge, 24px tall, uppercase 11px tracked text (label-caps).
 * Map real states to a tone at the call site, e.g.:
 *   in_stock/fulfilled/delivered -> success
 *   low_stock/processing/pending -> warning
 *   out_of_stock/cancelled       -> danger
 */
export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-2.5 font-sans text-label-caps uppercase tracking-wide ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
