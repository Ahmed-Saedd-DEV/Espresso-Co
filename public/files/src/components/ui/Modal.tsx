import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Level-4 elevation per DESIGN.md: roast scrim (rgba(28,19,14,.5)) + 4px blur
 * behind a white card, rounded-lg, shadow-roast-lg. Used for the order
 * cancellation confirm and the admin delete-product confirm.
 */
export function Modal({ open, onClose, title, icon, eyebrow, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-roast/50 p-4 backdrop-blur-scrim"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-roast-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {icon && <div className="mb-3">{icon}</div>}
        {eyebrow && <p className="mb-1 text-label-caps uppercase text-danger-text">{eyebrow}</p>}
        <h2 id="modal-title" className="mb-2 text-headline-sm text-roast">
          {title}
        </h2>
        <div className="text-body-md text-on-surface-variant">{children}</div>
        {footer && <div className="mt-6 flex gap-3">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
